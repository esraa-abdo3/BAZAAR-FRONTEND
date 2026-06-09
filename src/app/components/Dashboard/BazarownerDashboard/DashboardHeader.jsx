"use client";

import { useState } from "react";
import { Bell, Settings, User, Search, X } from "lucide-react";

export default function DashboardHeader({ greeting = "good morning" }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30 gap-3">
      {/* Greeting — hidden on mobile when search is open */}
      <h1
        className={`text-base font-semibold text-gray-800 whitespace-nowrap flex-shrink-0 lg:ml-0 ml-10 ${
          searchOpen ? "hidden sm:block" : "block"
        }`}
      >
        {greeting}
      </h1>

      {/* Search bar — desktop always visible, mobile toggle */}
      <div
        className={`flex-1 max-w-md mx-auto ${
          searchOpen ? "flex" : "hidden sm:flex"
        }`}
      >
        <div className="relative w-full">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search orders, products..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
          {searchOpen && (
            <button
              onClick={() => setSearchOpen(false)}
              className="sm:hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Search icon — mobile only */}
        {!searchOpen && (
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Search size={17} />
          </button>
        )}

        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 relative">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
          <Settings size={17} />
        </button>

        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center cursor-pointer">
          <User size={15} className="text-amber-700" />
        </div>
      </div>
    </header>
  );
}
