# plantilla-servidor-rp: plantilla web para servidores FiveM/GTA RP

[Read me in English](README.md)

Plantilla web gratuita y de código abierto (MIT) para servidores de rol de
FiveM/GTA RP. Edita **un único fichero de configuración** y despliega gratis
en Cloudflare. Sin base de datos, sin JavaScript de cliente, sin coste.

**Demo en vivo:** https://plantilla-servidor-rp.manguez-pls.workers.dev/

![Portada](docs/capturas/home.png)

## Qué incluye

- Hero con el nombre de tu servidor, lema y llamada a la acción (cambia
  automáticamente entre un CTA de solicitud y un CTA de conexión según tu
  configuración)
- Cuadrícula de características, pasos de cómo entrar, página de staff,
  redes sociales
- Página de normas generada a partir de ficheros Markdown, con índice lateral
  fijo
- FAQ con acordeones nativos y JSON-LD `FAQPage` para los resultados
  enriquecidos de Google
- SEO listo de fábrica: URLs canónicas, Open Graph, sitemap, robots.txt
- **Degradación elegante:** cada campo opcional simplemente oculta su
  sección. ¿Sin logo? Un wordmark tipográfico. ¿Sin imagen de hero? Un
  degradado con tus colores. La web nunca se ve rota.

## Inicio rápido (fork → editar → desplegar)

1. **Haz un fork** de este repositorio (botón arriba a la derecha en GitHub).
2. **Edita `src/config/servidor.ts`**: nombre, lema, invitación de Discord,
   colores, características, staff, FAQ... Todos los campos están
   comentados.
3. **Fija tu URL** en `astro.config.mjs` (`site: 'https://tu-dominio.com'`)
   para que los enlaces canónicos y las tarjetas sociales apunten a *tu*
   web.
4. **Sustituye `public/favicon.svg`** por tu icono (funciona mejor si es
   cuadrado).
5. **Despliega** (elige una opción):

   **Opción A: un solo comando (Cloudflare Workers, así corre la demo):**
   ```bash
   npm install
   npx wrangler login   # solo la primera vez
   npm run deploy
   ```
   Tu web queda publicada en `plantilla-servidor-rp.<tu-cuenta>.workers.dev`
   (puedes renombrarla en `wrangler.jsonc`; añade un dominio propio desde el
   panel).

   **Opción B: sin terminal (botón Deploy to Workers):**

   [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/manguezpls-dotcom/plantilla-servidor-rp)

   Cloudflare clona el repositorio en tu cuenta y lo construye: con cada
   `git push` se vuelve a desplegar.

## Ejecutar en local
Para ejecutar localmente el repo, primero debes clonarlo desde Github en tu directorio
Copia la URL en el botón verde que dice "Code" en la página principal del repo

![Clone](docs/capturas/clone.jpg)

Y ejecutas el comando de clonación en tu terminal, apuntando a tu directorio
```bash
cd /<your-project>
git clone https://github.com/manguezpls-dotcom/plantilla-servidor-rp.git
```

Y lo arrancas localmente
```bash
npm install
npm run dev        # http://localhost:4321
npm test           # tests de lógica pura (Vitest)
npm run build      # salida estática en dist/
```

## Editar la página de normas

Cada norma es un fichero Markdown en `src/content/normas/`:

```markdown
---
titulo: El respeto ante todo
orden: 1
---
El acoso, la discriminación o el comportamiento tóxico...
```

`orden` controla la posición; el nombre del fichero (sin la extensión
`.md`, incluido el número inicial) se convierte en el ancla del índice
lateral, por ejemplo, `01-respeto.md` enlaza a `#01-respeto`. Si borras
todos los ficheros, el enlace de Normas desaparece del menú.

## Capturas

| Página de normas | Móvil |
|---|---|
| ![Normas](docs/capturas/normas.png) | ![Móvil](docs/capturas/movil.png) |

## Preguntas frecuentes

- **¿Necesito saber programar?** No. El fichero de configuración son valores
  planos con comentarios; las normas en Markdown son texto plano.
- **¿Puedo quitar el crédito de "hecho con"?** Sí: pon
  `creditoPlantilla: false`. Se agradece un enlace de vuelta, pero no es
  obligatorio (licencia MIT).
- **¿Los textos de la interfaz están en español?** Sí, los textos fijos de
  la interfaz (menú, títulos de sección, botones de CTA) están escritos en
  español directamente en el código, ya que la demo está pensada para una
  comunidad hispanohablante. Para lectores en español esto no es un
  problema, pero si quieres cambiarlos, viven en varios ficheros: el menú
  en `src/layouts/Base.astro`; los títulos de sección y los botones
  "Únete al Discord" en `src/components/` (`Hero.astro`, `CtaDiscord.astro`
  y los componentes de sección); y el texto del CTA de solicitar o
  conectar en `src/lib/entrada.ts`.

## Licencia

MIT, ver [LICENSE](LICENSE). Hecho por [VidaEnLeonida.com](https://vidaenleonida.com).
