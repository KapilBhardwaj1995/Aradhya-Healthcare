"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag, Sparkles } from "lucide-react";
import OrderRequestModal, { ProductItem } from "./OrderRequestModal";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
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
    stock?: number;
    minStock?: number;
    availabilityStatus?: string;
    images: string; // JSON or url
    isFeatured?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t, language } = useLanguage();

  // Parse image
  let imageUrl = "/images/aradhya-baby-diapers.jpg";
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      imageUrl = parsed[0];
    }
  } catch {
    if (typeof product.images === "string" && product.images.length > 0) {
      imageUrl = product.images;
    }
  }

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

  return (
    <>
      <div className="product-card group relative rounded-3xl overflow-hidden flex flex-col justify-between">
        {/* Top Image & Category Container */}
        <div className="relative aspect-square w-full bg-[#f6f4ee] overflow-hidden">
          {/* Discount Tag */}
          {product.discountPercent > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-rose-600 to-pink-500 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-md shadow-rose-600/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{product.discountPercent}% {t.badgeDiscount}</span>
            </div>
          )}

          {/* Category Tag on top-right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-[#1e2b5e] bg-white/95 px-2.5 py-1 rounded-full backdrop-blur-md border border-[#dbe2f5] shadow-2xs">
              {categoryLabel}
            </span>
          </div>

          {/* Product Image */}
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Quick View overlay button on hover */}
          <div className="absolute inset-x-0 bottom-3 px-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-white/95 hover:bg-white text-[#141d42] text-xs font-bold rounded-2xl shadow-lg backdrop-blur-md transition-transform hover:scale-[1.02] border border-[#e8ecf7]"
            >
              <Eye className="w-3.5 h-3.5 text-[#1e2b5e]" />
              <span>{t.btnDetails}</span>
            </Link>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
          <div>
            {/* Pack Size in gold brand accent */}
            <div className="text-[11px] text-[#b8892e] font-bold mb-1 tracking-wide">
              {product.packSize}
            </div>

            {/* Product Title */}
            <Link href={`/product/${product.slug}`} className="block group-hover:text-[#1e2b5e] transition-colors">
              <h3 className="font-extrabold text-sm text-[#141d42] line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div>
            {/* Pricing */}
            <div className="pt-2.5 border-t border-[#f0ede4] flex items-baseline justify-between mb-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-[#141d42] tracking-tight">
                    ₹{product.finalPrice}
                  </span>
                  {product.discountPercent > 0 && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{parseFloat(product.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{t.allFactoryRates}</p>
              </div>

              {product.discountPercent > 0 && (
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                  {t.badgeSave} {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Card Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/product/${product.slug}`}
                className="flex items-center justify-center py-2.5 px-2.5 rounded-2xl border border-[#dbe2f5] hover:border-[#1e2b5e] bg-[#eef1fa]/60 hover:bg-[#eef1fa] text-[#1e2b5e] text-xs font-bold transition-all text-center"
              >
                {t.btnDetails}
              </Link>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-2xl bg-[#1e2b5e] hover:bg-[#141d42] text-white text-xs font-bold shadow-2xs hover:shadow-md transition-all text-center"
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-[#d4a43c]" />
                <span className="truncate">{t.btnOrderRequest}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Request Submission Modal */}
      <OrderRequestModal
        product={productItemData}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
