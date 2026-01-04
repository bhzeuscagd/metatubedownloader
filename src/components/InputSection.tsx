interface InputSectionProps {
  playlistUrl: string;
  setPlaylistUrl: (url: string) => void;
  onLoad: () => void;
  loading: boolean;
}

export default function InputSection({ playlistUrl, setPlaylistUrl, onLoad, loading }: InputSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onLoad();
    }
  };

  return (
    <section className="bg-bg-card border border-border rounded-3xl p-8 space-y-5 shadow-sm">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <input
            type="text"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pega el link de un video o playlist de YouTube..."
            className="w-full pl-12 pr-4 py-3.5 bg-paper border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all text-[15px]"
          />
        </div>
        <button
          onClick={onLoad}
          disabled={loading}
          className="px-7 py-3.5 bg-gradient-to-r from-primary to-accent rounded-xl font-medium text-white hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all flex items-center gap-2.5"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Cargando...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="5 12 12 19 19 12" />
                <line x1="12" y1="5" x2="12" y2="19" />
              </svg>
              <span>Cargar</span>
            </>
          )}
        </button>
      </div>
      <div className="flex items-center gap-2.5 text-sm text-text-tertiary">
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <span>Soporta videos individuales y playlists públicas de YouTube</span>
      </div>
    </section>
  );
}
