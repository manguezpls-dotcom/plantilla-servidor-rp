import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://plantilla-servidor-rp.manguez-pls.workers.dev',
  trailingSlash: 'always',
  adapter: cloudflare()
});