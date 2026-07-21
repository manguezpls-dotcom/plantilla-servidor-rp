# HANDOFF · plantilla-servidor-rp

Estado canónico del proyecto para que una sesión nueva arranque informada solo con el
repo. Doc técnico interno; sin datos comerciales.

**Qué es:** plantilla open-source (MIT) de web estática para servidores de rol de
FiveM/GTA RP. Web config-driven en Astro 5: el admin edita un único fichero
(`src/config/servidor.ts`) y despliega gratis en Cloudflare. Planos de arquitectura
(cerrados) en el repo `vidaenleonida`: `docs/linea-c/00-fundamentos.md` y
`docs/linea-c/01-plantilla-servidor-rp.md`.

**Repo:** https://github.com/manguezpls-dotcom/plantilla-servidor-rp (público)
**Demo:** https://plantilla-servidor-rp.manguez-pls.workers.dev/ (Cloudflare Workers)

## Mapa de fases

| Fase | Alcance | Estado |
|---|---|---|
| **F1 · Esqueleto** | Repo, Astro, config tipada con ejemplo completo, Base + Hero + footer con crédito, demo desplegada | ✅ Completa (2026-07-18) |
| **F2 · Secciones** | Características, cómo entrar (bifurcación whitelist/directo), normas desde markdown con índice, staff, FAQ (schema FAQPage), redes, nav | ✅ Completa (2026-07-18) |
| **F3 · Pulido y lanzamiento** | SEO (sitemap/robots/theme-color), Lighthouse 100×4 + AA, README bilingüe EN/ES con capturas, post de release Cfx, pendientes heredados | ✅ Completa (2026-07-21), rama `f3-pulido` pendiente de frontera |

## Arquitectura (F1 + F2 + F3)

- **Stack:** Astro 5 estático, TypeScript strict, Vitest para lógica pura,
  @astrojs/sitemap. **Sin JS de cliente.** Fuente = stack de sistema.
- **Contrato cerrado:** `interface ConfigServidor` en `src/config/servidor.ts`. NO
  modificar sin cambiar el plano en `vidaenleonida/docs/linea-c/01`. Solo `colores`
  viene de la config; `--radio` y `--fuente` son tokens fijos. **F3 no tocó el
  contrato** (solo el valor demo de `primario` y el comentario de cabecera).
- **Validación en build:** `src/lib/colores.ts` (`validarColores` en `Base.astro`):
  color no-hex → el build falla con mensaje claro. Cierra el riesgo del `set:html`.
- **Degradación elegante:** todo opcional degrada; además (F3) el nav solo enlaza
  Normas/Staff si tienen contenido y el footer solo se renderiza si tiene contenido
  (las páginas siguen existiendo por URL directa).
- **CSS:** primitivo `.boton` + `.boton--compacto` compartido por los 3 botones
  primarios (BEM hooks conservados). Enlaces planos usan
  `color-mix(primario 75%, --color-texto 25%)`: desacoplados de los botones y
  siguiendo la polaridad de la config (nunca mezclar hacia `white` hardcodeado).
  Atenuados con `color`, no `opacity`, donde hay enlaces anidados (composición de capa).
- **SEO:** sitemap (integración), `src/pages/robots.txt.ts` deriva la URL de `site`
  (un fork solo toca `astro.config.mjs`), `theme-color` desde `colores.fondo`,
  canonical/OG de F1, JSON-LD FAQPage de F2. Favicon SIEMPRE `/favicon.svg` (el logo
  ya no se reutiliza como icono; un fork sustituye el fichero).
- **Lógica pura (TDD, `src/lib/`):** `tokens.ts`, `fallbacks.ts`, `entrada.ts`,
  `redes.ts`, `faqSchema.ts`, `colores.ts` (F3).

## Verificación (F3, 2026-07-21)

- Tests: **21/21 verdes** (`npm test`). `astro check`: 0 errores, 1 hint esperado
  (`is:inline` del JSON-LD en Faq.astro). Build: 3 páginas + robots.txt + sitemap.
- **Lighthouse: 100/100/100/100** (Performance/Accessibility/Best Practices/SEO) en
  `/`, `/normas/` y `/staff/` sobre el build de producción (astro preview + headless).
- Contraste AA verificado por cálculo WCAG: blanco sobre primario demo `#c9224a` =
  5.51:1; enlaces `#d45776` sobre fondo = 4.87:1.
- Capturas README (`docs/capturas/`): generadas con puppeteer-core + Chrome del
  sistema (viewport real 375 y 1280, DSF 2). Ojo: el `--screenshot` CLI de Chrome
  headless en Windows recorta por el ancho mínimo de ventana (~500px); usar puppeteer.
  El screenshot del pane del navegador integrado sigue dando timeout (limitación del
  entorno, ya vista en F2); JS/read_page del pane funcionan.
- Ejecución: subagent-driven (Sonnet implementa, Opus doble review por task). Fixes de
  review aplicados: mezcla de enlaces hacia `--color-texto` (no `white`), raya fuera
  del README ES, rutas exactas de los textos de UI en las FAQ.

## Decisiones de F3 (para no re-decidir)

- **Honestidad i18n:** los rótulos fijos de la UI (nav, títulos de sección, CTAs
  "Únete al Discord" y "Solicitar plaza"/"Conectar") están hardcodeados en español.
  Documentado con rutas exactas en las FAQ de ambos README y en el post de release.
  **Extraerlos a config/i18n = cambio de contrato → decisión de producto del usuario**
  (el post ofrece "if there's interest, i18n is the first thing I'd add").
- **npm audit: 6 vulnerabilidades quedan** (3 moderate, 2 high, 1 critical) en astro
  <=7.0.9 y la cadena vitest/vite/esbuild. Todas exigen majors (Astro 7, Vitest 3);
  `npm audit fix` sin --force no puede. Sin superficie en runtime (sitio estático;
  vectores = dev server y features no usadas: islands, spread props, view transitions,
  define:vars). Evaluar upgrade Astro 7 + Vitest 3 POST-lanzamiento como tarea propia.
- Rama remota `cloudflare/workers-autoconfig` apareció en origin (autogenerada por
  Cloudflare, probablemente al conectar Workers Builds). Revisar/cerrar en la frontera.
- Bootstrap Graphify: sigue pendiente (requiere Ollama local; no bloquea).

## Próximos pasos (post-F3)

1. **Frontera de fase** (con OK del usuario): merge `f3-pulido` → `main`, push,
   borrar rama, **redeploy de la demo** (`npm run deploy`).
2. **Smoke de tercero (usuario):** publicar un fork limpio siguiendo solo el README.
   Es el criterio de aceptación real de F3.
3. **Etapa 2 del roadmap** (`vidaenleonida/docs/linea-c/ROADMAP.md`, 10-23 ago):
   revisar y publicar `docs/release-post.md` en el foro Cfx, compartir en comunidades
   hispanas, enlazar la plantilla desde /servicios/ de vidaenleonida.com.
