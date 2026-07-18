# F2 · Secciones — Plan de implementación (plantilla-servidor-rp)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Modelos: subagentes **Sonnet** para código, **Opus** para review/testing.

**Goal:** Convertir el esqueleto de F1 en una web completa: características, "cómo entrar" con bifurcación whitelist/directo, normas desde markdown con índice lateral, staff, FAQ con schema FAQPage, y redes sociales. Todo config-driven y con degradación elegante (sección sin datos = sección que no se renderiza).

**Architecture:** Se mantiene la arquitectura de F1. La lógica pura nueva (CTA de entrada, redes activas, schema FAQ) vive en `src/lib/` con TDD (Vitest). Las secciones son componentes `.astro` que leen de `servidor` y se autoocultan si su dato está vacío. Las normas usan una colección de contenido de Astro (`glob` loader). Estilos en `src/styles/global.css` (mismo patrón BEM que F1). Sin JS de cliente (con 3-4 enlaces el header cabe en móvil sin hamburguesa).

**Tech Stack:** Astro 5.18 (content collections con `glob` de `astro/loaders`), TypeScript strict, Vitest. Sin dependencias nuevas obligatorias. (Opcional en F3, no aquí: `@fontsource`.)

**Alcance F2 (del doc `vidaenleonida/docs/linea-c/01`, no ampliar):** características, cómo entrar (bifurcación), normas markdown con índice, staff, FAQ con schema FAQPage, redes. NO en F2: sitemap/robots/Lighthouse/README bilingüe/post de release (F3).

**Contrato CERRADO:** `ConfigServidor` no se toca. Recordatorio: solo `colores` viene de la config; `--radio`/`--fuente` son fijos en `global.css`.

---

## Convenciones de nombres (clases BEM, fijar antes de empezar)

Para que los componentes y sus estilos sean consistentes:

- Sección genérica: `.seccion`, `.seccion__titulo`, contenedor `.contenedor` (ya existe de F1).
- Características: `.caracteristicas`, `.caracteristicas__grid`, `.tarjeta`, `.tarjeta__titulo`, `.tarjeta__texto`.
- Cómo entrar: `.entrada`, `.entrada__pasos`, `.entrada__paso`, `.entrada__cta`.
- FAQ: `.faq`, `.faq__item` (`<details>`), `.faq__pregunta` (`<summary>`), `.faq__respuesta`.
- Staff: `.staff`, `.staff__grid`, `.miembro`, `.miembro__avatar`, `.miembro__nombre`, `.miembro__rol`.
- Redes: `.redes`, `.redes__enlace`.
- CTA Discord reutilizable: `.cta-discord`, `.cta-discord__boton`.
- Normas: `.normas`, `.normas__indice`, `.normas__contenido`, `.norma`.
- Nav header: `.cabecera__nav`, `.cabecera__enlace`.

## Estructura de ficheros (F2)

| Fichero | Acción | Responsabilidad |
|---|---|---|
| `src/lib/entrada.ts` (+`.test.ts`) | crear | `ctaEntrada(config)` → texto+url según `requiereWhitelist` |
| `src/lib/redes.ts` (+`.test.ts`) | crear | `redesActivas(redes)` → lista ordenada de redes presentes |
| `src/lib/faqSchema.ts` (+`.test.ts`) | crear | `faqPageSchema(faq)` → objeto JSON-LD FAQPage |
| `src/content.config.ts` | crear | colección `normas` (glob loader) |
| `src/content/normas/*.md` | crear | 3 normas de ejemplo |
| `src/components/CtaDiscord.astro` | crear | bloque CTA reutilizable a Discord |
| `src/components/Caracteristicas.astro` | crear | grid de tarjetas |
| `src/components/ComoEntrar.astro` | crear | pasos + CTA bifurcada |
| `src/components/Faq.astro` | crear | acordeón `<details>` + `<script type="application/ld+json">` |
| `src/components/Staff.astro` | crear | grid de miembros (avatar o iniciales) |
| `src/components/Redes.astro` | crear | enlaces de redes activas |
| `src/layouts/Base.astro` | modificar | nav en header (Inicio/Normas/Staff) + `<Redes/>` en footer |
| `src/pages/index.astro` | modificar | hero + características + cómo entrar + FAQ + CTA |
| `src/pages/normas.astro` | crear | colección con índice lateral |
| `src/pages/staff.astro` | crear | página de staff |
| `src/styles/global.css` | modificar | estilos de todas las secciones nuevas (append) |

