"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  User,
  ClipboardList,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Package,
} from "lucide-react";

export default function CustomerAccountPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data?.orders) {
            setRecentOrders(data.orders);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New Request":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Under Review":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Customer Contacted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Completed":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "Cancelled":
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/account/order-requests"
              className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold border border-purple-200 transition-colors"
            >
              All Order Requests ({recentOrders.length})
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Account Details & Recent Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Saved Profile Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <span>Saved Contact Information</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Mobile Number:</span>
                  <p className="font-semibold text-slate-800">{user.phone || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email Address:</span>
                  <p className="font-semibold text-slate-800">{user.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Primary Delivery Address:</span>
                  <p className="font-semibold text-slate-800 leading-relaxed">
                    {user.address || "No address saved yet. You can provide it when requesting products."}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Verification Notice */}
            <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-100 text-xs text-purple-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-950">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Direct Order Request Handling</span>
              </div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                ARADHAYA Enterprises assigns an account coordinator to each request. Statuses are kept updated right here in your dashboard.
              </p>
            </div>
          </div>

          {/* Right: Recent Order Requests */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-purple-600" />
                <span>Recent Order Requests</span>
              </h2>
              <Link
                href="/account/order-requests"
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingOrders ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
                Loading order requests...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">No order requests yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse through our catalog of Aradhya SoftCare baby diapers and sanitary pads to submit your first request.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 font-mono">
                          {order.requestId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 mt-1">{order.productName}</h4>
                      <p className="text-xs text-slate-500">
                        Qty: {order.quantity} Units • {order.productPackSize}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        ₹{order.totalEstimate}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
