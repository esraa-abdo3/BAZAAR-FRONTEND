
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, TrendingUp, ShoppingBag, Wallet, Clock, Store,
  Lightbulb, ThumbsUp, AlertTriangle, RefreshCw, ArrowLeft,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import DashboardHeader from "../../../components/Dashboard/BazarownerDashboard/DashboardHeader";
import { getDashboardAi } from "../../../services/Bazaaraiservice";

const EGP = (n) =>
  new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(n ?? 0);

const hourLabel = (h) => {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
};


function humanizeAiText(text) {
  if (!text) return text;

  let result = text;


  result = result.replace(/\bhour\s+_id\s*:?\s*(\d{1,2})\b/gi, (_, h) => hourLabel(Number(h)));

  result = result.replace(/\b_id\s*:?\s*(\d{1,2})\b/gi, (_, h) => hourLabel(Number(h)));


  result = result.replace(/\bhour\s+(\d{1,2})\b/gi, (_, h) => hourLabel(Number(h)));

  
  result = result.replace(/\s*_id\b/gi, "");

  return result;
}

function SummaryCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent.bg}`}>
        <Icon size={18} className={accent.text} />
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-[11px] font-medium text-gray-400 truncate">{label}</p>
        <p className="text-base font-bold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{hourLabel(label)}</p>
      <p className="text-gray-500">Orders: <span className="font-semibold text-gray-700">{payload[0]?.payload?.orders}</span></p>
      <p className="text-gray-500">Revenue: <span className="font-semibold text-indigo-600">{EGP(payload[0]?.value)} EGP</span></p>
    </div>
  );
}

function SalesByHourChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-[220px] text-xs text-gray-400">
        No sales data yet for this period.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f1f1f4" />
        <XAxis
          dataKey="_id"
          tickFormatter={hourLabel}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={52}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : v)}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f3ff" }} />
        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#6366f1" maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function BrandPerformanceList({ brands }) {
  if (!brands?.length) {
    return <p className="text-xs text-gray-400 py-6 text-center">No brand activity yet.</p>;
  }
  const maxRevenue = Math.max(...brands.map((b) => b.revenue || 0), 1);

  return (
    <div className="flex flex-col gap-3">
      {brands.map((b, i) => (
        <div key={b.brand} className="flex items-center gap-3">
          <span className="w-5 text-[11px] font-semibold text-gray-400 flex-shrink-0">{i + 1}</span>
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-700 truncate">{b.brand}</p>
              <p className="text-xs font-semibold text-gray-600 flex-shrink-0">{EGP(b.revenue)} EGP</p>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500"
                style={{ width: `${Math.max((b.revenue / maxRevenue) * 100, 4)}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-gray-400 flex-shrink-0 w-16 text-right">{b.orders} orders</span>
        </div>
      ))}
    </div>
  );
}

const PANEL_META = {
  insights: {
    title: "Insights", icon: Lightbulb,
    header: "bg-violet-50/60", iconBg: "bg-violet-100", iconText: "text-violet-600",
    dot: "bg-violet-400", titleText: "text-violet-700",
  },
  recommendations: {
    title: "Recommendations", icon: ThumbsUp,
    header: "bg-indigo-50/60", iconBg: "bg-indigo-100", iconText: "text-indigo-600",
    dot: "bg-indigo-500", titleText: "text-indigo-700",
  },
  alerts: {
    title: "Alerts", icon: AlertTriangle,
    header: "bg-red-50/70", iconBg: "bg-red-100", iconText: "text-red-500",
    dot: "bg-red-400", titleText: "text-red-700",
  },
};

function InsightPanel({ kind, items }) {
  const meta = PANEL_META[kind];
  const Icon = meta.icon;
  if (!items?.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className={`flex items-center gap-2.5 px-5 py-3.5 ${meta.header}`}>
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.iconBg}`}>
          <Icon size={14} className={meta.iconText} />
        </span>
        <p className={`text-xs font-bold uppercase tracking-wider ${meta.titleText}`}>{meta.title}</p>
        <span className={`ml-auto text-[11px] font-semibold ${meta.titleText} opacity-60`}>{items.length}</span>
      </div>
      <div className="flex flex-col divide-y divide-gray-100 px-5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 py-3.5">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${meta.dot}`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">{humanizeAiText(item.title)}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{humanizeAiText(item.description)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonBlock({ className }) {
  return <div className={`bg-gray-100 rounded-2xl animate-pulse ${className}`} />;
}

export default function AiInsightsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await getDashboardAi();
      setData(res);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load AI insights.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const summary = data?.summary;
  const brandPerformance = data?.brandPerformance ?? [];
  const salesByHour = data?.salesByHour ?? [];
  const aiInsights = data?.aiInsights;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardHeader />

      <main className="px-4 sm:px-6 py-6 w-[90%] m-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ArrowLeft size={15} className="text-gray-500" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <Sparkles size={15} className="text-white" />
              </span>
              <div>
                <h1 className="text-base font-semibold text-gray-800">AI Insights</h1>
                <p className="text-xs text-[#2d1372]">Performance &amp; recommendations across your bazaar</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => load(true)}
            disabled={loading || refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-5">
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Couldn't load AI insights</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-[64px]" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SkeletonBlock className="h-[280px]" />
              <SkeletonBlock className="h-[280px]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-[200px]" />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">

            {/* Summary strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SummaryCard icon={Wallet} label="Total Revenue" value={`${EGP(summary?.totalRevenue)} EGP`}
                accent={{ bg: "bg-emerald-50", text: "text-emerald-500" }} />
              <SummaryCard icon={ShoppingBag} label="Orders" value={summary?.ordersCount ?? 0}
                accent={{ bg: "bg-indigo-50", text: "text-indigo-500" }} />
              <SummaryCard icon={TrendingUp} label="Avg Order Value" value={`${EGP(summary?.avgOrderValue)} EGP`}
                accent={{ bg: "bg-amber-50", text: "text-amber-500" }} />
              <SummaryCard icon={Clock} label="Peak Hour" value={summary != null ? hourLabel(summary.peakHour) : "—"}
                accent={{ bg: "bg-violet-50", text: "text-violet-500" }} />
            </div>

            {/* Chart + brand performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-[#2d1372] uppercase tracking-wider mb-3">
                  Sales by Hour
                </p>
                <SalesByHourChart data={salesByHour} />
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-[#2d1372] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Store size={13} />
                  Brand Performance
                </p>
                <BrandPerformanceList brands={brandPerformance} />
              </div>
            </div>

            {/* AI insights / recommendations / alerts */}
            {aiInsights && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <InsightPanel kind="insights" items={aiInsights.insights} />
                <InsightPanel kind="recommendations" items={aiInsights.recommendations} />
                <InsightPanel kind="alerts" items={aiInsights.alerts} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}