---

## Task 1: `entrada.ts` — CTA de entrada bifurcada (TDD)

**Files:** Create `src/lib/entrada.ts`, Test `src/lib/entrada.test.ts`

- [ ] **Step 1: Test que falla** (`src/lib/entrada.test.ts`)

```ts
import { describe, it, expect } from 'vitest';
import { ctaEntrada } from './entrada';
import type { ConfigServidor } from '../config/servidor';

const base: ConfigServidor = {
  nombre: 'X', lema: 'y', descripcion: 'z', urlDiscord: 'https://discord',
  colores: { primario: '#111', fondo: '#222', texto: '#333' },
  caracteristicas: [], pasosEntrada: [], requiereWhitelist: true,
  staff: [], faq: [], creditoPlantilla: true,
};

describe('ctaEntrada', () => {
  it('con whitelist: "Solicitar plaza" apuntando al Discord', () => {
    expect(ctaEntrada(base)).toEqual({ texto: 'Solicitar plaza', url: 'https://discord' });
  });
  it('sin whitelist y con urlConexion: "Conectar" a la conexión', () => {
    expect(ctaEntrada({ ...base, requiereWhitelist: false, urlConexion: 'https://cfx' }))
      .toEqual({ texto: 'Conectar', url: 'https://cfx' });
  });
  it('sin whitelist y sin urlConexion: "Conectar" cae al Discord', () => {
    expect(ctaEntrada({ ...base, requiereWhitelist: false }))
      .toEqual({ texto: 'Conectar', url: 'https://discord' });
  });
});
```

- [ ] **Step 2: Ver fallar** — `npm test` → FAIL (módulo `./entrada` no existe).

- [ ] **Step 3: Implementación** (`src/lib/entrada.ts`)

```ts
import type { ConfigServidor } from '../config/servidor';

export interface CtaEntrada {
  texto: string;
  url: string;
}

/** Texto y destino del CTA de entrada según el modelo del servidor. */
export function ctaEntrada(config: ConfigServidor): CtaEntrada {
  if (config.requiereWhitelist) {
    return { texto: 'Solicitar plaza', url: config.urlDiscord };
  }
  return { texto: 'Conectar', url: config.urlConexion ?? config.urlDiscord };
}
```

- [ ] **Step 4: Ver pasar** — `npm test` → PASS.

- [ ] **Step 5: Commit** — `git add src/lib/entrada.ts src/lib/entrada.test.ts && git commit -m "F2: CTA de entrada bifurcada whitelist/directo (TDD)"`

---

## Task 2: `redes.ts` — redes activas ordenadas (TDD)

**Files:** Create `src/lib/redes.ts`, Test `src/lib/redes.test.ts`

- [ ] **Step 1: Test que falla** (`src/lib/redes.test.ts`)

```ts
import { describe, it, expect } from 'vitest';
import { redesActivas } from './redes';

describe('redesActivas', () => {
  it('sin redes: array vacío', () => {
    expect(redesActivas(undefined)).toEqual([]);
  });
  it('solo X: una entrada con etiqueta', () => {
    expect(redesActivas({ x: 'https://x.com/s' }))
      .toEqual([{ red: 'x', url: 'https://x.com/s', etiqueta: 'X' }]);
  });
  it('ignora cadenas vacías o de espacios', () => {
    expect(redesActivas({ x: '   ', youtube: 'https://yt' }))
      .toEqual([{ red: 'youtube', url: 'https://yt', etiqueta: 'YouTube' }]);
  });
  it('respeta el orden x → tiktok → youtube → instagram', () => {
    const r = redesActivas({
      instagram: 'https://ig', x: 'https://x', youtube: 'https://yt', tiktok: 'https://tt',
    });
    expect(r.map((e) => e.red)).toEqual(['x', 'tiktok', 'youtube', 'instagram']);
  });
});
```

