# F1 · Esqueleto — Plan de implementación (plantilla-servidor-rp)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levantar el esqueleto de la plantilla open-source de web de servidor RP: proyecto Astro 5 estático, contrato tipado `servidor.ts` con ejemplo completo del servidor ficticio "Leonida Roleplay", tokens de tema derivados de la config, layout `Base` con head SEO/OG, componente `Hero` con degradación elegante, y footer con crédito de marketing. Cierra con demo desplegada en Cloudflare Pages.

**Architecture:** Web estática config-driven. Un único fichero `src/config/servidor.ts` (tipado, contrato CERRADO) alimenta todo. La lógica pura de robustez (derivar variables CSS de los colores, fallbacks de logo/hero) vive en `src/lib/` y se construye con TDD (Vitest). Los componentes `.astro` se verifican con build + smoke en navegador, no con tests unitarios. Sin JS de cliente en F1.

**Tech Stack:** Astro 5, TypeScript (strict), Vitest para la lógica pura, Cloudflare Pages para el deploy. Sin dependencias de fuentes externas (stack de sistema en F1; `@fontsource` llega en F2). Licencia MIT.

**Alcance F1 (del doc 01 — no ampliar):** repo, Astro, config tipada con ejemplo completo, `Base` + `Hero` + footer con crédito, deploy de demo. NO en F1: características/staff/FAQ/normas/redes (F2), sitemap/robots/Lighthouse/README bilingüe (F3). El *ejemplo* de config sí se rellena completo ya, aunque la UI de F1 solo muestre hero + footer.

---

## Estructura de ficheros (F1)

| Fichero | Responsabilidad |
|---|---|
| `package.json` | scripts (dev/build/check/test), deps (astro), devDeps (vitest, @astrojs/check, typescript) |
| `astro.config.mjs` | `site`, `trailingSlash: 'always'` |
| `tsconfig.json` | extiende `astro/tsconfigs/strict` |
| `vitest.config.ts` | config mínima de Vitest (entorno node) |
| `.gitignore` | node_modules, dist, .astro, graphify-out, .env |
| `src/config/servidor.ts` | **CONTRATO CERRADO** `ConfigServidor` + ejemplo `servidor` (Leonida Roleplay) completo |
| `src/lib/tokens.ts` | `variablesTema(config)` + `estiloInline(vars)` → CSS custom properties desde `colores` |
| `src/lib/fallbacks.ts` | `tieneLogo`, `tieneImagenHero`, `gradienteHero` (degradación elegante) |
| `src/lib/tokens.test.ts` | tests TDD de tokens |
| `src/lib/fallbacks.test.ts` | tests TDD de fallbacks |
| `src/styles/global.css` | reset, tokens fijos (`--radio`, `--fuente`), estilos base/header/hero/footer, responsive |
| `src/layouts/Base.astro` | head SEO/OG + inyección de `:root` vars + header (wordmark) + `<slot/>` + footer con crédito |
| `src/components/Hero.astro` | hero con nombre, lema y CTA a Discord; fondo imagen o gradiente fallback |
| `src/pages/index.astro` | `Base` envolviendo `Hero` |
| `public/favicon.svg` | favicon por defecto reemplazable |
| `README.md` | placeholder mínimo (README bilingüe completo es F3) |
| `LICENSE` | MIT |

---

## Task 1: Scaffold del proyecto Astro

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `README.md`, `LICENSE`, `public/favicon.svg`

Sin scaffolding interactivo (`npm create astro` pregunta): se crean los ficheros a mano para que la ejecución sea determinista.

- [ ] **Step 1: Crear `package.json`**

```json
{
  "name": "plantilla-servidor-rp",
  "type": "module",
  "version": "0.1.0",
  "license": "MIT",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^5.10.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Crear `astro.config.mjs`**

`site` es un placeholder hasta el primer deploy en Pages (se corregirá al final de F1 con la URL real `*.pages.dev`).

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://plantilla-servidor-rp.pages.dev',
  trailingSlash: 'always',
});
```

- [ ] **Step 3: Crear `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Crear `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 5: Crear `.gitignore`**

```gitignore
node_modules/
dist/
.astro/
graphify-out/
.env
.env.*
.DS_Store
```

- [ ] **Step 6: Crear `README.md` (placeholder; el bilingüe completo es F3)**

