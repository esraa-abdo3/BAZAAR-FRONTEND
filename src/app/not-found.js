"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { NotFoundIllustration } from "./components/Auth/illustrations";
import Navbar from "./components/Navbar/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 p-6">
   
      <div className="max-w-md w-full text-center bg-white  rounded-2xl  p-10">
   <div
  className="w-100 h-100 mx-auto mb-4 bg-center bg-contain bg-no-repeat"
  style={{
    backgroundImage: "url('/404 Error with a cute animal-amico.svg')",
  }}
/>

        <h2 className="text-lg font-bold text-stone-800 mb-2">
          This page doesn't exist
        </h2>
        <p className="text-sm text-stone-400 mb-8 leading-relaxed">
          The page you're looking for isn't here. It may have moved, or the
          link might be wrong.
        </p>

        <Link
          href="/"
          className="w-full py-3 bg-primary text-white text-xs font-medium uppercase tracking-widest rounded-lg hover:bg-stone-700 hover:scale-[0.98] transition-all duration-500 cursor-pointer flex items-center justify-center gap-2"
        >
          <Home size={14} />
          Go to Website
        </Link>
      </div>
    </div>
  );
}