- [ ] **Step 2: Ver fallar** — `npm test` → FAIL (módulo `./redes`).

- [ ] **Step 3: Implementación** (`src/lib/redes.ts`)

```ts
import type { ConfigServidor } from '../config/servidor';

export interface RedActiva {
  red: string;
  url: string;
  etiqueta: string;
}

const ORDEN: { clave: keyof NonNullable<ConfigServidor['redes']>; etiqueta: string }[] = [
  { clave: 'x', etiqueta: 'X' },
  { clave: 'tiktok', etiqueta: 'TikTok' },
  { clave: 'youtube', etiqueta: 'YouTube' },
  { clave: 'instagram', etiqueta: 'Instagram' },
];

/** Redes con URL utilizable, en orden fijo. Degrada a [] si no hay ninguna. */
export function redesActivas(redes: ConfigServidor['redes']): RedActiva[] {
  if (!redes) return [];
  return ORDEN
    .filter(({ clave }) => {
      const url = redes[clave];
      return typeof url === 'string' && url.trim().length > 0;
    })
    .map(({ clave, etiqueta }) => ({ red: clave, url: redes[clave]!, etiqueta }));
}
```

- [ ] **Step 4: Ver pasar** — `npm test` → PASS.

- [ ] **Step 5: Commit** — `git add src/lib/redes.ts src/lib/redes.test.ts && git commit -m "F2: redes activas ordenadas con degradacion (TDD)"`

---

## Task 3: `faqSchema.ts` — JSON-LD FAQPage (TDD)

**Files:** Create `src/lib/faqSchema.ts`, Test `src/lib/faqSchema.test.ts`

- [ ] **Step 1: Test que falla** (`src/lib/faqSchema.test.ts`)

```ts
import { describe, it, expect } from 'vitest';
import { faqPageSchema } from './faqSchema';

describe('faqPageSchema', () => {
  it('genera un FAQPage con una Question por entrada', () => {
    const schema = faqPageSchema([
      { pregunta: '¿A?', respuesta: 'Sí.' },
      { pregunta: '¿B?', respuesta: 'No.' },
    ]);
    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: '¿A?', acceptedAnswer: { '@type': 'Answer', text: 'Sí.' } },
        { '@type': 'Question', name: '¿B?', acceptedAnswer: { '@type': 'Answer', text: 'No.' } },
      ],
    });
  });
  it('faq vacío: mainEntity vacío', () => {
    expect(faqPageSchema([])).toEqual({
      '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [],
    });
  });
});
```

- [ ] **Step 2: Ver fallar** — `npm test` → FAIL (módulo `./faqSchema`).

- [ ] **Step 3: Implementación** (`src/lib/faqSchema.ts`)

```ts
import type { ConfigServidor } from '../config/servidor';

/** Objeto JSON-LD schema.org FAQPage a partir del FAQ de la config. */
export function faqPageSchema(faq: ConfigServidor['faq']): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: item.respuesta },
    })),
  };
}
```

- [ ] **Step 4: Ver pasar** — `npm test` → PASS.

- [ ] **Step 5: Commit** — `git add src/lib/faqSchema.ts src/lib/faqSchema.test.ts && git commit -m "F2: schema JSON-LD FAQPage (TDD)"`

---

## Task 4: Colección `normas` + normas de ejemplo

**Files:** Create `src/content.config.ts`, `src/content/normas/01-respeto.md`, `02-personajes.md`, `03-metagaming.md`

