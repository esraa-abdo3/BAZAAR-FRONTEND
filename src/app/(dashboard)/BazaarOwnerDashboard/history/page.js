"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Loader2,
  History,
  CalendarDays,
  Users,
  ChevronDown,
  AlertCircle,
  Archive,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DashboardHeader from "../../../components/Dashboard/BazarownerDashboard/DashboardHeader";
import {
  getBazaarHistoryList,
  getHistoryDashboard,
  getHistorySalesByHour,
  getHistoryControl,
} from "../../../services/bazaarHistoryService";

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
  );
}

function formatHour(h) {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      <p>
        Revenue:{" "}
        <span className="font-bold">${payload[0]?.value?.toLocaleString()}</span>
      </p>
      <p>
        Orders: <span className="font-bold">{payload[1]?.value ?? "—"}</span>
      </p>
    </div>
  );
};

// Normalize whatever shape a history-list entry comes back as.
function normalizeHistoryEntry(item) {
  const id =
    item?._id || item?.id || item?.bazaarId || item?.bazaarID || item?.uuid;
  const name =
    item?.bazaarName || item?.name || item?.title || "Ended Bazaar";
  const endDate =
    item?.endDate ||
    item?.eventEndDate ||
    item?.closedAt ||
    item?.finishedAt ||
    item?.updatedAt ||
    null;
  const startDate = item?.startDate || item?.eventStartDate || null;

  return { id, name, endDate, startDate, raw: item };
}

