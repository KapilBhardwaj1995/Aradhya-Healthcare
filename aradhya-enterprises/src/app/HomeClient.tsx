"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/ProductCard";
import {
  Baby,
  Sparkles,
  Flower2,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Award,
  Layers,
  Droplet,
} from "lucide-react";

interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

interface Product {
  id: number;
  slug: string;
  sku: string;
  name: string;
  categorySlug: string;
  description: string;
  packSize: string;
  originalPrice: string;
  discountPercent: number;
  finalPrice: string;
  images: string;
  isFeatured?: boolean;
}

interface HomeClientProps {
  categories: Category[];
  products: Product[];
}

export default function HomeClient({ categories, products }: HomeClientProps) {
  const { t, language } = useLanguage();

  const categoryIcons: Record<string, React.ReactNode> = {
    "baby-diapers": <Baby className="w-6 h-6 text-[#1e2b5e]" />,
    "sanitary-pads": <Sparkles className="w-6 h-6 text-rose-500" />,
    "panty-liners": <Flower2 className="w-6 h-6 text-[#b8892e]" />,
    "maternity-pads": <HeartHandshake className="w-6 h-6 text-rose-500" />,
  };

  const categoryNamesHi: Record<string, string> = {
    "baby-diapers": "बेबी डायपर",
    "sanitary-pads": "सेनेटरी पैड्स",
    "panty-liners": "पैंटी लाइनर्स",
    "maternity-pads": "मातृत्व पैड्स",
  };

  const getCategoryName = (cat: Category) => {
    if (language === "hi" && categoryNamesHi[cat.slug]) {
      return categoryNamesHi[cat.slug];
    }
    return cat.name;
  };

  return (
    <main className="flex-1">
      {/* ============ PREMIUM HERO SECTION ============ */}
      <section className="relative overflow-hidden hero-cream py-14 sm:py-20 lg:py-24 border-b border-[#efe7d2]/70">
        {/* Decorative floating gold accents */}
        <div className="pointer-events-none absolute top-16 right-[8%] w-20 h-20 rounded-full bg-[#d4a43c]/10 blur-2xl"></div>
        <div className="pointer-events-none absolute bottom-10 left-[5%] w-28 h-28 rounded-full bg-rose-300/10 blur-3xl"></div>
        <Sparkles className="pointer-events-none absolute top-24 right-[14%] w-5 h-5 text-[#d4a43c]/40" />
        <Sparkles className="pointer-events-none absolute top-40 left-[3%] w-4 h-4 text-[#d4a43c]/30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Brand Badge Pill with official logo mark */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#e8ecf7] shadow-md shadow-[#1e2b5e]/5">
                <img src="/images/logo-mark.png" alt="ARADHAYA mark" className="h-7 w-7 object-contain" />
                <span className="font-extrabold text-sm tracking-tight text-[#1e2b5e]">
                  {t.brandName}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#d4a43c]"></span>
                <span className="text-xs font-semibold text-[#b8892e]">{t.brandSub}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#141d42] tracking-tight leading-[1.08]">
                {t.heroHeadingLine1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8892e] via-[#d4a43c] to-rose-500">
                  {t.heroHeadingLine2}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#1e2b5e] hover:bg-[#141d42] text-white font-bold text-sm shadow-lg shadow-[#1e2b5e]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <span>{t.btnExploreProducts}</span>
                  <ArrowRight className="w-4 h-4 text-[#d4a43c] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#1e2b5e] font-bold text-sm border border-[#dbe2f5] shadow-2xs hover:shadow hover:border-[#d4a43c] hover:-translate-y-0.5 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-[#b8892e]" />
                  <span>{t.btnContactUs}</span>
                </Link>
              </div>

              {/* Trust Highlights */}
              <div className="pt-6 border-t border-[#e8dfc6] grid grid-cols-3 gap-3 sm:gap-4 text-xs text-slate-700">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/85 border border-[#e8ecf7] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-[#eef1fa] text-[#1e2b5e] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#141d42]">{t.trustSkinSafe}</p>
                    <p className="text-[11px] text-slate-500">{t.trustSkinSafeSub}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/85 border border-[#efe3c4] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-[#faf3df] text-[#b8892e] flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#141d42]">{t.trustJapaneseCore}</p>
                    <p className="text-[11px] text-slate-500">{t.trustJapaneseCoreSub}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/85 border border-[#d3f0e5] shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#141d42]">{t.trustDirect}</p>
                    <p className="text-[11px] text-slate-500">{t.trustDirectSub}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card with floating badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-[#1e2b5e]/15 border-4 border-white ring-1 ring-[#d4a43c]/30">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/images/hero-family.jpg"
                    alt="Aradhya SoftCare mother and infant care"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141d42]/45 via-transparent to-transparent" />
                </div>

                {/* Floating quality badge (top-left) */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-3 py-2 border border-[#efe3c4]">
                  <div className="w-8 h-8 rounded-xl gold-gradient text-[#141d42] flex items-center justify-center">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold text-[#141d42]">100% Skin Safe</p>
                    <p className="text-[10px] text-[#b8892e] font-bold">Chlorine-Free</p>
                  </div>
                </div>

                {/* Floating protection badge (top-right) */}
                <div className="absolute top-4 right-4 bg-[#141d42]/85 backdrop-blur-md text-white rounded-2xl px-3 py-2 shadow-xl border border-white/15 text-center">
                  <p className="text-sm font-extrabold text-[#d4a43c] leading-none">12 Hrs</p>
                  <p className="text-[9px] font-semibold text-slate-200 mt-0.5">Protection</p>
                </div>

                {/* Floating Brand Banner (bottom) */}
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-[#e8ecf7] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#e8ecf7] shadow-2xs flex items-center justify-center">
                      <img src="/images/logo-mark.png" alt="ARADHAYA mark" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#141d42]">{t.heroFloatingTitle}</p>
                      <p className="text-[11px] text-[#b8892e] font-bold">{t.heroFloatingSub}</p>
                    </div>
                  </div>
                  <Link
                    href="/products"
                    className="px-3 py-1.5 rounded-xl gold-gradient text-[#141d42] text-xs font-extrabold hover:shadow-md transition-all"
                  >
                    {t.btnViewAll}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT CATEGORIES ============ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1e2b5e] bg-[#eef1fa] px-3.5 py-1.5 rounded-full border border-[#dbe2f5]">
              {t.secCategoriesTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141d42] mt-3 tracking-tight">
              {t.secCategoriesTitle}
            </h2>
            <div className="mx-auto mt-3 w-16 h-1 gold-line rounded-full"></div>
            <p className="text-sm text-slate-600 mt-3">
              {t.secCategoriesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative bg-white rounded-3xl border border-[#e8ecf7] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#1e2b5e]/10 hover:border-[#c9d4f2]"
              >
                <div>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-[#eef1fa] border border-[#dbe2f5]">
                    <Image
                      src={cat.imageUrl || "/images/aradhya-baby-diapers.jpg"}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-2.5 rounded-xl bg-[#eef1fa] group-hover:bg-[#faf3df] transition-colors">
                      {categoryIcons[cat.slug] || <Sparkles className="w-5 h-5 text-[#1e2b5e]" />}
                    </div>
                    <h3 className="font-bold text-base text-[#141d42] group-hover:text-[#1e2b5e] transition-colors">
                      {getCategoryName(cat)}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Link
                    href={`/products/${cat.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#eef1fa] group-hover:bg-[#1e2b5e] text-[#1e2b5e] group-hover:text-white text-xs font-bold border border-[#dbe2f5] group-hover:border-[#1e2b5e] transition-all shadow-2xs"
                  >
                    <span>{t.btnViewProducts}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-16 sm:py-20 bg-[#faf9f6] border-t border-[#efe7d2]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200">
                {t.secFeaturedTag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141d42] mt-2 tracking-tight">
                {t.secFeaturedTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {t.secFeaturedDesc}
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1e2b5e] hover:text-[#141d42] self-start md:self-auto bg-white hover:bg-[#eef1fa] px-4 py-2.5 rounded-xl border border-[#dbe2f5] transition-colors shadow-2xs"
            >
              <span>{t.btnFullCatalog}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ ORDER REQUEST PROCESS ============ */}
      <section className="py-16 bg-white border-t border-[#e8ecf7]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b8892e] bg-[#faf3df] px-3.5 py-1.5 rounded-full border border-[#f0e2bd]">
              {t.secProcessTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141d42] mt-3 tracking-tight">
              {t.secProcessTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {t.secProcessDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-b from-[#eef1fa] to-white border border-[#dbe2f5] rounded-3xl p-6 text-center shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#1e2b5e] text-white font-extrabold flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#1e2b5e]/25 ring-2 ring-[#d4a43c]/40 ring-offset-2">
                1
              </div>
              <h3 className="font-bold text-sm text-[#141d42]">{t.step1Title}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.step1Desc}</p>
            </div>

            <div className="bg-gradient-to-b from-[#faf3df] to-white border border-[#f0e2bd] rounded-3xl p-6 text-center shadow-2xs">
              <div className="w-11 h-11 rounded-2xl gold-gradient text-[#141d42] font-extrabold flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#d4a43c]/30">
                2
              </div>
              <h3 className="font-bold text-sm text-[#141d42]">{t.step2Title}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.step2Desc}</p>
            </div>

            <div className="bg-gradient-to-b from-[#eef1fa] to-white border border-[#dbe2f5] rounded-3xl p-6 text-center shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#1e2b5e] text-white font-extrabold flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#1e2b5e]/25 ring-2 ring-[#d4a43c]/40 ring-offset-2">
                3
              </div>
              <h3 className="font-bold text-sm text-[#141d42]">{t.step3Title}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.step3Desc}</p>
            </div>

            <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 rounded-3xl p-6 text-center shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/25">
                4
              </div>
              <h3 className="font-bold text-sm text-[#141d42]">{t.step4Title}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUALITY STANDARDS (Deep Navy Premium Band) ============ */}
      <section className="py-16 bg-[#101833] text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#d4a43c]/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#e3b854] uppercase tracking-widest bg-[#d4a43c]/15 px-3.5 py-1.5 rounded-full border border-[#d4a43c]/30">
                {t.secQualityTag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {t.secQualityTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.secQualityDesc}
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.qualPurity1}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.qualPurity2}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.qualPurity3}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <span className="text-3xl font-extrabold text-[#e3b854]">{t.statChlorine}</span>
                <p className="text-xs text-slate-100 font-semibold mt-1">{t.statChlorineSub}</p>
                <p className="text-[10px] text-slate-400 mt-1">{t.trustSkinSafeSub}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <span className="text-3xl font-extrabold text-white">{t.statDryLock}</span>
                <p className="text-xs text-slate-100 font-semibold mt-1">{t.statDryLockSub}</p>
                <p className="text-[10px] text-slate-400 mt-1">{t.trustJapaneseCoreSub}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <span className="text-3xl font-extrabold text-emerald-400">{t.statDyes}</span>
                <p className="text-xs text-slate-100 font-semibold mt-1">{t.statDyesSub}</p>
                <p className="text-[10px] text-slate-400 mt-1">{t.trustSkinSafe}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-[#d4a43c]/30">
                <span className="text-3xl font-extrabold text-[#e3b854]">{t.statDirect}</span>
                <p className="text-xs text-slate-100 font-semibold mt-1">{t.statDirectSub}</p>
                <p className="text-[10px] text-slate-400 mt-1">{t.trustDirectSub}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
