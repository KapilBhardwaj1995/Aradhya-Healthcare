# ARADHAYA Enterprises — "Care for Every Little Need"

A production-ready, bilingual (English / हिंदी) e-commerce-style website for **Aradhaya Enterprises**, a Baby & Women's Care product manufacturer (District Shamli, Uttar Pradesh, India).

> **Aradhya SoftCare** product line: Baby Diapers • Sanitary Pads • Panty Liners • Maternity Pads

---

## ✨ Features

| Area | Details |
|------|---------|
| **Public store** | Product grid with image, name, price, category & discount. Live search, filters (category, discount), sorting. **No stock or sales data is ever exposed to visitors.** |
| **Order Request System** | Customers submit order requests (no online payment / no delivery partner). Unique Request IDs (e.g. `AS-2026-000125`), customer self-service tracking by Request ID + phone. |
| **Hindi / English switcher** | Top-right `EN \| हिंदी` toggle — all UI text translates, persists across pages. |
| **Customer accounts** | Register / login (email or mobile), profile, own order-request history. |
| **Admin Console** (`/admin`) | Full product CRUD: **Name, Price, Discount, Image, Category, Pack Size**, plus **Stock Quantity** and **Sales Quantity (units sold)**, low-stock dashboard, order-request status management, inventory controls, production QA approval, customer & employee management, reports (CSV export), company settings. |
| **Employee Portal** (`/employee`) | Separate login, production entry, own production history only. |
| **Security** | Role-based access (admin / employee / customer), server-side masking of `stock` / `unitsSold` for non-admin API callers, hashed passwords, signed session cookies, full audit trail. |
| **Branding** | Official navy + gold ARADHAYA Enterprises logo, premium healthcare visual identity, fully responsive (320px → 1920px). |

---

## 🚀 Local Setup (GitHub → your machine)

**Prerequisites:** Node.js 20.9+ and a local PostgreSQL 14+ database.

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USER/aradhaya-enterprises.git
cd aradhaya-enterprises

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
#    → edit .env and set DATABASE_URL to your local Postgres, e.g.
#      DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db

# 4. Run the development server
npm run dev
#    → open http://localhost:3000
```

> **No manual database setup required!** On the first database connection the app
> **automatically creates all tables and seeds the demo catalogue** (idempotent —
> safe to re-run at any time). You do NOT need to run migrations by hand.

### Demo Accounts

| Role | Email | Password | Portal |
|------|-------|----------|--------|
| **Admin** | `admin@aradhyacare.com` | `admin123` | `/admin` |
| **Employee** | `employee@aradhyacare.com` | `employee123` | `/employee` |
| **Customer** | `customer@example.com` | `customer123` | `/account` |

> ⚠️ Change these passwords before any real public launch.

---

## ⚠️ IMPORTANT: Do NOT use GitHub Pages

**GitHub Pages (the `yourusername.github.io` address) CANNOT host this website.**
GitHub Pages only serves *static* HTML/CSS/JS files. It cannot run:

- ❌ Next.js server-side rendering
- ❌ API routes (`/api/products`, `/api/auth/login`, …)
- ❌ PostgreSQL database connections
- ❌ Login / Admin panel / Order requests

If you open your repo on GitHub Pages you will see a **"404 File not found"** page.
That is normal and not a bug in the code.

**What to do:**

1. **Disable GitHub Pages** for this repo:
   `GitHub repo → Settings → Pages → Source → (Disable)` — or simply ignore it.
   (You may also delete the `gh-pages` branch if one was created.)
2. **Deploy to Vercel instead** (free for this project) — see the next section.

> **Where does GitHub fit in?** GitHub is only used as the *code repository*.
> GitHub **Pages** is a different feature (static hosting) and is NOT a server.

| Platform | Can host this site? | Why |
|----------|:---:|-----|
| GitHub (repository) | — | Stores your code ✅ |
| GitHub Pages | ❌ | Static files only — no server, no API, no database |
| **Vercel** | ✅ | Official Next.js platform — runs server + API + DB connection (recommended) |
| Netlify / Render / Railway | ✅ | Also run Node.js servers |

---

## ▲ Deployment to Vercel (Recommended — FREE)

### Step 1 — Push the code to GitHub

```bash
git add .
git commit -m "ARADHAYA Enterprises website"
git push origin main
```

(The included `.gitignore` keeps `node_modules/`, `.next/` and your `.env` secrets out of the repository.)

### Step 2 — Create a hosted PostgreSQL database

Any managed Postgres works — recommended free tiers:

- **Neon** (neon.tech) → create project → copy the **pooled** connection string
- **Supabase** (supabase.com) → Project Settings → Database → copy connection string
- **Render / Railway** Postgres also work

Example format:

```
postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

### Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in **with GitHub**.
2. Click **Add New… → Project**.
3. Find your repository in the list and click **Import**.
4. On the setup screen:
   - **Framework Preset** should automatically show **Next.js** — leave it as is.
   - Under **Environment Variables**, add one variable:

     | Name | Value |
     |------|-------|
     | `DATABASE_URL` | your Postgres connection string from Step 2 |

   - (Optional) **Project Name**: e.g. `aradhaya-enterprises`
5. Click **Deploy**.
6. Wait ~1 minute. Vercel gives you a live URL like
   `https://aradhaya-enterprises.vercel.app` — **this is your real website**.

That's it. **Tables and demo data are created automatically on the first request** — no migrations, no seed scripts, no build-time database access needed.

### After deployment

- **Your live URL** is the Vercel one (`*.vercel.app`) — or your own custom domain
  (Vercel → Project → Settings → Domains → Add your domain, e.g.
  `aradhayaenterprises.in`).
- **GitHub Pages must stay disabled** (or simply unused) — it is NOT your website.
- Future updates: just `git push` to GitHub → Vercel **rebuilds and deploys automatically**.
- Environment changes (e.g. new DB): Vercel → Project → Settings → Environment
  Variables → edit → redeploy.

> **Tips**
> - Vercel Settings → General → **Node.js version**: set to **22.x** (required by Next.js 16).
> - The build does **not** touch the database, so deployments are fast and reliable.
> - For serverless-friendly pooling, prefer your host's **pooler** connection string (Neon: the `...sba.neon.tech?pgbouncer=true` URL).

---

## 📁 Project Structure

```
├── public/images/            # Official logos (logo-full, logo-mark, logo-dark) + product images
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home (hero, categories, featured products)
│   │   ├── products/                 # Catalog + /products/[category]
│   │   ├── product/[id]/             # Product details
│   │   ├── about/  contact/          # Company pages
│   │   ├── login/  register/         # Customer auth
│   │   ├── account/                  # Customer dashboard + order requests
│   │   ├── admin/                    # Admin Console (products, inventory, orders,
│   │   │                             #   production, customers, employees, reports, settings)
│   │   ├── employee/                 # Employee production portal
│   │   └── api/                      # REST API (auth, products, orders, inventory,
│   │                                 #   production, inquiries, settings, reports)
│   ├── components/           # Navbar (logo + EN/हिंदी + Admin), Footer, ProductCard,
│   │                         #   OrderRequestModal, WhatsAppButton, AdminSidebar...
│   ├── context/              # AuthContext, LanguageContext (EN/HI translations)
│   ├── db/
│   │   ├── schema.ts         # Drizzle ORM schema (8 tables)
│   │   ├── index.ts          # DB pool + AUTO bootstrap (creates tables & seeds if empty)
│   │   └── seed.ts           # Standalone seeder (also available via /api/seed)
│   └── lib/
│       ├── auth.ts           # scrypt password hashing + signed session cookies
│       └── firebase.ts       # Firebase config adapter (optional future use)
├── .env.example              # Environment template (copy to .env)
├── .gitignore                # Keeps secrets & build artifacts out of Git
└── drizzle.config.json       # For optional `npx drizzle-kit push` local migrations
```

---

## 🔒 Data Access Rules (enforced server-side)

| Data | Public visitors | Admin Console |
|------|:---:|:---:|
| Product image, name, price, category, discount | ✅ | ✅ |
| **Stock quantity** | ❌ hidden | ✅ |
| **Units sold / sales information** | ❌ hidden | ✅ |
| **Low-stock information** | ❌ hidden | ✅ |
| Customer accounts & other customers' orders | ❌ | ✅ |
| Production logs | ❌ | ✅ |

The public product cards only show: **Product Image • Product Name • Product Price • Product Category**.
Any change the Admin saves (name, price, image, category, stock, sales) is **immediately live** on the public website.

---

## 🛠️ Useful Commands

```bash
npm run dev         # development server
npm run build       # production build
npm run start       # serve production build locally
npm run typecheck   # TypeScript check
npx drizzle-kit push   # (optional) sync schema from drizzle.config.json locally
```
