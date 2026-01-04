import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://metatube-downloader.com',
  integrations: [react(), tailwind(), sitemap()],
  server: {
    port: 4321
  }
});

