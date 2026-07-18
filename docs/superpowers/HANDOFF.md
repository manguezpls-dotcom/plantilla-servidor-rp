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
| **F2 · Secciones** | Características, cómo entrar (bifurcación whitelist/directo), normas desde markdown con índice, staff, FAQ (schema FAQPage), redes | ⏳ Siguiente |
| **F3 · Pulido y lanzamiento** | SEO completo (sitemap/robots), Lighthouse ≥95, README bilingüe EN/ES con guía paso a paso, capturas, borrador del post de release para el foro Cfx | ⬜ Pendiente |

## Arquitectura (F1)

- **Stack:** Astro 5 estático, TypeScript strict, Vitest para lógica pura. Sin JS de
  cliente. Fuente = stack de sistema (sin dependencias externas; `@fontsource` llega en F2).
- **Contrato cerrado:** `interface ConfigServidor` en `src/config/servidor.ts`. NO
  modificar sin cambiar el plano en `vidaenleonida/docs/linea-c/01`. Solo `colores`
  viene de la config; `--radio` y `--fuente` son tokens fijos de la plantilla en
  `global.css` (el contrato no los expone).
- **Robustez ("nunca se ve rota"):** todo opcional degrada con elegancia. Helpers en
  `src/lib/fallbacks.ts` (`tieneLogo`, `tieneImagenHero`, `gradienteHero`). El ejemplo
  deja `logo`/`imagenHero` sin definir a propósito para demostrarlo (wordmark + gradiente).
- **Tema:** `src/lib/tokens.ts` deriva las custom properties de color de la config;
  `Base.astro` las inyecta en `:root`.

## Verificación (F1, 2026-07-18)

- Tests: 8/8 verdes (`npm test` — tokens 2, fallbacks 6).
- `astro check`: 0 errores / 0 warnings / 0 hints.
- `npm run build`: OK, 1 página.
- Smoke navegador (dev + demo desplegada): home carga, hero con gradiente fallback,
  wordmark, CTA a Discord, footer con crédito, responsive 375px sin scroll horizontal,
  consola limpia. Smoke de la demo desplegada: OK (usuario, 2026-07-18).
- Code review de frontera (Opus, holístico): sin críticos. Arreglados: helpers de
  robustez en favicon/og de Base, token muerto `--espacio`. Resto anotado abajo.

## Pendientes anotados (de la review de frontera; abordar en F2/F3)

- **Guía de deploy (F3):** el texto de `README.md` y `servidor.ts` dice "Cloudflare
  Pages" (decisión de arquitectura), pero la demo se desplegó en **Workers**. Reconciliar
  en la guía de F3: documentar el camino (Pages o Workers) de forma coherente.
- **"Único fichero" no es literal (F3):** el usuario aguas abajo también debe fijar
  `site` en `astro.config.mjs` para que canonical/OG apunten a SU dominio (si no,
  apuntan a la demo). Documentarlo en la guía de deploy, o buscar forma de derivarlo.
- **Sanitización de `set:html` (F2/F3):** los valores de color de la config se
  interpolan en `<style>` sin escapar. Riesgo bajo (config = autor), pero valorar
  validar hex en el contrato o usar `define:vars`.
- **Footer vacío con `creditoPlantilla:false`:** deja una banda con padding. Al añadir
  redes al footer en F2, gatear el render del `<footer>` a que haya contenido.
- **Logo como favicon:** `Base.astro` usa el logo tal cual como favicon; un wordmark
  ancho se ve distorsionado. Cosmético; valorar en F3.
- **Bootstrap Graphify:** pendiente `graphify install` + `graphify .` (norma de proyecto
  nuevo). Requiere Ollama local (ver memoria graphify-local-ollama-build). `graphify-out/`
  ya está en `.gitignore`.
- **npm audit:** 6 vulnerabilidades en transitivas de devDependencies (toolchain build).
  Sin superficie en runtime estático. Revisar en F3.

## Próximo arranque

Siguiente = **F2 · Secciones**. Plan detallado en
`docs/superpowers/plans/` (escribir con superpowers `writing-plans` justo antes de
ejecutar, reflejando el código real). Sugerido: sesión nueva para refrescar contexto
(mejor cache hit ratio). Modelos: subagentes Sonnet para código, Opus para review/testing.
