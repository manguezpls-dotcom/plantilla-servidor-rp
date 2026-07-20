import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://plantilla-servidor-rp.manguez-pls.workers.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
