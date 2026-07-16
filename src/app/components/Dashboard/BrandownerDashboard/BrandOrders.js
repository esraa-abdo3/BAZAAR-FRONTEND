"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BrandPagination from "./BrandPagination";

const BASE_URL = "https://bazary-backend.vercel.app/api";
const PAGE_SIZE = 8;

function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// الباك إند بيرجع الـ id في حقل اسمه orderId مش _id
function getOrderId(order) {
  return order?.orderId ?? order?._id ?? "";
}

const STATUS_STYLES = {
  confirmed: "text-blue-600 bg-blue-50",
  preparing: "text-blue-600 bg-blue-50",
  pending: "text-orange-600 bg-orange-50",
  shipped: "text-teal-600 bg-teal-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
};

const FILTERS = ["All Orders", "Pending", "Shipped", "Delivered"];

export default function BrandOrders({ onViewDetail }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Orders");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${BASE_URL}/brand/orders`, {
          headers: getHeaders(),
        });
        const list = res.data?.data?.orders ?? res.data?.data ?? res.data ?? [];
        setOrders(Array.isArray(list) ? list : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  async function updateStatus(id, status) {
    const backendStatus = status.toUpperCase();
    setUpdating(id + status);
    try {
      await axios.patch(
        `${BASE_URL}/brand/orders/${id}/status`,
        { status: backendStatus },
        { headers: getHeaders() },
      );
      setOrders((prev) =>
        prev.map((o) => (getOrderId(o) === id ? { ...o, status: backendStatus } : o)),
      );
    } catch (err) {
      alert(
        err?.response?.data?.message ??
          "Failed to update order status. Try again.",
      );
    } finally {
      setUpdating(null);
    }
  }

  const filtered = orders.filter((o) => {
    const matchFilter =
      filter === "All Orders" ||
      o.status?.toLowerCase() === filter.toLowerCase();

    const fullId = getOrderId(o).toLowerCase();
    const shortId = fullId.slice(-4);
    const query = search.trim().toLowerCase().replace(/^#?ord-?/, "");

    const matchSearch =
      !search ||
      fullId.includes(query) ||
      shortId.includes(query) ||
      (o.customerId?.fullName ?? o.customer?.fullName ?? o.customer?.name ?? "")
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <p className="text-xs text-gray-400 mb-1">Brand / Order Management</p>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          All Orders
        </h1>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ID, customer "
          className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 transition-colors"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No orders found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider">
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Order ID
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Date
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Customer
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Total
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-right font-semibold">
                      Quick Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((order, i) => {
                    const orderId = `#ORD-${getOrderId(order).slice(-4).toUpperCase() || String(i)}`;
                    const customer =
                      order.customerId?.fullName ??
                      order.customer?.fullName ??
                      order.customer?.name ??
                      "Customer";
                    const date = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—";
                    const status = (order.status ?? "pending").toLowerCase();
                    const total = Number(
                      order.totalAmount ?? order.totalPrice ?? order.total ?? 0,
                    ).toFixed(2);
                    const isDone =
                      status === "delivered" || status === "cancelled";

                    return (
                      <tr
                        key={getOrderId(order) || i}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-4 sm:px-5 py-3">
                          <button
                            onClick={() => onViewDetail(order)}
                            className="font-semibold text-indigo-600 hover:underline"
                          >
                            {orderId}
                          </button>
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-gray-500">
                          {date}
                        </td>
                        <td className="px-4 sm:px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-medium text-indigo-600 shrink-0">
                              {customer[0]?.toUpperCase()}
                            </div>
                            <span className="text-gray-700 font-medium truncate max-w-[120px]">
                              {customer}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-5 py-3 font-medium text-gray-800">
                          ${total}
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            {["prepare", "ship", "deliver"].map((action) => {
                              const actionStatus =
                                action === "prepare"
                                  ? "preparing"
                                  : action === "ship"
                                    ? "shipped"
                                    : "delivered";
                              const isCurrentStatus = status === actionStatus;
                              return (
                                <button
                                  key={action}
                                  onClick={() =>
                                    updateStatus(getOrderId(order), actionStatus)
                                  }
                                  disabled={
                                    isDone ||
                                    updating === getOrderId(order) + actionStatus
                                  }
                                  className={`px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                                    isCurrentStatus
                                      ? "bg-indigo-600 text-white"
                                      : isDone
                                        ? "text-gray-200 cursor-not-allowed"
                                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {updating === getOrderId(order) + actionStatus
                                    ? "..."
                                    : action}
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
            </div>
            <BrandPagination
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="orders"
            />
          </>
        )}
      </div>
    </div>
  );
}
