"use client";

import { useEffect, useState } from "react";
// axios import removed; using brandService with auth interceptor
import BrandAIInsights from "./BrandAIInsights";

const STATUS_STYLES = {
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-blue-100 text-blue-700",
  shipped: "bg-teal-100 text-teal-700",
  pending: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};


function MiniBarChart({ orders }) {
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNamesAr = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

  const counts = dayLabels.map(
    (_, i) =>
      orders.filter((o) => new Date(o.createdAt).getDay() === (i + 1) % 7)
        .length,
  );
  const max = Math.max(...counts);
  const hasData = max > 0;
  // لو أكتر من يوم بنفس أعلى عدد، ناخد أول واحد بس عشان الهينت يبقى واضح
  const peakIndex = hasData ? counts.indexOf(max) : -1;

  return (
    <div>
      <div className="flex items-end gap-1.5 h-16">
        {counts.map((c, i) => (
          <div
            key={i}
            className="group relative flex-1 flex flex-col items-center justify-end h-full"
          >
            {/* الرقم بيظهر فوق العمود عند الهوفر */}
            <span className="absolute -top-4 text-[9px] font-semibold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {c}
            </span>
            <div
              title={`${dayLabels[i]}: ${c} order${c === 1 ? "" : "s"}`}
              className={`w-full rounded-sm transition-all ${
                i === peakIndex ? "bg-indigo-600" : "bg-gray-200"
              }`}
              style={{ height: `${hasData ? Math.max((c / max) * 40, 3) : 3}px` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {dayLabels.map((d, i) => (
          <span
            key={d}
            className={`flex-1 text-center text-[9px] font-medium ${
              i === peakIndex ? "text-indigo-600" : "text-gray-300"
            }`}
          >
            {d[0]}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-2">
        {hasData ? (
          <>
          Most Orders Received:

            <span className="font-semibold text-indigo-600">
              {dayNamesAr[peakIndex]}
            </span>{" "}
            ({max} orders)
          </>
        ) : (
          "لسه مفيش بيانات كفاية لتحديد أكتر يوم"
        )}
      </p>
    </div>
  );
}

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
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth="1.5" />
    </svg>
  );
}

export default function BrandOverview({
  onViewOrders,
  onViewProducts,
  dashboard,
  orders = [],
  ordersLoading = false,
  ordersError = null,
  aiLoading = false,
  aiError = null,
  onRetry,
}) {

  // fallback: لو /brand/dashboard فشلت (زي مشكلة خدمة الـ AI من ناحية السيرفر)
  // نحسب الإحصائيات الأساسية من الأوردرز نفسها بدل ما نوقف الصفحة كلها
  const fallbackRevenue = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount ?? o.totalPrice ?? o.total ?? 0),
    0,
  );
  const totalRevenue = dashboard?.totalRevenue ?? fallbackRevenue;
  const ordersCount = dashboard?.ordersCount ?? orders.length;
  const avgOrderValue =
    dashboard?.avgOrderValue ??
    (orders.length ? fallbackRevenue / orders.length : 0);
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

  // الصفحة كلها بتوقف بس لو بيانات الأوردرز الأساسية فشلت
  // فشل الداشبورد/الـ AI مش سبب كافي لإخفاء الصفحة كلها
  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center">
        <p className="text-sm text-red-500 font-medium">
          حصل خطأ أثناء تحميل بيانات الداشبورد: {ordersError}
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {/* Revenue */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Total Revenue
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            $
            {totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mb-4">
            <span className="text-xs text-emerald-500 font-medium">↑ Live data</span>
          </div>
          <MiniAreaChart orders={orders} />
        </div>

        {/* Orders Count */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Orders Count
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            {ordersCount.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mb-4">
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#4f46e5"
              strokeWidth={2}
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-400">
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
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Avg. Order Value
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            $
            {avgOrderValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center gap-1 mb-4">
            <span className="text-xs text-gray-400">
              Stable across current quarter
            </span>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Growth Target</span>
              <span>82%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: "82%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
        {/* Recent Orders — 2/3 */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Recent Orders
              </h2>
              <p className="text-xs text-gray-400">
                Reviewing your latest brand transactions.
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {["All", "Pending", "Shipped"].map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    orderFilter === f
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold text-[10px]">
                      Order ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold text-[10px]">
                      Customer
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold text-[10px]">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right font-semibold text-[10px]">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, i) => (
                    <tr
                      key={order.orderId ?? order._id ?? i}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 font-medium text-indigo-600">
                        #ORD-{(order.orderId ?? order._id ?? String(i)).slice(-4).toUpperCase()}
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-gray-700">
                        {order.customerId?.fullName ??
                          order.customer?.fullName ??
                          order.customer?.name ??
                          "Customer"}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[(order.status ?? "").toLowerCase()] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {(order.status ?? "pending").toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-right font-medium text-gray-800">
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
            </div>
          )}

          <div className="px-4 sm:px-6 py-3 border-t border-gray-100">
            <button
              onClick={onViewOrders}
              className="text-xs text-gray-500 hover:text-indigo-600 font-medium transition-colors"
            >
              VIEW ALL ORDERS →
            </button>
          </div>
        </div>

        {/* Right sidebar — 1/3 */}
        <div className="flex flex-col gap-4">
          {/* Top Selling */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Top Selling
            </h3>
            {aiError && !dashboard ? (
              <p className="text-xs text-amber-500">تعذّر تحميل البيانات حاليًا</p>
            ) : topProducts.length === 0 ? (
              <p className="text-xs text-gray-400">No products yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {topProducts.slice(0, 2).map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {p.quantity ?? 0} in stock
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-indigo-600">
                        {p.totalSold ?? 0} sold
                      </p>
                      <p className="text-[10px] text-gray-400">
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
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
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
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-700">
                Inventory Risks
              </h3>
            </div>
            {aiError && !dashboard ? (
              <p className="text-xs text-amber-500">تعذّر تحميل البيانات حاليًا</p>
            ) : inventoryRisks.length === 0 ? (
              <p className="text-xs text-gray-400">
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
                      <p className="text-xs text-gray-700 truncate flex-1">
                        {p.name}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ml-2 shrink-0 ${
                          stock === 0
                            ? "bg-red-100 text-red-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
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
              className="mt-4 w-full text-[10px] font-semibold uppercase tracking-wider border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Restock All
            </button>
          </div>

          {/* AI Insights */}
          <BrandAIInsights aiData={dashboard?.aiAssistant ?? null} loading={aiLoading} error={aiError} onRetry={onRetry} />
        </div>
      </div>
    </div>
  );
}
