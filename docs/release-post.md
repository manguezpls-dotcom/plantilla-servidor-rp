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
