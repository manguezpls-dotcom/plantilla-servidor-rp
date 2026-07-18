# plantilla-servidor-rp

Plantilla open-source (MIT) para la web de un servidor de rol de FiveM/GTA RP.
Edita un único fichero de configuración (`src/config/servidor.ts`), haz push y publícala
gratis en Cloudflare. Sin base de datos, sin JavaScript de cliente, sin coste.

**Demo:** https://plantilla-servidor-rp.manguez-pls.workers.dev/

## Desplegar gratis en Cloudflare

Ambas opciones son gratuitas para un sitio estático. Antes de desplegar, abre
`astro.config.mjs` y cambia `site` por la URL de **tu** dominio (así los enlaces canónicos
y las etiquetas Open Graph apuntan a tu web y no a la demo).

- **Cloudflare Pages** (recomendado, más simple): en el panel de Cloudflare, *Workers &
  Pages → Create → Pages → Connect to Git*, elige tu fork, framework preset **Astro**, y
  cada `git push` republica sola.
- **Cloudflare Workers** (alternativa, es donde corre la demo): despliegue de assets
  estáticos con `wrangler`. Útil si ya trabajas con Workers.

> Guía paso a paso bilingüe (EN/ES) con capturas: pendiente (Fase 3).

Hecho con ❤ por [VidaEnLeonida.com](https://vidaenleonida.com).
