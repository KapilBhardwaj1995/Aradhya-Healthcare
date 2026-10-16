"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please verify your credentials.");
      }

      await refreshUser();

      // Role-based destination
      if (data.user?.role === "admin") {
        router.push("/admin");
      } else if (data.user?.role === "employee") {
        router.push("/employee");
      } else {
        router.push("/account");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: "customer" | "admin" | "employee") => {
    if (role === "customer") {
      setIdentifier("customer@example.com");
      setPassword("customer123");
    } else if (role === "employee") {
      setIdentifier("employee@aradhyacare.com");
      setPassword("employee123");
    } else {
      setIdentifier("admin@aradhyacare.com");
      setPassword("admin123");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <img
              src="/images/logo-full.png"
              alt="ARADHAYA Enterprises"
              className="h-14 w-auto mx-auto"
            />
            <h1 className="text-2xl font-extrabold text-[#141d42] tracking-tight">
              Welcome to ARADHAYA
            </h1>
            <p className="text-xs text-slate-500">
              Sign in to manage your order requests, track status, and view exclusive brand updates.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. customer@example.com or phone"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-purple-700 hover:text-purple-900 cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#1e2b5e] hover:bg-[#141d42] text-white font-bold text-xs shadow-md shadow-[#1e2b5e]/25 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for instant evaluation */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
              Quick One-Click Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("customer")}
                className="py-1.5 px-2 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 rounded-lg text-[10px] font-semibold transition-colors"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("employee")}
                className="py-1.5 px-2 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 rounded-lg text-[10px] font-semibold transition-colors"
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("admin")}
                className="py-1.5 px-2 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 rounded-lg text-[10px] font-semibold transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold text-purple-700 hover:text-purple-900 underline">
              Register here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
