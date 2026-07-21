import type { APIRoute } from 'astro';

// El sitemap necesita URL absoluta; se deriva de `site` para que un fork
// solo tenga que cambiar astro.config.mjs.
export const GET: APIRoute = ({ site }) => {
  const cuerpo = ['User-agent: *', 'Allow: /', `Sitemap: ${new URL('sitemap-index.xml', site)}`, ''].join('\n');
  return new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
