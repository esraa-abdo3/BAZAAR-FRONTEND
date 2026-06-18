"use client";

import { useState, useEffect } from "react";

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="skeleton w-full" style={{ height: "200px" }} />
      <div className="p-5 flex flex-col gap-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
      </div>
    </div>
  );
}

// ─── Static Fallback Products ─────────────────────────────────────────────────
const FALLBACK_PRODUCTS = [
  {
    _id: "f1",
    name: "Best Seller",
    price: 299,
    description: "Our most loved product — top-rated by thousands of happy shoppers.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    badge: "🏆 Best Seller",
  },
  {
    _id: "f2",
    name: "Trending Now",
    price: 449,
    description: "Flying off the shelves — catch this trending item before it's gone.",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
    badge: "🔥 Trending",
  },
  {
    _id: "f3",
    name: "Most Popular",
    price: 199,
    description: "Chosen by the crowd — the most popular pick at every bazaar.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    badge: "⭐ Popular",
  },
  {
    _id: "f4",
    name: "Limited Offer",
    price: 349,
    description: "Exclusive deal available only for a short time. Grab yours now!",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    badge: "⚡ Limited",
  },
];

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, badge }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        <img
          src={imgError ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" : (product.image || product.imageUrl)}
          alt={product.name || product.productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        {badge && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{ background: "rgba(80,96,74,0.9)", backdropFilter: "blur(4px)" }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">
          {product.name || product.productName}
        </h3>

        {(product.price) && (
          <p className="text-[#50604A] font-semibold text-sm mb-2">
            EGP {product.price.toLocaleString()}
          </p>
        )}

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {product.description || product.productDescription || "Premium quality product available at this bazaar."}
        </p>

        <button
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95 cursor-pointer"
          style={{ background: "linear-gradient(135deg,#50604A,#3a4a35)" }}
        >
          View Product
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Step 1: Get live events
        const eventsRes = await fetch(
          "https://bazary-backend.vercel.app/api/events/live",
          { cache: "no-store" }
        );
        if (!eventsRes.ok) throw new Error("No live events");
        const eventsData = await eventsRes.json();
        const events = eventsData?.data ?? [];
        if (!events.length) throw new Error("Empty events");

        const eventId = events[0]._id;

        // Step 2: Get brands for that event
        const brandsRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${eventId}/brands`,
          { cache: "no-store" }
        );
        if (!brandsRes.ok) throw new Error("No brands");
        const brandsData = await brandsRes.json();
        const brands = brandsData?.data ?? [];
        if (!brands.length) throw new Error("Empty brands");

        const brandId = brands[0]._id;

        // Step 3: Get products
        const productsRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${eventId}/brands/${brandId}/products`,
          { cache: "no-store" }
        );
        if (!productsRes.ok) throw new Error("No products");
        const productsData = await productsRes.json();
        const allProducts = productsData?.data ?? productsData?.products ?? [];

        if (!allProducts.length) throw new Error("Empty products");

        // Randomly pick up to 4
        const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
        setProducts(shuffled.slice(0, 4));
        setIsFallback(false);
      } catch {
        setProducts(FALLBACK_PRODUCTS);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section
      id="explore-products"
      className="w-full px-4 sm:px-6 lg:px-16 py-20"
      style={{ background: "linear-gradient(180deg,#f9fafb 0%,#f0f4ee 100%)" }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
          style={{ background: "rgba(80,96,74,0.1)", color: "#50604A" }}
        >
          Featured Collection
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Top Products
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Handpicked from the most exciting bazaars — discover products loved by thousands of shoppers.
        </p>
        {isFallback && !loading && (
          <p className="text-xs text-amber-600 mt-2">
            ✨ Showing curated picks — live inventory loads shortly.
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p, i) => (
              <ProductCard
                key={p._id || i}
                product={p}
                badge={isFallback ? p.badge : null}
              />
            ))}
      </div>
    </section>
  );
}
