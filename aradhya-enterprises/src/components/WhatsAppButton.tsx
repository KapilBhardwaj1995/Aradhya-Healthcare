"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  floating?: boolean;
  className?: string;
  label?: string;
}

export default function WhatsAppButton({
  phone,
  message,
  floating = true,
  className = "",
  label,
}: WhatsAppButtonProps) {
  const { t } = useLanguage();
  const [waNumber, setWaNumber] = useState(phone || "+919000012345");

  const defaultMsg = message || `Hello ${t.brandName}! I would like to inquire about your baby & feminine care products.`;
  const defaultLabel = label || (floating ? t.waCare : t.waInquiry);

  useEffect(() => {
    if (!phone) {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data?.settings?.whatsapp_number) {
            setWaNumber(data.settings.whatsapp_number);
          }
        })
        .catch(() => {});
    }
  }, [phone]);

  const cleanNumber = waNumber.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMsg)}`;

  if (floating) {
    return (
      <aside aria-label="WhatsApp Support Assistance" className="fixed bottom-6 right-6 z-50">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-4 py-3 rounded-full shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ring-2 ring-white/50"
          aria-label="Direct WhatsApp Support"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping" />
            <MessageCircle className="w-5 h-5 relative fill-current" />
          </div>
          <span className="text-xs font-bold pr-1">{defaultLabel}</span>
        </a>
      </aside>
    );
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs hover:shadow transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-current" />
      <span>{defaultLabel}</span>
    </a>
  );
}
