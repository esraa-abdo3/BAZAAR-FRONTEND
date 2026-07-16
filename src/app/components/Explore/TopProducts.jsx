"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiHeart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const TOP_PRODUCTS_API =
  "https://bazary-backend.vercel.app/api/events/live/top-products?limit=4";


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

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const router = useRouter();
  const { cart, addToCart, updateCartQuantity, removeFromCart, openLogin, closeLogin } =
    useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const wishlisted = isInWishlist(product._id);
  const brandName = product.brandId?.brandName;

  const productHref =
    product.bazaarId && product.brandId?._id
      ? `/Bazaarprofile/${product.bazaarId}/brand/${product.brandId._id}/product/${product._id}`
      : null;

  const cartItem = cart?.items?.find((item) => {
    const id = item.productId?._id || item.productId;
    return id === product._id;
  });

  const goToProduct = () => {
    if (productHref) router.push(productHref);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product._id, product.bazaarId, 1);
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (cartItem.quantity < product.quantity) {
      updateCartQuantity(product._id, cartItem.quantity + 1);
    }
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (cartItem.quantity <= 1) {
      removeFromCart(product._id);
    } else {
      updateCartQuantity(product._id, cartItem.quantity - 1);
    }
  };

  return (
    <>
      {openLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center shadow-md">
            <h2 className="text-lg font-bold mb-2">Please login first</h2>
            <p className="text-sm text-gray-500 mb-4">
              You need to login to add products to cart
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => (window.location.href = "/auth/login")}
                className="bg-[#50604A] text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>
              <button onClick={closeLogin} className="border px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        onClick={goToProduct}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      >
  
        <div className="relative overflow-hidden" style={{ height: "200px" }}>
          <img
            src={
              imgError
                ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
                : product.images?.[0]
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />

          {product.priceAfterOffer != null && (
            <span
              className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: "rgba(200,50,50,0.9)", backdropFilter: "blur(4px)" }}
            >
              Sale
            </span>
          )}

          {/* Wishlist heart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product, product.bazaarId);
            }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200 cursor-pointer group/heart hover:scale-110 active:scale-95"
            title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <FiHeart
              size={16}
              className={`transition-colors duration-200 ${
                wishlisted
                  ? "text-red-500 fill-red-500"
                  : "text-gray-600 group-hover/heart:text-red-500"
              }`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          {brandName && (
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">
              {brandName}
            </span>
          )}

          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">
            {product.name}
          </h3>

          <div className="mb-2">
            {product.priceAfterOffer != null ? (
              <div className="flex items-center gap-2">
                <span className="text-[#50604A] font-semibold text-sm">
                  EGP {product.priceAfterOffer.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-[#50604A] font-semibold text-sm">
                EGP {product.price?.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
            {product.description || "Premium quality product available at this bazaar."}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={goToProduct}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95 cursor-pointer"
              style={{ background: "linear-gradient(135deg,#50604A,#3a4a35)" }}
            >
              View Product
            </button>

            {cartItem ? (
              <div className="flex items-center bg-gray-100 rounded-full h-10 px-1.5 shadow-sm border border-gray-200 flex-shrink-0">
                <button
                  onClick={handleDecrease}
                  className="w-7 h-7 flex items-center justify-center text-base font-medium text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="w-6 text-center text-xs font-semibold text-gray-900">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  disabled={cartItem.quantity >= product.quantity}
                  className={`w-7 h-7 flex items-center justify-center text-base font-medium transition-colors ${
                    cartItem.quantity >= product.quantity
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:text-black cursor-pointer"
                  }`}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!product.quantity || product.quantity <= 0 || isAdding}
                className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all ${
                  product.quantity > 0
                    ? "bg-[#50604A] text-white hover:scale-[.98] shadow-md hover:shadow-lg duration-200 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                title={product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              >
                {isAdding ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TopProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(TOP_PRODUCTS_API, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch top products");
        const json = await res.json();
        const list = json?.data ?? [];
        setProducts(list.slice(0, 4));
        setError(false);
      } catch {
        setProducts([]);
        setError(true);
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
        {error && !loading && (
          <p className="text-xs text-amber-600 mt-2">
            Couldn't load live top products right now — please check back soon.
          </p>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 text-sm">No top products available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* See more */}
      {!loading && products.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push("/shop")}
            className="flex items-center gap-1.5 text-sm font-semibold px-6 py-3 rounded-full border transition cursor-pointer"
            style={{ borderColor: "#50604A", color: "#50604A" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#50604A";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#50604A";
            }}
          >
            See More Products
            <span>→</span>
          </button>
        </div>
      )}
    </section>
  );
}
