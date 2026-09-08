import { useEffect, useState } from "react";
import type { Lang, Product } from "../lib/data";
import { inr } from "../lib/data";
import type { Dict } from "../lib/i18n";
import { IconClose, IconLock } from "./icons";

interface Props {
  open: boolean;
  lang: Lang;
  t: Dict;
  products: Product[];
  onChange: (id: string, patch: Partial<Pick<Product, "stock" | "sold">>) => void;
  onReset: () => void;
  onClose: () => void;
}

const PIN = "2018";

export default function AdminModal({ open, t, products, onChange, onReset, onClose }: Props) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setPin("");
      setUnlocked(false);
      setWrong(false);
    }
  }, [open]);

  if (!open) return null;

  const tryUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === PIN) {
      setUnlocked(true);
      setWrong(false);
    } else {
      setWrong(true);
      window.setTimeout(() => setWrong(false), 500);
    }
  };

  const num = (v: string) => {
    const n = parseInt(v.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t.admin.title}>
      <button className="absolute inset-0 bg-cocoa/70 cursor-default" onClick={onClose} aria-label={t.admin.close} />
      <div className={`relative w-full max-w-2xl max-h-[86vh] overflow-hidden rounded-2xl border border-clay bg-card shadow-2xl ${wrong ? "shake" : ""}`}>
        <div className="flex items-start justify-between gap-4 border-b border-clay bg-parch px-6 py-5">
          <div>
            <p className="flex items-center gap-2 font-display text-xl font-semibold">
              <IconLock className="w-4 h-4 text-rust" />
              {t.admin.title}
            </p>
            <p className="mt-1 text-xs text-inksoft">{t.admin.sub}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-clay bg-card p-2 text-ink hover:border-rust hover:text-rust transition-colors"
            aria-label={t.admin.close}
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {!unlocked ? (
          <form onSubmit={tryUnlock} className="px-6 py-10 text-center">
            <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-inksoft">{t.admin.pin}</label>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={t.admin.pinPh}
              type="password"
              inputMode="numeric"
              autoFocus
              className={`mx-auto mt-3 w-48 rounded-xl border bg-cream/60 px-4 py-3 text-center font-mono text-lg tracking-[0.4em] focus:outline-none focus:border-rust transition-colors ${
                wrong ? "border-alert" : "border-clay"
              }`}
            />
            {wrong && <p className="mt-2 text-xs font-semibold text-alert">{t.admin.wrong}</p>}
            <p className="mt-2 text-[11px] text-inksoft">{t.admin.hint}</p>
            <button
              type="submit"
              className="mt-6 rounded-full bg-rust px-8 py-3 text-sm font-bold text-cream hover:bg-rustdeep transition-colors"
            >
              {t.admin.unlock}
            </button>
          </form>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto thin-scroll px-6 py-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-[0.16em] text-inksoft">
                  <th className="pb-3 pr-4">{t.admin.product}</th>
                  <th className="pb-3 pr-3 w-32">{t.admin.stockH}</th>
                  <th className="pb-3 w-32">{t.admin.soldH}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-clay/60">
                    <td className="py-3 pr-4">
                      <p className="font-semibold leading-snug">{p.name}</p>
                      <p className="font-mono text-[11px] text-inksoft">{p.sku}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <input
                        value={p.stock}
                        onChange={(e) => onChange(p.id, { stock: num(e.target.value) })}
                        inputMode="numeric"
                        aria-label={`${t.admin.stockH} — ${p.name}`}
                        className="w-full rounded-lg border border-clay bg-cream/60 px-3 py-2 font-mono text-xs tabular-nums focus:border-rust focus:outline-none"
                      />
                    </td>
                    <td className="py-3">
                      <input
                        value={p.sold}
                        onChange={(e) => onChange(p.id, { sold: num(e.target.value) })}
                        inputMode="numeric"
                        aria-label={`${t.admin.soldH} — ${p.name}`}
                        className="w-full rounded-lg border border-clay bg-cream/60 px-3 py-2 font-mono text-xs tabular-nums focus:border-rust focus:outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-5 flex items-center justify-between border-t border-clay pt-4 pb-1">
              <p className="text-[11px] text-inksoft">
                {t.stock.availableLegend}: <strong className="text-leaf">{inr(products.reduce((s, p) => s + p.stock, 0))}</strong> · {t.stock.soldLegend}:{" "}
                <strong className="text-rust">{inr(products.reduce((s, p) => s + p.sold, 0))}</strong>
              </p>
              <button
                onClick={onReset}
                className="rounded-full border border-clay bg-card px-5 py-2 text-xs font-bold text-ink hover:border-alert hover:text-alert transition-colors"
              >
                {t.admin.reset}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
