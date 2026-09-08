# Aradhya Healthcare — Baby & Women Care

Marketing + catalog site for **Aradhya Healthcare Pvt. Ltd.** (Shamli, Uttar Pradesh):
12 live SKUs across baby diapers, sanitary pads, panty liners and maternity pads,
a live **Stock & Sales** board, company info and a full contact section.
All WhatsApp functionality has been **removed** — inquiries go through the on-site
contact form, `mailto:` and `tel:` links only.

## Stack

- React 19 + TypeScript + Vite 7
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `vite-plugin-singlefile` — the production build is **one self-contained `dist/index.html`**
  (no external asset paths), so it deploys cleanly to GitHub Pages project sites,
  Netlify, Azure Static Web Apps or any static host with no base-path configuration.

## Run locally

```bash
npm install     # or: npm ci  (if a package-lock.json is present)
npm run dev     # http://localhost:5173
npm run build   # outputs dist/index.html
npm run preview # serve the production bundle locally
```

Requires **Node.js 20.19+ or 22.12+** (Vite 7 engine requirement).

## Deploy to GitHub Pages

The repository ships with `.github/workflows/main.yml`
(*Build & Deploy to GitHub Pages*). It installs dependencies, runs `npm run build`
and publishes `dist/` via GitHub Actions.

One-time repository setup:

1. **Settings → Pages → Build and deployment → Source** = **GitHub Actions**
   (not “Deploy from a branch” — serving raw source will show a blank page because
   `.tsx` files are not compiled by the browser).
2. Push to `main`. The workflow builds and deploys automatically; the live URL is
   printed at the end of the *Deploy* job (`https://<user>.github.io/<repo>/`).

### Why an earlier `main.yml` may have failed

| Symptom | Cause | Fix in this workflow |
| --- | --- | --- |
| `npm ci` errors with *“lockfile not found”* | `package-lock.json` not committed | Step falls back to `npm install` when the lockfile is absent |
| *“Vite requires Node.js version 20.19+”* / syntax errors | Template workflow used Node 16/18 | `actions/setup-node` pinned to **22** |
| Blank page after deploy | Pages source set to branch/root, serving uncompiled `src/` | Deploys the built `dist/` artifact via Actions |
| 404 on `/assets/*` under a project path | Absolute asset URLs | `vite-plugin-singlefile` inlines JS/CSS into `index.html` |

If you commit a `package-lock.json` later, the same workflow automatically switches
to the faster, reproducible `npm ci`.

## Feature notes

- **Bilingual UI** — the `हिं / EN` button in the header switches every string,
  including product copy, between English and Hindi.
- **Admin console** — header *Admin* button, demo PIN `2018`. Edits to stock /
  units-sold update every stat, bar and alert on the page instantly and persist
  in `localStorage`.
- **Enquire flow** — each product card drafts a pre-filled inquiry into the
  contact form (replaces the old WhatsApp enquire button).
- **Contact** — validated form (name, 10-digit mobile, message) with an in-page
  success reference; care line `+91 90000 12345`, toll-free `1800 000 0000`,
  `care@aradhyahealthcare.in`, wholesale `distributors@aradhyahealthcare.in`.
- Respects `prefers-reduced-motion` for all animations (count-ups, marquee,
  Ken Burns hero, scroll reveals, bar growth).

## Structure

```
src/
  App.tsx               composition + global state (lang, inventory, drafts)
  lib/data.ts           12 SKUs, categories, contact constants
  lib/i18n.ts           EN + HI string tables
  lib/motion.tsx        reveal / count-up / reduced-motion hooks
  components/           Header, Hero, Products, StockSales, About, Contact, AdminModal, icons
.github/workflows/main.yml   CI: build + GitHub Pages deploy
```
