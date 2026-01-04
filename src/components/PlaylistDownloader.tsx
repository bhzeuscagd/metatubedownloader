import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Header from './Header';
import Features from './Features';
import InputSection from './InputSection';
import PlaylistInfo from './PlaylistInfo';
import DownloadProgress from './DownloadProgress';
import CompletedSection from './CompletedSection';
import Footer from './Footer';
import ErrorMessage from './ErrorMessage';

interface Song {
  id: string;
  title: string;
  duration: number;
  url: string;
  thumbnail: string | null;
  channel: string;
  artist: string;
  album: string;
  estimatedSizeMp3: number | null;
  estimatedSizeMp4: number | null;
}

interface PlaylistData {
  title: string;
  channel: string;
  count: number;
  totalDuration: number;
  estimatedSizes: {
    mp3: number;
    mp4: number;
  };
  songs: Song[];
}

export default function PlaylistDownloader() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<'mp3' | 'mp4'>('mp3');
  const [quality, setQuality] = useState({ mp3: '256', mp4: '720' });
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<any>(null);
  const [completedFiles, setCompletedFiles] = useState<any[]>([]);
  const [sessionDir, setSessionDir] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.io connection
    const socketUrl = import.meta.env.DEV 
      ? 'http://localhost:3001' 
      : (window.location.origin.includes(':3001') 
          ? window.location.origin 
          : window.location.origin.replace(/:\d+$/, ':3001'));
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Conectado al servidor');
    });

    socketRef.current.on('download-started', (data) => {
      console.log('📥 Descarga iniciada:', data);
      setDownloading(true);
      setDownloadProgress({ completed: 0, total: data.total, songs: {} });
    });

    socketRef.current.on('song-progress', (data) => {
      setDownloadProgress((prev: any) => ({
        ...prev,
        songs: { ...prev?.songs, [data.songId]: data }
      }));
    });

    socketRef.current.on('download-complete', (data) => {
      console.log('✅ Descarga completada:', data);
      setSessionDir(data.sessionDir);
      setCompletedFiles(data.files);
      setDownloading(false);
    });

    socketRef.current.on('global-stats', (data) => {
      setDownloadProgress((prev: any) => ({
        ...prev,
        stats: data
      }));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const loadPlaylist = async () => {
    if (!playlistUrl.trim()) {
      setError('Por favor, ingresa un enlace de playlist de YouTube');
      return;
    }

    if (!isValidYouTubeUrl(playlistUrl)) {
      setError('Por favor, ingresa un enlace válido de YouTube');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/playlist-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: playlistUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar la playlist');
      }

      if (!data.songs || data.songs.length === 0) {
        throw new Error('No se encontraron canciones en esta playlist');
      }

      setPlaylistData(data);
      setSelectedSongs(new Set(data.songs.map((s: Song) => s.id)));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidYouTubeUrl = (url: string) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=.+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=.+&list=.+/
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const toggleSong = (songId: string) => {
    setSelectedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (playlistData) {
      if (selectedSongs.size === playlistData.songs.length) {
        setSelectedSongs(new Set());
      } else {
        setSelectedSongs(new Set(playlistData.songs.map(s => s.id)));
      }
    }
  };

  const startDownload = () => {
    if (downloading || selectedSongs.size === 0 || !playlistData) return;

    const songsToDownload = playlistData.songs.filter(s => selectedSongs.has(s.id));

    if (socketRef.current) {
      socketRef.current.emit('start-download', {
        songs: songsToDownload,
        format,
        quality: quality[format],
        filenameTemplate: '%(title)s',
        embedMetadata: true
      });
    }
  };

  const resetUI = () => {
    setPlaylistUrl('');
    setPlaylistData(null);
    setSelectedSongs(new Set());
    setDownloading(false);
    setDownloadProgress(null);
    setCompletedFiles([]);
    setSessionDir(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <Header />
      <Features />
      
      <InputSection
        playlistUrl={playlistUrl}
        setPlaylistUrl={setPlaylistUrl}
        onLoad={loadPlaylist}
        loading={loading}
      />

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {playlistData && !downloading && !completedFiles.length && (
        <PlaylistInfo
          playlistData={playlistData}
          selectedSongs={selectedSongs}
          format={format}
          quality={quality}
          onToggleSong={toggleSong}
          onToggleSelectAll={toggleSelectAll}
          onFormatChange={setFormat}
          onQualityChange={(q) => setQuality(prev => ({ ...prev, [format]: q }))}
          onDownload={startDownload}
        />
      )}

      {downloading && downloadProgress && (
        <DownloadProgress progress={downloadProgress} />
      )}

      {completedFiles.length > 0 && sessionDir && (
        <CompletedSection
          files={completedFiles}
          sessionDir={sessionDir}
          onNewDownload={resetUI}
        />
      )}

      <Footer />
    </div>
  );
}

