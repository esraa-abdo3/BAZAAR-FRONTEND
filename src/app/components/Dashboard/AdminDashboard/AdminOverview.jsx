"use client";

import { useState, useEffect } from "react";
import { getAdminDashboard, getAdminAnalytics } from "@/app/services/adminService";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Simple SVG line/area chart
function SimpleLineChart({ data, valueKey, color = "#3d4f38", height = 180 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-xs text-stone-400" style={{ height }}>
        No revenue trend data available
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  const W = 600;
  const H = height - 28;
  const pad = 10;
  const points = data.map((d, i) => {
    const x = pad + (data.length > 1 ? (i / (data.length - 1)) : 0.5) * (W - 2 * pad);
    const y = H - pad - ((d[valueKey] || 0) / max) * (H - 2 * pad);
    return { x, y };
  });
  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  const fillPath = `M${firstX},${H - pad} L${pointsStr} L${lastX},${H - pad} Z`;
  const linePath = `M${pointsStr}`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
        <defs>
          <linearGradient id={`areaGrad-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#areaGrad-${valueKey})`} />
        <polyline points={pointsStr} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between mt-1 px-1">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] text-stone-400 flex-1 text-center truncate">
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashboardData, analyticsData] = await Promise.all([
          getAdminDashboard(),
          getAdminAnalytics(),
        ]);
        setStats(dashboardData);
        setAnalytics(analyticsData);
      } catch (err) {
        setError("Failed to load overview data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#3d4f38", borderTopColor: "transparent" }}
        />
        <p className="text-sm text-stone-500">Loading system overview analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm max-w-lg mx-auto my-8">
        {error}
      </div>
    );
  }

  const revenueTrendData = (analytics?.revenueTrend || []).map((item) => ({
    name: `${MONTHS[item.month]}`,
    Revenue: item.totalRevenue,
    Orders: item.totalOrders,
  }));

  const bazaarComparisonData = (analytics?.topBazaars || []).map((item) => ({
    name: item.bazaarName,
    Revenue: item.totalRevenue,
  }));

  const orderStatusData = analytics?.ordersByStatus
    ? Object.entries(analytics.ordersByStatus).map(([status, value]) => ({
        name: status,
        value,
      }))
    : [];

  const kpis = [
    {
      label: "TOTAL REVENUE",
      value: `${(stats?.totalRevenue ?? 0).toLocaleString()} EGP`,
      accent: "#3d4f38",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      label: "TOTAL ORDERS",
      value: (stats?.ordersCount ?? 0).toLocaleString(),
      accent: "#50604A",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.57L23 6H6" />
        </svg>
      ),
    },
    {
      label: "TOTAL BAZAARS",
      value: (stats?.bazaarsCount ?? 0).toLocaleString(),
      accent: "#9A5F4C",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "TOTAL BRANDS",
      value: (stats?.brandsCount ?? 0).toLocaleString(),
      accent: "#3d4f38",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      label: "PRODUCTS",
      value: (stats?.productsCount ?? 0).toLocaleString(),
      accent: "#50604A",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      label: "REGISTERED USERS",
      value: (stats?.usersCount ?? 0).toLocaleString(),
      accent: "#9A5F4C",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ];

  const STATUS_BADGE = {
    DELIVERED: "bg-green-100 text-green-700",
    PENDING: "bg-orange-100 text-orange-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h2 className="text-sm font-semibold text-stone-800">System Overview</h2>
        <p className="text-xs text-stone-400">
          Real-time metrics and performance charts across all bazaars &amp; brands.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(({ label, value, accent, icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                {label}
              </span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: accent + "18", color: accent }}
              >
                {icon}
              </div>
            </div>
            <p className="text-lg font-bold text-stone-800 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Trend Area Chart */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 lg:col-span-2">
          <div className="flex items-center gap-1.5 mb-4">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#3d4f38" }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <h3 className="text-sm font-semibold text-stone-700">Revenue Trend (Monthly)</h3>
          </div>
          <SimpleLineChart data={revenueTrendData} valueKey="Revenue" color="#3d4f38" height={200} />
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Orders Fulfillment</h3>
          {orderStatusData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-xs text-stone-400">
              No orders status data available
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orderStatusData.map((item) => {
                const total = orderStatusData.reduce((s, i) => s + i.value, 0);
                const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                const cls = STATUS_BADGE[item.name] || "bg-blue-100 text-blue-700";
                return (
                  <div key={item.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] font-bold text-stone-600">
                        {item.value} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: "#3d4f38" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Bazaars horizontal bar */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Top Bazaars by Revenue</h3>
          {bazaarComparisonData.length === 0 ? (
            <div className="flex items-center justify-center h-36 text-xs text-stone-400">
              No bazaar analytics data available
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {bazaarComparisonData.slice(0, 5).map((item, idx) => {
                const max = Math.max(...bazaarComparisonData.map((d) => d.Revenue || 0), 1);
                const pct = Math.round(((item.Revenue || 0) / max) * 100);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 w-24 truncate flex-shrink-0">{item.name}</span>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: "#50604A" }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-stone-600 w-20 text-right flex-shrink-0">
                      {(item.Revenue || 0).toLocaleString()} EGP
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Brands List */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Top Brands Ranking</h3>
          <div className="flex flex-col gap-3">
            {(analytics?.topBrands || []).slice(0, 4).map((brand, idx) => (
              <div
                key={brand.brandId || idx}
                className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-400 bg-stone-50 w-5 h-5 flex items-center justify-center rounded">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-stone-700">{brand.brandName}</p>
                    <p className="text-[10px] text-stone-400">{brand.brandCategory}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: "#3d4f38" }}>
                    {(brand.totalRevenue || 0).toLocaleString()} EGP
                  </p>
                  <p className="text-[9px] text-stone-400">{brand.totalOrders} Orders</p>
                </div>
              </div>
            ))}
            {(!analytics?.topBrands || analytics.topBrands.length === 0) && (
              <div className="text-center text-xs text-stone-400 py-10">
                No top brands data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top products by sales */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center gap-1.5 mb-4">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#50604A" }}>
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
            <h3 className="text-sm font-semibold text-stone-700">Top Products by Sales Volume</h3>
          </div>
          <div className="flex flex-col gap-3">
            {(analytics?.topProductsBySales || []).slice(0, 5).map((prod, idx) => (
              <div
                key={prod._id || idx}
                className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {prod.images && prod.images[0] ? (
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-stone-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100 text-stone-400">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-700 truncate">{prod.name}</p>
                    <p className="text-[10px] text-stone-400 truncate">
                      Brand: {prod.brandId?.brandName || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-stone-700">{prod.price} EGP</p>
                  <p className="text-[9px] font-semibold" style={{ color: "#50604A" }}>
                    Stock: {prod.quantity}
                  </p>
                </div>
              </div>
            ))}
            {(!analytics?.topProductsBySales || analytics.topProductsBySales.length === 0) && (
              <div className="text-center text-xs text-stone-400 py-10">
                No top products by sales available
              </div>
            )}
          </div>
        </div>

        {/* Top products by views */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center gap-1.5 mb-4">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#9A5F4C" }}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <h3 className="text-sm font-semibold text-stone-700">Top Products by Views</h3>
          </div>
          <div className="flex flex-col gap-3">
            {(analytics?.topProductsByViews || []).slice(0, 5).map((prod, idx) => (
              <div
                key={prod._id || idx}
                className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {prod.images && prod.images[0] ? (
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-stone-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100 text-stone-400">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-700 truncate">{prod.name}</p>
                    <p className="text-[10px] text-stone-400 truncate">
                      Brand: {prod.brandId?.brandName || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-stone-700 flex items-center gap-1 justify-end">
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-stone-400">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {prod.viewsCount || 0}
                  </p>
                  <p className="text-[9px] text-stone-400">Price: {prod.price} EGP</p>
                </div>
              </div>
            ))}
            {(!analytics?.topProductsByViews || analytics.topProductsByViews.length === 0) && (
              <div className="text-center text-xs text-stone-400 py-10">
                No top products by views available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
