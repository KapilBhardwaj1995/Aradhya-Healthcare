import { ABOUT_IMG, ABOUT_IMG_2 } from "../lib/data";
import type { Dict } from "../lib/i18n";
import { Reveal } from "../lib/motion";
import { IconFactory, IconFlask, IconShield, IconTruck } from "./icons";

interface Props {
  t: Dict;
}

const POINT_ICONS = [IconFactory, IconFlask, IconShield, IconTruck];

export default function About({ t }: Props) {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16">
          {/* sticky story column */}
          <div className="lg:sticky lg:top-24 self-start">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-rust">{t.about.kicker}</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold leading-[1.08]">{t.about.title}</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-inksoft">{t.about.p1}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-inksoft">{t.about.p2}</p>
            </Reveal>

            <Reveal delay={140}>
              <figure className="relative mt-8 max-w-md">
                <div className="overflow-hidden rounded-2xl border border-clay shadow-[0_24px_60px_-32px_rgba(42,27,18,0.55)]">
                  <img
                    src={ABOUT_IMG}
                    alt={t.about.imgCap}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-[1.6s] hover:scale-105"
                  />
                </div>
                <div className="hidden sm:block absolute -bottom-10 -right-6 w-40 rotate-3 rounded-xl border border-clay bg-card p-2 shadow-[0_18px_40px_-20px_rgba(42,27,18,0.5)] transition-transform duration-500 hover:rotate-0">
                  <img src={ABOUT_IMG_2} alt="" loading="lazy" className="rounded-lg w-full aspect-square object-cover" />
                </div>
                <figcaption className="mt-3 text-xs text-inksoft">{t.about.imgCap}</figcaption>
              </figure>
            </Reveal>
          </div>

          {/* info points */}
          <div>
            <ul>
              {t.about.points.map((p, i) => {
                const Icon = POINT_ICONS[i % POINT_ICONS.length];
                return (
                  <Reveal key={p.t} delay={i * 90}>
                    <li className="group flex gap-5 border-t border-clay py-6 first:border-t-0 first:pt-0">
                      <span className="mt-1 text-rust transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110">
                        <Icon className="w-7 h-7" />
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-semibold">{p.t}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-inksoft">{p.d}</p>
                      </div>
                      <span className="ml-auto font-display text-2xl text-clay select-none">0{i + 1}</span>
                    </li>
                  </Reveal>
                );
              })}
            </ul>

            {/* timeline */}
            <Reveal>
              <h3 className="mt-14 text-[11px] font-bold uppercase tracking-[0.24em] text-rust">{t.about.tlTitle}</h3>
            </Reveal>
            <div className="relative mt-6">
              <div className="hidden md:block absolute left-0 right-0 top-[7px] h-px bg-clay" aria-hidden="true" />
              <ol className="grid md:grid-cols-5 gap-8 md:gap-5">
                {t.about.timeline.map((m, i) => (
                  <Reveal key={m.y} delay={i * 100}>
                    <li className="relative">
                      <span className="block w-3.5 h-3.5 rounded-full border-2 border-rust bg-cream" aria-hidden="true" />
                      <p className="mt-3 font-display text-2xl font-semibold text-rust">{m.y}</p>
                      <p className="mt-1 text-sm font-bold leading-snug">{m.t}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-inksoft">{m.d}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
