"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Users, Search, Mail, Phone, Calendar, ClipboardList } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  orderCount: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data?.customers) setCustomers(data.customers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
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
              Customer Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registered customers, institutions, clinics, and pharmacies.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            Total: <strong>{customers.length}</strong> Customers
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, email, or phone..."
            className="w-full text-xs focus:outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-3">Contact Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Primary Delivery Address</th>
                  <th className="py-3 px-3">Order Requests</th>
                  <th className="py-3 px-4 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-3 text-slate-600">{c.email}</td>
                    <td className="py-3 px-3 text-slate-600">{c.phone || "N/A"}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{c.address || "No address saved"}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {c.orderCount} Requests
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