```markdown
# plantilla-servidor-rp

Plantilla open-source (MIT) para la web de un servidor de rol de FiveM/GTA RP.
Edita un único fichero de configuración, haz push y publícala gratis en Cloudflare Pages.

> Guía paso a paso bilingüe (EN/ES), capturas y demo pública: pendientes (Fase 3).

Hecho con ❤ por [VidaEnLeonida.com](https://vidaenleonida.com).
```

- [ ] **Step 7: Crear `LICENSE` (MIT)**

```
MIT License

Copyright (c) 2026 VidaEnLeonida.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 8: Crear `public/favicon.svg` (marcador reemplazable)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#5865F2"/>
  <text x="16" y="22" font-family="system-ui,sans-serif" font-size="18" font-weight="700" text-anchor="middle" fill="#fff">RP</text>
</svg>
```

- [ ] **Step 9: Instalar dependencias**

Run: `npm install`
Expected: crea `node_modules/` y `package-lock.json` sin errores.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "F1: scaffold del proyecto Astro (package, config, licencia MIT)"
```

---

## Task 2: Contrato `servidor.ts` con ejemplo completo

**Files:**
- Create: `src/config/servidor.ts`

El `interface ConfigServidor` se copia EXACTAMENTE del doc 01 (contrato cerrado, no añadir ni quitar campos). El ejemplo se rellena completo (todas las secciones) aunque F1 solo pinte hero + footer. `logo` e `imagenHero` se dejan SIN definir a propósito, para que la demo ejercite la degradación elegante (wordmark + gradiente) sin necesitar binarios.

- [ ] **Step 1: Crear `src/config/servidor.ts`**

```ts
// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE TU SERVIDOR
//  Este es el ÚNICO fichero que necesitas editar. Cambia los valores por los de
//  tu servidor, haz push y Cloudflare Pages publicará tu web.
//  Regla de oro: todo lo opcional degrada con elegancia. Si no rellenas una
//  sección, simplemente no se muestra; si no pones logo o imagen, se genera un
//  respaldo con tus colores. La plantilla nunca se ve "rota".
// ─────────────────────────────────────────────────────────────────────────────

export interface ConfigServidor {
  nombre: string;                    // "Leonida Roleplay"
  lema: string;                      // tagline corta del hero
  descripcion: string;               // meta description + bloque "sobre"
  urlDiscord: string;                // invitación permanente
  urlConexion?: string;              // cfx.re/join/xxxxx (opcional)
  colores: { primario: string; fondo: string; texto: string };  // hex
  logo?: string;                     // ruta en /public; fallback: wordmark tipográfico
  imagenHero?: string;               // ruta en /public; fallback: gradiente con el color primario
  caracteristicas: { titulo: string; texto: string }[];   // 3-6 tarjetas
  pasosEntrada: string[];            // "cómo entrar", 3-5 pasos
  requiereWhitelist: boolean;        // cambia el CTA: "Solicitar plaza" vs "Conectar"
  staff: { nombre: string; rol: string; avatar?: string }[];
  faq: { pregunta: string; respuesta: string }[];
  redes?: { x?: string; tiktok?: string; youtube?: string; instagram?: string };
  creditoPlantilla: boolean;         // footer "plantilla de VidaEnLeonida.com" (por defecto true)
}

