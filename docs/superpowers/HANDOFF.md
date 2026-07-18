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
| **F3 · Pulido y lanzamiento** | SEO completo (sitemap/robots), Lighthouse ≥95, README bilingüe EN/ES con guía paso a paso, capturas, borrador del post de release para el foro Cfx | ⏳ Siguiente |

## Arquitectura (F1 + F2)

- **Stack:** Astro 5 estático, TypeScript strict, Vitest para lógica pura. **Sin JS de
  cliente** (FAQ con `<details>` nativo; nav sin hamburguesa). Fuente = stack de sistema
  (sin dependencias externas; `@fontsource` sigue siendo opcional, aparcado para F3).
- **Contrato cerrado:** `interface ConfigServidor` en `src/config/servidor.ts`. NO
  modificar sin cambiar el plano en `vidaenleonida/docs/linea-c/01`. Solo `colores`
  viene de la config; `--radio` y `--fuente` son tokens fijos de la plantilla en
  `global.css` (el contrato no los expone). **F2 no tocó el contrato** (verificado en la
  review de frontera).
- **Degradación elegante ("nunca se ve rota"):** todo opcional degrada. Cada sección se
  autooculta si su dato está vacío (guardas `length > 0` en Caracteristicas, ComoEntrar,
  Faq, Staff; `redesActivas` para Redes). Helpers de fallback de F1 en `src/lib/fallbacks.ts`.
- **Lógica pura (TDD, `src/lib/`):** `entrada.ts` (`ctaEntrada` → CTA bifurcada
  whitelist/directo), `redes.ts` (`redesActivas` → redes presentes en orden fijo
  x→tiktok→youtube→instagram), `faqSchema.ts` (`faqPageSchema` → JSON-LD FAQPage). Más
  los de F1: `tokens.ts`, `fallbacks.ts`.
- **Contenido:** colección `normas` (Astro content collection, glob loader) en
  `src/content.config.ts` + `src/content/normas/*.md`. La página `normas.astro` ordena por
  `orden` y monta índice lateral sticky con anclajes = `id` del fichero.
- **Componentes de sección:** `CtaDiscord`, `Caracteristicas`, `ComoEntrar`, `Faq`,
  `Staff` (avatar o iniciales), `Redes`. Todo el CSS en `src/styles/global.css` (BEM).
- **Layout:** `Base.astro` con nav en header (Inicio/Normas/Staff, rutas con trailing
  slash) y `<Redes/>` en el footer. `trailingSlash: 'always'`.
- **Páginas:** `index.astro` (Hero + Caracteristicas + ComoEntrar + Faq + CtaDiscord),
  `normas.astro`, `staff.astro`.

## Verificación (F2, 2026-07-18)

- Tests: **17/17 verdes** (`npm test` — tokens 2, fallbacks 6, entrada 3, redes 4, faqSchema 2).
- `astro check`: 0 errores / 0 warnings / 1 hint (esperado: `is:inline` del `<script>`
  JSON-LD en `Faq.astro`; comportamiento buscado, sin JS de cliente).
- `npm run build`: OK, 3 páginas (`/`, `/normas/`, `/staff/`).
- Smoke navegador (dev, puerto 4322): home completa (nav, hero, 4 características,
  4 pasos + CTA "Solicitar plaza", 3 FAQ, CtaDiscord, footer con redes X/TikTok/YouTube +
  crédito); acordeón FAQ abre/cierra (nativo); JSON-LD `FAQPage` con 3 preguntas;
  `/normas/` con 3 normas markdown + índice con anclajes coincidentes + énfasis renderizado;
  `/staff/` con 3 miembros con iniciales; responsive 375px sin scroll horizontal, nav a
  ancho completo, grids a 1 columna; consola y logs del servidor limpios.
  **Pendiente:** capturas (Step 7 del plan) dieron timeout del renderer del entorno; la
  funcionalidad quedó verificada por árbol de accesibilidad + mediciones JS. **Falta el
  smoke del usuario sobre la demo desplegada** (tras el deploy de F2).
- Ejecución: subagent-driven-development (implementer Sonnet + doble review Opus por task:
  spec + calidad) y **review holística de frontera (Opus) sobre el diff completo de la
  rama: APROBADA, sin críticos ni importantes.**

## Pendientes anotados (abordar en F3 salvo indicación)

Nuevos (de la review holística de frontera F2):
- **Botón primario duplicado 3×:** `.hero__cta`, `.cta-discord__boton`, `.cabecera__discord`
  comparten patrón casi idéntico en `global.css`. `ComoEntrar` ya reutiliza
  `.cta-discord__boton`. Valorar extraer un primitivo `.boton` en F3 para evitar deriva.
- **Páginas que pueden quedar "desnudas":** si `staff` (o la colección `normas`) queda
  vacía, `/staff/` (o `/normas/`) renderiza un `<main>` vacío mientras el nav sigue
  enlazándolas. Coherente con el contrato de degradación; documentar/valorar ocultar el
  enlace del nav cuando la sección esté vacía.

Heredados de F1 (revisar en F3):
- **Guía de deploy:** README ya reconciliado (2026-07-18: documenta Pages recomendado +
  Workers alternativa, y el paso de fijar `site`). Falta: el comentario de cabecera de
  `servidor.ts` aún dice "Cloudflare Pages publicará tu web", y la guía bilingüe paso a
  paso con capturas es de F3.
- **"Único fichero" no es literal:** el usuario aguas abajo también debe fijar `site` en
  `astro.config.mjs` para que canonical/OG apunten a SU dominio. Documentar en la guía.
- **Sanitización de `set:html`:** colores de la config se interpolan en `<style>` sin
  escapar; el JSON-LD del FAQ usa `set:html={JSON.stringify(schema)}` (seguro con config de
  confianza, sin `</script>`). Riesgo bajo (config = autor); valorar validar hex en el
  contrato o `define:vars`.
- **Footer con `creditoPlantilla:false` y sin redes:** deja una banda con padding. F2 metió
  `<Redes/>` (que se autooculta), pero el `<footer>` no está gateado a que haya contenido.
- **Logo como favicon:** un wordmark ancho se ve distorsionado. Cosmético.
- **Bootstrap Graphify:** pendiente `graphify install` + `graphify .` (requiere Ollama
  local, ver memoria graphify-local-ollama-build). `graphify-out/` ya en `.gitignore`.
- **npm audit:** 6 vulnerabilidades en transitivas de devDependencies (toolchain build).
  Sin superficie en runtime estático. Revisar en F3.

## Próximo arranque

Siguiente = **F3 · Pulido y lanzamiento**. Escribir el plan detallado con superpowers
`writing-plans` justo antes de ejecutar, reflejando el código real. Sugerido: **sesión
nueva** para refrescar contexto (mejor cache hit ratio). Modelos: subagentes Sonnet para
código, Opus para review. Primer entregable natural de F3: reconciliar la guía de deploy
(Pages vs Workers) + README bilingüe, y desplegar F2 para el smoke del usuario sobre la demo.
