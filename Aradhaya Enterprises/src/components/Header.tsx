import { useEffect, useState } from "react";
import type { Lang } from "../lib/data";
import { CONTACT } from "../lib/data";
import type { Dict } from "../lib/i18n";
import { scrollToId } from "../lib/motion";
import { IconLock, IconMail, IconMenu, IconClose, IconPhone, LogoMark } from "./icons";

interface Props {
  lang: Lang;
  t: Dict;
  onToggleLang: () => void;
  onAdmin: () => void;
}

const LINKS: { id: string; key: "products" | "stock" | "about" | "contact" }[] = [
  { id: "products", key: "products" },
  { id: "stock", key: "stock" },
  { id: "about", key: "about" },
  { id: "contact", key: "contact" },
];

export default function Header({ lang, t, onToggleLang, onAdmin }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((l) => l.id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      {/* top info bar */}
      <div className="bg-cocoa text-cream/90 text-[11px] tracking-wide">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex flex-wrap items-center gap-x-5 gap-y-1 justify-between">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 uppercase tracking-[0.14em] font-semibold">
            <span>{t.top.brand}</span>
            <span className="text-rust">•</span>
            <span>{t.top.est}</span>
            <span className="text-rust hidden sm:inline">•</span>
            <span className="hidden sm:inline">{t.top.iso}</span>
            <span className="text-rust hidden md:inline">•</span>
            <span className="hidden md:inline normal-case tracking-wide font-medium text-cream/70">{t.top.made}</span>
          </p>
          <p className="flex items-center gap-4">
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1.5 hover:text-cream transition-colors">
              <IconMail className="w-3.5 h-3.5" />
              {CONTACT.email}
            </a>
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-1.5 hover:text-cream transition-colors">
              <IconPhone className="w-3.5 h-3.5" />
              {CONTACT.phone}
            </a>
          </p>
        </div>
      </div>

      {/* sticky nav */}
      <div
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled ? "bg-cream/95 backdrop-blur border-clay shadow-[0_10px_30px_-18px_rgba(42,27,18,0.45)]" : "bg-cream border-clay/60"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
            className="flex items-center gap-3 text-left group"
            aria-label="Aradhya Healthcare — back to top"
          >
            <span className="transition-transform duration-500 group-hover:-rotate-6">
              <LogoMark className="w-10 h-10" />
            </span>
            <span>
              <span className="block font-display font-semibold text-lg leading-tight">{t.top.brand}</span>
              <span className="block text-[11px] text-inksoft tracking-[0.18em] uppercase">
                {lang === "en" ? "Baby & Women Care" : "बेबी एंड वूमेन केयर"}
              </span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-8 mx-auto text-sm font-semibold text-ink/80">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`link-sweep hover:text-rust transition-colors ${active === l.id ? "active text-rust" : ""}`}
              >
                {t.nav[l.key]}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 ml-auto lg:ml-0">
            <button
              onClick={onToggleLang}
              className="h-9 px-3.5 rounded-full border border-clay bg-card text-sm font-bold text-ink hover:border-rust hover:text-rust transition-colors"
              aria-label={lang === "en" ? "Switch to Hindi" : "Switch to English"}
            >
              {t.nav.langBtn}
            </button>
            <button
              onClick={onAdmin}
              className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-full bg-cocoa text-cream text-sm font-semibold hover:bg-rust transition-colors"
            >
              <IconLock className="w-3.5 h-3.5" />
              {t.nav.admin}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-full border border-clay bg-card text-ink"
              aria-label={t.nav.menu}
              aria-expanded={open}
            >
              {open ? <IconClose className="w-4 h-4" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-400 ${
            open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          } border-t border-clay/60 bg-cream`}
        >
          <nav className="px-4 sm:px-6 py-4 flex flex-col gap-1 text-sm font-semibold">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="text-left py-2.5 border-b border-clay/50 hover:text-rust transition-colors"
              >
                {t.nav[l.key]}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                onAdmin();
              }}
              className="mt-3 inline-flex items-center justify-center gap-2 h-10 rounded-full bg-cocoa text-cream"
            >
              <IconLock className="w-3.5 h-3.5" />
              {t.nav.admin}
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
