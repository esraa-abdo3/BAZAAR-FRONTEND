"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api";
function getHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const STATUS_STYLES = {
  confirmed: "text-blue-600 bg-blue-50",
  pending:   "text-orange-600 bg-orange-50",
  shipped:   "text-teal-600 bg-teal-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
};

const FILTERS = ["All Orders", "Pending", "Shipped", "Delivered"];

export default function BrandOrders({ onViewDetail }) {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("All Orders");
  const [search,  setSearch]  = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res  = await axios.get(`${BASE_URL}/orders/brand`, { headers: getHeaders() });
        const list = res.data?.data ?? res.data ?? [];
        setOrders(Array.isArray(list) ? list : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function updateStatus(id, status) {
    setUpdating(id + status);
    try {
      await axios.put(`${BASE_URL}/orders/${id}/status`, { status }, { headers: getHeaders() });
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    } finally {
      setUpdating(null);
    }
  }

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "All Orders" || o.status?.toLowerCase() === filter.toLowerCase();
    const matchSearch = !search ||
      (o._id ?? "").includes(search) ||
      (o.customer?.fullName ?? o.customer?.name ?? "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <p className="text-xs text-stone-400 mb-1">Atelier / Order Management</p>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-stone-900">All Orders</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-xs border border-stone-200 px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors font-medium">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export pdf
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-[#3d4f38] text-white px-4 py-2 rounded-lg hover:bg-[#22301D] transition-colors font-medium">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 13l4 4L19 7" />
            </svg>
            Bulk Mark Shipped
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors
              ${filter === f ? "bg-stone-100 text-stone-800 border border-stone-200" : "text-stone-500 hover:text-stone-700"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ID, customer or product..."
          className="w-full pl-9 pr-4 py-2.5 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-stone-400 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#50604A", borderTopColor: "transparent" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-stone-400 text-sm">No orders found</div>
        ) : (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-medium">Order ID</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Total</th>
                  <th className="px-5 py-3 text-right font-medium">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => {
                  const orderId  = `#ORD-${(order._id ?? String(i)).slice(-4).toUpperCase()}`;
                  const customer = order.customer?.fullName ?? order.customer?.name ?? "Customer";
                  const date     = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "—";
                  const status  = order.status ?? "pending";
                  const total   = Number(order.totalPrice ?? order.total ?? 0).toFixed(2);
                  const isDone  = status === "delivered" || status === "cancelled";

                  return (
                    <tr
                      key={order._id ?? i}
                      className={`border-b border-stone-50 last:border-0 transition-colors
                        ${order._id === filtered[0]?._id && i === 0 ? "bg-stone-50" : "hover:bg-stone-50/50"}`}
                    >
                      <td className="px-5 py-3">
                        <button
                          onClick={() => onViewDetail(order)}
                          className="font-semibold text-[#3d4f38] hover:underline"
                        >
                          {orderId}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-stone-500">{date}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[9px] font-medium text-stone-600 shrink-0">
                            {customer[0]?.toUpperCase()}
                          </div>
                          <span className="text-stone-700 font-medium">{customer}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-stone-100 text-stone-600"}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-stone-800">${total}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {["prepare", "ship", "deliver"].map((action) => {
                            const actionStatus = action === "prepare" ? "confirmed" : action === "ship" ? "shipped" : "delivered";
                            const isCurrentStatus = status === actionStatus;
                            return (
                              <button
                                key={action}
                                onClick={() => updateStatus(order._id, actionStatus)}
                                disabled={isDone || updating === order._id + actionStatus}
                                className={`px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wide transition-colors
                                  ${isCurrentStatus
                                    ? "bg-[#3d4f38] text-white"
                                    : isDone
                                    ? "text-stone-200 cursor-not-allowed"
                                    : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                                  }`}
                              >
                                {updating === order._id + actionStatus ? "..." : action}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-stone-100 text-xs text-stone-400">
              Showing {filtered.length} of {orders.length} orders
            </div>
          </>
        )}
      </div>
    </div>
  );
}
