import { useState } from 'react';

interface Song {
  id: string;
  title: string;
  duration: number;
  thumbnail: string | null;
  channel: string;
  estimatedSizeMp3: number | null;
  estimatedSizeMp4: number | null;
}

interface PlaylistData {
  title: string;
  channel: string;
  count: number;
  totalDuration: number;
  songs: Song[];
}

interface PlaylistInfoProps {
  playlistData: PlaylistData;
  selectedSongs: Set<string>;
  format: 'mp3' | 'mp4';
  quality: { mp3: string; mp4: string };
  onToggleSong: (id: string) => void;
  onToggleSelectAll: () => void;
  onFormatChange: (format: 'mp3' | 'mp4') => void;
  onQualityChange: (quality: string) => void;
  onDownload: () => void;
}

export default function PlaylistInfo({
  playlistData,
  selectedSongs,
  format,
  quality,
  onToggleSong,
  onToggleSelectAll,
  onFormatChange,
  onQualityChange,
  onDownload
}: PlaylistInfoProps) {
  const formatDuration = (seconds: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalDuration = (songs: Song[]) => {
    const totalSeconds = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes <= 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let size = bytes;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `≈ ${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getEstimatedSize = () => {
    const selectedSongsList = playlistData.songs.filter(s => selectedSongs.has(s.id));
    const baseKey = format === 'mp3' ? 'estimatedSizeMp3' : 'estimatedSizeMp4';
    const totalSize = selectedSongsList.reduce((acc, song) => {
      const baseSize = song[baseKey as keyof Song] as number | null;
      return acc + (baseSize || 0);
    }, 0);
    return formatFileSize(totalSize);
  };

  const mp3Qualities = ['128', '192', '256', '320'];
  const mp4Qualities = ['360', '480', '720', '1080', '2160'];

  return (
    <section className="bg-bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-text-primary">{playlistData.title}</h2>
          <p className="text-text-tertiary">{playlistData.channel}</p>
        </div>
        <div className="flex gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            {playlistData.count} canciones
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatTotalDuration(playlistData.songs)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-sm text-text-tertiary mb-2 block">Formato:</label>
          <div className="flex gap-2">
            <button
              onClick={() => onFormatChange('mp3')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                format === 'mp3'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-paper text-text-secondary hover:bg-bg-secondary border border-border'
              }`}
            >
              MP3
            </button>
            <button
              onClick={() => onFormatChange('mp4')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                format === 'mp4'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-paper text-text-secondary hover:bg-bg-secondary border border-border'
              }`}
            >
              MP4
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm text-text-tertiary mb-2 block">Calidad:</label>
          <div className="flex gap-2">
            {(format === 'mp3' ? mp3Qualities : mp4Qualities).map((q) => (
              <button
                key={q}
                onClick={() => onQualityChange(q)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  quality[format] === q
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-paper text-text-secondary hover:bg-bg-secondary border border-border'
                }`}
              >
                {format === 'mp3' ? `${q}k` : `${q}p`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-paper border border-border rounded-2xl">
        <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
          <input
            type="checkbox"
            checked={selectedSongs.size === playlistData.songs.length}
            onChange={onToggleSelectAll}
            className="w-5 h-5 rounded border-border bg-white text-primary focus:ring-2 focus:ring-primary/50"
          />
          <span>Seleccionar todas</span>
        </label>
        <div className="text-sm text-text-secondary">
          <span>{selectedSongs.size} seleccionadas</span>
          {getEstimatedSize() && (
            <span className="ml-2 text-text-tertiary">{getEstimatedSize()}</span>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {playlistData.songs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => onToggleSong(song.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
              selectedSongs.has(song.id)
                ? 'bg-primary/10 border-primary/40 shadow-md shadow-primary/10'
                : 'bg-paper border-border hover:bg-bg-secondary hover:border-border-hover'
            }`}
          >
            <span className="text-text-tertiary w-8 text-sm">{index + 1}</span>
            <img
              src={song.thumbnail || `https://i.ytimg.com/vi/${song.id}/mqdefault.jpg`}
              alt={song.title}
              className="w-16 h-12 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90" fill="%2318181b"><rect width="120" height="90"/><text x="60" y="45" fill="%23444444" text-anchor="middle" dominant-baseline="middle" font-size="20">🎵</text></svg>';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-text-primary">{song.title}</p>
              <p className="text-sm text-text-tertiary truncate">{song.channel}</p>
            </div>
            <span className="text-sm text-text-tertiary">{formatDuration(song.duration)}</span>
            <input
              type="checkbox"
              checked={selectedSongs.has(song.id)}
              onChange={() => onToggleSong(song.id)}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 rounded border-border bg-white text-primary focus:ring-2 focus:ring-primary/50"
            />
          </div>
        ))}
      </div>

      <button
        onClick={onDownload}
        disabled={selectedSongs.size === 0}
        className="w-full py-4 bg-gradient-to-r from-primary to-accent rounded-2xl font-semibold text-white hover:shadow-xl hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all flex items-center justify-center gap-2.5"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Descargar Seleccionadas</span>
      </button>
    </section>
  );
}