- [ ] **Step 1: `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const normas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/normas' }),
  schema: z.object({
    titulo: z.string(),
    orden: z.number().default(0),
  }),
});

export const collections = { normas };
```

- [ ] **Step 2: `src/content/normas/01-respeto.md`**

```markdown
---
titulo: Respeto entre jugadores
orden: 1
---

Detrás de cada personaje hay una persona. No se toleran insultos reales, discriminación
ni acoso. Los conflictos *in character* se quedan en la ciudad; fuera del rol, respeto.
```

- [ ] **Step 3: `src/content/normas/02-personajes.md`**

```markdown
---
titulo: Tu personaje
orden: 2
---

Crea una historia coherente y mantente en tu papel mientras estás conectado. Nada de
romper el personaje sin motivo (*break character*) ni de crear identidades para saltarte
sanciones.
```

- [ ] **Step 4: `src/content/normas/03-metagaming.md`**

```markdown
---
titulo: Metagaming y powergaming
orden: 3
---

No uses información que tu personaje no conoce (Discord, streams) dentro del rol
(*metagaming*), ni fuerces acciones imposibles sin dar opción a responder (*powergaming*).
El buen rol se construye entre todos.
```

- [ ] **Step 5: Verificar la colección** — `npm run build` debe compilar sin error de schema. (La página que la consume se crea en Task 12; aquí solo se valida que la colección tipa.)

- [ ] **Step 6: Commit** — `git add src/content.config.ts src/content/normas && git commit -m "F2: coleccion de normas con 3 ejemplos"`

---

## Task 5: `CtaDiscord.astro` (bloque reutilizable) + estilos

**Files:** Create `src/components/CtaDiscord.astro`; Modify `src/styles/global.css`

- [ ] **Step 1: `src/components/CtaDiscord.astro`**

```astro
---
import { servidor } from '../config/servidor';

interface Props {
  titulo?: string;
}
const { titulo = '¿Listo para empezar?' } = Astro.props;
---
<section class="cta-discord contenedor">
  <h2 class="seccion__titulo">{titulo}</h2>
  <a class="cta-discord__boton" href={servidor.urlDiscord}>Únete al Discord</a>
</section>
```

- [ ] **Step 2: Append a `src/styles/global.css`**

```css
/* Secciones genéricas */
.seccion { padding-block: 4rem; }
.seccion__titulo {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  letter-spacing: -0.02em;
  margin: 0 0 2rem;
  text-align: center;
}

/* CTA Discord reutilizable */
.cta-discord {
  padding-block: 4rem;
  text-align: center;
}
.cta-discord__boton {
  display: inline-flex;
  align-items: center;
  padding: 0.9rem 1.6rem;
  border-radius: var(--radio);
  background: var(--color-primario);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
.cta-discord__boton:hover { filter: brightness(1.08); }
```

- [ ] **Step 3: Build OK** — `npm run check && npm run build`.

- [ ] **Step 4: Commit** — `git add src/components/CtaDiscord.astro src/styles/global.css && git commit -m "F2: componente CtaDiscord reutilizable"`

---

## Task 6: `Caracteristicas.astro` + estilos

**Files:** Create `src/components/Caracteristicas.astro`; Modify `src/styles/global.css`

Degradación: si `caracteristicas` está vacío, no renderiza nada.

- [ ] **Step 1: `src/components/Caracteristicas.astro`**

