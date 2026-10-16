"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  ShieldCheck,
  Award,
  Factory,
} from "lucide-react";

export default function AboutClient() {
  const { t } = useLanguage();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-100/70 via-pink-50/40 to-slate-50 py-16 sm:py-24 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-200">
            {t.navAboutUs} • {t.brandName}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#141d42] mt-4 tracking-tight">
            {t.heroHeadingLine1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8892e] via-[#d4a43c] to-rose-500">
              {t.heroHeadingLine2}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Story & Vision */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100">
              <Image
                src="https://images.pexels.com/photos/19773885/pexels-photo-19773885.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="Aradhya SoftCare mother and infant tender care"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-5">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                District Shamli, Uttar Pradesh
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t.brandName} • {t.brandSub}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.footerAboutText}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Located in District Shamli, Uttar Pradesh, our manufacturing operations ensure hospital-grade organic softness, chlorine-free pulp, 3D anatomical leak barriers, and Japanese SAP retention polymers reach families with complete transparency.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <h3 className="font-bold text-slate-900 text-sm">Vision & Mission</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    To be India&apos;s most trustworthy family hygiene brand celebrated for compassion, safety, and purity.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-pink-50 border border-pink-100">
                  <h3 className="font-bold text-slate-900 text-sm">{t.statDirect} Model</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.directModelNotice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Principles */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              {t.secQualityTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              {t.secQualityTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{t.trustSkinSafe}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.qualPurity1}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{t.trustJapaneseCore}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.qualPurity2}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{t.trustDirect}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.qualPurity3}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#101833] text-white text-center border-t-4 border-[#d4a43c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.brandName} • {t.tagline}
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-xl mx-auto">
            {t.heroSubtitle}
          </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/products"
                className="px-6 py-3 rounded-xl bg-white text-[#141d42] font-bold text-xs shadow-lg hover:bg-[#faf3df] transition-all"
              >
                {t.btnExploreProducts}
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl gold-gradient text-[#141d42] font-bold text-xs shadow-lg hover:shadow-xl transition-all"
              >
                {t.btnContactUs}
              </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