export const servidor: ConfigServidor = {
  nombre: 'Leonida Roleplay',
  lema: 'Tu nueva vida en Leonida empieza aquí.',
  descripcion:
    'Servidor de rol serio de FiveM ambientado en Leonida. Historias que importan, ' +
    'economía viva y una comunidad que cuida cada personaje. Whitelist para garantizar calidad.',
  urlDiscord: 'https://discord.gg/leonidarp',
  urlConexion: 'https://cfx.re/join/abcd12',
  colores: {
    primario: '#e0355a',
    fondo: '#0f1117',
    texto: '#f5f6fa',
  },
  // logo e imagenHero se dejan sin definir: la demo muestra la degradación elegante.
  caracteristicas: [
    { titulo: 'Rol serio y whitelist', texto: 'Cada plaza pasa por una entrevista. Nada de RDM ni troleo: solo historias.' },
    { titulo: 'Economía viva', texto: 'Trabajos legales e ilegales, empresas de jugadores y un mercado que reacciona.' },
    { titulo: 'Facciones con historia', texto: 'Policía, sanitarios, prensa y bandas con tramas persistentes entre sesiones.' },
    { titulo: 'Staff presente', texto: 'Equipo activo 24/7 y tickets resueltos en minutos, no en días.' },
  ],
  pasosEntrada: [
    'Entra a nuestro Discord y lee las normas.',
    'Rellena la solicitud de whitelist y espera la entrevista.',
    'Instala FiveM y conéctate con el enlace directo.',
    'Crea tu personaje y empieza a rolear.',
  ],
  requiereWhitelist: true,
  staff: [
    { nombre: 'Álex', rol: 'Fundador' },
    { nombre: 'Marina', rol: 'Admin' },
    { nombre: 'Dario', rol: 'Soporte' },
  ],
  faq: [
    { pregunta: '¿Necesito experiencia previa en rol?', respuesta: 'No. Buscamos actitud, no currículum. Te ayudamos a empezar.' },
    { pregunta: '¿Cuánto tarda la whitelist?', respuesta: 'Normalmente 24-48 h desde que envías la solicitud.' },
    { pregunta: '¿Es gratis?', respuesta: 'Sí. Hay ventajas cosméticas opcionales que no dan ventaja de juego.' },
  ],
  redes: {
    x: 'https://x.com/leonidarp',
    tiktok: 'https://tiktok.com/@leonidarp',
    youtube: 'https://youtube.com/@leonidarp',
  },
  creditoPlantilla: true,
};
```

- [ ] **Step 2: Verificar tipado**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: sin errores (el ejemplo satisface `ConfigServidor`).

- [ ] **Step 3: Commit**

```bash
git add src/config/servidor.ts
git commit -m "F1: contrato ConfigServidor + ejemplo completo (Leonida Roleplay)"
```

---

## Task 3: `tokens.ts` — variables de tema desde la config (TDD)

**Files:**
- Create: `src/lib/tokens.ts`
- Test: `src/lib/tokens.test.ts`

Deriva las custom properties de color a partir de `config.colores`. Nota de contrato: SOLO los colores vienen de la config; `--radio` y `--fuente` son tokens fijos de la plantilla (viven en `global.css`), porque `ConfigServidor` no los expone.

- [ ] **Step 1: Escribir el test que falla**

```ts
import { describe, it, expect } from 'vitest';
import { variablesTema, estiloInline } from './tokens';
import type { ConfigServidor } from '../config/servidor';

const base: ConfigServidor = {
  nombre: 'X', lema: 'y', descripcion: 'z', urlDiscord: 'https://d',
  colores: { primario: '#111111', fondo: '#222222', texto: '#333333' },
  caracteristicas: [], pasosEntrada: [], requiereWhitelist: false,
  staff: [], faq: [], creditoPlantilla: true,
};

describe('variablesTema', () => {
  it('mapea los tres colores a custom properties', () => {
    expect(variablesTema(base)).toEqual({
      '--color-primario': '#111111',
      '--color-fondo': '#222222',
      '--color-texto': '#333333',
    });
  });
});

describe('estiloInline', () => {
  it('serializa el mapa como declaraciones CSS separadas por ;', () => {
    expect(estiloInline({ '--a': '1', '--b': '2' })).toBe('--a: 1; --b: 2');
  });
});
```

- [ ] **Step 2: Ejecutar el test para verlo fallar**

Run: `npm test`
Expected: FAIL — `Cannot find module './tokens'`.

- [ ] **Step 3: Implementación mínima**

```ts
import type { ConfigServidor } from '../config/servidor';

/** Custom properties CSS derivadas de los colores de la config. */
export function variablesTema(config: ConfigServidor): Record<string, string> {
  return {
    '--color-primario': config.colores.primario,
    '--color-fondo': config.colores.fondo,
    '--color-texto': config.colores.texto,
  };
}

/** Serializa un mapa de variables como declaraciones CSS: "--a: 1; --b: 2". */
export function estiloInline(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([clave, valor]) => `${clave}: ${valor}`)
    .join('; ');
}
```

- [ ] **Step 4: Ejecutar el test para verlo pasar**

Run: `npm test`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tokens.ts src/lib/tokens.test.ts
git commit -m "F1: tokens de tema desde config (TDD)"
```

