"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { UserCheck, Plus, Search, Mail, Phone, Lock, User, Loader2, Check } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("employee123");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/employees")
      .then((res) => res.json())
      .then((data) => {
        if (data?.employees) setEmployees(data.employees);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees((prev) => [data.employee, ...prev]);
        setModalOpen(false);
        setName("");
        setEmail("");
        setPhone("");
        setToast("Employee account created!");
        setTimeout(() => setToast(null), 3500);
      } else {
        alert(data.error || "Failed to create employee");
      }
    } catch {
      alert("Error creating employee");
    } finally {
      setSaving(false);
    }
  };

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
              Production Employees & Staff
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage accounts with access to the Employee Production Entry Portal.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-3">Login Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Portal Role</th>
                  <th className="py-3 px-4 text-right">Added On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{emp.name}</td>
                    <td className="py-3 px-3 text-slate-600">{emp.email}</td>
                    <td className="py-3 px-3 text-slate-600">{emp.phone || "N/A"}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Production Staff
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {new Date(emp.createdAt || Date.now()).toLocaleDateString("en-IN", {
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

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 space-y-4">
              <h3 className="font-bold text-base text-slate-900">Add Production Employee</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Singh"
                    className="w-full text-xs px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Login Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employee2@aradhyacare.com"
                    className="w-full text-xs px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full text-xs px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl"
                  >
                    {saving ? "Saving..." : "Create Account"}
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
