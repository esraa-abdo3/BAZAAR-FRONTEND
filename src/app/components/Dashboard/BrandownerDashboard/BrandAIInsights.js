"use client";

import { useEffect, useState } from "react";
import { getBrandDashboard } from "@/app/services/brandService";

const TABS = [
  { key: "pricing",     label: "Pricing",     icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { key: "stock",       label: "Stock",       icon: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12" },
  { key: "performance", label: "Performance", icon: "M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3" },
];

export default function BrandAIInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pricing");

  useEffect(() => {
    async function load() {
      try {
        const res = await getBrandDashboard();
        const payload = res?.data?.aiAssistant ?? null;
        setData(payload);
      } catch (err) {
        setError(err?.response?.data?.message ?? "Failed to load AI insights.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const items = data?.[activeTab] ?? [];

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#3d4f38" strokeWidth={2}>
          <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.36-6.36l-2.12 2.12M8.76 15.24l-2.12 2.12m12.72 0l-2.12-2.12M8.76 8.76L6.64 6.64" />
        </svg>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-700">AI Assistant Insights</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-stone-100">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors border-b-2 -mb-px
              ${activeTab === tab.key
                ? "border-[#3d4f38] text-[#3d4f38]"
                : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#50604A", borderTopColor: "transparent" }} />
        </div>
      ) : error ? (
        <p className="text-xs text-red-500 py-4">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-stone-400 py-4">No {activeTab} recommendations right now.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="border border-stone-100 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-semibold text-stone-800">{item.product}</p>
              </div>
              <p className="text-xs font-medium text-[#3d4f38] mb-1">{item.recommendation}</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">{item.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
