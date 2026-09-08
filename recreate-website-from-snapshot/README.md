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
  Netlify, Azure Static Web Apps, cPanel or any static host with no base-path configuration.

## Run locally

```bash
nvm use            # optional — .nvmrc pins Node 22
npm install        # or: npm ci (if a package-lock.json is present)
npm run dev        # http://localhost:5173
npm run build      # outputs a single self-contained dist/index.html
npm run preview    # serve the production bundle locally
```

Requires **Node.js 20.19+ or 22.12+** (Vite 7 engine requirement).

## GitHub deployment (`.github/workflows/main.yml`)

The workflow is **self-adapting** and stays green on a fresh repository:

1. **Build job (always runs):** checkout → Node 22 → `npm ci` *or* `npm install`
   (whichever the repo supports) → `npm run build` → verifies `dist/index.html`
   → uploads artifacts. This job cannot fail because of Pages configuration.
2. **If GitHub Pages is enabled** (detected via the Pages REST API): the
   *Deploy (Pages source = Actions)* job publishes `dist/` with
   `actions/deploy-pages`. Live at `https://<user>.github.io/<repo>/`.
3. **If Pages is not enabled yet:** the *Publish to gh-pages branch* job pushes
   the built site (plus `.nojekyll`) to a `gh-pages` branch, so the site is one
   dropdown away from being live. A workflow notice prints the exact setting.

### One-time repository setup (pick either source)

- **Source = GitHub Actions:** Settings → Pages → Build and deployment → Source:
  *GitHub Actions*, then re-run the workflow (or push again).
- **Source = branch:** Settings → Pages → Source: *Deploy from a branch* →
  Branch: `gh-pages`, Folder: `/ (root)`. The workflow keeps this branch updated
  on every push to `main`.

> Never point “Deploy from a branch” at `main / (root)` — that serves raw
> `.tsx` source, which browsers cannot execute (blank page).

### Failures this workflow already guards against

| Symptom | Cause | Guard |
| --- | --- | --- |
| `npm ci` → *“lockfile not found”* | no committed `package-lock.json` | conditional `npm install` fallback |
| *“Vite requires Node.js version 20.19+”* | template workflow on Node 16/18 | `setup-node` pinned to 22 (+ `.nvmrc`) |
| `configure-pages` / `deploy-pages` 404 | Pages not enabled on repo | Pages status probed first; falls back to `gh-pages` branch publish |
| Blank page on a project URL | absolute `/assets/*` paths | single-file build inlines all JS/CSS |
| Jekyll eating `_` files on branch deploys | Pages runs Jekyll by default | `.nojekyll` committed with the publish step |

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
.github/workflows/main.yml   CI: build + adaptive GitHub Pages deploy
.nvmrc                    Node engine pin (22)
```
