import { createServer } from 'http';
import { Server } from 'socket.io';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
const YTDLP_CMD = process.env.YTDLP_PATH || 'yt-dlp';

// Crear directorio de descargas si no existe
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

function downloadSong(song, outputDir, format, options, onProgress) {
  return new Promise((resolve, reject) => {
    const template = options.filenameTemplate || '%(title)s';
    const outputTemplate = path.join(outputDir, `${template}.%(ext)s`);
    const quality = options.quality || (format === 'mp3' ? '256' : '720');

    const args = [
      '-o', outputTemplate,
      '--no-playlist',
      '--no-warnings',
      '--newline',
      '--progress',
      '--progress-template', '%(progress._percent_str)s|%(progress._speed_str)s|%(progress._eta_str)s|%(progress._downloaded_bytes_str)s|%(progress._total_bytes_str)s'
    ];

    if (format === 'mp3') {
      const qualityMap = { '320': '0', '256': '2', '192': '5', '128': '7' };
      const audioQuality = qualityMap[quality] || '2';
      args.push('-x', '--audio-format', 'mp3', '--audio-quality', audioQuality);

      if (options.embedMetadata) {
        args.push(
          '--embed-thumbnail',
          '--embed-metadata',
          '--add-metadata',
          '--parse-metadata', `title:%(title)s`,
          '--parse-metadata', `${song.artist || song.channel}:%(artist)s`,
          '--parse-metadata', `${song.album || 'YouTube'}:%(album)s`,
          '--convert-thumbnails', 'jpg'
        );
      }
    } else if (format === 'mp4') {
      const heightFilter = quality === '2160' ? '2160' : quality;
      const formatString = `bestvideo[height<=${heightFilter}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${heightFilter}][ext=mp4]/best`;
      args.push('-f', formatString);

      if (options.embedMetadata) {
        args.push('--embed-thumbnail', '--embed-metadata');
      }
    }

    args.push(song.url);

    const ytdlp = spawn(YTDLP_CMD, args);
    let lastProgress = 0;

    ytdlp.stdout.on('data', (data) => {
      const output = data.toString();
      const lines = output.split('\n').filter(line => line.trim());

      for (const line of lines) {
        const parts = line.split('|');
        if (parts.length >= 3) {
          const percentStr = parts[0]?.trim();
          const speedStr = parts[1]?.trim();
          const etaStr = parts[2]?.trim();
          const downloadedStr = parts[3]?.trim();
          const totalStr = parts[4]?.trim();

          const progressMatch = percentStr?.match(/([\d.]+)/);
          if (progressMatch) {
            const progress = parseFloat(progressMatch[1]);
            if (progress >= lastProgress) {
              lastProgress = progress;

              let speedBytes = 0;
              if (speedStr && speedStr !== 'N/A' && speedStr !== 'Unknown') {
                const speedMatch = speedStr.match(/([\d.]+)\s*(\w+)/i);
                if (speedMatch) {
                  const value = parseFloat(speedMatch[1]);
                  const unit = speedMatch[2].toUpperCase();
                  if (unit.includes('G')) speedBytes = value * 1024 * 1024 * 1024;
                  else if (unit.includes('M')) speedBytes = value * 1024 * 1024;
                  else if (unit.includes('K')) speedBytes = value * 1024;
                  else speedBytes = value;
                }
              }

              onProgress({
                progress: progress,
                speed: speedStr !== 'N/A' && speedStr !== 'Unknown' ? speedStr : null,
                speedBytes: speedBytes,
                eta: etaStr !== 'N/A' && etaStr !== 'Unknown' ? etaStr : null,
                downloaded: downloadedStr !== 'N/A' && downloadedStr !== 'Unknown' ? downloadedStr : null,
                totalSize: totalStr !== 'N/A' && totalStr !== 'Unknown' ? totalStr : null
              });
            }
          }
        }
      }
    });

    ytdlp.on('close', (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`yt-dlp terminó con código ${code}`));
      }
    });

    ytdlp.on('error', (error) => {
      reject(error);
    });
  });
}