---

## Task 4: `fallbacks.ts` — degradación elegante (TDD)

**Files:**
- Create: `src/lib/fallbacks.ts`
- Test: `src/lib/fallbacks.test.ts`

Implementa la regla de robustez para logo/hero: presencia real de valor y gradiente de respaldo cuando no hay imagen.

- [ ] **Step 1: Escribir el test que falla**

```ts
import { describe, it, expect } from 'vitest';
import { tieneLogo, tieneImagenHero, gradienteHero } from './fallbacks';
import type { ConfigServidor } from '../config/servidor';

const base: ConfigServidor = {
  nombre: 'X', lema: 'y', descripcion: 'z', urlDiscord: 'https://d',
  colores: { primario: '#e0355a', fondo: '#0f1117', texto: '#fff' },
  caracteristicas: [], pasosEntrada: [], requiereWhitelist: false,
  staff: [], faq: [], creditoPlantilla: true,
};

describe('tieneLogo', () => {
  it('false cuando no hay logo', () => {
    expect(tieneLogo(base)).toBe(false);
  });
  it('false cuando el logo es cadena vacía o espacios', () => {
    expect(tieneLogo({ ...base, logo: '   ' })).toBe(false);
  });
  it('true cuando hay una ruta de logo', () => {
    expect(tieneLogo({ ...base, logo: '/logo.svg' })).toBe(true);
  });
});

describe('tieneImagenHero', () => {
  it('false cuando no hay imagen', () => {
    expect(tieneImagenHero(base)).toBe(false);
  });
  it('true cuando hay ruta de imagen', () => {
    expect(tieneImagenHero({ ...base, imagenHero: '/hero.jpg' })).toBe(true);
  });
});

describe('gradienteHero', () => {
  it('usa el color primario y el fondo en un linear-gradient', () => {
    expect(gradienteHero(base.colores)).toBe(
      'linear-gradient(135deg, #e0355a 0%, #0f1117 100%)'
    );
  });
});
```

- [ ] **Step 2: Ejecutar el test para verlo fallar**

Run: `npm test`
Expected: FAIL — `Cannot find module './fallbacks'`.

- [ ] **Step 3: Implementación mínima**

```ts
import type { ConfigServidor } from '../config/servidor';

/** ¿La config trae una ruta de logo utilizable? */
export function tieneLogo(config: ConfigServidor): boolean {
  return typeof config.logo === 'string' && config.logo.trim().length > 0;
}

/** ¿La config trae una imagen de hero utilizable? */
export function tieneImagenHero(config: ConfigServidor): boolean {
  return typeof config.imagenHero === 'string' && config.imagenHero.trim().length > 0;
}

/** Gradiente de respaldo cuando no hay imagen de hero: del primario al fondo. */
export function gradienteHero(colores: ConfigServidor['colores']): string {
  return `linear-gradient(135deg, ${colores.primario} 0%, ${colores.fondo} 100%)`;
}
```

- [ ] **Step 4: Ejecutar el test para verlo pasar**

Run: `npm test`
Expected: PASS (todos los tests de tokens + fallbacks).

- [ ] **Step 5: Commit**

```bash
git add src/lib/fallbacks.ts src/lib/fallbacks.test.ts
git commit -m "F1: fallbacks de logo/hero, degradacion elegante (TDD)"
```

---

## Task 5: `global.css` — reset, tokens fijos y estilos base

**Files:**
- Create: `src/styles/global.css`

Define los tokens fijos de la plantilla (`--radio`, `--fuente`, escalas) y los estilos de header, hero y footer. Los colores (`--color-*`) los inyecta `Base.astro` en `:root` (Task 6), así que aquí solo se consumen con `var()`. F1 usa stack de fuentes del sistema (sin dependencias externas, RGPD-safe); `@fontsource` llega en F2.

- [ ] **Step 1: Crear `src/styles/global.css`**