```astro
---
import { servidor } from '../config/servidor';
const items = servidor.caracteristicas;
---
{items.length > 0 && (
  <section class="seccion caracteristicas contenedor" id="caracteristicas">
    <h2 class="seccion__titulo">Lo que nos hace distintos</h2>
    <div class="caracteristicas__grid">
      {items.map((c) => (
        <article class="tarjeta">
          <h3 class="tarjeta__titulo">{c.titulo}</h3>
          <p class="tarjeta__texto">{c.texto}</p>
        </article>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 2: Append a `src/styles/global.css`**

```css
/* Características */
.caracteristicas__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}
.tarjeta {
  padding: 1.5rem;
  border-radius: var(--radio);
  background: color-mix(in srgb, var(--color-texto) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-texto) 10%, transparent);
}
.tarjeta__titulo { margin: 0 0 0.5rem; font-size: 1.15rem; }
.tarjeta__texto { margin: 0; opacity: 0.85; }
```

- [ ] **Step 3: Build OK** — `npm run check && npm run build`.

- [ ] **Step 4: Commit** — `git add src/components/Caracteristicas.astro src/styles/global.css && git commit -m "F2: seccion de caracteristicas"`

---

## Task 7: `ComoEntrar.astro` (pasos + CTA bifurcada) + estilos

**Files:** Create `src/components/ComoEntrar.astro`; Modify `src/styles/global.css`

- [ ] **Step 1: `src/components/ComoEntrar.astro`**

```astro
---
import { servidor } from '../config/servidor';
import { ctaEntrada } from '../lib/entrada';
const pasos = servidor.pasosEntrada;
const cta = ctaEntrada(servidor);
---
{pasos.length > 0 && (
  <section class="seccion entrada contenedor" id="como-entrar">
    <h2 class="seccion__titulo">Cómo entrar</h2>
    <ol class="entrada__pasos">
      {pasos.map((paso) => <li class="entrada__paso">{paso}</li>)}
    </ol>
    <div class="entrada__cta">
      <a class="cta-discord__boton" href={cta.url}>{cta.texto}</a>
    </div>
  </section>
)}
```

- [ ] **Step 2: Append a `src/styles/global.css`**

```css
/* Cómo entrar */
.entrada__pasos {
  max-width: 40rem;
  margin: 0 auto 2rem;
  padding-left: 1.25rem;
  display: grid;
  gap: 0.75rem;
}
.entrada__paso { padding-left: 0.25rem; }
.entrada__cta { text-align: center; }
```

- [ ] **Step 3: Build OK** — `npm run check && npm run build`.

- [ ] **Step 4: Commit** — `git add src/components/ComoEntrar.astro src/styles/global.css && git commit -m "F2: seccion como entrar con CTA bifurcada"`

---

## Task 8: `Faq.astro` (acordeón no-JS + schema FAQPage) + estilos

**Files:** Create `src/components/Faq.astro`; Modify `src/styles/global.css`

- [ ] **Step 1: `src/components/Faq.astro`**

```astro
---
import { servidor } from '../config/servidor';
import { faqPageSchema } from '../lib/faqSchema';
const items = servidor.faq;
const schema = faqPageSchema(items);
---
{items.length > 0 && (
  <section class="seccion faq contenedor" id="faq">
    <h2 class="seccion__titulo">Preguntas frecuentes</h2>
    <div class="faq__lista">
      {items.map((item) => (
        <details class="faq__item">
          <summary class="faq__pregunta">{item.pregunta}</summary>
          <p class="faq__respuesta">{item.respuesta}</p>
        </details>
      ))}
    </div>
    <script type="application/ld+json" set:html={JSON.stringify(schema)} />
  </section>
)}
```

- [ ] **Step 2: Append a `src/styles/global.css`**

```css
/* FAQ */
.faq__lista { max-width: 44rem; margin-inline: auto; display: grid; gap: 0.75rem; }
.faq__item {
  border-radius: var(--radio);
  background: color-mix(in srgb, var(--color-texto) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-texto) 10%, transparent);
  padding: 0 1.25rem;
}
.faq__pregunta {
  cursor: pointer;
  font-weight: 600;
  padding-block: 1rem;
  list-style: none;
}
.faq__pregunta::-webkit-details-marker { display: none; }
.faq__respuesta { margin: 0 0 1rem; opacity: 0.85; }
```

- [ ] **Step 3: Build + verificar el JSON-LD** — `npm run build`; grep `dist/index.html` (tras Task 14) contendrá `"@type":"FAQPage"`. En este punto verifica al menos que el build no rompe con `set:html` del script.

- [ ] **Step 4: Commit** — `git add src/components/Faq.astro src/styles/global.css && git commit -m "F2: FAQ con acordeon no-JS y schema FAQPage"`

---

## Task 9: `Staff.astro` (avatar o iniciales) + estilos

**Files:** Create `src/components/Staff.astro`; Modify `src/styles/global.css`

Degradación: sin avatar, muestra iniciales sobre el color primario.

- [ ] **Step 1: `src/components/Staff.astro`**

```astro
---
import { servidor } from '../config/servidor';
const miembros = servidor.staff;

