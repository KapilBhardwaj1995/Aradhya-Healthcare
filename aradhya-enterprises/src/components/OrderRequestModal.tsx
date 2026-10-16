"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  X,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Loader2,
  Package,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export interface ProductItem {
  id: number;
  name: string;
  packSize: string;
  finalPrice: string;
  originalPrice: string;
  discountPercent: number;
  availabilityStatus?: string;
  images?: string;
}

interface OrderRequestModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderRequestModal({
  product,
  isOpen,
  onClose,
}: OrderRequestModalProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    requestId: string;
    whatsappUrl: string;
    productName: string;
    quantity: number;
    totalEstimate: string;
  } | null>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.email) setCustomerEmail(user.email);
      if (user.address) setCustomerAddress(user.address);
    }
  }, [user]);

  // Reset when opening a new product
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setError(null);
      setSuccessData(null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const unitPrice = parseFloat(product.finalPrice);
  const totalEstimate = (unitPrice * quantity).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || !customerAddress.trim()) {
      setError("Please fill in your name, contact phone, email, and delivery/pickup address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName,
          customerPhone,
          customerEmail,
          customerAddress,
          quantity,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit order request");
      }

      setSuccessData({
        requestId: data.requestId,
        whatsappUrl: data.whatsappUrl,
        productName: product.name,
        quantity,
        totalEstimate,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-purple-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#141d42] to-[#2b3a7a] text-white border-b border-[#d4a43c]/40">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#d4a43c]" />
            <h3 className="font-bold text-base sm:text-lg">
              {successData ? t.modalSubmittedTitle : t.modalTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {successData ? (
            /* Success confirmation screen */
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Request ID: {successData.requestId}
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-2">
                  {t.modalSubmittedTitle}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  {t.modalSubmittedDesc}
                </p>
              </div>

              {/* Order Request Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Product:</span>
                  <span className="font-semibold text-slate-800 text-right">{successData.productName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="font-semibold text-slate-800">{successData.quantity} Units / Packs</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Estimated Total:</span>
                  <span className="font-bold text-purple-700 text-sm">₹{successData.totalEstimate}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    New Request
                  </span>
                </div>
              </div>

              {/* WhatsApp direct contact action */}
              <div className="pt-2 space-y-3">
                <a
                  href={successData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{t.modalWhatsappBtn}</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 transition-colors"
                >
                  {t.modalCloseBtn}
                </button>
              </div>
            </div>
          ) : (
            /* Order Request Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Info Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50/80 border border-purple-100 text-xs">
                <div>
                  <h4 className="font-bold text-purple-950 text-sm leading-tight">{product.name}</h4>
                  <p className="text-purple-700 mt-0.5">{product.packSize}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {product.discountPercent > 0 && (
                      <span className="text-slate-400 line-through text-[11px]">
                        ₹{parseFloat(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                    <span className="font-bold text-purple-800 text-base">₹{product.finalPrice}</span>
                  </div>
                  {product.discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">
                      {product.discountPercent}% {t.badgeDiscount}
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.modalQtyLabel}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-slate-800 min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-xs text-slate-600">
                    {t.modalSubtotal} <strong className="text-purple-700 font-bold">₹{totalEstimate}</strong>
                  </div>
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.modalFullName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priya Deshmukh"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t.modalPhone} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t.modalEmail} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.modalAddress} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <textarea
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Street, Landmark, City, State, PIN code"
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.modalNotes}
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Need urgent confirmation, hospital purchase inquiry"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              {/* Direct Inquiry Clarification Notice */}
              <div className="p-3 bg-purple-50/60 rounded-xl text-[11px] text-purple-900 border border-purple-200/60 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  {t.modalDirectNotice}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {t.modalCancel}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.modalSubmitting}</span>
                    </>
                  ) : (
                    <span>{t.modalSubmitBtn} (₹{totalEstimate})</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
