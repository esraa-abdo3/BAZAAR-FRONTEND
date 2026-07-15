"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/Shop/ProductCard";
import { FiHeart, FiArrowLeft } from "react-icons/fi";

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  const wishlistItems = wishlist?.items || [];

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container w-[95%] lg:w-[85%] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <FiArrowLeft size={14} /> Home
              </Link>
              <span>/</span>
              <span className="text-gray-400">Wishlist</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#22301D] tracking-tight">
              My Wishlist
            </h1>
          </div>
          <div className="bg-[#50604A]/10 text-[#50604A] font-semibold px-4 py-2 rounded-full text-sm self-start md:self-auto">
            {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"} Saved
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-t-transparent border-[#50604A] rounded-full animate-spin mb-4" />
            <p className="text-stone-500 font-medium">Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl border border-stone-150 shadow-xs max-w-2xl mx-auto text-center mt-8">
            <div className="w-16 h-16 rounded-full bg-[#50604A]/5 flex items-center justify-center mb-6">
              <FiHeart size={32} className="text-[#50604A]/40" />
            </div>
            <h2 className="text-2xl font-bold text-[#22301D] mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-stone-500 mb-8 max-w-md">
              Tap the heart icon on any product while browsing Bazaarna to save it here for later.
            </p>
            <Link
              href="/shop"
              className="bg-[#50604A] hover:bg-[#22301D] text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[0.98]"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          /* Grid of Items */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => {
              // Ensure we fallback gracefully if details are missing
              if (!item.productId) return null;

              // Construct compatible product payload for ProductCard
              const productPayload = {
                ...item.productId,
                brandId: item.brandId,
                brandName: item.brandId?.brandName || "Brand",
                bazaarId: item.bazaarId,
              };

              return (
                <div key={item.productId._id || index} className="h-full">
                  <ProductCard product={productPayload} index={index} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
