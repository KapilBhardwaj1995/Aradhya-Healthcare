"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react";

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

interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
}

export default function ProductsClient({
  initialProducts,
  categories,
  initialCategory,
  initialSearch,
}: ProductsClientProps) {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();

  const [search, setSearch] = useState(initialSearch || searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || searchParams.get("category") || "all"
  );
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categoryNamesHi: Record<string, string> = {
    "baby-diapers": "बेबी डायपर",
    "sanitary-pads": "सेनेटरी पैड्स",
    "panty-liners": "पैंटी लाइनर्स",
    "maternity-pads": "मातृत्व पैड्स",
  };

  const getCategoryName = (slug: string, fallback: string) => {
    if (language === "hi" && categoryNamesHi[slug]) {
      return categoryNamesHi[slug];
    }
    return fallback;
  };

  // Filter & Sort logic (No stock or sales logic in public display)
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) {
          return false;
        }

        // Discount filter
        if (discountOnly && product.discountPercent <= 0) {
          return false;
        }

        // Search query
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesSku = product.sku.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesCat = product.categorySlug.toLowerCase().includes(q);
          if (!matchesName && !matchesSku && !matchesDesc && !matchesCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") {
          return parseFloat(a.finalPrice) - parseFloat(b.finalPrice);
        }
        if (sortBy === "price_desc") {
          return parseFloat(b.finalPrice) - parseFloat(a.finalPrice);
        }
        if (sortBy === "discount") {
          return b.discountPercent - a.discountPercent;
        }
        if (sortBy === "newest") {
          return b.id - a.id;
        }
        // popular / default
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [initialProducts, selectedCategory, discountOnly, search, sortBy]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setDiscountOnly(false);
    setSortBy("popular");
  };

  const hasActiveFilters =
    search !== "" ||
    selectedCategory !== "all" ||
    discountOnly ||
    sortBy !== "popular";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.brandSub} {language === "hi" ? "कैटलॉग" : "Catalog"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === "hi"
              ? "हमारे बेबी डायपर, सेनेटरी पैड, पैंटी लाइनर्स और मातृत्व देखभाल पैड्स का पूरा संग्रह देखें।"
              : "Browse our full range of Baby Diapers, Sanitary Pads, Panty Liners, and Maternity Maxi Pads."}
          </p>
        </div>

        {/* Global Search Box */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Filters on Left (desktop) + Grid on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 text-xs font-bold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-600" />
            <span>{t.filterTitle} {hasActiveFilters && "(Active)"}</span>
          </button>
          <span className="text-xs text-slate-500">{filteredProducts.length} {language === "hi" ? "उत्पाद" : "Products"}</span>
        </div>

        {/* Left Sidebar Filter (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? "block" : "hidden"
          } space-y-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-600" />
              <span>{t.filterTitle}</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.filterReset}</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              {t.filterCategories}
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-purple-100 text-purple-900 font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.filterAllCategories}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-purple-100 text-purple-900 font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {getCategoryName(cat.slug, cat.name)}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Offers Filter */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.filterOffers}
            </h4>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={discountOnly}
                onChange={(e) => setDiscountOnly(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <span>{t.filterDiscountOffers}</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.filterSortBy}
            </h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="popular">{t.sortPopular}</option>
              <option value="price_asc">{t.sortPriceAsc}</option>
              <option value="price_desc">{t.sortPriceDesc}</option>
              <option value="discount">{t.sortDiscount}</option>
              <option value="newest">{t.sortNewest}</option>
            </select>
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <main className="lg:col-span-3">
          {/* Active summary bar */}
          <div className="hidden lg:flex items-center justify-between mb-4 text-xs text-slate-500">
            <span>
              {language === "hi" ? "दिखाए जा रहे हैं" : "Showing"}{" "}
              <strong className="text-slate-800">{filteredProducts.length}</strong>{" "}
              {language === "hi" ? "उत्पाद" : "items"}
            </span>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t.noProductsFound}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {t.noProductsDesc}
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetAllFilters}</span>
              </button>
            </div>
          ) : (
            /* Product Grid: Image, Name, Price, Category */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
