"use client";

import { useState } from "react";
import {Bell} from "lucide-react";

export default function DashboardHeader({ greeting = "good morning" }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30 gap-3">
   
      <h1
        className={`text-base font-semibold text-gray-800 whitespace-nowrap flex-shrink-0 lg:ml-0 ml-10 `}
      >
        {greeting}
      </h1>
 
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 relative">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

    
      </div>
    </header>
  );
}
