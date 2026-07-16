"use client";

import { useState } from "react";

const TABS = [
  { key: "pricing",     label: "Pricing",     icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { key: "stock",       label: "Stock",       icon: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12" },
  { key: "performance", label: "Performance", icon: "M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3" },
];

export default function BrandAIInsights({ aiData = null, loading = false, error = null, onRetry }) {
  const [activeTab, setActiveTab] = useState("pricing");

  const items = aiData?.[activeTab] ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" strokeWidth={2}>
          <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.36-6.36l-2.12 2.12M8.76 15.24l-2.12 2.12m12.72 0l-2.12-2.12M8.76 8.76L6.64 6.64" />
        </svg>
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-700">AI Assistant Insights</h3>
      </div>

      <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors border-b-2 -mb-px
              ${activeTab === tab.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
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
          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="py-4">
          <p className="text-xs text-red-500 mb-2">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600 hover:underline"
            >
              إعادة المحاولة
            </button>
          )}
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-400 py-4">No {activeTab} recommendations right now.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-semibold text-gray-800">{item.product}</p>
              </div>
              <p className="text-xs font-medium text-indigo-600 mb-1">{item.recommendation}</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">{item.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
