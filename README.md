# plantilla-servidor-rp

Plantilla open-source (MIT) para la web de un servidor de rol de FiveM/GTA RP.
Edita un único fichero de configuración (`src/config/servidor.ts`), haz push y publícala
gratis en Cloudflare. Sin base de datos, sin JavaScript de cliente, sin coste.

**Demo:** https://plantilla-servidor-rp.manguez-pls.workers.dev/

## Desplegar gratis en Cloudflare

Antes de desplegar, abre `astro.config.mjs` y cambia `site` por la URL de **tu** dominio
(así los enlaces canónicos y las etiquetas Open Graph apuntan a tu web y no a la demo).

- **Cloudflare Workers** (recomendado; es la vía actual de Cloudflare y donde corre la
  demo). Con una cuenta gratuita de Cloudflare:

  ```
  npm install
  npx wrangler login     # solo la primera vez
  npm run deploy
  ```

  Tu web queda en `plantilla-servidor-rp.<tu-cuenta>.workers.dev` (URL gratuita; puedes
  cambiar el nombre en `wrangler.jsonc` y conectar tu dominio propio desde el panel).
- **Cloudflare Pages** (alternativa sin terminal, también gratuita y soportada): en el
  panel, *Workers & Pages → Create → Pages → Connect to Git*, elige tu fork, framework
  preset **Astro**, y cada `git push` republica sola.

> Guía paso a paso bilingüe (EN/ES) con capturas: pendiente (Fase 3).

Hecho con ❤ por [VidaEnLeonida.com](https://vidaenleonida.com).
