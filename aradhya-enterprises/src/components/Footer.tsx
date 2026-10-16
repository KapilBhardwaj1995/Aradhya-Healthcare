"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#101833] text-slate-300 pt-16 pb-10 border-t-4 border-[#d4a43c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Assurance Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-12 border-b border-white/10 text-xs">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-2.5 rounded-xl bg-[#d4a43c]/15 text-[#d4a43c]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">{t.trustSkinSafe}</p>
              <p className="text-slate-400 text-[11px]">{t.trustSkinSafeSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">{t.statChlorineSub}</p>
              <p className="text-slate-400 text-[11px]">{t.statDyesSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-2.5 rounded-xl bg-[#d4a43c]/15 text-[#d4a43c]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">{t.trustDirect}</p>
              <p className="text-slate-400 text-[11px]">{t.statDirectSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">{t.trustDirectSub}</p>
              <p className="text-slate-400 text-[11px]">{t.step4Title}</p>
            </div>
          </div>
        </div>

        {/* 4-column Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info with official logo */}
          <div className="lg:col-span-2 space-y-5">
            <img src="/images/logo-dark.png" alt="ARADHAYA Enterprises" className="h-16 w-auto rounded-xl" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footerAboutText}
            </p>
            <div className="pt-1">
              <WhatsAppButton
                floating={false}
                label={t.waInquiry}
                className="text-xs py-2 px-4"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#d4a43c] uppercase tracking-wider">{t.footerQuickLinks}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#e3b854] transition-colors">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#e3b854] transition-colors">
                  {t.navProducts}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#e3b854] transition-colors">
                  {t.navAboutUs}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#e3b854] transition-colors">
                  {t.navContactUs}
                </Link>
              </li>
              <li>
                <Link href="/account/order-requests" className="hover:text-[#e3b854] transition-colors">
                  {t.navTrackRequest}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#d4a43c] uppercase tracking-wider">{t.footerProductCategories}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products/baby-diapers" className="hover:text-[#e3b854] transition-colors">
                  {t.catBabyDiapers}
                </Link>
              </li>
              <li>
                <Link href="/products/sanitary-pads" className="hover:text-[#e3b854] transition-colors">
                  {t.catSanitaryPads}
                </Link>
              </li>
              <li>
                <Link href="/products/panty-liners" className="hover:text-[#e3b854] transition-colors">
                  {t.catPantyLiners}
                </Link>
              </li>
              <li>
                <Link href="/products/maternity-pads" className="hover:text-[#e3b854] transition-colors">
                  {t.catMaternityPads}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#d4a43c] uppercase tracking-wider">{t.footerDirectContact}</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#d4a43c] shrink-0 mt-0.5" />
                <span className="leading-tight">{t.address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-rose-300 shrink-0" />
                <span>{t.phoneDemo}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Toll Free: {t.tollFreeDemo}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-[#d4a43c] shrink-0" />
                <span>{t.emailCare}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-rose-300 shrink-0" />
                <span>Wholesale: {t.emailWholesale}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Portals & Disclaimer */}
        <div className="pt-8 border-t border-white/10 text-[11px] text-slate-400 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>
              © {new Date().getFullYear()} <strong className="text-white">ARADHAYA Enterprises</strong>. {t.footerCopyright}
            </p>
            <div className="flex items-center gap-5 text-[11px]">
              <Link href="/admin/login" className="hover:text-[#e3b854] flex items-center gap-1 transition-colors font-bold text-slate-300">
                <span>{t.navAdminPortal}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
              <Link href="/contact" className="hover:text-[#e3b854] transition-colors">
                {t.navContactUs}
              </Link>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            {t.footerNotice}
          </p>
        </div>
      </div>
    </footer>
  );
}
