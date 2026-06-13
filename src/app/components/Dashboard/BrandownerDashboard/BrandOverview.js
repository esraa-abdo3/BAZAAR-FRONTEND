"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BrandAIInsights from "./BrandAIInsights";

const BASE_URL = "https://bazary-backend.vercel.app/api";
function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const STATUS_STYLES = {
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-blue-100 text-blue-700",
  shipped: "bg-teal-100 text-teal-700",
  pending: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// Simple bar chart using divs
function MiniBarChart({ orders }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = days.map(
    (_, i) =>
      orders.filter((o) => new Date(o.createdAt).getDay() === (i + 1) % 7)
        .length,
  );
  const max = Math.max(...counts, 1);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {counts.map((c, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full rounded-sm transition-all ${i === 3 ? "bg-[#9A5F4C]" : "bg-stone-200"}`}
            style={{ height: `${Math.max((c / max) * 48, 4)}px` }}
          />
        </div>
      ))}
    </div>
  );
}

// Simple area chart SVG
function MiniAreaChart({ orders }) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const count = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getDate() % 8 === i;
    }).length;
    return count;
  });
  const max = Math.max(...pts, 1);
  const w = 200,
    h = 60;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map((v) => h - (v / max) * (h - 8));
  const pathD = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x},${ys[i]}`)
    .join(" ");
  const areaD = pathD + ` L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#50604A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#50604A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke="#50604A" strokeWidth="1.5" />
    </svg>
  );
}

export default function BrandOverview({ onViewOrders, onViewProducts }) {
  const [orders, setOrders] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [d, o] = await Promise.allSettled([
          axios.get(`${BASE_URL}/brand/dashboard`, { headers: getHeaders() }),
          axios.get(`${BASE_URL}/brand/orders`, { headers: getHeaders() }),
        ]);
        if (d.status === "fulfilled") {
          setDashboard(d.value.data?.data ?? null);
        }
        if (o.status === "fulfilled") {
          const list =
            o.value.data?.data?.orders ??
            o.value.data?.data ??
            o.value.data ??
            [];
          setOrders(Array.isArray(list) ? list : []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalRevenue = dashboard?.totalRevenue ?? 0;
  const ordersCount = dashboard?.ordersCount ?? orders.length;
  const avgOrderValue = dashboard?.avgOrderValue ?? 0;
  const topProducts = dashboard?.topSelling ?? [];
  const inventoryRisks = dashboard?.inventoryRisks ?? [];
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const [orderFilter, setOrderFilter] = useState("All");
  const filteredOrders =
    orderFilter === "All"
      ? recentOrders
      : recentOrders.filter(
          (o) => o.status?.toLowerCase() === orderFilter.toLowerCase(),
        );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#50604A", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Revenue */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
            Total Revenue
          </p>
          <p className="text-3xl font-bold text-stone-900 mb-1">
            $
            {totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mb-4">
            <span className="text-xs text-green-600 font-medium">↑ +12.5%</span>
            <span className="text-xs text-stone-400">vs last month</span>
          </div>
          <MiniAreaChart orders={orders} />
        </div>

        {/* Orders Count */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
            Orders Count
          </p>
          <p className="text-3xl font-bold text-stone-900 mb-1">
            {ordersCount.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mb-4">
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#50604A"
              strokeWidth={2}
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-stone-400">
              {
                recentOrders.filter((o) => {
                  const d = new Date(o.createdAt);
                  return d.toDateString() === new Date().toDateString();
                }).length
              }{" "}
              orders today
            </span>
          </div>
          <MiniBarChart orders={orders} />
        </div>

        {/* Avg Order Value */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
            Avg. Order Value
          </p>
          <p className="text-3xl font-bold text-stone-900 mb-1">
            $
            {avgOrderValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center gap-1 mb-4">
            <span className="text-xs text-stone-400">
              ↔ Stable across current quarter
            </span>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-stone-400 mb-1">
              <span>Growth Target</span>
              <span>82%</span>
            </div>
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#50604A] rounded-full"
                style={{ width: "82%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Orders — 2/3 */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-stone-800">
                Recent Orders
              </h2>
              <p className="text-xs text-stone-400">
                Reviewing your latest brand transactions.
              </p>
            </div>
            <div className="flex gap-1">
              {["All", "Pending", "Shipped"].map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                    ${orderFilter === f ? "bg-stone-100 text-stone-800" : "text-stone-400 hover:text-stone-700"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              No orders found
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-medium">Order ID</th>
                  <th className="px-6 py-3 text-left font-medium">Customer</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr
                    key={order._id ?? i}
                    className="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-[#3d4f38]">
                      #ORD-{(order._id ?? String(i)).slice(-4).toUpperCase()}
                    </td>
                    <td className="px-6 py-3 text-stone-700">
                      {order.customerId?.fullName ??
                        order.customer?.fullName ??
                        order.customer?.name ??
                        "Customer"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[(order.status ?? "").toLowerCase()] ?? "bg-stone-100 text-stone-600"}`}
                      >
                        {(order.status ?? "pending").toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-stone-800">
                      $
                      {Number(
                        order.totalAmount ??
                          order.totalPrice ??
                          order.total ??
                          0,
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="px-6 py-3 border-t border-stone-100">
            <button
              onClick={onViewOrders}
              className="text-xs text-stone-500 hover:text-[#3d4f38] font-medium transition-colors"
            >
              VIEW ALL ORDERS →
            </button>
          </div>
        </div>

        {/* Right sidebar — 1/3 */}
        <div className="flex flex-col gap-4">
          {/* Top Selling */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-widest mb-4">
              Top Selling
            </h3>
            {topProducts.length === 0 ? (
              <p className="text-xs text-stone-400">No products yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {topProducts.slice(0, 2).map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-stone-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-stone-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {p.quantity ?? 0} in stock
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#3d4f38]">
                        {p.totalSold ?? 0} sold
                      </p>
                      <p className="text-[10px] text-stone-400">
                        +$
                        {(
                          ((p.totalSold ?? 0) * Number(p.price ?? 0)) /
                          1000
                        ).toFixed(1)}
                        k rev
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inventory Risks */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#f59e0b"
                strokeWidth={2}
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
              </svg>
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-700">
                Inventory Risks
              </h3>
            </div>
            {inventoryRisks.length === 0 ? (
              <p className="text-xs text-stone-400">
                All stock levels are healthy
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {inventoryRisks.slice(0, 3).map((p, i) => {
                  const stock = p.quantity ?? 0;
                  return (
                    <div
                      key={p._id ?? i}
                      className="flex items-center justify-between"
                    >
                      <p className="text-xs text-stone-700 truncate flex-1">
                        {p.name}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ml-2 shrink-0
                        ${stock === 0 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}
                      >
                        {stock === 0 ? "OUT" : `${stock} LEFT`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              onClick={onViewProducts}
              className="mt-4 w-full text-[10px] font-semibold uppercase tracking-wider border border-stone-200 text-stone-600 py-2 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Restock All
            </button>
          </div>

          {/* AI Insights */}
          <BrandAIInsights />
        </div>
      </div>
    </div>
  );
}