export default function BazaarHistoryPage() {
  const LIMIT = 10;

  const [historyList, setHistoryList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totals, setTotals] = useState(null);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [control, setControl] = useState(null);
  const [salesData, setSalesData] = useState([]);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Fetch the list of ended bazaars once, pick the most recent by default.
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoadingList(true);
        setListError(null);
        const raw = await getBazaarHistoryList();
        const normalized = raw.map(normalizeHistoryEntry).filter((b) => b.id);

        const sorted = [...normalized].sort((a, b) => {
          const aTime = a.endDate ? new Date(a.endDate).getTime() : 0;
          const bTime = b.endDate ? new Date(b.endDate).getTime() : 0;
          return bTime - aTime;
        });

        setHistoryList(sorted);
        if (sorted.length > 0) setSelectedId(sorted[0].id);
      } catch (err) {
        setListError("Failed to load bazaar history.");
      } finally {
        setLoadingList(false);
      }
    };

    loadHistory();
  }, []);

  const fetchDetail = useCallback(async (bazaarId, p) => {
    if (!bazaarId) return;
    try {
      setLoadingDetail(true);
      setDetailError(null);
      const [dashboardData, controlData] = await Promise.all([
        getHistoryDashboard(bazaarId, { page: p, limit: LIMIT }),
        getHistoryControl(bazaarId).catch(() => null),
      ]);
      setTotals(dashboardData?.totals ?? null);
      setBrands(dashboardData?.brands ?? []);
      setPagination(dashboardData?.pagination ?? null);
      setControl(controlData?.bazaar ?? controlData ?? null);
    } catch (err) {
      setDetailError("Failed to load this bazaar's dashboard.");
      setTotals(null);
      setBrands([]);
      setPagination(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const fetchSales = useCallback(async (bazaarId) => {
    if (!bazaarId) return;
    try {
      setLoadingSales(true);
      const data = await getHistorySalesByHour(bazaarId);
      const arr = Array.isArray(data?.salesByHour)
        ? data.salesByHour
        : Array.isArray(data)
        ? data
        : [];
      setSalesData(
        arr
          .filter((d) => d?.hour !== undefined)
          .map((d) => ({
            time: formatHour(d.hour),
            revenue: d.revenue ?? 0,
            orders: d.orders ?? 0,
          }))
      );
    } catch {
      setSalesData([]);
    } finally {
      setLoadingSales(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setPage(1);
    fetchDetail(selectedId, 1);
    fetchSales(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    fetchDetail(selectedId, page);
  }, [page]);

  const selectedEntry = useMemo(
    () => historyList.find((b) => b.id === selectedId) || null,
    [historyList, selectedId]
  );

  const stats = totals
    ? [
        { label: "TOTAL REVENUE", value: `$${totals.totalRevenue.toLocaleString()}` },
        { label: "TOTAL ORDERS", value: totals.totalOrders.toLocaleString() },
        { label: "PRODUCTS SOLD COUNT", value: totals.totalProducts.toLocaleString() },
      ]
    : [];

  return (
    <>
      <DashboardHeader greeting="bazaar history" />

      <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <History size={17} className="text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 leading-none">
              Bazaar History
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Review performance from your previous, ended bazaars
            </p>
          </div>
        </div>

        {listError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            <AlertCircle size={15} className="flex-shrink-0" />
            {listError}
          </div>
        )}

        {loadingList ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center">
            <Loader2 size={22} className="animate-spin text-indigo-400" />
          </div>
        ) : historyList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Archive size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-700">No History</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              You don&apos;t have any ended bazaars yet. Once a bazaar closes,
              its performance history will show up here.
            </p>
          </div>
        ) : (
          <>
            {/* Selector */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Viewing history for</p>
                <p className="text-sm font-semibold text-gray-800">
                  {selectedEntry?.name ?? "—"}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                  <CalendarDays size={12} />
                  {selectedEntry?.startDate
                    ? `${formatDate(selectedEntry.startDate)} — ${formatDate(
                        selectedEntry.endDate
                      )}`
                    : `Ended ${formatDate(selectedEntry?.endDate)}`}
                </div>
              </div>

              {historyList.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setPickerOpen((o) => !o)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-3.5 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Switch bazaar
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {pickerOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setPickerOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 max-h-72 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1.5">
                        {historyList.map((entry) => (
                          <button
                            key={entry.id}
                            onClick={() => {
                              setSelectedId(entry.id);
                              setPickerOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                              entry.id === selectedId
                                ? "bg-indigo-50 text-indigo-600 font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <p className="truncate">{entry.name}</p>
                            <p className="text-[11px] text-gray-400">
                              Ended {formatDate(entry.endDate)}
                            </p>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {detailError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                <AlertCircle size={15} className="flex-shrink-0" />
                {detailError}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {loadingDetail
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                    >
                      <Skeleton className="h-3 w-24 mb-3" />
                      <Skeleton className="h-7 w-32 mb-3" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                  ))
                : stats.map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                    >
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
                        {label}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        {value}
                      </p>
                      <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                        <TrendingUp size={12} />
                        Final results
                      </div>
                    </div>
                  ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Bazaar info card, from control endpoint */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Bazaar Overview
                </p>
                {loadingDetail ? (
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                        Ended
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Start date</span>
                      <span className="text-gray-700 font-medium">
                        {formatDate(control?.startDate || selectedEntry?.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">End date</span>
                      <span className="text-gray-700 font-medium">
                        {formatDate(control?.endDate || selectedEntry?.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Users size={13} /> Brand capacity
                      </span>
                      <span className="text-gray-700 font-medium">
                        {control?.maxBrandCapacity ?? "—"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sales by hour */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Sales During the Day
                </p>
                {loadingSales ? (
                  <div className="flex items-center justify-center h-[180px]">
                    <Loader2 size={22} className="animate-spin text-indigo-400" />
                  </div>
                ) : salesData.length === 0 ? (
                  <div className="flex items-center justify-center h-[180px] text-gray-400 text-sm">
                    No sales data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={salesData}>
                      <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, fill: "#4f46e5", strokeWidth: 0 }}
                      />
                      <Line type="monotone" dataKey="orders" stroke="transparent" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Brands table */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">
                    Brand Performance
                  </h2>
                  <p className="text-sm text-gray-400">
                    {pagination
                      ? `${pagination.totalBrands} Participating Brands`
                      : "Loading..."}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Brand", "Owner Contact", "Products", "Orders", "Revenue"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {loadingDetail
                        ? Array.from({ length: LIMIT }).map((_, i) => (
                            <tr key={i} className="border-b border-gray-50">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <td key={j} className="px-5 py-4">
                                  <Skeleton className="h-4 w-full" />
                                </td>
                              ))}
                            </tr>
                          ))
                        : brands.length === 0
                        ? (
                          <tr>
                            <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                              No brands participated in this bazaar.
                            </td>
                          </tr>
                        )
                        : brands.map((brand, i) => (
                            <tr
                              key={brand.brandId}
                              className={`border-b border-gray-50 ${
                                i === 0 ? "bg-gray-50" : ""
                              }`}
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
                                    {brand.brandName?.[0] ?? "?"}
                                  </div>
                                  <span className="font-medium text-gray-800 whitespace-nowrap">
                                    {brand.brandName}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <p className="font-medium text-gray-700">
                                  {brand.ownerName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {brand.ownerEmail}
                                </p>
                              </td>
                              <td className="px-5 py-4">
                                <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                  {brand.totalProducts} items
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="bg-emerald-50 text-emerald-600 text-xs font-medium px-3 py-1 rounded-full">
                                  {brand.totalOrders}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-emerald-500 font-semibold">
                                  ${brand.totalRevenue?.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                            page === i + 1
                              ? "bg-indigo-600 text-white"
                              : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
