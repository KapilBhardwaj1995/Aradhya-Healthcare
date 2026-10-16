"use client";

import React, { useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
  Boxes,
  ShoppingCart,
  AlertTriangle,
  RefreshCw,
  Eye,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface Product {
  id: number;
  slug: string;
  sku: string;
  name: string;
  categorySlug: string;
  description: string;
  packSize: string;
  originalPrice: string;
  discountPercent: number;
  finalPrice: string;
  stock: number;
  unitsSold: number;
  minStock: number;
  availabilityStatus: string;
  images: string;
  isActive: boolean;
  isFeatured: boolean;
}

export default function ProductManagerClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form states for modal
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categorySlug: "baby-diapers",
    description: "",
    packSize: "",
    originalPrice: "",
    discountPercent: 0,
    stock: 100,
    unitsSold: 0,
    minStock: 20,
    imageUrl: "/images/aradhya-baby-diapers.jpg",
    availabilityStatus: "available",
    isFeatured: false,
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Top Stock & Sales Metrics
  const totalStockUnits = productList.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalUnitsSold = productList.reduce((acc, p) => acc + (p.unitsSold || 0), 0);
  const totalSalesRevenue = productList.reduce(
    (acc, p) => acc + (p.unitsSold || 0) * (parseFloat(p.finalPrice) || 0),
    0
  );
  const lowStockCount = productList.filter(
    (p) => p.stock <= p.minStock || p.availabilityStatus === "low_stock" || p.availabilityStatus === "out_of_stock"
  ).length;

  // Auto calculate final price preview
  const originalPriceNum = parseFloat(formData.originalPrice) || 0;
  const discountNum = Math.min(100, Math.max(0, formData.discountPercent || 0));
  const previewFinalPrice = (
    originalPriceNum -
    (originalPriceNum * discountNum) / 100
  ).toFixed(2);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: `AS-PR-${Math.floor(100 + Math.random() * 900)}`,
      categorySlug: "baby-diapers",
      description: "",
      packSize: "Pack of 30 Pants",
      originalPrice: "499.00",
      discountPercent: 10,
      stock: 150,
      unitsSold: 0,
      minStock: 25,
      imageUrl: "/images/aradhya-baby-diapers.jpg",
      availabilityStatus: "available",
      isFeatured: false,
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);

    let img = "/images/aradhya-baby-diapers.jpg";
    try {
      const parsed = JSON.parse(prod.images);
      if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
    } catch {
      if (prod.images) img = prod.images;
    }

    setFormData({
      name: prod.name,
      sku: prod.sku,
      categorySlug: prod.categorySlug,
      description: prod.description,
      packSize: prod.packSize,
      originalPrice: prod.originalPrice,
      discountPercent: prod.discountPercent,
      stock: prod.stock,
      unitsSold: prod.unitsSold || 0,
      minStock: prod.minStock,
      imageUrl: img,
      availabilityStatus: prod.availabilityStatus,
      isFeatured: prod.isFeatured,
      isActive: prod.isActive,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      const payload = {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice),
        discountPercent: parseInt(String(formData.discountPercent), 10) || 0,
        stock: parseInt(String(formData.stock), 10) || 0,
        unitsSold: parseInt(String(formData.unitsSold), 10) || 0,
        minStock: parseInt(String(formData.minStock), 10) || 10,
        images: [formData.imageUrl],
      };

      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update product");

        setProductList((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? data.product : p))
        );
        showToast(`Product "${data.product.name}" updated successfully! Changes are live.`);
      } else {
        // POST create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create product");

        setProductList((prev) => [data.product, ...prev]);
        showToast(`Product "${data.product.name}" created successfully! Visible on website.`);
      }

      setIsModalOpen(false);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");

      setProductList((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      showToast(data.message || "Product deleted permanently.");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const filtered = productList.filter((p) => {
    if (categoryFilter !== "all" && p.categorySlug !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categorySlug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-8 space-y-6 max-w-7xl">
        {/* Toast confirmation */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs border border-purple-500 animate-in fade-in slide-in-from-top-3">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>ARADHAYA Admin Console</span>
              <span className="text-purple-300">•</span>
              <span className="text-slate-600">District Shamli, UP</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Products, Stock & Sales Console
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Admin-Only Interface: Edit Product Name, Price, Image, Category, Stock Quantity, and Sales Quantity. Changes immediately reflect on the public website.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all self-start sm:self-auto hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* ADMIN-ONLY STOCK & SALES DASHBOARD (4 Clean KPI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Stock Quantity
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {totalStockUnits.toLocaleString()} <span className="text-xs font-semibold text-slate-400">units</span>
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Available in warehouse
              </span>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Boxes className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Units Sold (Sales)
              </span>
              <p className="text-2xl font-extrabold text-purple-700 mt-1">
                {totalUnitsSold.toLocaleString()} <span className="text-xs font-semibold text-purple-400">sold</span>
              </p>
              <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 mt-0.5">
                <ShoppingCart className="w-3 h-3" /> Total units dispatched
              </span>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sales Information
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                ₹{Math.round(totalSalesRevenue).toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                Gross sales revenue value
              </span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Low Stock Information
              </span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                {lowStockCount} <span className="text-xs font-semibold text-amber-500">Items</span>
              </p>
              <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">
                At or below reorder threshold
              </span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product name, SKU, or category..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="baby-diapers">Baby Diapers</option>
              <option value="sanitary-pads">Sanitary Pads</option>
              <option value="panty-liners">Panty Liners</option>
              <option value="maternity-pads">Maternity Pads</option>
            </select>
            <span className="text-xs text-slate-500 whitespace-nowrap px-2">
              Showing <strong>{filtered.length}</strong> products
            </span>
          </div>
        </div>

        {/* DESKTOP TABLE VIEW (Admin-Only Data Structure: Image, Name, Price, Category, Stock Quantity, Units Sold, Sales Info, Low Stock Info) */}
        <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product Image & Name</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3 font-extrabold text-slate-800">Price (₹)</th>
                  <th className="py-3.5 px-3">Stock Quantity</th>
                  <th className="py-3.5 px-3">Units Sold</th>
                  <th className="py-3.5 px-3">Sales Information</th>
                  <th className="py-3.5 px-3">Low Stock Info</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((prod) => {
                  let img = "/images/aradhya-baby-diapers.jpg";
                  try {
                    const parsed = JSON.parse(prod.images);
                    if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
                  } catch {
                    if (prod.images) img = prod.images;
                  }

                  const revenue = (prod.unitsSold || 0) * (parseFloat(prod.finalPrice) || 0);
                  const isLow = prod.stock <= prod.minStock;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Product Image & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <Image src={img} alt={prod.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                            <span className="text-[10px] font-mono text-slate-400">{prod.sku} • {prod.packSize}</span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Product Category */}
                      <td className="py-3 px-3">
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-semibold border border-purple-100 whitespace-nowrap">
                          {prod.categorySlug}
                        </span>
                      </td>

                      {/* 3. Product Price */}
                      <td className="py-3 px-3">
                        <span className="text-sm font-extrabold text-slate-900 block">
                          ₹{prod.finalPrice}
                        </span>
                        {prod.discountPercent > 0 && (
                          <span className="text-[10px] text-rose-600 font-semibold">
                            {prod.discountPercent}% off (₹{prod.originalPrice})
                          </span>
                        )}
                      </td>

                      {/* 4. Stock Quantity */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm">{prod.stock}</span>
                          <span className="text-slate-400 text-[10px]">units</span>
                        </div>
                        {prod.stock === 0 ? (
                          <span className="text-[10px] font-bold text-red-600">🔴 Out of Stock</span>
                        ) : isLow ? (
                          <span className="text-[10px] font-bold text-amber-600">🟠 Low Stock</span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600">🟢 Healthy</span>
                        )}
                      </td>

                      {/* 5. Units Sold (Sales Quantity) */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-purple-700 text-sm block">
                          {prod.unitsSold || 0}
                        </span>
                        <span className="text-[10px] text-slate-400">units sold</span>
                      </td>

                      {/* 6. Sales Information */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">
                          ₹{Math.round(revenue).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">item sales</span>
                      </td>

                      {/* 7. Low Stock Information */}
                      <td className="py-3 px-3">
                        <div className="text-[11px]">
                          <span className="text-slate-500">Min Threshold: </span>
                          <span className="font-semibold text-slate-800">{prod.minStock}</span>
                        </div>
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold mt-0.5">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Action needed</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600">Sufficient</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            title="Edit Product Details, Price, Stock & Sales"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(prod.id)}
                            title="Delete Product"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE CARDS VIEW (Fully responsive for small screens & tablets) */}
        <div className="md:hidden space-y-4">
          {filtered.map((prod) => {
            let img = "/images/aradhya-baby-diapers.jpg";
            try {
              const parsed = JSON.parse(prod.images);
              if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
            } catch {
              if (prod.images) img = prod.images;
            }

            const revenue = (prod.unitsSold || 0) * (parseFloat(prod.finalPrice) || 0);
            const isLow = prod.stock <= prod.minStock;

            return (
              <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image src={img} alt={prod.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                        {prod.categorySlug}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">₹{prod.finalPrice}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 truncate mt-1">{prod.name}</h3>
                    <p className="text-[10px] text-slate-400">{prod.packSize} • SKU: {prod.sku}</p>
                  </div>
                </div>

                {/* Stock & Sales Metrics for this item */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Stock Qty</span>
                    <span className="font-bold text-slate-900">{prod.stock} units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Units Sold</span>
                    <span className="font-bold text-purple-700">{prod.unitsSold || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sales Value</span>
                    <span className="font-bold text-slate-900">₹{Math.round(revenue).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="text-[11px]">
                    {isLow ? (
                      <span className="text-amber-600 font-bold">⚠️ Low stock (Min: {prod.minStock})</span>
                    ) : (
                      <span className="text-emerald-600 font-medium">✓ Sufficient stock</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Product
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(prod.id)}
                      className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-red-100">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-slate-900">
                  Permanently delete this product?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  This action cannot be undone. Product records and specifications will be removed.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(deleteConfirmId)}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT / ADD PRODUCT MODAL (Admin permissions: Name, Price, Image, Category, Stock Quantity, Sales Quantity) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-purple-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-base">
                    {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Aradhya SoftCare Product"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* 1. PRODUCT NAME */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aradhya SoftCare Baby Diapers - Large (L)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 2. PRODUCT CATEGORY */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Product Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categorySlug}
                      onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white font-medium"
                    >
                      <option value="baby-diapers">Baby Diapers</option>
                      <option value="sanitary-pads">Sanitary Pads</option>
                      <option value="panty-liners">Panty Liners</option>
                      <option value="maternity-pads">Maternity Pads</option>
                    </select>
                  </div>

                  {/* Pack Size */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Pack Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.packSize}
                      onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                      placeholder="e.g. Pack of 42 Pants"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>

                {/* 3. PRODUCT PRICE & DISCOUNT */}
                <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
                  <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    <span>Product Price & Discount Management</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Original Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        required
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        placeholder="500"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Discount (0 - 100%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discountPercent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountPercent: Math.min(
                              100,
                              Math.max(0, parseInt(e.target.value, 10) || 0)
                            ),
                          })
                        }
                        placeholder="10"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] font-bold text-slate-700 mb-1">
                        Final Price (Live on Website)
                      </span>
                      <div className="px-3 py-2 bg-white rounded-xl border border-purple-200 text-sm font-extrabold text-purple-800">
                        ₹{previewFinalPrice}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. PRODUCT IMAGE (with live preview & instant presets) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Product Image
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="/images/aradhya-baby-diapers.jpg or HTTPS URL"
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 shrink-0">
                      <Image
                        src={formData.imageUrl || "/images/aradhya-baby-diapers.jpg"}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "/images/aradhya-baby-diapers.jpg" })}
                      className="text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 rounded-md border border-purple-200"
                    >
                      Preset: Baby Diapers
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "/images/aradhya-sanitary-pads.jpg" })}
                      className="text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 rounded-md border border-purple-200"
                    >
                      Preset: Sanitary Pads
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "/images/aradhya-panty-liners.jpg" })}
                      className="text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 rounded-md border border-purple-200"
                    >
                      Preset: Panty Liners
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "/images/aradhya-maternity-pads.jpg" })}
                      className="text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 rounded-md border border-purple-200"
                    >
                      Preset: Maternity Pads
                    </button>
                  </div>
                </div>

                {/* 5. STOCK QUANTITY & 6. SALES QUANTITY / UNITS SOLD */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Stock Quantity (Units)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white font-bold"
                    />
                    <div className="flex gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stock: formData.stock + 10 })}
                        className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded font-semibold"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stock: formData.stock + 50 })}
                        className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded font-semibold"
                      >
                        +50
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stock: Math.max(0, formData.stock - 10) })}
                        className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded font-semibold"
                      >
                        -10
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Sales Quantity (Units Sold)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.unitsSold}
                      onChange={(e) =>
                        setFormData({ ...formData, unitsSold: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white font-bold text-purple-700"
                    />
                    <div className="flex gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, unitsSold: formData.unitsSold + 10 })}
                        className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded font-semibold"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, unitsSold: formData.unitsSold + 50 })}
                        className="text-[10px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded font-semibold"
                      >
                        +50
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Min Stock Threshold
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.minStock}
                      onChange={(e) =>
                        setFormData({ ...formData, minStock: parseInt(e.target.value, 10) || 10 })
                      }
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Alert triggered below this level</span>
                  </div>
                </div>

                {/* SKU Code & Store Visibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g. AS-BD-01"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Store Visibility
                    </label>
                    <select
                      value={formData.isActive ? "active" : "inactive"}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      <option value="active">Active (Visible on public store)</option>
                      <option value="inactive">Deactivated (Hidden from public store)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Product Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter detailed description of materials, absorption layers, certifications..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <span>Save / Update Product</span>
                    )}
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
