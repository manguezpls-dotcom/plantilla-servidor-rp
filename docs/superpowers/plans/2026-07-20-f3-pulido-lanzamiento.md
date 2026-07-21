# F3 · Pulido y lanzamiento — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar la plantilla lista para lanzamiento público: SEO completo, Lighthouse ≥95 + AA, README bilingüe con guía paso a paso, post de release para el foro Cfx, y saldar los pendientes heredados de F1/F2.

**Architecture:** Astro 5 estático config-driven (contrato `ConfigServidor` CERRADO en `src/config/servidor.ts` — este plan NO lo modifica). Lógica pura con TDD en `src/lib/`, CSS BEM en `src/styles/global.css`, sin JS de cliente. Deploy en Cloudflare Workers (static assets).

**Tech Stack:** Astro 5, TypeScript strict, Vitest, @astrojs/sitemap (nueva dep), wrangler.

**Restricción dura:** `interface ConfigServidor` no se toca. Si una task parece necesitar un campo nuevo, PARAR y consultar (el plano `vidaenleonida/docs/linea-c/01` manda).

---

### Task 1: Rama de trabajo

**Files:** ninguno (git).

- [ ] **Step 1: Crear la rama F3 desde main actualizado**

```bash
git checkout main && git pull && git checkout -b f3-pulido
```

- [ ] **Step 2: Verificar punto de partida verde**

Run: `npm test && npm run check && npm run build`
Expected: 17/17 tests pass; astro check 0 errores (1 hint `is:inline` esperado); build OK con 3 páginas.

---

### Task 2: Validación de colores hex (lógica pura, TDD)

Cierra el pendiente "sanitización de `set:html`": los colores de la config se interpolan en un `<style>` sin escapar. En vez de sanitizar en runtime, validamos en build: si un color no es hex, el build falla con mensaje claro. Config inválida nunca llega a producción.

**Files:**
- Create: `src/lib/colores.ts`
- Test: `src/lib/colores.test.ts`
- Modify: `src/layouts/Base.astro` (frontmatter, tras los imports)

- [ ] **Step 1: Escribir los tests que fallan**

```typescript
// src/lib/colores.test.ts
import { describe, it, expect } from 'vitest';
import { esHexValido, validarColores } from './colores';

describe('esHexValido', () => {
  it('acepta hex de 6 y de 3 dígitos, con mayúsculas o minúsculas', () => {
    expect(esHexValido('#e0355a')).toBe(true);
    expect(esHexValido('#F5F6FA')).toBe(true);
    expect(esHexValido('#fff')).toBe(true);
  });

  it('rechaza valores que no son hex', () => {
    expect(esHexValido('red')).toBe(false);
    expect(esHexValido('e0355a')).toBe(false);          // sin #
    expect(esHexValido('#e0355')).toBe(false);           // 5 dígitos
    expect(esHexValido('#e0355a; } body { x: url(')).toBe(false); // inyección
  });
});

describe('validarColores', () => {
  it('no lanza con colores válidos', () => {
    expect(() =>
      validarColores({ primario: '#e0355a', fondo: '#0f1117', texto: '#f5f6fa' }),
    ).not.toThrow();
  });

  it('lanza nombrando la clave inválida', () => {
    expect(() =>
      validarColores({ primario: 'rojo', fondo: '#0f1117', texto: '#f5f6fa' }),
    ).toThrow(/primario/);
  });
});
```

- [ ] **Step 2: Verificar que fallan**

Run: `npx vitest run src/lib/colores.test.ts`
Expected: FAIL (módulo `./colores` no existe).

- [ ] **Step 3: Implementación mínima**

