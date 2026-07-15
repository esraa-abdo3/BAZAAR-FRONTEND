"use client";

export default function AdminHeader({ title = "Admin Dashboard" }) {
  return (
    <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-30">
      <h1 className="text-sm font-semibold text-stone-800">{title}</h1>

      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-500 relative transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
