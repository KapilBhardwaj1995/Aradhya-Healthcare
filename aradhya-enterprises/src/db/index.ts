import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, Client } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Do NOT crash at import time (static pages must still build on Vercel).
  // Fail lazily with a helpful message when a DB query is attempted.
  console.warn(
    "[db] DATABASE_URL is not configured.\n" +
      "  Local:   add DATABASE_URL to your .env file (see .env.example).\n" +
      "  Vercel:  Project Settings -> Environment Variables -> add DATABASE_URL\n" +
      "           pointing to a PostgreSQL database (Neon, Supabase, Render, Railway).\n" +
      "  All tables and demo data are created AUTOMATICALLY on first connection."
  );
}

const globalForDb = globalThis as typeof globalThis & {
  __aradhyaPostgresPool?: Pool;
};

const pool =
  globalForDb.__aradhyaPostgresPool ??
  new Pool({
    connectionString: databaseUrl,
    // Serverless-friendly (Vercel): small pool, short idle lifetime
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__aradhyaPostgresPool = pool;
}

/*
 * ──────────────────────────────────────────────────────────────────────────
 *  AUTOMATIC SCHEMA BOOTSTRAP (fully idempotent, zero manual migrations)
 *
 *  On the first database access of each process, ONE dedicated connection
 *  runs a single DO block that:
 *    1. Creates every table if it does not exist (CREATE TABLE IF NOT EXISTS).
 *    2. Seeds the demo catalogue, demo users, sample orders and company
 *       settings ONLY when the database is empty.
 *
 *  The pool's query() is gated behind this bootstrap promise, so app queries
 *  NEVER race against schema creation. This means a fresh Vercel + Neon
 *  deployment needs NOTHING but the DATABASE_URL environment variable.
 * ──────────────────────────────────────────────────────────────────────────
 */
const BOOTSTRAP_SQL = `
DO $$
BEGIN
  -- 1. USERS
  CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'customer',
    phone         TEXT,
    address       TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 2. CATEGORIES
  CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    description TEXT,
    icon        TEXT,
    image_url   TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 3. PRODUCTS
  CREATE TABLE IF NOT EXISTS products (
    id                  SERIAL PRIMARY KEY,
    slug                TEXT NOT NULL UNIQUE,
    sku                 TEXT NOT NULL UNIQUE,
    name                TEXT NOT NULL,
    category_slug       TEXT NOT NULL,
    description         TEXT NOT NULL,
    pack_size           TEXT NOT NULL,
    original_price      NUMERIC(10,2) NOT NULL,
    discount_percent    INTEGER NOT NULL DEFAULT 0,
    final_price         NUMERIC(10,2) NOT NULL,
    stock               INTEGER NOT NULL DEFAULT 0,
    units_sold          INTEGER NOT NULL DEFAULT 0,
    min_stock           INTEGER NOT NULL DEFAULT 10,
    availability_status TEXT NOT NULL DEFAULT 'available',
    images              TEXT NOT NULL,
    specifications      TEXT,
    features            TEXT,
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 4. ORDER REQUESTS
  CREATE TABLE IF NOT EXISTS order_requests (
    id                 SERIAL PRIMARY KEY,
    request_id         TEXT NOT NULL UNIQUE,
    user_id            INTEGER REFERENCES users(id),
    customer_name      TEXT NOT NULL,
    customer_phone     TEXT NOT NULL,
    customer_email     TEXT NOT NULL,
    customer_address   TEXT NOT NULL,
    product_id         INTEGER REFERENCES products(id),
    product_name       TEXT NOT NULL,
    product_pack_size  TEXT NOT NULL,
    quantity           INTEGER NOT NULL DEFAULT 1,
    unit_price         NUMERIC(10,2) NOT NULL,
    discount_percent   INTEGER NOT NULL DEFAULT 0,
    total_estimate     NUMERIC(10,2) NOT NULL,
    message            TEXT,
    status             TEXT NOT NULL DEFAULT 'New Request',
    admin_notes        TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 5. PRODUCTION LOGS
  CREATE TABLE IF NOT EXISTS production_logs (
    id                SERIAL PRIMARY KEY,
    employee_id       INTEGER REFERENCES users(id),
    employee_name     TEXT NOT NULL,
    product_id        INTEGER REFERENCES products(id),
    product_name      TEXT NOT NULL,
    production_date   TEXT NOT NULL,
    quantity_produced INTEGER NOT NULL,
    remarks           TEXT,
    is_approved       BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by       TEXT,
    approved_at       TIMESTAMPTZ,
    inventory_updated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 6. CUSTOMER INQUIRIES
  CREATE TABLE IF NOT EXISTS customer_inquiries (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT NOT NULL,
    subject     TEXT NOT NULL,
    message     TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'New',
    admin_reply TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 7. AUDIT LOGS
  CREATE TABLE IF NOT EXISTS audit_logs (
    id           SERIAL PRIMARY KEY,
    action       TEXT NOT NULL,
    entity       TEXT NOT NULL,
    entity_id    TEXT,
    details      TEXT,
    performed_by TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 8. COMPANY SETTINGS
  CREATE TABLE IF NOT EXISTS company_settings (
    id         SERIAL PRIMARY KEY,
    key        TEXT NOT NULL UNIQUE,
    value      TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- SEED ONLY WHEN DATABASE IS EMPTY
  IF NOT EXISTS (SELECT 1 FROM categories LIMIT 1) THEN
    INSERT INTO company_settings (key, value) VALUES
      ('whatsapp_number', '+919000012345'),
      ('contact_phone', '+91 90000 12345 (demo number)'),
      ('toll_free', '1800 000 0000 (demo)'),
      ('contact_email', 'care@aradhayaenterprises.in'),
      ('wholesale_email', 'distributors@aradhayaenterprises.in'),
      ('contact_address', 'Aradhaya Enterprises, District Shamli, Uttar Pradesh, India'),
      ('announcement_banner', 'Aradhaya Enterprises • Care for Every Little Need • District Shamli, UP'),
      ('company_tagline', 'Care for Every Little Need'),
      ('low_stock_threshold', '25');

    INSERT INTO users (name, email, password_hash, role, phone, address) VALUES
      ('Aradhya Administrator', 'admin@aradhyacare.com',
       'b12880c49fa8eaa084c853f16165b01aaaf621784849f78cd5eb0674b523f48b438ea2966a6cc26d9e51e0065adadf136574cb9223a4c8d0f99929c6903fb555',
       'admin', '+91 98765 43210', 'Headquarters, Industrial Zone, Pune, Maharashtra'),
      ('Priya Sharma (Production)', 'employee@aradhyacare.com',
       'b4de451d385059cbb57ead21bfabaee366640c882f46ee87b1b460d0612d3a04808bb9649b05c3a75a57f4f41ad12602f5c413bdc306cf7c091a55582a3aea3c',
       'employee', '+91 98765 43211', 'Unit 3 Production Plant, Pune, Maharashtra'),
      ('Ananya Deshmukh', 'customer@example.com',
       '1b5ed43bb805d6aa51f3e13643839cadb7193c0fb286a961a73b5a5982b0c214a50d71b26e620f14754b0b01dbf878938c99bf5976c056658ec50a6b1928a3b8',
       'customer', '+91 98765 11223', 'Flat 402, Lotus Residency, Baner, Pune, Maharashtra 411045');

    INSERT INTO categories (slug, name, description, icon, image_url, sort_order) VALUES
      ('baby-diapers', 'Baby Diapers',
       'Ultra-absorbent, hypoallergenic, feather-soft baby diapers engineered for gentle 12-hour leak-lock protection.',
       'Baby', '/images/aradhya-baby-diapers.jpg', 1),
      ('sanitary-pads', 'Sanitary Pads',
       'Cottony soft, ultra-thin breathable sanitary pads with active gel absorption and odor neutralizing lock.',
       'Sparkles', '/images/aradhya-sanitary-pads.jpg', 2),
      ('panty-liners', 'Panty Liners',
       'Feather-light, ultra-breathable daily liners for all-day freshness and daily intimate hygiene confidence.',
       'Flower2', '/images/aradhya-panty-liners.jpg', 3),
      ('maternity-pads', 'Maternity Pads',
       'Hospital-grade heavy flow postpartum pads with ultra-cushioned comfort, 3D side leak guards, and high softness.',
       'HeartHandshake', '/images/aradhya-maternity-pads.jpg', 4);

    INSERT INTO products
      (slug, sku, name, category_slug, description, pack_size, original_price, discount_percent, final_price, stock, units_sold, min_stock, availability_status, images, specifications, features, is_featured)
    VALUES
      ('baby-diapers-newborn-nb', 'AS-BD-NB-30', 'Aradhya SoftCare Baby Diapers - Newborn (NB)', 'baby-diapers',
       'Specially formulated for delicate newborn skin under 5 kg. Features an umbilical cord notch, organic cotton top-sheet, 12-hour dry-weave absorbency, and breathable 3D air-channels to prevent rash and irritation.',
       'Pack of 30 Pants', 399.00, 12, 351.12, 350, 1420, 40, 'available',
       '["/images/aradhya-baby-diapers.jpg"]',
       '{"Baby Weight":"Up to 5 kg","Absorption":"Up to 12 Hours Gel Lock","Material":"Organic Cotton Blend, Chlorine-free","Special Feature":"Umbilical Cord Cutout, Wetness Indicator"}',
       '["12-Hour Dry-Weave Absorption Layer","Gentle Navel Protection Cut for Newborns","Color-Changing Wetness Indicator Line","Hypoallergenic and 100% Breathable Backsheet","Double Leak-Guard Barriers"]',
       TRUE),
      ('baby-diapers-small-s', 'AS-BD-S-46', 'Aradhya SoftCare Baby Diapers - Small (S)', 'baby-diapers',
       'Designed for active babies weighing 4-8 kg. Crafted with super-absorbent Japanese SAP polymer, cushiony soft waistband, and wetness indicator for uninterrupted sleep and play.',
       'Pack of 46 Pants', 599.00, 15, 509.15, 480, 1890, 50, 'available',
       '["/images/aradhya-baby-diapers.jpg"]',
       '{"Baby Weight":"4 - 8 kg","Absorption":"Up to 12 Hours Dry Core","Waistband":"360-Degree Cloud Elastic","Chemical Free":"Paraben Free, Lotion Free"}',
       '["360-Degree Cloud-Soft Stretchable Waistband","Deep Liquid Capture Pocket for Active Crawlers","Zero Harsh Chemicals and Chlorine-Free Pulp","Dermatologically Approved for Sensitive Skin"]',
       TRUE),
      ('baby-diapers-medium-m', 'AS-BD-M-42', 'Aradhya SoftCare Baby Diapers - Medium (M)', 'baby-diapers',
       'Ideal for babies 7-12 kg exploring the world. Features flexible side cuffs, extra wide leak shields, and diamond-embossed surface for swift fluid distribution.',
       'Pack of 42 Pants', 649.00, 10, 584.10, 220, 1240, 45, 'available',
       '["/images/aradhya-baby-diapers.jpg"]',
       '{"Baby Weight":"7 - 12 kg","Absorption":"Anti-Sagging Dual Core","Air Circulation":"Micro-Porous Film"}',
       '["Diamond-Embossed Rapid Fluid Grid","Anti-Sagging Construction During Movement","Odor Lock Natural Polymer","Silky Smooth Leg Elastics"]',
       TRUE),
      ('baby-diapers-large-l', 'AS-BD-L-38', 'Aradhya SoftCare Baby Diapers - Large (L)', 'baby-diapers',
       'Engineered for active toddlers 9-14 kg. Heavy absorption core locks moisture away instantly during active play and long nighttime rests.',
       'Pack of 38 Pants', 699.00, 10, 629.10, 12, 980, 30, 'low_stock',
       '["/images/aradhya-baby-diapers.jpg"]',
       '{"Baby Weight":"9 - 14 kg","Absorption":"Maxi-Capacity Toddler Core"}',
       '["Heavy Toddler Night-Lock Retention","Super Tear-Off Sides for Quick Change","Breathable Outer Shield"]',
       FALSE),
      ('ultra-thin-sanitary-pads-xl-plus', 'AS-SP-XL-30', 'Aradhya SoftCare Ultra Thin Sanitary Pads - XL+', 'sanitary-pads',
       '320mm Extra-Long sanitary pads crafted with 100% natural organic cotton surface, rapid-dry SAP core, and wide wings. Provides leak-free peace of mind day and night.',
       'Pack of 30 Pads (Individually Wrapped)', 349.00, 14, 300.14, 410, 2150, 50, 'available',
       '["/images/aradhya-sanitary-pads.jpg"]',
       '{"Length":"320 mm (Extra Long XL+)","Top Sheet":"100% Organic Soft Cotton","Wings":"Flexible Stay-Fast Dual Wings","Flow Type":"Heavy Flow and Overnight"}',
       '["320mm Extra Rear Coverage for Zero Night Stains","Organic Feather-Soft Breathable Cotton","Anion Strip with Natural Odor Neutralizer","Ultra-Thin Profile - Stays Completely Discreet"]',
       TRUE),
      ('cottony-soft-sanitary-pads-regular', 'AS-SP-RG-20', 'Aradhya SoftCare Cottony Soft Sanitary Pads - Regular', 'sanitary-pads',
       '240mm regular flow sanitary pads featuring plush cotton weave, side leak guards, and ergonomic contours for everyday office, college, and home wear.',
       'Pack of 20 Pads', 219.00, 5, 208.05, 290, 1630, 30, 'available',
       '["/images/aradhya-sanitary-pads.jpg"]',
       '{"Length":"240 mm (Regular Flow)","Top Sheet":"Cotton Cushioned Weave","Wings":"Contoured Adhesion Wings"}',
       '["Instant Absorption Channels","Soft Cloud Cuffs Against Chafing","Anti-Bunching Lock Technology"]',
       TRUE),
      ('daily-fresh-panty-liners', 'AS-PL-DF-40', 'Aradhya SoftCare Daily Fresh Panty Liners', 'panty-liners',
       'Ultra-thin 155mm daily liners formulated for everyday freshness, light discharge, ovulation days, and menstrual cup backup. 100% breathable with non-irritating botanical cotton.',
       'Pack of 40 Liners', 189.00, 0, 189.00, 0, 870, 25, 'out_of_stock',
       '["/images/aradhya-panty-liners.jpg"]',
       '{"Length":"155 mm (Everyday Slim)","Thickness":"Under 1 mm Micro Profile","Breathability":"100% Micro-Aerated Base"}',
       '["Barely-There Micro Thickness","Gentle Botanical Cotton For Sensitive Skin","Stay-Put Adhesion That Leaves No Residue","All-Day Cleanliness and Spotting Confidence"]',
       FALSE),
      ('maternity-care-maxi-pads', 'AS-MP-MX-16', 'Aradhya SoftCare Maternity Care Maxi Pads', 'maternity-pads',
       'Hospital-grade 420mm postpartum maxi pads specially tailored for mothers recovering from childbirth. Features extra cushioning, high lochia retention, and hypoallergenic soothing touch.',
       'Pack of 16 Super Absorbent Pads', 449.00, 15, 381.65, 175, 1100, 25, 'available',
       '["/images/aradhya-maternity-pads.jpg"]',
       '{"Length":"420 mm (Postpartum Maxi)","Flow Grade":"Hospital Grade Heavy Lochia Flow","Softness":"Velvet Cloud Extra-Thick Cushioning","Side Barriers":"3D Anatomical Raised Walls"}',
       '["420mm Extended Postpartum Coverage","High-Speed Absorption for Heavy Flow","Tender Cushioning to Reduce Perineal Pressure","Hypoallergenic Without Synthetic Dyes or Fragrance"]',
       TRUE);

    -- Sample order requests
    INSERT INTO order_requests
      (request_id, user_id, customer_name, customer_phone, customer_email, customer_address,
       product_id, product_name, product_pack_size, quantity, unit_price, discount_percent,
       total_estimate, message, status, admin_notes)
    SELECT 'AS-2026-000125', u.id, 'Ananya Deshmukh', '+91 98765 11223', 'customer@example.com',
           'Flat 402, Lotus Residency, Baner, Pune, Maharashtra 411045',
           p.id, p.name, p.pack_size, 4, p.final_price, p.discount_percent,
           p.final_price * 4, 'Please deliver morning time if possible.', 'Customer Contacted',
           'Called customer on 12 Sep. Address confirmed.'
    FROM users u CROSS JOIN products p
    WHERE u.email = 'customer@example.com' AND p.slug = 'baby-diapers-small-s';

    INSERT INTO order_requests
      (request_id, user_id, customer_name, customer_phone, customer_email, customer_address,
       product_id, product_name, product_pack_size, quantity, unit_price, discount_percent,
       total_estimate, message, status, admin_notes)
    SELECT 'AS-2026-000128', NULL, 'Meera Joshi', '+91 98220 99881', 'meera.joshi@gmail.com',
           'B-12, Green Acres Society, Kothrud, Pune - 411038',
           p.id, p.name, p.pack_size, 6, p.final_price, p.discount_percent,
           p.final_price * 6, 'Urgent requirement for local community distribution.', 'New Request', NULL
    FROM products p WHERE p.slug = 'ultra-thin-sanitary-pads-xl-plus';

    INSERT INTO order_requests
      (request_id, user_id, customer_name, customer_phone, customer_email, customer_address,
       product_id, product_name, product_pack_size, quantity, unit_price, discount_percent,
       total_estimate, message, status, admin_notes)
    SELECT 'AS-2026-000130', NULL, 'Dr. Kavita Nair (Aarogyam Clinic)', '+91 98111 22334', 'contact@aarogyamclinic.in',
           'Aarogyam Women and Child Clinic, Shivajinagar, Pune - 411005',
           p.id, p.name, p.pack_size, 20, p.final_price, p.discount_percent,
           p.final_price * 20, 'Monthly clinic supply request for maternity ward.', 'Confirmed',
           'Institutional order confirmed. Direct dispatch scheduled.'
    FROM products p WHERE p.slug = 'maternity-care-maxi-pads';

    -- Sample production logs
    INSERT INTO production_logs
      (employee_id, employee_name, product_id, product_name, production_date, quantity_produced,
       remarks, is_approved, approved_by, approved_at, inventory_updated)
    SELECT u.id, u.name, p.id, p.name, to_char(NOW(), 'YYYY-MM-DD'), 250,
           'Batch NB-904. Passed air-permeability and elastic tension QA.', TRUE, 'Aradhya Administrator', NOW(), TRUE
    FROM users u CROSS JOIN products p
    WHERE u.email = 'employee@aradhyacare.com' AND p.slug = 'baby-diapers-newborn-nb';

    INSERT INTO production_logs
      (employee_id, employee_name, product_id, product_name, production_date, quantity_produced,
       remarks, is_approved, approved_by, approved_at, inventory_updated)
    SELECT u.id, u.name, p.id, p.name, to_char(NOW() - INTERVAL '1 day', 'YYYY-MM-DD'), 500,
           'Batch XL-818. Organic cotton surface inspection 100% clear.', TRUE, 'Aradhya Administrator', NOW() - INTERVAL '12 hours', TRUE
    FROM users u CROSS JOIN products p
    WHERE u.email = 'employee@aradhyacare.com' AND p.slug = 'ultra-thin-sanitary-pads-xl-plus';

    -- Sample customer inquiries
    INSERT INTO customer_inquiries (name, email, phone, subject, message, status, admin_reply) VALUES
      ('Rohit Kulkarni', 'rohit.pharmacy@gmail.com', '+91 97654 32109',
       'Wholesale dealership inquiry',
       'We operate a chain of 14 medical stores. Would like to stock Aradhaya SoftCare products. Please share catalog and trade margins.',
       'New', NULL),
      ('Sneha Patil', 'sneha.p@outlook.com', '+91 98901 23456',
       'Maternity Pads sample request',
       'I am in my 8th month of pregnancy and wanted to know if Aradhaya maternity pads are chlorine-free.',
       'Resolved', 'Yes, our Maternity Care Maxi pads are 100% chlorine-free and gynecologically tested.');

    -- Initial audit entry
    INSERT INTO audit_logs (action, entity, entity_id, details, performed_by)
    VALUES ('SYSTEM_INITIALIZE', 'SYSTEM', '1',
            'Initial catalogue, products, categories, and company settings configured automatically.',
            'System Setup');
  END IF;
END $$;
`;

/*
 * Bootstrap gate: a single dedicated connection runs the schema bootstrap
 * once per process. The pool's query() is wrapped so that EVERY query first
 * awaits this gate — app queries can never run before the tables exist.
 * If the database is unreachable, the gate rejects silently and the real
 * query surfaces its own (clear) connection error.
 */
let bootstrapGate: Promise<void> | null = null;

function ensureBootstrapped(): Promise<void> {
  if (!bootstrapGate) {
    bootstrapGate = new Promise<void>((resolve, reject) => {
      const client = new Client({
        connectionString: databaseUrl,
        connectionTimeoutMillis: 15_000,
      });
      client
        .connect()
        .then(() => client.query(BOOTSTRAP_SQL))
        .then(() => {
          console.log("[db] Schema ready. Demo data seeded (only if database was empty).");
          resolve();
        })
        .catch((err) => {
          console.error("[db] Auto-bootstrap failed:", (err as Error).message);
          reject(err);
        })
        .finally(() => {
          client.end().catch(() => {});
        });
    });
    // Never let a bootstrap failure hang future queries forever:
    // after a failure, retry on the next query (idempotent SQL).
    bootstrapGate.catch(() => {
      bootstrapGate = null;
    });
  }
  return bootstrapGate;
}

const originalPoolQuery = pool.query.bind(pool);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pool as any).query = function gatedQuery(...args: any[]) {
  return ensureBootstrapped()
    .catch(() => {})
    .then(() => (originalPoolQuery as any)(...args));
};

export { pool };
export const db = drizzle(pool);
