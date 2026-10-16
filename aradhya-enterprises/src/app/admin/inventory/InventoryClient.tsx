"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Check,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  categorySlug: string;
  packSize: string;
  stock: number;
  minStock: number;
  availabilityStatus: string;
  finalPrice: string;
}

export default function InventoryClient({
  initialInventory,
}: {
  initialInventory: InventoryItem[];
}) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "low_stock" | "out_of_stock">("all");
  const [adjustingId, setAdjustingId] = useState<number | null>(null);
  const [adjustQty, setAdjustQty] = useState(50);
  const [adjustType, setAdjustType] = useState<"add" | "subtract" | "set">("add");
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleStockUpdate = async (productId: number, markOutOfStock = false) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          adjustmentType: adjustType,
          quantity: adjustQty,
          markOutOfStock,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update stock");

      setInventory((prev) =>
        prev.map((item) =>
          item.id === productId
            ? {
                ...item,
                stock: data.product.stock,
                minStock: data.product.minStock,
                availabilityStatus: data.product.availabilityStatus,
              }
            : item
        )
      );

      setAdjustingId(null);
      showToast(data.message);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = inventory.filter((item) => {
    if (filterType === "low_stock" && item.availabilityStatus !== "low_stock") return false;
    if (filterType === "out_of_stock" && item.availabilityStatus !== "out_of_stock") return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
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
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Warehouse Inventory & Stock
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live warehouse stock counts, threshold alerts, and instant stock adjustments. (Admin-Only)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterType === "all" ? "bg-purple-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Items ({inventory.length})
            </button>
            <button
              onClick={() => setFilterType("low_stock")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterType === "low_stock" ? "bg-amber-500 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterType("out_of_stock")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterType === "out_of_stock" ? "bg-rose-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by product name or SKU..."
            className="w-full text-xs focus:outline-none"
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-3">SKU</th>
                  <th className="py-3.5 px-3">Current Stock</th>
                  <th className="py-3.5 px-3">Min Threshold</th>
                  <th className="py-3.5 px-3">Stock Health</th>
                  <th className="py-3.5 px-4 text-right">Quick Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-rose-600 font-semibold">{item.packSize}</p>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500">{item.sku}</td>

                    <td className="py-3 px-3">
                      <span className="text-sm font-extrabold text-slate-900">
                        {item.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-500">{item.minStock} units</td>

                    <td className="py-3 px-3">
                      {item.availabilityStatus === "out_of_stock" || item.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </span>
                      ) : item.availabilityStatus === "low_stock" || item.stock <= item.minStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Available</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {adjustingId === item.id ? (
                        <div className="inline-flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-purple-200">
                          <select
                            value={adjustType}
                            onChange={(e) => setAdjustType(e.target.value as any)}
                            className="text-[11px] px-2 py-1 bg-white border border-slate-300 rounded-lg"
                          >
                            <option value="add">+ Add</option>
                            <option value="subtract">- Reduce</option>
                            <option value="set">= Set Exact</option>
                          </select>
                          <input
                            type="number"
                            min="1"
                            value={adjustQty}
                            onChange={(e) => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                            className="w-16 text-xs px-2 py-1 bg-white border border-slate-300 rounded-lg text-center"
                          />
                          <button
                            onClick={() => handleStockUpdate(item.id)}
                            disabled={updating}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setAdjustingId(null)}
                            className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setAdjustingId(item.id);
                              setAdjustQty(50);
                              setAdjustType("add");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold border border-purple-200 transition-colors"
                          >
                            Adjust Stock
                          </button>
                          {item.stock > 0 && (
                            <button
                              onClick={() => handleStockUpdate(item.id, true)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold transition-colors"
                            >
                              Mark Out
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-xs text-slate-900">{item.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">SKU: {item.sku} • {item.packSize}</p>
                </div>
                <span className="text-sm font-extrabold text-slate-900">{item.stock} units</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500 text-[11px]">Min threshold: <strong>{item.minStock}</strong></span>
                <div>
                  {item.availabilityStatus === "out_of_stock" || item.stock <= 0 ? (
                    <span className="text-rose-600 font-bold text-[10px]">Out of Stock</span>
                  ) : item.availabilityStatus === "low_stock" || item.stock <= item.minStock ? (
                    <span className="text-amber-600 font-bold text-[10px]">Low Stock</span>
                  ) : (
                    <span className="text-emerald-600 font-bold text-[10px]">Healthy</span>
                  )}
                </div>
              </div>

              <div className="pt-1">
                {adjustingId === item.id ? (
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                    <select
                      value={adjustType}
                      onChange={(e) => setAdjustType(e.target.value as any)}
                      className="text-xs px-2 py-1 bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="add">+ Add</option>
                      <option value="subtract">- Reduce</option>
                      <option value="set">= Set</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={adjustQty}
                      onChange={(e) => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                      className="w-16 text-xs px-2 py-1 bg-white border border-slate-300 rounded-lg text-center"
                    />
                    <button
                      onClick={() => handleStockUpdate(item.id)}
                      disabled={updating}
                      className="px-2.5 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setAdjustingId(null)}
                      className="px-2 py-1 text-slate-500 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAdjustingId(item.id);
                      setAdjustQty(50);
                      setAdjustType("add");
                    }}
                    className="w-full py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl border border-purple-200"
                  >
                    Adjust Stock Units
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
