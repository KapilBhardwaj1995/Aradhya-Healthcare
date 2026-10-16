"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  ClipboardList,
  Search,
  Filter,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Check,
  Edit2,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

interface OrderRequest {
  id: number;
  requestId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  productName: string;
  productPackSize: string;
  quantity: number;
  unitPrice: string;
  discountPercent: number;
  totalEstimate: string;
  message?: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
}

export default function OrdersManagerClient({
  initialOrders,
}: {
  initialOrders: OrderRequest[];
}) {
  const [orders, setOrders] = useState<OrderRequest[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRequest | null>(null);
  const [newStatus, setNewStatus] = useState("New Request");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const statuses = [
    "New Request",
    "Under Review",
    "Customer Contacted",
    "Confirmed",
    "Completed",
    "Cancelled",
    "Rejected",
    "On Hold",
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenStatusModal = (order: OrderRequest) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setAdminNotes(order.adminNotes || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? data.order : o))
      );

      setSelectedOrder(null);
      showToast(`Request ${data.order.requestId} updated to "${newStatus}"!`);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
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
      case "On Hold":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        o.requestId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-8 space-y-6 max-w-7xl">
        {toast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs border border-purple-500">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>Order Management</span>
              <span className="text-purple-300">•</span>
              <span className="text-slate-600">Direct Customer Fulfillment</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Order Requests
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review incoming requests, contact customers directly via Phone/WhatsApp, and confirm factory dispatch without third-party delivery fees.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
              Total: <strong>{orders.length}</strong> Requests
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Request ID, customer, phone..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === "all" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              All
            </button>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === st ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Order Cards Grid */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No order requests found matching the current filter.
            </div>
          ) : (
            filtered.map((order) => {
              const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");
              const waText = encodeURIComponent(
                `Hello ${order.customerName}! This is Aradhaya Enterprises regarding your Order Request #${order.requestId} for ${order.quantity}x ${order.productName}. We are contacting you to confirm dispatch details.`
              );
              const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

              return (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:border-purple-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-extrabold text-purple-700">
                        {order.requestId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Customer Info */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Customer Contact
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-pink-500" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-purple-500" />
                        <span>{order.customerEmail}</span>
                      </div>
                    </div>

                    {/* Product & Qty */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Requested Product
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{order.productName}</p>
                      <p className="text-pink-600">{order.productPackSize}</p>
                      <p className="text-slate-600 font-semibold">
                        Qty: {order.quantity} Units • Unit Price: ₹{order.unitPrice}
                      </p>
                      <p className="text-purple-700 font-extrabold text-sm">
                        Total Estimate: ₹{order.totalEstimate}
                      </p>
                    </div>

                    {/* Delivery & Direct Actions */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Delivery Destination
                        </span>
                        <p className="text-slate-700 leading-relaxed text-[11px] line-clamp-2">
                          {order.customerAddress}
                        </p>
                      </div>

                      {order.message && (
                        <p className="text-[11px] italic text-slate-500 bg-slate-50 p-2 rounded-lg">
                          &quot;{order.message}&quot;
                        </p>
                      )}

                      {/* Direct WhatsApp Contact Button for Admin */}
                      <div className="pt-1">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Contact Customer on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {order.adminNotes && (
                    <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-xs text-purple-900">
                      <span className="font-bold">Admin Coordinator Note:</span>{" "}
                      <span>{order.adminNotes}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Update Status Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Update Request: {selectedOrder.requestId}
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedOrder.customerName}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select New Request Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Notes / Customer Follow-up Log
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Spoke with customer on 14th Sept. Confirmed 10 cases of baby diapers. Payment on delivery."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="py-2 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2 px-5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Update</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
