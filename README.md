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

`orden` controls the position; the file name (without the `.md` extension,
number prefix included) becomes the anchor in the side index, e.g.
`01-respeto.md` links to `#01-respeto`. Delete all files and the Rules link
disappears from the nav.

## FAQ

- **Do I need to know how to code?** No. The config file is plain values with
  comments; the Markdown rules are plain text.
- **Can I remove the "made with" credit?** Yes: set `creditoPlantilla: false`.
  A link back is appreciated but not required (MIT license).
- **Custom domain?** Add it to your Worker from the Cloudflare dashboard
  (Workers & Pages → your worker → Domains & Routes).

## License

MIT — see [LICENSE](LICENSE). Made by [VidaEnLeonida.com](https://vidaenleonida.com).
