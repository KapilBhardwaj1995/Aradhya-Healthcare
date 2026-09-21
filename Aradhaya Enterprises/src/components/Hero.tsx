import type { Product } from "../lib/data";
import { CATEGORIES, HERO_IMG, inr, LOW_STOCK_AT } from "../lib/data";
import type { Dict } from "../lib/i18n";
import { CountUp, Reveal, scrollToId } from "../lib/motion";
import { IconArrowDown, IconCheck, IconDiamond } from "./icons";

interface Props {
  t: Dict;
  products: Product[];
}

export default function Hero({ t, products }: Props) {
  const available = products.reduce((s, p) => s + p.stock, 0);
  const sold = products.reduce((s, p) => s + p.sold, 0);
  const low = products.filter((p) => p.stock < LOW_STOCK_AT).length;

  const tiles = [
    {
      label: t.inv.productsLive,
      sub: `${CATEGORIES.length} ${t.inv.categories}`,
      value: products.length,
      bg: "bg-amberbg border-clay/70",
      fg: "text-ink",
    },
    {
      label: t.inv.available,
      sub: t.inv.warehouse,
      value: available,
      bg: "bg-leafbg border-leaf/25",
      fg: "text-leaf",
    },
    {
      label: t.inv.sold,
      sub: t.inv.lifetime,
      value: sold,
      bg: "bg-parch border-clay/70",
      fg: "text-rust",
    },
    {
      label: t.inv.low,
      sub: t.inv.auto,
      value: low,
      bg: "bg-alertbg border-alert/25",
      fg: "text-alert",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        {/* soft radial warmth behind hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-40 w-[42rem] h-[42rem] rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, rgba(192,81,28,0.14), transparent 70%)" }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-16 lg:pt-16 grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-start">
          {/* left column */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-clay bg-card px-4 py-1.5 text-xs font-semibold tracking-wide text-rust">
                <IconDiamond className="w-2.5 h-2.5" />
                {t.hero.badge}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 font-display text-[2.6rem] leading-[1.04] sm:text-6xl xl:text-[4.4rem] font-semibold">
                {t.hero.title1}
                <span className="block italic font-medium text-rust">{t.hero.title2}</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <figure className="mt-8 max-w-xl rounded-2xl overflow-hidden border border-clay bg-card shadow-[0_24px_60px_-30px_rgba(42,27,18,0.5)]">
                <div className="overflow-hidden aspect-[16/9]">
                  <img
                    src={HERO_IMG}
                    alt={t.hero.caption}
                    className="kenburns w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs sm:text-sm text-inksoft border-t border-clay/70 bg-card">
                  <strong className="text-ink font-semibold">Aradhya CloudSoft™</strong>
                  {" — "}
                  {t.hero.caption.split("— ")[1]}
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={220}>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-inksoft">{t.hero.para}</p>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => scrollToId("products")}
                  className="inline-flex items-center gap-2 rounded-full bg-rust px-6 py-3 text-sm font-bold text-cream shadow-[0_14px_30px_-14px_rgba(192,81,28,0.8)] hover:bg-rustdeep hover:-translate-y-0.5 transition-all"
                >
                  {t.hero.cta1}
                  <IconArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToId("contact")}
                  className="inline-flex items-center gap-2 rounded-full border border-clay bg-card px-6 py-3 text-sm font-bold text-ink hover:border-rust hover:text-rust transition-colors"
                >
                  {t.hero.cta2}
                </button>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-ink/75">
                {t.hero.checks.map((c) => (
                  <li key={c} className="inline-flex items-center gap-1.5">
                    <IconCheck className="w-3.5 h-3.5 text-leaf" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* right column — live inventory card */}
          <Reveal delay={140} className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-clay bg-card p-6 sm:p-7 shadow-[0_30px_70px_-40px_rgba(42,27,18,0.55)]">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-rust">
                <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-rust" />
                {t.inv.live}
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-[2.1rem] font-semibold">{t.inv.title}</h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {tiles.map((tile) => (
                  <div key={tile.label} className={`rounded-xl border p-4 ${tile.bg}`}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-inksoft">{tile.label}</p>
                    <p className={`mt-1.5 font-display text-[1.65rem] leading-none font-semibold ${tile.fg}`}>
                      <CountUp value={tile.value} format={inr} />
                    </p>
                    <p className="mt-1.5 text-[11px] text-inksoft">{tile.sub}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 flex items-center justify-between gap-3 border-t border-clay/70 pt-4 text-[11px] text-inksoft">
                <span className="inline-flex items-center gap-1.5">
                  <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-leaf" />
                  {t.inv.synced}
                </span>
                <span className="text-right">{t.inv.note}</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* marquee band */}
      <div className="bg-rust text-cream overflow-hidden py-3 border-y border-rustdeep/60" aria-hidden="true">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex gap-10">
              {t.marquee.map((m) => (
                <span key={`${dup}-${m}`} className="inline-flex items-center gap-10 text-xs font-bold uppercase tracking-[0.22em]">
                  {m}
                  <IconDiamond className="w-2 h-2 text-cream/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
