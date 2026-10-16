"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OrderRequestModal, { ProductItem } from "@/components/OrderRequestModal";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

interface ProductDetailsClientProps {
  product: {
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
    specifications?: string | null;
    features?: string | null;
  };
  relatedProducts: Array<any>;
  whatsappNumber: string;
}

export default function ProductDetailsClient({
  product,
  relatedProducts,
  whatsappNumber,
}: ProductDetailsClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t, language } = useLanguage();

  // Parse images
  let imageList: string[] = ["/images/aradhya-baby-diapers.jpg"];
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      imageList = parsed;
    }
  } catch {
    if (product.images) imageList = [product.images];
  }

  const [activeImage, setActiveImage] = useState(imageList[0] || "/images/aradhya-baby-diapers.jpg");

  // Parse specifications
  let specs: Record<string, string> = {};
  try {
    if (product.specifications) {
      specs = JSON.parse(product.specifications);
    }
  } catch {}

  // Parse features
  let featureList: string[] = [];
  try {
    if (product.features) {
      const parsed = JSON.parse(product.features);
      if (Array.isArray(parsed)) featureList = parsed;
    }
  } catch {}

  const cleanWa = (whatsappNumber || "+919000012345").replace(/[^0-9]/g, "");
  const waInquiryUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    `Hello Aradhaya Enterprises! I am inquiring about "${product.name}" (${product.packSize}, SKU: ${product.sku}). Please let me know current availability and dispatch details.`
  )}`;

  const productItemData: ProductItem = {
    id: product.id,
    name: product.name,
    packSize: product.packSize,
    finalPrice: product.finalPrice,
    originalPrice: product.originalPrice,
    discountPercent: product.discountPercent,
    availabilityStatus: "available", // Masked from public
    images: product.images,
  };

  const categoryNameMapEn: Record<string, string> = {
    "baby-diapers": "Baby Diapers",
    "sanitary-pads": "Sanitary Pads",
    "panty-liners": "Panty Liners",
    "maternity-pads": "Maternity Pads",
  };

  const categoryNameMapHi: Record<string, string> = {
    "baby-diapers": "बेबी डायपर",
    "sanitary-pads": "सेनेटरी पैड्स",
    "panty-liners": "पैंटी लाइनर्स",
    "maternity-pads": "मातृत्व पैड्स",
  };

  const categoryLabel =
    (language === "hi"
      ? categoryNameMapHi[product.categorySlug]
      : categoryNameMapEn[product.categorySlug]) || product.categorySlug;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-purple-700">
          {t.crumbHome}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/products" className="hover:text-purple-700">
          {t.crumbProducts}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href={`/products/${product.categorySlug}`} className="hover:text-purple-700">
          {categoryLabel}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
        {/* Left: Product Images & Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />

            {product.discountPercent > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-pink-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{product.discountPercent}% {t.badgeDiscount}</span>
              </div>
            )}
          </div>

          {/* Thumbnails Gallery */}
          {imageList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img
                      ? "border-purple-600 shadow-md ring-2 ring-purple-200"
                      : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Direct Verification Guarantee */}
          <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 text-xs text-purple-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-950">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>{t.qaTitle}</span>
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              {t.qaDesc}
            </p>
          </div>
        </div>

        {/* Right: Info, Price, Specs & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold text-[#1e2b5e] bg-[#eef1fa] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#dbe2f5]">
                {categoryLabel}
              </span>
              <span className="text-xs text-slate-500 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-pink-600 mt-1">
              {t.packSizeLabel}: {product.packSize}
            </p>
          </div>

          {/* Pricing Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs text-slate-500 block mb-1">{t.mfgPriceLabel}</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  ₹{product.finalPrice}
                </span>
                {product.discountPercent > 0 && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{parseFloat(product.originalPrice).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              {product.discountPercent > 0 ? (
                <span className="inline-block bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200">
                  {t.badgeSave} {product.discountPercent}%
                </span>
              ) : (
                <span className="inline-block bg-[#faf3df] text-[#b8892e] text-xs font-bold px-2.5 py-1 rounded-full border border-[#f0e2bd]">
                  {t.factoryRate}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.descTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Bullet Features */}
          {featureList.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.featuresTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {featureList.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Table */}
          {Object.keys(specs).length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t.specsTitle}
              </h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-200 text-xs">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-2 p-2.5 bg-white odd:bg-slate-50">
                    <span className="font-semibold text-slate-700">{key}</span>
                    <span className="text-slate-600">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#1e2b5e] hover:bg-[#141d42] text-white font-bold text-xs shadow-md shadow-[#1e2b5e]/25 hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#d4a43c]" />
                <span>{t.btnOrderRequest}</span>
              </button>

              <a
                href={waInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t.btnWhatsappInquiry}</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              {t.directModelNoticeText}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {t.relatedTitle}
            </h2>
            <Link
              href={`/products/${product.categorySlug}`}
              className="text-xs font-bold text-purple-700 hover:text-purple-900"
            >
              {t.viewMoreCat}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Order Request Modal */}
      <OrderRequestModal
        product={productItemData}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
