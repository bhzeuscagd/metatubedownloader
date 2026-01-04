# MetaTube Downloader

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Astro](https://img.shields.io/badge/Astro-4.0-orange.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)

**Descargas completas, datos exactos.**

MetaTube es la herramienta definitiva para quienes odian las bibliotecas desordenadas. Especializada en la preservación de datos, esta aplicación descarga tus videos y canciones favoritas inyectando los metadatos correctos directamente desde la fuente. Olvídate de archivos "Track 01" sin carátula; con MetaTube, cada descarga incluye título, artista, álbum y carátula oficial de alta resolución automáticamente.

Construida con **Astro**, **React**, **Tailwind CSS** y **Socket.io** para una experiencia en tiempo real.

## 🚀 Características Principales

- **Metadatos Automáticos**: Inyección automática de carátulas, artista, título y álbum.
- **Formatos Flexibles**:
  - 🎵 **MP3**: Audio de alta calidad (hasta 320kbps).
  - 🎥 **MP4**: Video en alta definición (hasta 4K).
- **Soporte de Playlists**: Descarga listas de reproducción enteras de YouTube de una sola vez.
- **Alto Rendimiento**: Descargas concurrentes (hasta 6 archivos simultáneos) para maximizar tu ancho de banda.
- **Interfaz Moderna**: Diseño "Paper" limpio, accesible y responsivo.
- **Sin Publicidad**: Una experiencia limpia, sin anuncios ni rastreadores.
- **Actualizaciones en Tiempo Real**: Visualiza el progreso de cada canción y la velocidad global.

## 📋 Requisitos Previos

Para ejecutar MetaTube Downloader localmente, necesitas:

1.  **Node.js** (v18.0.0 o superior)
2.  **yt-dlp**: El motor de descarga.
3.  **FFmpeg**: Para el procesamiento de multimedia.

### Instalación de Herramientas

#### Windows
```powershell
winget install yt-dlp FFmpeg
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install yt-dlp ffmpeg
```

#### macOS
```bash
brew install yt-dlp ffmpeg
```

## 🛠️ Instalación y Configuración

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/bhzeuscagd/MetaTube-Downloader.git
    cd MetaTube-Downloader
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    # o si usas pnpm (recomendado)
    pnpm install
    ```

3.  **Configuración (Opcional)**
    El archivo `astro.config.mjs` contiene la configuración del sitio. Asegúrate de actualizar la propiedad `site` para producción.

4.  **Iniciar en Desarrollo**
    Este comando inicia tanto el frontend (Astro) como el backend (Socket.io).
    ```bash
    npm run dev
    # o
    pnpm dev
    ```

    - Frontend: `http://localhost:4321`
    - Backend: `http://localhost:3001`

## 🎯 Guía de Uso

1.  Copia la **URL** de un video o una playlist de YouTube.
2.  Pégala en el campo de entrada y presiona **Cargar**.
3.  Selecciona las canciones que deseas descargar (o usa "Seleccionar todas").
4.  Elige el **Formato** (MP3/MP4) y la **Calidad**.
5.  Haz clic en **Descargar Seleccionadas**.
6.  ¡Disfruta! Al finalizar, se generará un archivo ZIP con tus descargas organizadas.

## 🏗️ Estructura del Proyecto

```
MetaTube-Downloader/
├── src/
│   ├── components/       # Componentes React (UI)
│   ├── layouts/          # Layouts de Astro
│   └── pages/            # Rutas y API Endpoints
├── public/               # Assets estáticos (favicon, robots.txt)
├── server.js             # Servidor de producción (Express)
├── socket-server.js      # Servidor de WebSockets (Socket.io)
└── astro.config.mjs      # Configuración de Astro
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si tienes una idea para mejorar MetaTube:

1.  Haz un Fork del proyecto.
2.  Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3.  Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

**Creado con ❤️ por [bhzeuscagd](https://github.com/bhzeuscagd)**
