export default function Header() {
  return (
    <header className="text-center space-y-5 py-12 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-16 h-16 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full">
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#d71e3d', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#b3002d', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="256" cy="256" r="240" fill="url(#grad2)" />
            <path d="M144,144 L144,304 L256,416 L368,304 L368,144 L304,144 L304,272 L256,320 L208,272 L208,144 Z" fill="#ffffff" />
            <polygon points="240,100 272,120 240,140" fill="#ffffff" opacity="0.8" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
            MetaTube
          </span>
          <span className="text-text-secondary ml-2 font-normal">Downloader</span>
        </h1>
      </div>
      <p className="text-xl text-text-secondary font-medium tracking-tight">Descargas completas, datos exactos.</p>
      <p className="text-sm text-text-tertiary">Metadatos automáticos • Carátulas oficiales • MP3 y MP4</p>
    </header>
  );
}
