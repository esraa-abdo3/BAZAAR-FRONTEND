import React from "react";
import ShopClient from "../../components/Shop/ShopClient";

export const metadata = {
  title: "Shop | Bazaarna",
  description: "Discover new arrivals, shop local brands, and explore our collection of handmade, fashion, and beauty products.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen pt-[61px]">
      {/* Marquee Banner */}
      <div className="fixed top-[60px] left-0 w-full z-40 bg-black text-white py-2 overflow-hidden whitespace-nowrap pointer-events-none">
        <div className="flex w-max ticker-track">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 text-sm md:text-base font-semibold tracking-wide uppercase">
              Buy now and get free shipping! 🚀
            </span>
          ))}
        </div>
      </div>

      <ShopClient />
    </main>
  );
}
