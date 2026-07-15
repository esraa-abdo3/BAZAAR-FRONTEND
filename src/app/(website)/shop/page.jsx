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
   

      <ShopClient />
    </main>
  );
}
