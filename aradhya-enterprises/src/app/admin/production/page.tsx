"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Factory, Check, AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";

interface ProductionLog {
  id: number;
  employeeName: string;
  productName: string;
  productionDate: string;
  quantityProduced: number;
  remarks?: string | null;
  isApproved: boolean;
  inventoryUpdated: boolean;
  createdAt: string;
}

export default function AdminProductionPage() {
  const [logs, setLogs] = useState<ProductionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/production")
      .then((res) => res.json())
      .then((data) => {
        if (data?.logs) setLogs(data.logs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: number, updateInventory: boolean) => {
    try {
      const res = await fetch(`/api/production/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true, updateInventory }),
      });
      const data = await res.json();
      if (res.ok) {
        setLogs((prev) =>
          prev.map((l) => (l.id === id ? data.log : l))
        );
        setToast(data.message || "Production entry approved!");
        setTimeout(() => setToast(null), 3500);
      }
    } catch {
      alert("Failed to approve log");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-8 space-y-6 max-w-7xl">
        {toast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs border border-purple-500 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Production & QA Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Strict employee production logs verification. Optional stock synchronization directly into finished inventory.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Qty Produced</th>
                  <th className="py-3 px-3">Remarks</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">QA Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{log.productName}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{log.productionDate}</td>
                    <td className="py-3 px-3">{log.employeeName}</td>
                    <td className="py-3 px-3 font-extrabold text-purple-700">
                      +{log.quantityProduced.toLocaleString()} units
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                      {log.remarks || "Standard run"}
                    </td>
                    <td className="py-3 px-3">
                      {log.isApproved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>Pending QA</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!log.isApproved ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(log.id, true)}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg"
                          >
                            Approve & Sync Stock
                          </button>
                          <button
                            onClick={() => handleApprove(log.id, false)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                          >
                            Approve Only
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {log.inventoryUpdated ? "Stock synced" : "Verified"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
