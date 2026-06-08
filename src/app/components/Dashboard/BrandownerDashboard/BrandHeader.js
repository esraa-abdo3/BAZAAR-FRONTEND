"use client";

export default function BrandHeader() {
  return (
    <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-8 shrink-0">
      {/* Greeting */}
      <h2 className="text-base font-semibold text-stone-800">good morning</h2>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-8">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            placeholder="Search orders, products..."
            className="w-full pl-8 pr-4 py-1.5 text-xs border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-stone-400 transition-colors"
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="relative p-1.5 text-stone-400 hover:text-stone-700 transition-colors">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        {/* Settings */}
        <button className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-600">
          B
        </div>
      </div>
    </header>
  );
}
