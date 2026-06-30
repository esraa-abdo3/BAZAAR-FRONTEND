"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import BazaaryAIChat from "./Bazaaryaichat";

export default function AIAssistantButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BazaaryAIChat isOpen={open} onClose={() => setOpen(false)} />

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#50604A] to-[#22301D] shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
        aria-label="افتح المساعد الذكي"
      >
        {open ? (
          <X size={22} className="text-white" />
        ) : (
          <Sparkles size={22} className="text-white" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#9A5F4C] border-2 border-white animate-pulse" />
        )}
      </button>
    </>
  );
}