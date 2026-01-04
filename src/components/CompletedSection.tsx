interface CompletedSectionProps {
  files: Array<{ name: string; path: string; size: number }>;
  sessionDir: string;
  onNewDownload: () => void;
}

export default function CompletedSection({ files, sessionDir, onNewDownload }: CompletedSectionProps) {
  return (
    <section className="bg-bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-text-primary">¡Descarga Completada!</h3>
        <p className="text-text-tertiary">
          {files.length === 1 ? 'Se descargó 1 canción' : `Se descargaron ${files.length} canciones`}
        </p>
      </div>

      {files.length > 1 && (
        <a
          href={`/api/download-zip/${sessionDir}`}
          download
          className="block w-full py-4 bg-gradient-to-r from-primary to-accent rounded-2xl font-semibold text-white hover:shadow-xl hover:shadow-primary/25 transition-all text-center"
        >
          <svg className="w-5 h-5 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar Todo (ZIP)
        </a>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {files.map((file) => (
          <a
            key={file.name}
            href={`/api/download/${sessionDir}/${encodeURIComponent(file.name)}`}
            download={file.name}
            className="flex items-center gap-4 p-4 bg-paper border border-border rounded-2xl hover:bg-bg-secondary hover:border-border-hover transition-all"
          >
            <svg className="w-5 h-5 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="flex-1 truncate text-text-primary">{file.name}</span>
            <span className="text-sm text-text-tertiary">Descargar</span>
          </a>
        ))}
      </div>

      <button
        onClick={onNewDownload}
        className="w-full py-3 bg-paper border border-border rounded-2xl font-medium text-text-secondary hover:bg-bg-secondary hover:border-border-hover transition-all"
      >
        Nueva Descarga
      </button>
    </section>
  );
}
