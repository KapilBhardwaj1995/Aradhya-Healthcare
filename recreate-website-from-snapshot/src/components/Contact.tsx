import { useEffect, useRef, useState } from "react";
import type { Lang } from "../lib/data";
import { CONTACT } from "../lib/data";
import type { Dict } from "../lib/i18n";
import { Reveal, scrollToId } from "../lib/motion";
import { IconBox, IconCheck, IconMail, IconPhone, IconPin, IconSend, LogoMark } from "./icons";

export interface Draft {
  text: string;
  nonce: number;
  product: string;
}

interface Props {
  lang: Lang;
  t: Dict;
  draft: Draft | null;
}

export function Contact({ lang, t, draft }: Props) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; message?: string }>({});
  const [sentRef, setSentRef] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [draftedFor, setDraftedFor] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!draft) return;
    setMessage(draft.text);
    setSentRef(null);
    setDraftedFor(draft.product);
    setFlash(true);
    const t1 = window.setTimeout(() => setFlash(false), 1900);
    const t2 = window.setTimeout(() => taRef.current?.focus({ preventScroll: true }), 450);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [draft]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = t.contact.errName;
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\s/g, ""))) errs.mobile = t.contact.errMobile;
    if (message.trim().length < 8) errs.message = t.contact.errMsg;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSentRef(`AH-${String(Date.now()).slice(-6)}`);
    setName("");
    setMobile("");
    setEmail("");
    setMessage("");
    setDraftedFor(null);
  };

  const field =
    "w-full rounded-lg border bg-cream/60 px-4 py-3 text-sm placeholder:text-inksoft/60 focus:outline-none focus:border-rust transition-colors";

  return (
    <section id="contact" className="scroll-mt-20 bg-parch border-t border-clay/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-10 items-start">
        {/* form card */}
        <Reveal>
          <div
            ref={cardRef}
            className={`rounded-2xl border border-clay bg-card p-6 sm:p-9 shadow-[0_30px_70px_-45px_rgba(42,27,18,0.6)] ${flash ? "flash-ring" : ""}`}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">{t.contact.title}</h2>
            <p className="mt-2 text-sm text-inksoft">{t.contact.sub}</p>

            {sentRef ? (
              <div className="mt-8 rounded-xl border border-leaf/30 bg-leafbg p-7 text-center">
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-leaf text-cream">
                  <IconCheck className="w-6 h-6" />
                </span>
                <p className="mt-4 font-display text-2xl font-semibold text-leaf">{t.contact.sentTitle}</p>
                <p className="mt-2 text-sm text-inksoft">
                  {t.contact.sentBody} <span className="font-mono font-bold text-ink">{sentRef}</span>
                </p>
                <button
                  onClick={() => setSentRef(null)}
                  className="mt-6 rounded-full border border-leaf/40 bg-card px-6 py-2.5 text-xs font-bold text-leaf hover:bg-leaf hover:text-cream transition-colors"
                >
                  {t.contact.again}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-7 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.contact.name}
                      aria-label={t.contact.name}
                      className={`${field} ${errors.name ? "border-alert" : "border-clay"}`}
                    />
                    {errors.name && <p className="mt-1.5 text-[11px] font-semibold text-alert">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder={t.contact.mobile}
                      aria-label={t.contact.mobile}
                      inputMode="numeric"
                      className={`${field} ${errors.mobile ? "border-alert" : "border-clay"}`}
                    />
                    {errors.mobile && <p className="mt-1.5 text-[11px] font-semibold text-alert">{errors.mobile}</p>}
                  </div>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.contact.email}
                  aria-label={t.contact.email}
                  type="email"
                  className={`${field} border-clay`}
                />
                <div>
                  <textarea
                    ref={taRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.contact.message}
                    aria-label={t.contact.message}
                    rows={5}
                    className={`${field} resize-y ${errors.message ? "border-alert" : "border-clay"}`}
                  />
                  {errors.message && <p className="mt-1.5 text-[11px] font-semibold text-alert">{errors.message}</p>}
                  {draftedFor && !errors.message && (
                    <p className="mt-1.5 text-[11px] font-semibold text-rust">
                      {t.contact.drafted} {draftedFor}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-rust px-7 py-3 text-sm font-bold text-cream shadow-[0_14px_30px_-14px_rgba(192,81,28,0.8)] hover:bg-rustdeep hover:-translate-y-0.5 transition-all"
                >
                  <IconSend className="w-4 h-4" />
                  {t.contact.send}
                </button>
                <p className="text-[11px] text-inksoft pt-1">{t.contact.note}</p>
              </form>
            )}
          </div>
        </Reveal>

        {/* info column */}
        <div className="space-y-6">
          <Reveal delay={100}>
            <div className="rounded-2xl border border-clay bg-card p-6 sm:p-8">
              <h3 className="font-display text-2xl font-semibold">{t.contact.infoTitle}</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="mt-0.5 text-rust">
                    <IconPhone className="w-4 h-4" />
                  </span>
                  <p>
                    <a href={CONTACT.phoneHref} className="font-bold hover:text-rust transition-colors">
                      {CONTACT.phone}
                    </a>{" "}
                    <span className="text-inksoft">{t.contact.phoneNote}</span>
                    <span className="block text-inksoft">{t.contact.toll}</span>
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-rust">
                    <IconMail className="w-4 h-4" />
                  </span>
                  <p>
                    <a href={`mailto:${CONTACT.email}`} className="font-bold hover:text-rust transition-colors">
                      {CONTACT.email}
                    </a>
                    <span className="block text-inksoft">
                      {t.contact.wholesale}{" "}
                      <a href={`mailto:${CONTACT.wholesale}`} className="font-semibold hover:text-rust transition-colors">
                        {CONTACT.wholesale}
                      </a>
                    </span>
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-rust">
                    <IconPin className="w-4 h-4" />
                  </span>
                  <p className="text-inksoft leading-relaxed">{CONTACT.address[lang]}</p>
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Inquiry — Aradhya Healthcare")}`}
                  className="inline-flex items-center gap-2 rounded-full bg-cocoa px-6 py-2.5 text-xs font-bold text-cream hover:bg-rust transition-colors"
                >
                  <IconMail className="w-3.5 h-3.5" />
                  {t.contact.emailBtn}
                </a>
                <a
                  href={CONTACT.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-clay bg-card px-6 py-2.5 text-xs font-bold text-ink hover:border-rust hover:text-rust transition-colors"
                >
                  <IconPhone className="w-3.5 h-3.5" />
                  {t.contact.callBtn}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="rounded-2xl border border-clay/80 bg-amberbg p-6 sm:p-7">
              <p className="flex items-center gap-2 font-display text-lg font-semibold">
                <IconBox className="w-5 h-5 text-rust" />
                {t.contact.dealerTitle}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-inksoft">{t.contact.dealerBody}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer({ lang, t }: { lang: Lang; t: Dict }) {
  const links: { id: string; label: string }[] = [
    { id: "products", label: t.nav.products },
    { id: "stock", label: t.nav.stock },
    { id: "about", label: t.nav.about },
    { id: "contact", label: t.nav.contact },
  ];
  return (
    <footer className="bg-cocoa text-cream/85">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid md:grid-cols-[1.2fr_0.8fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="w-11 h-11" />
            <div>
              <p className="font-display text-xl font-semibold text-cream">{t.top.brand}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-cream/60">
                {lang === "en" ? "Baby & Women Care" : "बेबी एंड वूमेन केयर"}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">{t.footer.blurb}</p>
          <p className="mt-5 inline-flex rounded-full border border-cream/20 px-4 py-1.5 text-[11px] tracking-wide text-cream/70">
            {t.footer.tag}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-rust">{t.footer.links}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.id}>
                <button onClick={() => scrollToId(l.id)} className="hover:text-cream transition-colors link-sweep">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-rust">{t.footer.contactT}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2.5 hover:text-cream transition-colors">
                <IconPhone className="w-4 h-4 text-rust" /> {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2.5 hover:text-cream transition-colors">
                <IconMail className="w-4 h-4 text-rust" /> {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.wholesale}`} className="inline-flex items-center gap-2.5 hover:text-cream transition-colors">
                <IconBox className="w-4 h-4 text-rust" /> {CONTACT.wholesale}
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-cream/70">
              <IconPin className="w-4 h-4 mt-0.5 text-rust" /> {CONTACT.address[lang]}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-7xl px-4 sm:px-6 py-5 text-[11px] text-cream/50">{t.footer.rights}</p>
      </div>
    </footer>
  );
}
