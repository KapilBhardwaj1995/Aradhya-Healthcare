# Aradhya Healthcare — Baby & Women Care (static site)

Plain **HTML + CSS** site (with a small vanilla-JS layer) for Aradhya Healthcare
Pvt. Ltd., Shamli, Uttar Pradesh: 12 live SKUs across baby diapers, sanitary pads,
panty liners and maternity pads, a live **Stock & Sales** board, company info and
a full contact section. All WhatsApp functionality is **removed** — inquiries go
through the on-site form, `mailto:` and `tel:` links only. Product names carry no
brand prefix.

## Runs directly on GitHub — no build step

The repository root **is** the website:

```
index.html    full markup (all 12 product cards, sections, admin modal)
styles.css    complete design system (custom CSS, no framework)
site.js       vanilla JS: bilingual switch, filters, enquiry flow, form
              validation, live inventory admin, scroll/count-up motion
.nojekyll     keeps GitHub Pages from Jekyll-processing the files
```

Push to GitHub, then **Settings → Pages → Build and deployment →
Source: “Deploy from a branch” → Branch: `main` (or `gh-pages`) → `/ (root)`**.
The site is live at `https://<user>.github.io/<repo>/` — nothing to install,
nothing to compile. Opening `index.html` from disk or any static host
(cPanel, Netlify drop, Azure Static Web Apps) works the same way.

### Optional CI (`.github/workflows/main.yml`)

A self-adapting workflow is included for repositories that prefer the
**GitHub Actions** Pages source: it builds with Vite (Node 22, `npm ci` or
`npm install` fallback) into a single self-contained `dist/index.html`, deploys
via `actions/deploy-pages` when Pages is enabled, and otherwise publishes the
bundle to a `gh-pages` branch. If you use the branch source above, the workflow
can simply be ignored or deleted — the site does not need it.

## Local preview

```bash
# zero-dependency: just open the file
open index.html            # or: python3 -m http.server 8080

# or with the toolchain (Vite dev server / single-file production build)
npm install
npm run dev
npm run build              # dist/index.html with CSS+JS inlined
```

Node.js 20.19+ / 22.12+ is only required for the optional Vite toolchain
(`.nvmrc` pins 22); the site itself needs no runtime beyond a browser.

## Feature notes

- **Bilingual UI** — the `हिं / EN` header button swaps every string (including
  product descriptions) between English and Hindi; choice persists.
- **Products** — search + category chips filter the 12 static cards; each card
  shows pack badge, rating, SKU, stock available, units sold, price/MRP/savings.
- **Enquire flow** — card buttons draft a pre-filled inquiry into the contact
  form and scroll to it (replaces the old WhatsApp button).
- **Contact** — validated form (name, 10-digit mobile, message) with in-page
  success reference; care line `+91 90000 12345`, toll-free `1800 000 0000`,
  `care@aradhyahealthcare.in`, wholesale `distributors@aradhyahealthcare.in`.
- **Admin console** — header *Admin* button, demo PIN `2018`: edit stock/sold
  and every tile, total, bar and low-stock alert updates instantly.
- **Motion** — scroll reveals, count-ups, Ken Burns hero, marquee, bar growth;
  all disabled under `prefers-reduced-motion`.

## Structure

```
index.html / styles.css / site.js   the website (framework-free)
.github/workflows/main.yml          optional CI + Actions Pages deploy
src/                                legacy React source (not required to run)
```
