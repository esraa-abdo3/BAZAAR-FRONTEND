"use client";

import { useRouter } from "next/navigation";

const NAV = [
  {
    key: "overview",
    label: "Overview",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: "orders",
    label: "Orders",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    key: "products",
    label: "Products",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M20 7H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export default function BrandSidebar({
  activePage,
  setActivePage,
  brandName,
  brandTagline,
}) {
  const router = useRouter();
  const isActive = (key) =>
    activePage === key ||
    (key === "orders" && activePage === "order-detail") ||
    (key === "products" && activePage === "add-product");

  return (
    <aside className="w-[140px] min-h-screen bg-white border-r border-stone-200 flex flex-col py-6 shrink-0">
      {/* Brand */}
      <div className="px-4 mb-6">
        <p className="font-semibold text-stone-800 text-sm leading-tight">
          {brandName || "Brand Name"}
        </p>
        <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">
          {brandTagline || "Global Marketplace"}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 px-2">
        {NAV.map((item) => (
          <button
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all w-full text-left
              ${
                isActive(item.key)
                  ? "bg-[#3d4f38] text-white"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 mt-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/auth/login");
          }}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors w-full"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
}