```css
:root {
  /* Tokens fijos de la plantilla (no vienen de la config). */
  --radio: 12px;
  --fuente: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --ancho-max: 1120px;
  --espacio: 1rem;
  /* --color-primario / --color-fondo / --color-texto los inyecta Base.astro */
}

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  font-family: var(--fuente);
  background: var(--color-fondo);
  color: var(--color-texto);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--color-primario); }

.contenedor {
  width: 100%;
  max-width: var(--ancho-max);
  margin-inline: auto;
  padding-inline: 1.25rem;
}

/* Header */
.cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1.1rem;
}
.cabecera__marca {
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  color: var(--color-texto);
  text-decoration: none;
}
.cabecera__discord {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1rem;
  border-radius: var(--radio);
  background: var(--color-primario);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

/* Hero */
.hero {
  position: relative;
  min-height: 68vh;
  display: grid;
  place-items: center;
  text-align: center;
  background-image: var(--fondo-hero);
  background-size: cover;
  background-position: center;
  padding-block: 4rem;
}
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, var(--color-fondo));
  opacity: 0.55;
}
.hero__contenido {
  position: relative;
  z-index: 1;
  max-width: 40rem;
  padding-inline: 1.25rem;
}
.hero__titulo {
  font-size: clamp(2.4rem, 6vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 0 0 0.75rem;
}
.hero__lema {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  opacity: 0.9;
  margin: 0 0 2rem;
}
.hero__cta {
  display: inline-flex;
  align-items: center;
  padding: 0.9rem 1.6rem;
  border-radius: var(--radio);
  background: var(--color-primario);
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
}
.hero__cta:hover { filter: brightness(1.08); }

/* Footer */
.pie {
  padding-block: 2.5rem;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.75;
}
.pie a { font-weight: 600; }

@media (max-width: 480px) {
  .hero { min-height: 60vh; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "F1: global.css con reset, tokens fijos y estilos base"
```

---

## Task 6: `Base.astro` — layout con head SEO/OG, tema y footer con crédito

**Files:**
- Create: `src/layouts/Base.astro`

Inyecta las variables de color en `:root`, monta el head (title/description/canonical/OG/favicon derivados de la config), un header con wordmark + Discord, el `<slot/>` y el footer con el crédito de marketing (condicionado a `creditoPlantilla`).

- [ ] **Step 1: Crear `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
import { servidor } from '../config/servidor';
import { variablesTema, estiloInline } from '../lib/tokens';
import { tieneLogo } from '../lib/fallbacks';

interface Props {
  titulo?: string;
}
const { titulo } = Astro.props;

const rootStyle = `:root{${estiloInline(variablesTema(servidor))}}`;
const tituloPagina = titulo
  ? `${titulo} · ${servidor.nombre}`
  : `${servidor.nombre} — ${servidor.lema}`;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImagen = servidor.imagenHero
  ? new URL(servidor.imagenHero, Astro.site)
  : undefined;
const marca = tieneLogo(servidor) ? servidor.logo! : null;
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{tituloPagina}</title>
    <meta name="description" content={servidor.descripcion} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={tituloPagina} />
    <meta property="og:description" content={servidor.descripcion} />
    <meta property="og:url" content={canonical} />
    {ogImagen && <meta property="og:image" content={ogImagen} />}
    <link rel="icon" href={servidor.logo ?? '/favicon.svg'} />
    <style set:html={rootStyle}></style>
  </head>
  <body>
    <header class="cabecera contenedor">
      <a class="cabecera__marca" href="/">
        {marca ? <img src={marca} alt={servidor.nombre} height="32" /> : servidor.nombre}
      </a>
      <a class="cabecera__discord" href={servidor.urlDiscord}>Discord</a>
    </header>

    <main>
      <slot />
    </main>

    <footer class="pie contenedor">
      {servidor.creditoPlantilla && (
        <p>
          Hecho con la <a href="https://vidaenleonida.com" rel="noopener">plantilla de VidaEnLeonida.com</a>
        </p>
      )}
    </footer>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "F1: layout Base con head SEO/OG, tema y footer con credito"
```

---

## Task 7: `Hero.astro` + `index.astro`

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Crear `src/components/Hero.astro`**

```astro
---
import { servidor } from '../config/servidor';
import { tieneImagenHero, gradienteHero } from '../lib/fallbacks';

const fondoHero = tieneImagenHero(servidor)
  ? `url("${servidor.imagenHero}")`
  : gradienteHero(servidor.colores);
---
<section class="hero" style={`--fondo-hero: ${fondoHero}`}>
  <div class="hero__contenido">
    <h1 class="hero__titulo">{servidor.nombre}</h1>
    <p class="hero__lema">{servidor.lema}</p>
    <a class="hero__cta" href={servidor.urlDiscord}>Únete al Discord</a>
  </div>
</section>
```