function iniciales(nombre: string): string {
  return nombre.trim().slice(0, 2).toUpperCase();
}
---
{miembros.length > 0 && (
  <section class="seccion staff contenedor" id="staff">
    <h2 class="seccion__titulo">El equipo</h2>
    <div class="staff__grid">
      {miembros.map((m) => (
        <article class="miembro">
          {m.avatar
            ? <img class="miembro__avatar" src={m.avatar} alt={m.nombre} width="72" height="72" />
            : <span class="miembro__avatar miembro__avatar--iniciales">{iniciales(m.nombre)}</span>}
          <h3 class="miembro__nombre">{m.nombre}</h3>
          <p class="miembro__rol">{m.rol}</p>
        </article>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 2: Append a `src/styles/global.css`**

```css
/* Staff */
.staff__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  text-align: center;
}
.miembro__avatar {
  width: 72px; height: 72px;
  border-radius: 50%;
  object-fit: cover;
  margin-inline: auto;
  display: grid; place-items: center;
}
.miembro__avatar--iniciales {
  background: var(--color-primario);
  color: #fff;
  font-weight: 700;
  font-size: 1.4rem;
}
.miembro__nombre { margin: 0.75rem 0 0.15rem; font-size: 1.05rem; }
.miembro__rol { margin: 0; opacity: 0.7; font-size: 0.9rem; }
```

- [ ] **Step 3: Build OK** — `npm run check && npm run build`.

- [ ] **Step 4: Commit** — `git add src/components/Staff.astro src/styles/global.css && git commit -m "F2: seccion de staff con fallback de iniciales"`

---

## Task 10: `Redes.astro` + integración en el footer de Base + estilos

**Files:** Create `src/components/Redes.astro`; Modify `src/layouts/Base.astro`, `src/styles/global.css`

- [ ] **Step 1: `src/components/Redes.astro`**

```astro
---
import { servidor } from '../config/servidor';
import { redesActivas } from '../lib/redes';
const redes = redesActivas(servidor.redes);
---
{redes.length > 0 && (
  <nav class="redes" aria-label="Redes sociales">
    {redes.map((r) => (
      <a class="redes__enlace" href={r.url} rel="noopener">{r.etiqueta}</a>
    ))}
  </nav>
)}
```

- [ ] **Step 2: Insertar `<Redes/>` en el footer de `src/layouts/Base.astro`**

Añade el import en el frontmatter:
```astro
import Redes from '../components/Redes.astro';
```
Y dentro del `<footer class="pie contenedor">`, ANTES del bloque de crédito:
```astro
    <footer class="pie contenedor">
      <Redes />
      {servidor.creditoPlantilla && (
        <p>
          Hecho con la <a href="https://vidaenleonida.com" rel="noopener">plantilla de VidaEnLeonida.com</a>
        </p>
      )}
    </footer>
```

- [ ] **Step 3: Append a `src/styles/global.css`**

```css
/* Redes */
.redes {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 1rem;
}
.redes__enlace { font-weight: 600; text-decoration: none; }
.redes__enlace:hover { text-decoration: underline; }
```

- [ ] **Step 4: Build OK** — `npm run check && npm run build`.

- [ ] **Step 5: Commit** — `git add src/components/Redes.astro src/layouts/Base.astro src/styles/global.css && git commit -m "F2: redes en el footer"`

---

## Task 11: Nav en el header de `Base.astro` + estilos

**Files:** Modify `src/layouts/Base.astro`, `src/styles/global.css`

Con 3 enlaces + botón Discord cabe en móvil sin hamburguesa (sin JS). Los enlaces usan rutas con `trailingSlash: 'always'`.

- [ ] **Step 1: Añadir el nav en el `<header>` de `src/layouts/Base.astro`**

Entre `.cabecera__marca` y `.cabecera__discord`, inserta:
```astro
      <nav class="cabecera__nav" aria-label="Principal">
        <a class="cabecera__enlace" href="/">Inicio</a>
        <a class="cabecera__enlace" href="/normas/">Normas</a>
        <a class="cabecera__enlace" href="/staff/">Staff</a>
      </nav>
```
(El header queda: marca · nav · botón Discord.)

- [ ] **Step 2: Append a `src/styles/global.css`**

```css
/* Nav header */
.cabecera__nav {
  display: flex;
  gap: 1.1rem;
  margin-inline: auto;
}
.cabecera__enlace {
  color: var(--color-texto);
  text-decoration: none;
  font-weight: 600;
  opacity: 0.85;
}
.cabecera__enlace:hover { opacity: 1; }

@media (max-width: 560px) {
  .cabecera { flex-wrap: wrap; }
  .cabecera__nav { order: 3; width: 100%; justify-content: center; margin-top: 0.75rem; }
}
```

- [ ] **Step 3: Build OK** — `npm run check && npm run build`.

- [ ] **Step 4: Commit** — `git add src/layouts/Base.astro src/styles/global.css && git commit -m "F2: navegacion en el header (sin JS)"`

---

## Task 12: Página `normas.astro` (colección + índice lateral) + estilos

**Files:** Create `src/pages/normas.astro`; Modify `src/styles/global.css`

- [ ] **Step 1: `src/pages/normas.astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../layouts/Base.astro';

const entradas = (await getCollection('normas')).sort(
  (a, b) => a.data.orden - b.data.orden
);
const render_ = await Promise.all(entradas.map(async (e) => ({
  id: e.id,
  titulo: e.data.titulo,
  Content: (await render(e)).Content,
})));
---
<Base titulo="Normas">
  <section class="seccion normas contenedor">
    <h1 class="seccion__titulo">Normas</h1>
    <div class="normas__layout">
      <nav class="normas__indice" aria-label="Índice de normas">
        <ul>
          {render_.map((n) => <li><a href={`#${n.id}`}>{n.titulo}</a></li>)}
        </ul>
      </nav>
      <div class="normas__contenido">
        {render_.map((n) => (
          <article class="norma" id={n.id}>
            <h2>{n.titulo}</h2>
            <n.Content />
          </article>
        ))}
      </div>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Append a `src/styles/global.css`**

```css
/* Normas */
.normas__layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2.5rem;
  align-items: start;
}
.normas__indice {
  position: sticky;
  top: 1.5rem;
}
.normas__indice ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.normas__indice a { text-decoration: none; opacity: 0.85; }
.normas__indice a:hover { opacity: 1; }
.norma { scroll-margin-top: 1.5rem; margin-bottom: 2.5rem; }
.norma h2 { margin-top: 0; }

@media (max-width: 720px) {
  .normas__layout { grid-template-columns: 1fr; }
  .normas__indice { position: static; }
}
```

- [ ] **Step 3: Build + verificación** — `npm run build`; confirma que se genera `dist/normas/index.html` con las 3 normas y los anclajes del índice.

- [ ] **Step 4: Commit** — `git add src/pages/normas.astro src/styles/global.css && git commit -m "F2: pagina de normas con indice lateral"`

---

## Task 13: Página `staff.astro`

**Files:** Create `src/pages/staff.astro`

- [ ] **Step 1: `src/pages/staff.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Staff from '../components/Staff.astro';
---
<Base titulo="Staff">
  <Staff />
</Base>
```

- [ ] **Step 2: Build** — `npm run build`; confirma `dist/staff/index.html` con los miembros.

- [ ] **Step 3: Commit** — `git add src/pages/staff.astro && git commit -m "F2: pagina de staff"`

---

## Task 14: Ensamblar `index.astro`

**Files:** Modify `src/pages/index.astro`

- [ ] **Step 1: Reescribir `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import Caracteristicas from '../components/Caracteristicas.astro';
import ComoEntrar from '../components/ComoEntrar.astro';
import Faq from '../components/Faq.astro';
import CtaDiscord from '../components/CtaDiscord.astro';
---
<Base>
  <Hero />
  <Caracteristicas />
  <ComoEntrar />
  <Faq />
  <CtaDiscord />
</Base>
```

- [ ] **Step 2: Build + verificación de la home** — `npm run build`; confirma en `dist/index.html`: las tarjetas de características, los pasos de "cómo entrar", el CTA "Solicitar plaza" (config de ejemplo tiene `requiereWhitelist: true`), el FAQ y el `"@type":"FAQPage"` en el JSON-LD.

- [ ] **Step 3: Commit** — `git add src/pages/index.astro && git commit -m "F2: ensamblar home con todas las secciones"`

---

## Task 15: Verificación en navegador (smoke de F2)

**Files:** (ninguno — verificación)

- [ ] **Step 1:** Arrancar el dev server (`preview_start` name `plantilla-servidor-rp`, puerto 4322).

- [ ] **Step 2: Home** — `read_page`/`read_console_messages`: hero, características (4 tarjetas), cómo entrar con CTA "Solicitar plaza", FAQ con `<details>` que abre/cierra al click (`computer`), CTA final, footer con redes (X/TikTok/YouTube) + crédito. Consola sin errores.

- [ ] **Step 3: `/normas/`** — navegar; 3 normas renderizadas desde markdown, índice lateral con anclajes que saltan a cada norma.

- [ ] **Step 4: `/staff/`** — 3 miembros con iniciales (sin avatar en la config de ejemplo).

- [ ] **Step 5: Responsive 375px** — sin scroll horizontal; nav se reordena; grids colapsan a 1 columna.

- [ ] **Step 6: Tests completos** — `npm test` → todos verdes (F1 + F2: tokens, fallbacks, entrada, redes, faqSchema).

- [ ] **Step 7: Capturas** (home desktop + móvil + normas) como prueba para el usuario.

---

## Cierre de F2

Tras el smoke OK: ejecutar el ritual `phase-boundary` (verificar, code-review de frontera con Opus, actualizar HANDOFF + mapa de fases, consolidar memoria, push a `main`), y preparar el checklist de smoke de F2 para el usuario sobre la demo desplegada. Siguiente = **F3 · Pulido y lanzamiento**.

## Self-Review (cobertura del alcance F2)

- **características:** Task 6. ✔
- **cómo entrar (bifurcación whitelist/directo):** Task 1 (lógica TDD) + Task 7 (UI). ✔
- **normas desde markdown con índice:** Task 4 (colección) + Task 12 (página + índice lateral). ✔
- **staff:** Task 9 (componente) + Task 13 (página). ✔
- **FAQ con schema FAQPage:** Task 3 (schema TDD) + Task 8 (UI + JSON-LD). ✔
- **redes:** Task 2 (TDD) + Task 10 (footer). ✔
- **navegación entre páginas:** Task 11. ✔
- **degradación elegante** en todas las secciones (guardas `length > 0` / `redesActivas`). ✔
- **sin JS de cliente** (FAQ con `<details>`, nav sin hamburguesa). ✔
- TDD en la lógica pura (entrada, redes, faqSchema); componentes verificados por build + smoke. ✔
- Fuera de alcance (F3): sitemap/robots, Lighthouse, README bilingüe, post de release. ✔
