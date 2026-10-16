"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Factory, Plus, Clock, Check, Loader2, LogOut, Package } from "lucide-react";

export default function EmployeeDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productionDate, setProductionDate] = useState(new Date().toISOString().split("T")[0]);
  const [qty, setQty] = useState(200);
  const [remarks, setRemarks] = useState("Standard batch run");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "employee" && user.role !== "admin"))) {
      router.push("/employee/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch("/api/production").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
      ])
        .then(([prodLogs, prodList]) => {
          if (prodLogs?.logs) setLogs(prodLogs.logs);
          if (prodList?.products) {
            setProducts(prodList.products);
            if (prodList.products.length > 0) {
              setSelectedProduct(String(prodList.products[0].id));
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: parseInt(selectedProduct, 10),
          productionDate,
          quantityProduced: qty,
          remarks,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLogs((prev) => [data.log, ...prev]);
        setToast("Production record submitted successfully!");
        setTimeout(() => setToast(null), 3500);
      } else {
        alert(data.error || "Failed to submit production record");
      }
    } catch {
      alert("Submission error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">ARADHAYA Enterprises</span>
              <span className="text-[10px] text-pink-400">Employee Production Portal • District Shamli, UP</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Signed in as <strong>{user?.name}</strong></span>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8 w-full flex-1">
        {toast && (
          <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Production Entry Form */}
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-md space-y-4">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Log Today&apos;s Production</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Select Manufactured Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.packSize})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Production Date</label>
                <input
                  type="date"
                  required
                  value={productionDate}
                  onChange={(e) => setProductionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                >
                </input>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Quantity Produced (Units/Packs)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Batch Remarks / Tension QA</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 pt-3"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit for QA Approval</span>}
              </button>
            </form>
          </div>

          {/* Permitted Production History */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-md space-y-4">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" />
              <span>Your Logged Production History</span>
            </h2>

            <div className="divide-y divide-slate-700 overflow-x-auto text-xs">
              {logs.length === 0 ? (
                <p className="text-slate-400 py-6 text-center">No production logs entered yet.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-white">{log.productName}</h4>
                      <p className="text-[11px] text-slate-400">Date: {log.productionDate} • {log.remarks}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-purple-400 text-sm">+{log.quantityProduced} units</span>
                      <div>
                        {log.isApproved ? (
                          <span className="text-[10px] text-emerald-400 font-bold">Approved</span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold">Pending Review</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