- [ ] **Step 2: Crear `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
---
<Base>
  <Hero />
</Base>
```

- [ ] **Step 3: `astro check` + build**

Run: `npm run check && npm run build`
Expected: `astro check` sin errores de tipo; build genera `dist/index.html` con el hero (gradiente fallback) y el footer con crédito.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "F1: componente Hero e index"
```

---

## Task 8: Verificación en navegador (smoke de build)

**Files:** (ninguno — verificación)

Verificación end-to-end del esqueleto antes de desplegar. Sin tests unitarios de componentes: se observa el resultado real.

- [ ] **Step 1: Arrancar el dev server** (herramienta de preview del harness, no Bash) y navegar a la home.

- [ ] **Step 2: Comprobaciones**
  - Consola del navegador sin errores.
  - `read_page`: `<h1>` = "Leonida Roleplay"; lema visible; CTA "Únete al Discord" apunta a `urlDiscord`; footer con el enlace "plantilla de VidaEnLeonida.com".
  - Hero con gradiente fallback (no hay `imagenHero`) y wordmark en el header (no hay `logo`) → la degradación elegante funciona.
  - `resize_window` a 375px: responsive sin scroll horizontal.

- [ ] **Step 3: Ejecutar toda la batería de tests una vez más**

Run: `npm test`
Expected: PASS (tokens + fallbacks).

- [ ] **Step 4: Captura de pantalla** como prueba visual para el usuario.

---

## Task 9: Primer commit a `main` y checkpoint de publicación

**Files:** (ninguno — git + checkpoint humano)

- [ ] **Step 1: Confirmar estado limpio y rama**

Run: `git status && git log --oneline -8`
Expected: árbol limpio; historial de F1 en `main`.

- [ ] **Step 2: CHECKPOINT (humano).** Parar y pedir OK al usuario para:
  1. crear el repo **público** `plantilla-servidor-rp` en GitHub (cuenta `manguezpls-dotcom`), y
  2. hacer push de `main`.

  Norma del usuario: el primer commit a `main` se publica enseguida para que Git registre el inicio del proyecto. No hacer push sin OK; nunca `--force`.

- [ ] **Step 3 (tras OK): crear repo y push**

```bash
gh repo create manguezpls-dotcom/plantilla-servidor-rp \
  --public --source=. --description "Plantilla open-source (MIT) para webs de servidores de rol de FiveM/GTA RP" --push
```

- [ ] **Step 4: Conectar Cloudflare Pages** (deploy de demo, cierre de F1). Requiere acción del usuario en el panel de Cloudflare (conectar el repo, framework Astro, build `npm run build`, salida `dist`). Preparar instrucciones exactas en el checklist de smoke. Tras el primer deploy, actualizar `site` en `astro.config.mjs` con la URL real `*.pages.dev` y commitear.

- [ ] **Step 5: Checklist de smoke de F1 para el usuario** (norma de proyecto: lo ejecuta el usuario). Incluir URL de la demo, y verificación clic a clic: home carga, hero visible, CTA a Discord, footer con crédito, responsive en móvil.

---

## Self-Review (cobertura del alcance F1)

- **repo + Astro:** Task 1. ✔
- **config tipada con ejemplo completo:** Task 2 (contrato exacto del doc + ejemplo con todas las secciones). ✔
- **Base + Hero + footer con crédito:** Tasks 5-7. ✔
- **tokens leídos de la config (colores):** Task 3; `--radio`/`--fuente` fijos por contrato. ✔
- **degradación elegante (robustez):** Task 4 + demo sin logo/imagen. ✔
- **head SEO/OG:** Task 6 (title/description/canonical/OG/favicon). Sitemap/robots/Lighthouse → F3 (fuera de F1). ✔
- **deploy de demo en Cloudflare Pages:** Task 9. ✔
- **primer commit a main → OK → repo público + push:** Task 9. ✔
- **checklist de smoke al cerrar fase:** Task 9 step 5. ✔

TDD aplicado donde corresponde (lógica pura: `tokens`, `fallbacks`); componentes `.astro` verificados por build + smoke.
