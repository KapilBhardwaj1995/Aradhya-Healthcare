"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { BarChart3, TrendingUp, Package, Factory, Download, Calendar } from "lucide-react";

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) setReportData(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    if (!reportData) return;
    let csv = "Product Name,Total Produced Units,Approved Units\n";
    reportData.productWiseProduction?.forEach((p: any) => {
      csv += `"${p.name}",${p.totalProduced},${p.approvedCount}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aradhaya-production-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-slate-900">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Reports & Performance Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Production output breakdown, status distributions, and order trends.
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Top Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Production Manufactured
            </span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {reportData?.totalProductionUnits?.toLocaleString() || 0} units
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Customer Order Requests
            </span>
            <p className="text-2xl font-extrabold text-purple-700 mt-1">
              {reportData?.totalOrders || 0} Requests
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Product Categories Active
            </span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              4 Categories
            </p>
          </div>
        </div>

        {/* Product-Wise Production Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Factory className="w-4 h-4 text-purple-600" />
            <span>Product-Wise Production Output</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Total Produced</th>
                  <th className="py-2.5 px-3">QA Approved</th>
                  <th className="py-2.5 px-3">Approval Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {reportData?.productWiseProduction?.map((p: any, idx: number) => {
                  const rate = p.totalProduced > 0 ? Math.round((p.approvedCount / p.totalProduced) * 100) : 100;
                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-3">{p.totalProduced.toLocaleString()} units</td>
                      <td className="py-2.5 px-3 font-bold text-purple-700">{p.approvedCount.toLocaleString()} units</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
