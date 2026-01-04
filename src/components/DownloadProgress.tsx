interface DownloadProgressProps {
  progress: {
    completed?: number;
    total?: number;
    songs?: Record<string, any>;
    stats?: {
      totalSpeed: number;
      elapsedTime: number;
      estimatedRemainingTime: number;
      completedSongs: number;
      totalSongs: number;
      activeSongs: number;
    };
  };
}

export default function DownloadProgress({ progress }: DownloadProgressProps) {
  const formatSpeed = (bytesPerSecond: number) => {
    if (!bytesPerSecond || bytesPerSecond <= 0) return '-- MB/s';
    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    let unitIndex = 0;
    let speed = bytesPerSecond;
    while (speed >= 1024 && unitIndex < units.length - 1) {
      speed /= 1024;
      unitIndex++;
    }
    return `${speed.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return '00:00';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completed = progress.completed || 0;
  const total = progress.total || 0;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <section className="bg-bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2.5 text-text-primary">
          <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargando...
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>{completed} / {total}</span>
            <span className="text-text-tertiary">{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-paper rounded-full h-2.5 overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {progress.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-paper border border-border rounded-2xl p-4">
            <div className="text-sm text-text-tertiary mb-1.5">Velocidad Total</div>
            <div className="text-lg font-semibold text-text-primary">{formatSpeed(progress.stats.totalSpeed)}</div>
          </div>
          <div className="bg-paper border border-border rounded-2xl p-4">
            <div className="text-sm text-text-tertiary mb-1.5">Tiempo Transcurrido</div>
            <div className="text-lg font-semibold text-text-primary">{formatTime(progress.stats.elapsedTime)}</div>
          </div>
          <div className="bg-paper border border-border rounded-2xl p-4">
            <div className="text-sm text-text-tertiary mb-1.5">Tiempo Restante</div>
            <div className="text-lg font-semibold text-text-primary">
              {progress.stats.completedSongs === progress.stats.totalSongs
                ? '¡Completado!'
                : formatTime(progress.stats.estimatedRemainingTime)}
            </div>
          </div>
          <div className="bg-paper border border-border rounded-2xl p-4">
            <div className="text-sm text-text-tertiary mb-1.5">Descargas Activas</div>
            <div className="text-lg font-semibold text-text-primary">
              {progress.stats.activeSongs} / {progress.stats.totalSongs - progress.stats.completedSongs}
            </div>
          </div>
        </div>
      )}

      {progress.songs && Object.keys(progress.songs).length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Object.entries(progress.songs).map(([songId, songData]: [string, any]) => (
            <div
              key={songId}
              className={`p-4 rounded-2xl border ${
                songData.status === 'completed'
                  ? 'bg-green-500/10 border-green-500/30'
                  : songData.status === 'error'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-paper border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium truncate flex-1 text-text-primary">{songData.title}</span>
                <span className="text-sm text-text-tertiary ml-2">
                  {songData.status === 'completed' ? '✓ Completado' : songData.status === 'error' ? '✗ Error' : `${Math.round(songData.progress || 0)}%`}
                </span>
              </div>
              {songData.status === 'downloading' && (
                <div className="w-full bg-paper rounded-full h-1.5 overflow-hidden border border-border">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
                    style={{ width: `${songData.progress || 0}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
