"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
} from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  adminReply?: string | null;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [replyId, setReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/inquiries")
      .then((res) => res.json())
      .then((data) => {
        if (data?.inquiries) {
          setInquiries(data.inquiries);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (id: number, status: string, reply?: string) => {
    setSending(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminReply: reply }),
      });
      const data = await res.json();
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? data.inquiry : item))
        );
        setReplyId(null);
        setReplyText("");
      }
    } catch (e) {
      alert("Failed to update inquiry");
    } finally {
      setSending(false);
    }
  };

  const filtered = inquiries.filter((inq) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.phone.includes(q) ||
        inq.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Inquiries
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review and resolve messages submitted from the public contact page and clinic wholesale inquiries.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            Total: <strong>{inquiries.length}</strong> Inquiries
          </span>
        </div>

        {/* Search */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by name, email, phone..."
            className="w-full text-xs focus:outline-none"
          />
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading inquiries...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No inquiries found.
            </div>
          ) : (
            filtered.map((inq) => (
              <div
                key={inq.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-sm text-slate-900">{inq.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        inq.status === "Resolved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : inq.status === "In Progress"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-pink-500" />
                    <span>{inq.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-purple-500" />
                    <span>{inq.email}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-purple-900">{inq.subject}</h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl mt-1.5 leading-relaxed">
                    &quot;{inq.message}&quot;
                  </p>
                </div>

                {inq.adminReply && (
                  <div className="p-3 bg-purple-50 rounded-xl text-xs border border-purple-100">
                    <span className="font-bold text-purple-900">Admin Response:</span>
                    <p className="text-purple-800 mt-0.5">{inq.adminReply}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {inq.status !== "Resolved" && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, "Resolved", inq.adminReply || "Resolved by call")}
                        className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {inq.status !== "In Progress" && inq.status !== "Resolved" && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, "In Progress")}
                        className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold"
                      >
                        In Progress
                      </button>
                    )}
                  </div>

                  <a
                    href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${inq.name}! This is Aradhaya Enterprises responding to your inquiry regarding ${inq.subject}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Reply on WhatsApp
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
