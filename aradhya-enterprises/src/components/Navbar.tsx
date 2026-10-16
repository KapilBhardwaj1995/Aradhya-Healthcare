"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Menu,
  X,
  Search,
  User,
  ShieldCheck,
  LogOut,
  ClipboardList,
  ChevronDown,
  Sparkles,
  PhoneCall,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: t.navHome, href: "/" },
    { name: t.navProducts, href: "/products" },
    { name: t.navBabyCare, href: "/products/baby-diapers" },
    { name: t.navSanitaryPads, href: "/products/sanitary-pads" },
    { name: t.navPantyLiners, href: "/products/panty-liners" },
    { name: t.navMaternityCare, href: "/products/maternity-pads" },
    { name: t.navAboutUs, href: "/about" },
    { name: t.navContactUs, href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e8ecf7] shadow-2xs transition-all duration-300">
      {/* Top Announcement Bar - Deep Navy with Gold accent line */}
      <div className="bg-[#141d42] text-white text-xs py-2 px-4 font-medium tracking-wide flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-2 text-slate-300 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4a43c] soft-pulse"></span>
          <span>{t.tagline} • District Shamli, Uttar Pradesh</span>
        </div>

        <div className="mx-auto flex items-center gap-2 text-[11px] sm:text-xs truncate">
          <span className="font-semibold text-[#d4a43c]">Toll Free:</span>
          <span className="font-bold text-white tracking-wider bg-white/10 px-2 py-0.5 rounded-md">
            {t.tollFreeDemo}
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300">{t.phoneDemo}</span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-slate-300 text-[11px]">
          <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full">
            <PhoneCall className="w-3 h-3 text-[#d4a43c]" />
            <span>{t.emailCare}</span>
          </Link>
        </div>
      </div>
      {/* Premium gold hairline */}
      <div className="h-0.5 gold-line"></div>

      {/* Main Navbar */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "py-2.5" : "py-3.5"}`}>
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Official Brand Logo */}
          <Link href="/" className="group shrink-0" aria-label="ARADHAYA Enterprises Home">
            {/* Desktop: full official logo */}
            <img
              src="/images/logo-full.png"
              alt="ARADHAYA Enterprises"
              className="hidden md:block w-auto transition-all duration-300 group-hover:scale-[1.02]"
              style={{ height: isScrolled ? "44px" : "52px" }}
            />
            {/* Mobile: monogram + compact name */}
            <div className="flex md:hidden items-center gap-2.5">
              <img src="/images/logo-mark.png" alt="ARADHAYA Enterprises logo" className="h-10 w-10 object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-base tracking-tight text-[#1e2b5e]">
                  ARADHAYA <span className="text-[#b8892e]">Enterprises</span>
                </span>
                <span className="text-[9px] font-bold text-[#b8892e] tracking-widest uppercase">
                  {t.tagline}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-sm xl:max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 pl-9 pr-20 py-2.5 rounded-full border border-[#dbe2f5] focus:border-[#1e2b5e] focus:ring-2 focus:ring-[#eef1fa] focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1 bg-[#1e2b5e] hover:bg-[#141d42] text-white text-xs font-semibold rounded-full shadow-2xs transition-colors"
              >
                {t.searchBtn}
              </button>
            </form>
          </div>

          {/* Right Controls: HINDI / ENGLISH LANGUAGE SWITCHER & ADMIN BUTTON */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* HINDI / ENGLISH LANGUAGE SWITCHER */}
            <div className="inline-flex items-center rounded-xl border border-[#dbe2f5] bg-[#eef1fa]/90 p-0.5 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  language === "en"
                    ? "bg-[#1e2b5e] text-white shadow-2xs"
                    : "text-[#1e2b5e] hover:bg-white/70"
                }`}
                title="Switch to English"
                aria-label="Switch to English"
              >
                EN
              </button>
              <span className="text-[#b8892e] font-normal px-0.5 select-none">|</span>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  language === "hi"
                    ? "bg-[#1e2b5e] text-white shadow-2xs font-semibold"
                    : "text-[#1e2b5e] hover:bg-white/70"
                }`}
                title="हिंदी में बदलें"
                aria-label="हिंदी में बदलें"
              >
                हिंदी
              </button>
            </div>

            {/* ADMIN BUTTON (Next to Language Switcher) - Gold accent */}
            <Link
              href={user?.role === "admin" ? "/admin" : "/admin/login"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold gold-gradient text-[#141d42] shadow-2xs hover:shadow transition-all hover:-translate-y-0.5 border border-[#e3b854]/60"
              title="Admin Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#141d42]" />
              <span>{t.navAdmin}</span>
            </Link>

            {/* Track Orders Link */}
            <Link
              href="/account/order-requests"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1e2b5e] bg-[#eef1fa] hover:bg-[#e2e8f8] transition-colors border border-[#dbe2f5]"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.navTrackRequest}</span>
            </Link>

            {/* User Account Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#eef1fa] text-slate-800 hover:text-[#1e2b5e] text-xs font-semibold border border-slate-200 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1e2b5e] text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-[#d4a43c]/50">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline max-w-[80px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e8ecf7] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-[#eef1fa] hover:text-[#1e2b5e]"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#1e2b5e]" />
                          <span>{t.navAdminPortal}</span>
                        </Link>
                      )}

                      <Link
                        href="/account"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-[#eef1fa] hover:text-[#1e2b5e]"
                      >
                        <User className="w-4 h-4 text-[#1e2b5e]" />
                        <span>{t.navMyAccount}</span>
                      </Link>

                      <Link
                        href="/account/order-requests"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-[#eef1fa] hover:text-[#1e2b5e]"
                      >
                        <ClipboardList className="w-4 h-4 text-[#1e2b5e]" />
                        <span>{t.navTrackRequest}</span>
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>{t.navSignOut}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#1e2b5e] rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#1e2b5e]" />
                    <span>{t.navLogin}</span>
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#1e2b5e] hover:bg-[#141d42] rounded-xl shadow-2xs hover:shadow transition-all hover:-translate-y-0.5"
                  >
                    {t.navRegister}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-[#eef1fa] hover:text-[#1e2b5e] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-6 pt-2.5 border-t border-[#eef1fa] text-xs font-semibold text-slate-700">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 transition-colors hover:text-[#1e2b5e] ${
                  isActive ? "text-[#1e2b5e] font-bold" : "text-slate-600"
                }`}
              >
                {link.name}
                {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 gold-line rounded-full" />}
              </Link>
            );
          })}
          <div className="ml-auto text-[11px] text-[#b8892e] font-bold bg-[#faf3df] px-3 py-0.5 rounded-full border border-[#f0e2bd] shadow-2xs">
            {t.directModelNotice}
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e8ecf7] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-50 text-xs pl-9 pr-16 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#dbe2f5]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1e2b5e] text-white text-[11px] font-semibold rounded-lg"
            >
              {t.searchBtn}
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-[#eef1fa] text-[#1e2b5e] font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-700 hover:text-[#1e2b5e] font-bold flex items-center gap-1.5 px-2 py-1"
            >
              <ShieldCheck className="w-4 h-4 text-[#1e2b5e]" />
              <span>{t.navAdmin}</span>
            </Link>
            <Link
              href="/account/order-requests"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#1e2b5e] font-semibold px-2 py-1"
            >
              {t.navTrackRequest}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
