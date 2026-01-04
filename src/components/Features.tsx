export default function Features() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      ),
      title: 'Descargas Rápidas',
      description: 'Hasta 6 descargas simultáneas para máxima velocidad'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: 'Alta Calidad',
      description: 'Hasta 320kbps en MP3 y 4K en video'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: '100% Gratis',
      description: 'Sin registro, sin anuncios, sin límites'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      title: 'Metadatos Completos',
      description: 'Título, artista, álbum y carátula oficial automáticamente'
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group bg-bg-card border border-border rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 text-primary group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
            <div className="w-5 h-5">{feature.icon}</div>
          </div>
          <h3 className="text-base font-semibold mb-2 text-text-primary">{feature.title}</h3>
          <p className="text-sm text-text-tertiary leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
