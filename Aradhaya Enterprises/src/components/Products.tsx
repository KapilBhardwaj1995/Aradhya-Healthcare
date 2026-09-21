import { useMemo, useState } from "react";
import type { CatId, Lang, Product } from "../lib/data";
import { CATEGORIES, inr, LOW_STOCK_AT } from "../lib/data";
import type { Dict } from "../lib/i18n";
import { Reveal } from "../lib/motion";
import { IconAlert, IconSearch, IconStar } from "./icons";

interface Props {
  lang: Lang;
  t: Dict;
  products: Product[];
  onEnquire: (p: Product) => void;
}

export default function Products({ lang, t, products, onEnquire }: Props) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CatId | "all">("all");

  const counts = useMemo(() => {
    const map = new Map<CatId, number>();
    products.forEach((p) => map.set(p.cat, (map.get(p.cat) ?? 0) + 1));
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== "all" && p.cat !== cat) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.sku} ${p.badge} ${p.desc.en} ${p.desc.hi} ${CATEGORIES.find((c) => c.id === p.cat)?.label.en ?? ""} ${CATEGORIES.find((c) => c.id === p.cat)?.label.hi ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [products, query, cat]);

  return (
    <section id="products" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold">{t.products.title}</h2>
              <p className="mt-3 text-sm text-inksoft">{t.products.sub}</p>
            </div>
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">{t.products.search}</span>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-inksoft">
                <IconSearch className="w-4 h-4" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.products.search}
                className="w-full rounded-full border border-clay bg-card py-2.5 pl-10 pr-4 text-sm placeholder:text-inksoft/70 focus:border-rust focus:outline-none transition-colors"
              />
            </label>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <button
              onClick={() => setCat("all")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                cat === "all" ? "bg-cocoa text-cream shadow-[0_10px_22px_-12px_rgba(36,24,17,0.9)]" : "border border-clay bg-card text-ink/80 hover:border-rust hover:text-rust"
              }`}
            >
              {t.products.all} · {products.length}
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(cat === c.id ? "all" : c.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  cat === c.id ? "bg-cocoa text-cream shadow-[0_10px_22px_-12px_rgba(36,24,17,0.9)]" : "border border-clay bg-card text-ink/80 hover:border-rust hover:text-rust"
                }`}
              >
                {c.label[lang]} · {counts.get(c.id) ?? 0}
              </button>
            ))}
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="mt-14 rounded-2xl border border-dashed border-clay bg-card p-14 text-center">
            <p className="font-display text-xl font-semibold">{t.products.empty}</p>
            <button
              onClick={() => {
                setQuery("");
                setCat("all");
              }}
              className="mt-4 rounded-full bg-rust px-5 py-2.5 text-xs font-bold text-cream hover:bg-rustdeep transition-colors"
            >
              {t.products.clear}
            </button>
          </div>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => {
              const catLabel = CATEGORIES.find((c) => c.id === p.cat)?.label[lang] ?? "";
              const low = p.stock < LOW_STOCK_AT;
              return (
                <Reveal key={p.id} delay={(i % 3) * 90} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-clay bg-card shadow-[0_16px_40px_-28px_rgba(42,27,18,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(42,27,18,0.55)]">
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img
                        src={p.img}
                        alt={p.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.07]"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-[10px] font-bold tracking-wide text-ink shadow-sm">
                        {p.badge}
                      </span>
                      {low && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-alert px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-cream shadow-sm">
                          <IconAlert className="w-3 h-3" />
                          {t.products.low}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rust">{catLabel}</p>
                      <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug">{p.name}</h3>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-inksoft">
                        <IconStar className="w-3.5 h-3.5 text-rust" />
                        <span className="font-semibold text-ink/80">{p.rating.toFixed(1)}</span>
                        <span aria-hidden="true">•</span>
                        <span className="font-mono">SKU {p.sku}</span>
                      </p>
                      <p className="mt-3 text-[13px] leading-relaxed text-inksoft">{p.desc[lang]}</p>

                      <div className="mt-4 grid grid-cols-2 gap-2.5">
                        <div className="rounded-lg border border-leaf/25 bg-leafbg px-3 py-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-inksoft">{t.products.stock}</p>
                          <p className="mt-1 font-display text-xl font-semibold leading-none text-leaf tabular-nums">{inr(p.stock)}</p>
                          <p className="mt-1 text-[10px] text-inksoft">{t.products.units}</p>
                        </div>
                        <div className="rounded-lg border border-clay/70 bg-amberbg px-3 py-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-inksoft">{t.products.sold}</p>
                          <p className="mt-1 font-display text-xl font-semibold leading-none text-amber tabular-nums">{inr(p.sold)}</p>
                          <p className="mt-1 text-[10px] text-inksoft">{t.products.lifetime}</p>
                        </div>
                      </div>

                      <div className="mt-auto pt-5 flex items-end justify-between gap-3">
                        <div>
                          <p className="font-display text-2xl font-semibold leading-none">₹{inr(p.price)}</p>
                          <p className="mt-1.5 text-[11px] text-inksoft">
                            {t.products.mrp} <s>₹{inr(p.mrp)}</s>{" "}
                            <span className="font-bold text-leaf">
                              {t.products.save} ₹{inr(p.mrp - p.price)}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => onEnquire(p)}
                          className="rounded-full border border-clay bg-parch px-5 py-2.5 text-xs font-bold text-ink transition-all hover:bg-rust hover:border-rust hover:text-cream"
                        >
                          {t.products.enquire}
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
