"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  ClipboardList,
  Search,
  Package,
  Calendar,
  MessageCircle,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";

export default function OrderRequestsPage() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Guest lookup state
  const [guestRequestId, setGuestRequestId] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"my_orders" | "track_guest">("my_orders");

  useEffect(() => {
    if (user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data?.orders) {
            setOrders(data.orders);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    } else {
      setLoadingOrders(false);
      setActiveTab("track_guest");
    }
  }, [user]);

  const handleGuestLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const res = await fetch(
        `/api/orders?requestId=${encodeURIComponent(
          guestRequestId.trim()
        )}&phone=${encodeURIComponent(guestPhone.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order request not found. Please verify details.");
      }
      setLookupResult(data.order);
    } catch (err) {
      setLookupError((err as Error).message);
    } finally {
      setLookupLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New Request":
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-200",
          desc: "Received by Aradhaya Care desk. Awaiting coordinator review.",
        };
      case "Under Review":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-200",
          desc: "Batch inventory & quantity allocation currently in verification.",
        };
      case "Customer Contacted":
        return {
          bg: "bg-purple-100 text-purple-800 border-purple-200",
          desc: "Our sales specialist has phoned or messaged you regarding confirmation.",
        };
      case "Confirmed":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
          desc: "Order confirmed! Package is prepped for direct dispatch or local pickup.",
        };
      case "Completed":
        return {
          bg: "bg-teal-100 text-teal-800 border-teal-200",
          desc: "Handover completed with verified customer receipt.",
        };
      case "Cancelled":
      case "Rejected":
        return {
          bg: "bg-red-100 text-red-800 border-red-200",
          desc: "Request cancelled by customer or stock unavailable.",
        };
      case "On Hold":
        return {
          bg: "bg-orange-100 text-orange-800 border-orange-200",
          desc: "Temporarily paused awaiting customer callback or date preference.",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-800 border-slate-200",
          desc: "In process.",
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Requests Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time status of your Aradhya SoftCare product inquiries and orders.
          </p>
        </div>

        {/* Tab switchers if user is logged in */}
        {user && (
          <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab("my_orders")}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === "my_orders"
                  ? "border-purple-600 text-purple-700 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              My Order Requests ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("track_guest")}
              className={`pb-3 px-2 border-b-2 transition-colors ${
                activeTab === "track_guest"
                  ? "border-purple-600 text-purple-700 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Lookup By Request ID
            </button>
          </div>
        )}

        {/* Guest Lookup View */}
        {activeTab === "track_guest" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-slate-900">
                  Track Any Order Request
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your Request ID (e.g. AS-2026-000125) and registered mobile number.
                </p>
              </div>

              {lookupError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{lookupError}</span>
                </div>
              )}

              <form onSubmit={handleGuestLookup} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Request ID
                  </label>
                  <input
                    type="text"
                    required
                    value={guestRequestId}
                    onChange={(e) => setGuestRequestId(e.target.value)}
                    placeholder="e.g. AS-2026-000125"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="e.g. +91 98765 11223 or 10-digit number"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {lookupLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking Status...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Track Order Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Lookup Result Box */}
            {lookupResult && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg max-w-2xl mx-auto space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Request Reference
                    </span>
                    <span className="text-lg font-mono font-extrabold text-purple-700">
                      {lookupResult.requestId}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      getStatusBadge(lookupResult.status).bg
                    }`}
                  >
                    {lookupResult.status}
                  </span>
                </div>

                <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900">
                  <p className="font-semibold">Current Processing State:</p>
                  <p className="text-[11px] text-purple-800 mt-0.5">
                    {getStatusBadge(lookupResult.status).desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Product:</span>
                    <span className="font-bold text-slate-800">{lookupResult.productName}</span>
                    <p className="text-[11px] text-slate-500">{lookupResult.productPackSize}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Quantity:</span>
                    <span className="font-bold text-slate-800">{lookupResult.quantity} Packs / Units</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Estimated Total:</span>
                    <span className="font-extrabold text-purple-700 text-sm">
                      ₹{lookupResult.totalEstimate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Submitted On:</span>
                    <span className="font-medium text-slate-700">
                      {new Date(lookupResult.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {lookupResult.adminNotes && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <span className="font-semibold text-slate-700">Aradhaya Team Note:</span>
                    <p className="text-slate-600 mt-0.5">{lookupResult.adminNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* My Orders List View */}
        {activeTab === "my_orders" && user && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="p-12 text-center text-xs text-slate-500">
                Loading your order requests...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Order Requests Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You have not submitted any product order requests yet. Browse our selection and submit a request with zero delivery partner charges!
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  <span>Explore Product Catalog</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const badgeInfo = getStatusBadge(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-extrabold text-purple-700">
                          {order.requestId}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeInfo.bg}`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Submitted: {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Product:</span>
                        <h4 className="font-bold text-slate-800 text-sm">{order.productName}</h4>
                        <p className="text-[11px] text-slate-500">{order.productPackSize}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">Order Breakdown:</span>
                        <p className="font-semibold text-slate-700">
                          Quantity: {order.quantity} Units @ ₹{order.unitPrice}
                        </p>
                        <p className="text-purple-700 font-extrabold text-sm mt-0.5">
                          Estimated Total: ₹{order.totalEstimate}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">Delivery Destination:</span>
                        <p className="text-slate-700 line-clamp-2 leading-relaxed">
                          {order.customerAddress}
                        </p>
                      </div>
                    </div>

                    {order.adminNotes && (
                      <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900">
                        <span className="font-semibold text-purple-950">Aradhaya Care Coordinator Note:</span>
                        <p className="text-[11px] text-purple-800 mt-0.5">{order.adminNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
