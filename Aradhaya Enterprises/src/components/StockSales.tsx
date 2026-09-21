import type { Lang, Product } from "../lib/data";
import { CATEGORIES, inr, LOW_STOCK_AT } from "../lib/data";
import type { Dict } from "../lib/i18n";
import { CountUp, Reveal, useInView } from "../lib/motion";
import { IconAlert, IconChart, IconCheck } from "./icons";

interface Props {
  lang: Lang;
  t: Dict;
  products: Product[];
}

export default function StockSales({ lang, t, products }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const available = products.reduce((s, p) => s + p.stock, 0);
  const sold = products.reduce((s, p) => s + p.sold, 0);
  const sellThrough = ((sold / (sold + available)) * 100).toFixed(1);
  const avgRating = (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1);
  const maxVal = Math.max(...CATEGORIES.map((c) => products.filter((p) => p.cat === c.id).reduce((s, p) => s + p.stock, 0)));

  const rows = CATEGORIES.map((c) => {
    const items = products.filter((p) => p.cat === c.id);
    return {
      id: c.id,
      label: c.label[lang],
      available: items.reduce((s, p) => s + p.stock, 0),
      sold: items.reduce((s, p) => s + p.sold, 0),
    };
  });

  const lowItems = products.filter((p) => p.stock < LOW_STOCK_AT);

  const stats = [
    { k: t.stock.sellThrough, v: `${sellThrough}%` },
    { k: t.stock.avgRating, v: avgRating },
    { k: t.stock.liveSkus, v: String(products.length) },
    { k: t.stock.categories, v: String(CATEGORIES.length) },
  ];

  return (
    <section id="stock" className="bg-parch border-b border-clay/70 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-rust flex items-center gap-2">
                <IconChart className="w-4 h-4" />
                {t.stock.kicker}
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">{t.stock.title}</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-inksoft">{t.stock.sub}</p>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4">
              {stats.map((s) => (
                <div key={s.k}>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-inksoft">{s.k}</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-rust">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-stretch">
          {/* category bars */}
          <Reveal className="h-full">
            <div ref={ref} className="rounded-2xl border border-clay bg-card p-6 sm:p-8 h-full">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-inksoft">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-clay" /> {t.stock.availableLegend}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-rust" /> {t.stock.soldLegend}
                </span>
              </div>

              <div className="mt-7 space-y-7">
                {rows.map((r, i) => (
                  <div key={r.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-display text-lg font-semibold">{r.label}</p>
                      <p className="text-xs text-inksoft tabular-nums">
                        {inr(r.available)} · {inr(r.sold)}
                      </p>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-3 rounded-full bg-cream border border-clay/60 overflow-hidden">
                        <div
                          className="bar-grow h-full rounded-full bg-clay"
                          style={{ width: inView ? `${(r.available / maxVal) * 100}%` : "0%", transitionDelay: `${i * 110}ms` }}
                        />
                      </div>
                      <div className="h-3 rounded-full bg-cream border border-clay/60 overflow-hidden">
                        <div
                          className="bar-grow h-full rounded-full bg-rust"
                          style={{ width: inView ? `${(r.sold / maxVal) * 100}%` : "0%", transitionDelay: `${i * 110 + 60}ms` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 border-t border-clay/70 pt-4 text-xs text-inksoft">
                {lang === "en"
                  ? "Bars compare warehouse stock (sand) against lifetime units sold (rust) per category."
                  : "बार प्रति श्रेणी वेयरहाउस स्टॉक (रेत रंग) और लाइफटाइम बिकी यूनिट (रस्ट) की तुलना करते हैं।"}
              </p>
            </div>
          </Reveal>

          {/* low stock alerts */}
          <Reveal delay={120} className="h-full">
            <div className="rounded-2xl border border-alert/30 bg-alertbg p-6 sm:p-8 h-full flex flex-col">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-alert">
                <IconAlert className="w-4 h-4" />
                {t.stock.alertsTitle}
              </p>
              <p className="mt-2 text-xs text-inksoft">{t.stock.alertsSub}</p>

              <ul className="mt-6 space-y-4">
                {lowItems.map((p) => (
                  <li key={p.id} className="rounded-xl border border-alert/25 bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm leading-snug">{p.name}</p>
                        <p className="mt-1 font-mono text-[11px] text-inksoft">{p.sku}</p>
                      </div>
                      <p className="font-display text-2xl font-semibold text-alert tabular-nums">
                        <CountUp value={p.stock} format={inr} />
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-inksoft">{t.products.units}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-alert px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cream">
                        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-cream" />
                        {t.stock.restock}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-6 flex items-center gap-2 text-xs font-semibold text-leaf">
                <IconCheck className="w-4 h-4" />
                {t.stock.healthy}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