async function downloadWithConcurrency(songs, sessionDir, format, socket, concurrency = 6, options = {}) {
  const results = [];
  const queue = [...songs.map((song, index) => ({ song, index }))];
  const activeDownloads = new Map();
  let completedCount = 0;
  const startTime = Date.now();

  const globalStats = {
    totalSongs: songs.length,
    completedSongs: 0,
    activeSpeeds: new Map(),
    activeProgress: new Map(),
    startTime: startTime,
    completionTimes: [],
    lastETA: null
  };

  const statsInterval = setInterval(() => {
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    let totalSpeed = 0;
    globalStats.activeSpeeds.forEach((speed) => totalSpeed += speed);

    let estimatedRemainingTime = 0;
    const remainingSongs = globalStats.totalSongs - globalStats.completedSongs;

    if (remainingSongs > 0) {
      let avgCompletionTime = 30;
      if (globalStats.completionTimes.length > 0) {
        const recentTimes = globalStats.completionTimes.slice(-5);
        const weights = recentTimes.map((_, i) => i + 1);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        avgCompletionTime = recentTimes.reduce((sum, time, i) => sum + time * weights[i], 0) / totalWeight;
      }

      let activeRemaining = 0;
      let activeCount = 0;
      globalStats.activeProgress.forEach((progress, songId) => {
        const speed = globalStats.activeSpeeds.get(songId) || 0;
        if (progress > 0 && progress < 100) {
          const remainingProgress = 100 - progress;
          if (speed > 0) {
            const elapsedForThis = (progress / 100) * avgCompletionTime;
            const estimatedTotalTime = elapsedForThis / (progress / 100);
            activeRemaining += estimatedTotalTime - elapsedForThis;
          } else {
            activeRemaining += (remainingProgress / 100) * avgCompletionTime;
          }
          activeCount++;
        }
      });

      const queuedSongs = remainingSongs - activeCount;
      const concurrentBatches = Math.ceil(queuedSongs / Math.min(concurrency, queuedSongs || 1));
      const queueTime = concurrentBatches * avgCompletionTime;

      const maxActiveRemaining = activeCount > 0 ? activeRemaining / activeCount : 0;
      estimatedRemainingTime = maxActiveRemaining + queueTime;

      if (globalStats.lastETA !== null && globalStats.lastETA > 0) {
        const smoothingFactor = 0.3;
        estimatedRemainingTime = globalStats.lastETA * (1 - smoothingFactor) + estimatedRemainingTime * smoothingFactor;
      }
      globalStats.lastETA = estimatedRemainingTime;
    }

    socket.emit('global-stats', {
      totalSpeed: totalSpeed,
      elapsedTime: elapsedSeconds,
      estimatedRemainingTime: estimatedRemainingTime,
      completedSongs: globalStats.completedSongs,
      totalSongs: globalStats.totalSongs,
      activeSongs: activeDownloads.size
    });
  }, 500);

  return new Promise((resolve) => {
    const startNext = () => {
      while (activeDownloads.size < concurrency && queue.length > 0) {
        const { song, index } = queue.shift();

        socket.emit('song-progress', {
          index,
          songId: song.id,
          status: 'downloading',
          title: song.title,
          progress: 0,
          speed: null,
          eta: null,
          downloaded: null,
          totalSize: null
        });

        const songStartTime = Date.now();
        globalStats.activeProgress.set(song.id, 0);

        const downloadPromise = downloadSong(song, sessionDir, format, options, (progressData) => {
          if (progressData.speed) {
            globalStats.activeSpeeds.set(song.id, progressData.speedBytes || 0);
          }
          globalStats.activeProgress.set(song.id, progressData.progress);

          socket.emit('song-progress', {
            index,
            songId: song.id,
            status: 'downloading',
            title: song.title,
            progress: progressData.progress,
            speed: progressData.speed,
            eta: progressData.eta,
            downloaded: progressData.downloaded,
            totalSize: progressData.totalSize
          });
        })
          .then(() => {
            const completionTime = (Date.now() - songStartTime) / 1000;
            globalStats.completionTimes.push(completionTime);

            completedCount++;
            globalStats.completedSongs++;
            globalStats.activeSpeeds.delete(song.id);
            globalStats.activeProgress.delete(song.id);

            socket.emit('song-progress', {
              index,
              songId: song.id,
              status: 'completed',
              title: song.title,
              progress: 100
            });
            results.push({ success: true, song });
          })
          .catch((error) => {
            const completionTime = (Date.now() - songStartTime) / 1000;
            globalStats.completionTimes.push(completionTime);

            completedCount++;
            globalStats.completedSongs++;
            globalStats.activeSpeeds.delete(song.id);
            globalStats.activeProgress.delete(song.id);

            console.error(`Error descargando ${song.title}:`, error);
            socket.emit('song-progress', {
              index,
              songId: song.id,
              status: 'error',
              title: song.title,
              error: error.message
            });
            results.push({ success: false, song, error: error.message });
          })
          .finally(() => {
            activeDownloads.delete(song.id);
            if (queue.length > 0) {
              startNext();
            } else if (activeDownloads.size === 0) {
              clearInterval(statsInterval);
              resolve(results);
            }
          });

        activeDownloads.set(song.id, downloadPromise);
      }
    };

    startNext();
  });
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('start-download', async (data) => {
    const { songs, format, quality, filenameTemplate, embedMetadata } = data;
    const sessionId = `session_${Date.now()}`;
    const sessionDir = path.join(DOWNLOADS_DIR, sessionId);

    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    const downloadOptions = {
      filenameTemplate: filenameTemplate || '%(title)s',
      embedMetadata: embedMetadata !== false,
      quality: quality || (format === 'mp3' ? '256' : '720')
    };

    socket.emit('download-started', {
      total: songs.length,
      sessionDir: sessionId
    });

    await downloadWithConcurrency(songs, sessionDir, format, socket, 6, downloadOptions);

    let files = [];
    try {
      const dirContents = fs.readdirSync(sessionDir);
      files = dirContents
        .filter(file => !file.endsWith('.part') && !file.endsWith('.ytdl'))
        .map(file => {
          const filePath = path.join(sessionDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: `/api/download/${sessionId}/${encodeURIComponent(file)}`,
            size: stats.size
          };
        })
        .filter(file => file.size > 0);
    } catch (err) {
      console.error('Error leyendo directorio:', err);
    }

    socket.emit('download-complete', {
      files,
      sessionDir: sessionId
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🔌 Socket.io server running on port ${PORT}`);
});
