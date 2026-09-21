import { useCallback, useEffect, useMemo, useState } from "react";
import About from "./components/About";
import AdminModal from "./components/AdminModal";
import { Contact, Footer, type Draft } from "./components/Contact";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import StockSales from "./components/StockSales";
import type { Lang, Product } from "./lib/data";
import { PRODUCTS } from "./lib/data";
import { STR } from "./lib/i18n";
import { scrollToId } from "./lib/motion";

const LS_KEY = "aradhya-inventory-v1";

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return PRODUCTS;
    const saved = JSON.parse(raw) as { id: string; stock: number; sold: number }[];
    return PRODUCTS.map((p) => {
      const s = saved.find((x) => x.id === p.id);
      return s ? { ...p, stock: Math.max(0, s.stock), sold: Math.max(0, s.sold) } : p;
    });
  } catch {
    return PRODUCTS;
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [adminOpen, setAdminOpen] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);

  const t = STR[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify(products.map((p) => ({ id: p.id, stock: p.stock, sold: p.sold }))),
      );
    } catch {
      /* storage unavailable — demo continues in memory */
    }
  }, [products]);

  const patchProduct = useCallback((id: string, patch: Partial<Pick<Product, "stock" | "sold">>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const resetProducts = useCallback(() => setProducts(PRODUCTS), []);

  const handleEnquire = useCallback(
    (p: Product) => {
      setDraft({ text: STR[lang].enquireMsg(p.name, p.sku), nonce: Date.now(), product: p.name });
      scrollToId("contact");
    },
    [lang],
  );

  const noise = useMemo(
    () => (
      <div
        aria-hidden="true"
        className="noise pointer-events-none fixed inset-0 z-[60] opacity-[0.045] mix-blend-multiply"
      />
    ),
    [],
  );

  return (
    <div className="min-h-screen bg-cream text-ink font-body overflow-x-clip">
      {noise}
      <Header
        lang={lang}
        t={t}
        onToggleLang={() => setLang((l) => (l === "en" ? "hi" : "en"))}
        onAdmin={() => setAdminOpen(true)}
      />
      <main>
        <Hero t={t} products={products} />
        <Products lang={lang} t={t} products={products} onEnquire={handleEnquire} />
        <StockSales lang={lang} t={t} products={products} />
        <About t={t} />
        <Contact lang={lang} t={t} draft={draft} />
      </main>
      <Footer lang={lang} t={t} />
      <AdminModal
        open={adminOpen}
        lang={lang}
        t={t}
        products={products}
        onChange={patchProduct}
        onReset={resetProducts}
        onClose={() => setAdminOpen(false)}
      />
    </div>
  );
}