```typescript
// src/lib/colores.ts
import type { ConfigServidor } from '../config/servidor';

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** ¿Es un color hex CSS válido (#abc o #aabbcc)? */
export function esHexValido(valor: string): boolean {
  return HEX.test(valor);
}

/**
 * Valida los colores de la config en build. Los colores se inyectan en un
 * <style> sin escapar (set:html), así que solo se admite hex estricto.
 * Lanza con mensaje claro para que el build falle si la config es inválida.
 */
export function validarColores(colores: ConfigServidor['colores']): void {
  const invalidas = (Object.entries(colores) as [string, string][])
    .filter(([, valor]) => !esHexValido(valor))
    .map(([clave]) => clave);
  if (invalidas.length > 0) {
    throw new Error(
      `Colores inválidos en src/config/servidor.ts (${invalidas.join(', ')}): ` +
        `usa hex tipo #aabbcc.`,
    );
  }
}
```

- [ ] **Step 4: Verificar que pasan**

Run: `npm test`
Expected: 21/21 tests pass (17 previos + 4 nuevos).

- [ ] **Step 5: Conectar la validación al build en `Base.astro`**

En el frontmatter de `src/layouts/Base.astro`, añadir el import y la llamada justo antes de `const rootStyle`:

```astro
import { validarColores } from '../lib/colores';
```

```astro
validarColores(servidor.colores);
const rootStyle = `:root{${estiloInline(variablesTema(servidor))}}`;
```

- [ ] **Step 6: Verificar build y commit**

Run: `npm run check && npm run build`
Expected: OK. (Prueba manual opcional: poner `primario: 'rojo'` temporalmente y ver que el build falla nombrando `primario`; revertir.)

```bash
git add src/lib/colores.ts src/lib/colores.test.ts src/layouts/Base.astro
git commit -m "F3: validar colores hex de la config en build"
```

---

### Task 3: Primitivo `.boton` (deduplicar CSS)

`.hero__cta`, `.cta-discord__boton` y `.cabecera__discord` repiten casi el mismo patrón en `global.css`. Se extrae un primitivo `.boton` con modificador de tamaño; los componentes lo usan junto a su clase BEM (que queda solo para ajustes propios).

**Files:**
- Modify: `src/styles/global.css` (bloques en líneas ~46-55, ~93-104, ~133-143)
- Modify: `src/layouts/Base.astro:50`, `src/components/Hero.astro:13`, `src/components/CtaDiscord.astro:11`, `src/components/ComoEntrar.astro:14`

- [ ] **Step 1: Añadir el primitivo en `global.css`** (tras el bloque `.contenedor`)

```css
/* Botón primario (primitivo compartido) */
.boton {
  display: inline-flex;
  align-items: center;
  padding: 0.9rem 1.6rem;
  border-radius: var(--radio);
  background: var(--color-primario);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
.boton:hover { filter: brightness(1.08); }
.boton--compacto {
  padding: 0.55rem 1rem;
  font-weight: 600;
}
```

- [ ] **Step 2: Reducir las tres clases existentes a sus diferencias**

Sustituir los tres bloques actuales por:

```css
.cabecera__discord {}
.hero__cta { font-size: 1.05rem; }
.cta-discord__boton {}
```

(Las clases vacías pueden eliminarse del CSS; se mantienen en el HTML como hook BEM. Eliminar también los dos `:hover` duplicados.)

- [ ] **Step 3: Actualizar los cuatro usos en componentes**

```astro
<!-- Base.astro línea 50 -->
<a class="boton boton--compacto cabecera__discord" href={servidor.urlDiscord}>Discord</a>
<!-- Hero.astro línea 13 -->
<a class="boton hero__cta" href={servidor.urlDiscord}>Únete al Discord</a>
<!-- CtaDiscord.astro línea 11 -->
<a class="boton cta-discord__boton" href={servidor.urlDiscord}>Únete al Discord</a>
<!-- ComoEntrar.astro línea 14 -->
<a class="boton cta-discord__boton" href={cta.url}>{cta.texto}</a>
```

- [ ] **Step 4: Verificar visualmente**

Run: `npm run build`, luego levantar dev (puerto 4322) y comprobar que los tres botones se ven igual que antes (header compacto, hero grande, CTA normal).

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro src/components/Hero.astro src/components/CtaDiscord.astro src/components/ComoEntrar.astro
git commit -m "F3: extraer primitivo .boton y eliminar CSS duplicado"
```

---

### Task 4: Nav condicional y footer gateado (páginas "desnudas")

Si `staff` o la colección `normas` están vacías, sus páginas renderizan un `<main>` vacío con el nav apuntándolas. Solución: el nav solo enlaza secciones con contenido, y el `<footer>` solo se renderiza si tiene algo que mostrar. Las páginas siguen existiendo (contrato de degradación intacto: nada "se rompe" si alguien entra por URL directa).

**Files:**
- Modify: `src/layouts/Base.astro` (frontmatter + header + footer)

- [ ] **Step 1: Calcular visibilidad en el frontmatter de `Base.astro`**

Añadir a los imports y al frontmatter:

```astro
import { getCollection } from 'astro:content';
import { redesActivas } from '../lib/redes';
```

```astro
const hayNormas = (await getCollection('normas')).length > 0;
const hayStaff = servidor.staff.length > 0;
const hayPie = redesActivas(servidor).length > 0 || servidor.creditoPlantilla;
```

- [ ] **Step 2: Gatear nav y footer**

```astro
<nav class="cabecera__nav" aria-label="Principal">
  <a class="cabecera__enlace" href="/">Inicio</a>
  {hayNormas && <a class="cabecera__enlace" href="/normas/">Normas</a>}
  {hayStaff && <a class="cabecera__enlace" href="/staff/">Staff</a>}
</nav>
```

```astro
{hayPie && (
  <footer class="pie contenedor">
    <Redes />
    {servidor.creditoPlantilla && (
      <p>
        Hecho con la <a href="https://vidaenleonida.com" rel="noopener">plantilla de VidaEnLeonida.com</a>
      </p>
    )}
  </footer>
)}
```

- [ ] **Step 3: Verificar por build**

Run: `npm run build && grep -c "/staff/" dist/index.html`
Expected: build OK; con la config de ejemplo (staff y normas presentes) los enlaces siguen en el HTML. Prueba manual opcional: vaciar `staff: []` temporalmente, rebuild, comprobar que el enlace Staff desaparece del nav; revertir.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "F3: nav condicional por contenido y footer gateado"
```

---

### Task 5: Favicon fijo (no reutilizar el logo)

Un wordmark ancho como favicon se ve distorsionado. El favicon pasa a ser siempre `/favicon.svg`; quien haga fork lo sustituye por el suyo (se documenta en el README de Task 8).

**Files:**
- Modify: `src/layouts/Base.astro:22` y `:37`

- [ ] **Step 1: Eliminar la reutilización del logo**

Quitar la línea `const favicon = ...` del frontmatter y dejar en el head:

```astro
<link rel="icon" href="/favicon.svg" />
```

- [ ] **Step 2: Verificar y commit**

Run: `npm run check && npm run build`
Expected: OK (la variable `favicon` ya no existe; `tieneLogo` sigue usándose para `marca`).

```bash
git add src/layouts/Base.astro
git commit -m "F3: favicon fijo, el logo ya no se reutiliza como icono"
```

---

### Task 6: SEO — sitemap, robots.txt y metas

FAQ schema y OG básico ya existen (F1/F2). Falta: sitemap, robots.txt (con URL absoluta derivada de `site`, para que los forks no tengan que tocarlo) y `theme-color`.

**Files:**
- Modify: `astro.config.mjs`, `package.json` (nueva dep), `src/layouts/Base.astro` (head)
- Create: `src/pages/robots.txt.ts`

- [ ] **Step 1: Instalar e integrar @astrojs/sitemap**

```bash
npm install @astrojs/sitemap
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://plantilla-servidor-rp.manguez-pls.workers.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
```

- [ ] **Step 2: robots.txt dinámico (endpoint estático)**

```typescript
// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

// El sitemap necesita URL absoluta; se deriva de `site` para que un fork
// solo tenga que cambiar astro.config.mjs.
export const GET: APIRoute = ({ site }) => {
  const cuerpo = ['User-agent: *', 'Allow: /', `Sitemap: ${new URL('sitemap-index.xml', site)}`, ''].join('\n');
  return new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
```

- [ ] **Step 3: Metas en el head de `Base.astro`**

Añadir junto a las metas OG:

```astro
<meta name="theme-color" content={servidor.colores.fondo} />
<link rel="sitemap" href="/sitemap-index.xml" />
```

- [ ] **Step 4: Verificar artefactos generados**

Run: `npm run build && ls dist/sitemap-index.xml dist/robots.txt && cat dist/robots.txt`
Expected: ambos ficheros existen; robots.txt contiene `Sitemap: https://plantilla-servidor-rp.manguez-pls.workers.dev/sitemap-index.xml`.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs package.json package-lock.json src/pages/robots.txt.ts src/layouts/Base.astro
git commit -m "F3: sitemap, robots.txt dinamico y theme-color"
```

---

### Task 7: Comentario de cabecera de `servidor.ts` (deploy honesto)

El comentario aún dice "Cloudflare Pages publicará tu web". Se actualiza SOLO el comentario (el contrato y los valores no se tocan).

**Files:**
- Modify: `src/config/servidor.ts:1-8` (solo el bloque de comentario)

- [ ] **Step 1: Sustituir el comentario de cabecera**

```typescript
// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE TU SERVIDOR
//  Este es el fichero que necesitas editar: cambia los valores por los de tu
//  servidor y despliega gratis en Cloudflare con `npm run deploy` (Workers).
//  Recuerda también poner la URL de TU web en `site` (astro.config.mjs) para
//  que los enlaces canónicos y las tarjetas al compartir apunten a tu dominio.
//  Regla de oro: todo lo opcional degrada con elegancia. Si no rellenas una
//  sección, simplemente no se muestra; si no pones logo o imagen, se genera un
//  respaldo con tus colores. La plantilla nunca se ve "rota".
// ─────────────────────────────────────────────────────────────────────────────
```

- [ ] **Step 2: Verificar y commit**

Run: `npm test`
Expected: 21/21 (solo cambió un comentario).

```bash
git add src/config/servidor.ts
git commit -m "F3: comentario de servidor.ts alineado con deploy Workers y paso de site"
```

---

### Task 8: README bilingüe (EN primero) + README.es.md

README principal en inglés (audiencia Cfx), con guía fork → config → deploy, botón "Deploy to Workers" y sección de personalización. Versión española en `README.es.md` con enlace cruzado. Las capturas se generan en Task 10; aquí se referencian rutas `docs/capturas/*.png` que existirán entonces.

**Files:**
- Modify: `README.md` (reescritura completa, en EN)
- Create: `README.es.md`

- [ ] **Step 1: Escribir `README.md` (EN)**

```markdown
# plantilla-servidor-rp — FiveM/GTA RP server website template

[Léeme en español](README.es.md)

Free, open-source (MIT) website template for FiveM / GTA RP servers.
Edit **one config file**, deploy for free on Cloudflare. No database, no
client-side JavaScript, no cost.

**Live demo:** https://plantilla-servidor-rp.manguez-pls.workers.dev/

![Home](docs/capturas/home.png)

## What you get

- Hero with your name, tagline and call to action (auto-switches between
  "Apply for whitelist" and "Connect" depending on your config)
- Features grid, how-to-join steps, staff page, social links
- Rules page generated from Markdown files, with a sticky side index
- FAQ with native accordions + `FAQPage` JSON-LD for Google rich results
- SEO out of the box: canonical URLs, Open Graph, sitemap, robots.txt
- **Graceful degradation:** every optional field just hides its section.
  No logo? A typographic wordmark. No hero image? A gradient in your colors.
  The site never looks broken.

## Quick start (fork → edit → deploy)

1. **Fork** this repository (button at the top right on GitHub).
2. **Edit `src/config/servidor.ts`** — name, tagline, Discord invite, colors,
   features, staff, FAQ… Every field is commented.
3. **Set your URL** in `astro.config.mjs` (`site: 'https://your-domain.com'`)
   so canonical links and social cards point to *your* site.
4. **Replace `public/favicon.svg`** with your icon (square works best).
5. **Deploy** (pick one):

   **Option A — one command (Cloudflare Workers, how the demo runs):**
   ```bash
   npm install
   npx wrangler login   # first time only
   npm run deploy
   ```
   Your site goes live at `plantilla-servidor-rp.<your-account>.workers.dev`
   (rename it in `wrangler.jsonc`; add a custom domain from the dashboard).

   **Option B — no terminal (Deploy to Workers button):**

   [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/manguezpls-dotcom/plantilla-servidor-rp)

   Cloudflare clones the repo into your account and builds it; every
   `git push` redeploys.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm test           # pure-logic tests (Vitest)
npm run build      # static output in dist/
```

## Editing the rules page

Each rule is a Markdown file in `src/content/normas/`:

```markdown
---
titulo: Respect above all
orden: 1
---
Harassment, discrimination or toxic behaviour...
```

`orden` controls the position; the file name (minus the number prefix) becomes
the anchor in the side index. Delete all files and the Rules link disappears
from the nav.

## FAQ

- **Do I need to know how to code?** No. The config file is plain values with
  comments; the Markdown rules are plain text.
- **Can I remove the "made with" credit?** Yes: set `creditoPlantilla: false`.
  A link back is appreciated but not required (MIT license).
- **Custom domain?** Add it to your Worker from the Cloudflare dashboard
  (Workers & Pages → your worker → Domains & Routes).

## License

MIT — see [LICENSE](LICENSE). Made by [VidaEnLeonida.com](https://vidaenleonida.com).
```

- [ ] **Step 2: Escribir `README.es.md`**

Mismo contenido traducido al español, empezando con `[Read me in English](README.md)`. Secciones: Qué incluye / Empezar (fork → editar `servidor.ts` → `site` en `astro.config.mjs` → favicon → desplegar con las dos opciones A/B incluido el botón) / En local / Editar las normas / Preguntas frecuentes / Licencia. Traducir el contenido del Step 1 fielmente, no resumirlo.

- [ ] **Step 3: Verificar enlaces**

Comprobar que `LICENSE` existe en el repo (si no, crearlo con el texto MIT estándar, copyright "2026 VidaEnLeonida.com", y añadirlo al commit).

- [ ] **Step 4: Commit**

```bash
git add README.md README.es.md LICENSE
git commit -m "F3: README bilingue EN/ES con guia fork-config-deploy y boton Deploy to Workers"
```

---

### Task 9: Lighthouse ≥95 y accesibilidad AA

**Files:**
- Modify: los que dicten los hallazgos (esperado: `src/config/servidor.ts` solo valores de la demo, `src/styles/global.css`).

- [ ] **Step 1: Auditar sobre el build de producción**

```bash
npm run build && npx astro preview --port 4321 &
npx lighthouse http://localhost:4321/ --output=json --output-path=./lighthouse.json --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```

Expected: informe generado. Anotar las 4 puntuaciones. (Si `npx lighthouse` no puede lanzar Chrome en el entorno, usar el panel Lighthouse del navegador integrado contra el preview y anotar resultados a mano.)

- [ ] **Step 2: Contraste AA del botón primario (hallazgo esperado)**

Blanco sobre `#e0355a` ronda 3.9:1, por debajo del 4.5:1 de AA para texto normal. Corregir en los VALORES de la demo (no en el contrato): oscurecer `primario` en `src/config/servidor.ts` hasta pasar 4.5:1 manteniendo el rojo de marca (probar `#c9224a`; verificar con un checker de contraste). Revisar también los textos con `opacity` (`.pie` 0.75, `.miembro__rol` 0.7) contra `#0f1117`: si Lighthouse los marca, subir la opacidad justo hasta pasar.

- [ ] **Step 3: Corregir el resto de hallazgos hasta ≥95 en las 4 categorías**

Regla: arreglos en plantilla (CSS/layout) sí; cambios de contrato NO. Si un hallazgo pidiera tocar el contrato, anotarlo en HANDOFF y seguir.

- [ ] **Step 4: Repetir la auditoría y registrar**

Run: (mismo comando del Step 1)
Expected: ≥95 en Performance, Accessibility, Best Practices y SEO. Guardar las puntuaciones finales para el HANDOFF. No commitear `lighthouse.json` (borrarlo).

- [ ] **Step 5: Commit**

```bash
git add -A -- ':!lighthouse.json'
git commit -m "F3: ajustes de contraste AA y hallazgos Lighthouse (>=95 en las 4 categorias)"
```

---

### Task 10: Capturas para el README

**Files:**
- Create: `docs/capturas/home.png`, `docs/capturas/normas.png`, `docs/capturas/movil.png`

- [ ] **Step 1: Generar las capturas**

Con el preview de producción levantado (puerto 4321), usar el navegador integrado:
- `home.png`: viewport desktop (1280×800), página `/` completa visible desde el hero.
- `normas.png`: `/normas/` con el índice lateral visible.
- `movil.png`: viewport mobile (375×812), página `/`.

Guardarlas en `docs/capturas/` (crear la carpeta).

- [ ] **Step 2: Verificar que el README las referencia bien**

`README.md` referencia `docs/capturas/home.png` (Task 8). Añadir las otras dos al README en una sección corta "Screenshots" (EN) / "Capturas" (ES) si no rompen el flujo, o dejarlas solo enlazadas.

- [ ] **Step 3: Commit**

```bash
git add docs/capturas README.md README.es.md
git commit -m "F3: capturas de la demo para el README"
```

---

### Task 11: Borrador del post de release para el foro Cfx

Borrador en inglés para la sección Releases del foro Cfx. El usuario lo revisará antes de publicar (no se publica desde la sesión). Tono directo, sin marketing hueco; formato habitual de Releases: qué es, features, enlaces, licencia.

**Files:**
- Create: `docs/release-post.md`

- [ ] **Step 1: Escribir el borrador**

```markdown
# [Free] [MIT] Static website template for your RP server — one config file, deploy free on Cloudflare

**Draft for the Cfx forum (Releases section). Review before posting.**

---

Hi everyone,

I made a free, open-source website template for FiveM RP servers. You edit
**one config file** (name, tagline, colors, Discord invite, features, staff,
FAQ), write your rules in Markdown, and deploy it for free on Cloudflare.
No database, no client-side JavaScript, nothing to maintain.

**Demo:** https://plantilla-servidor-rp.manguez-pls.workers.dev/
**Code:** https://github.com/manguezpls-dotcom/plantilla-servidor-rp

## Features

- Hero + features + how-to-join + rules + staff + FAQ + socials
- The join CTA adapts: whitelist servers get "Apply", open servers get "Connect"
- Rules page generated from Markdown files with a side index
- FAQ ships `FAQPage` structured data (Google rich results)
- SEO done for you: canonical, Open Graph, sitemap, robots.txt
- Everything optional degrades gracefully — no logo, no hero image, empty
  sections: the site never looks broken
- Static output, ~0 dependencies at runtime, loads instantly

## How to use it

Fork → edit `src/config/servidor.ts` → `npm run deploy` (Cloudflare Workers,
free tier). There's also a "Deploy to Workers" button if you don't want to
touch a terminal. Full step-by-step guide (EN/ES) in the README.

The demo content is in Spanish (my community is Spanish-speaking) but every
string comes from your config, so the site is whatever language you write.

MIT licensed. Keep the footer credit or remove it (`creditoPlantilla: false`),
up to you. Feedback and PRs welcome.
```

- [ ] **Step 2: Commit**

```bash
git add docs/release-post.md
git commit -m "F3: borrador del post de release para el foro Cfx"
```

---

### Task 12: npm audit y verificación final

**Files:**
- Modify: `package-lock.json` (si `npm audit fix` aplica limpio), `docs/superpowers/HANDOFF.md`

- [ ] **Step 1: Revisar el audit**

```bash
npm audit
npm audit fix   # solo si no fuerza majors; NUNCA usar --force
npm test && npm run check && npm run build
```

Expected: si `fix` cambió algo, todo sigue verde. Anotar en HANDOFF lo que quede (transitivas de devDependencies, sin superficie en runtime estático).

- [ ] **Step 2: Verificación completa de F3**

```bash
npm test && npm run check && npm run build
```

Expected: 21/21 tests; check limpio (1 hint esperado); build con `/`, `/normas/`, `/staff/`, `robots.txt`, `sitemap-index.xml`.
Smoke navegador (dev o preview): home, normas, staff, responsive 375px, consola limpia.

- [ ] **Step 3: Actualizar `docs/superpowers/HANDOFF.md`**

Marcar F3 ✅ con fecha, registrar: puntuaciones Lighthouse finales, decisiones (favicon fijo, validación hex, `.boton`, nav/footer condicionales), y los pendientes que queden. Dejar claro el paso post-frontera: **el usuario hace el smoke de tercero** (publicar un fork limpio siguiendo solo el README) y los items de la etapa 2 del roadmap (publicar el post Cfx, enlazar la plantilla desde /servicios/).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "F3: npm audit, verificacion final y HANDOFF actualizado"
```

---

## Fuera del plan (frontera de fase y usuario)

- **Frontera:** merge de `f3-pulido` a `main`, push, borrado de rama y **redeploy de la demo** (`npm run deploy`) — con la skill `phase-boundary` y OK del usuario.
- **Smoke de tercero (usuario):** publicar un fork limpio siguiendo solo el README. Es el criterio de aceptación real de F3.
- **Post Cfx (usuario):** revisar `docs/release-post.md` y publicarlo (etapa 2 del roadmap, 10-23 ago).
- **Graphify bootstrap:** requiere Ollama local levantado; hacerlo en sesión principal al cierre si hay ocasión (memoria `graphify-local-ollama-build`), no bloquea F3.
