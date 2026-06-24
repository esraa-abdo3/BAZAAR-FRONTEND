"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../../../context/CartContext";

function StarRatingComponent({ rating, size = 16, interactive = false, onChange }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillValue = hoverRating || rating;
        const isFilled = star <= fillValue;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={isFilled ? "#f59e0b" : "none"}
              stroke={isFilled ? "#f59e0b" : "#d6d3d1"}
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499c.15-.461.782-.461.932 0l1.374 4.225a1 1 0 00.95.69h4.436c.484 0 .684.62.293.925l-3.59 2.585a1 1 0 00-.364 1.118l1.374 4.226c.15.461-.377.844-.768.552l-3.59-2.585a1 1 0 00-1.175 0l-3.59 2.585c-.391.292-.918-.09-.768-.552l1.374-4.226a1 1 0 00-.364-1.118l-3.59-2.585c-.391-.305-.19-.925.293-.925h4.436a1 1 0 00.95-.69l1.374-4.225z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function getLoggedInUserId() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.id || parsed._id || parsed.userId || null;
  } catch {
    return null;
  }
}

export default function BrandProfile() {
  const { id, brandid } = useParams();
  const router = useRouter();
  const { addToCart, openLogin, closeLogin } = useCart();

  const [addingId, setAddingId] = useState(null);
  const [bazaardata, setBazaardata] = useState(null);
  const [branddata, setBranddata] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all"); 
  const [onlySale, setOnlySale] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  async function fetchReviews() {
    if (!brandid) return;
    setLoadingReviews(true);
    try {
      const res = await fetch(`https://bazary-backend.vercel.app/api/events/brands/${brandid}/reviews`);
      const json = await res.json();
      setReviews(json.reviews || []);
      setAvgRating(json.avgRating || 0);
      setRatingCount(json.ratingCount || 0);
    } catch (err) {
      console.log("Failed to fetch brand reviews", err);
    } finally {
      setLoadingReviews(false);
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError("");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setReviewError("Please login to write a review.");
      setSubmittingReview(false);
      return;
    }
    try {
      const method = editingReviewId ? "PATCH" : "POST";
      const res = await fetch(`https://bazary-backend.vercel.app/api/events/brands/${brandid}/review`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating: newRating })
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || "";
        if (msg.includes("duplicate") || msg.includes("dup key") || res.status === 409) {
          throw new Error("You already rated this brand. Please edit your existing rating instead.");
        }
        if (res.status === 401 || res.status === 403) {
          throw new Error("Please login first to rate this brand.");
        }
        throw new Error(msg || "Failed to save rating");
      }
      setNewRating(5);
      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("duplicate") || msg.includes("dup key")) {
        setReviewError("You already rated this brand. Please edit your existing rating instead.");
      } else {
        setReviewError(msg || "Something went wrong, please try again.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    async function fetchAll() {
      try {
        const bazaarRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands`
        );
        const bazaarJson = await bazaarRes.json();
        setBazaardata(bazaarJson?.data?.bazaar || null);

        const brands = bazaarJson?.data?.brands || [];
        const thisBrand = brands.find((b) => b._id === brandid) || null;
        setBranddata(thisBrand);

        const prodRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands/${brandid}/products`
        );
        const prodJson = await prodRes.json();
        setProducts(prodJson?.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    if (id && brandid) {
      fetchAll();
      fetchReviews();
    }
  }, [id, brandid]);

  const filteredProducts = products
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (onlySale ? !!p.priceAfterOffer : true))
    .sort((a, b) => {
      const priceA = a.priceAfterOffer || a.price;
      const priceB = b.priceAfterOffer || b.price;
      if (priceFilter === "low") return priceA - priceB;
      if (priceFilter === "high") return priceB - priceA;
      return 0;
    });

  const hasActiveFilter = search || onlySale || priceFilter !== "all";

  return (
    <div className="w-[100%] lg:w-[85%] mx-auto px-4 py-6 pb-12 mt-15">

      {openLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center">
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
        className="relative w-full rounded-2xl overflow-hidden mb-6"
        style={{ aspectRatio: "21/9", minHeight: "160px" }}
      >
        <img
          src={bazaardata?.logoUrl}
          alt="bazaar"
          className="w-full h-full object-cover block"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
          }}
        />
        <button
          onClick={() => router.push(`/Bazaarprofile/${id}`)}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-white/90 px-3 py-1.5 rounded-full transition-all duration-200"
          style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.25)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to bazaar
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col gap-1">
          <span
            className="inline-flex items-center gap-1.5 w-fit text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgb(80 96 74)", border: "1px solid rgba(212,168,83,0.45)", color: "#D4A853" }}
          >
            ✦ Exclusive Bazaar
          </span>
          {!loading && (
            <h1 className="text-base sm:text-xl font-semibold text-white leading-tight">
              {bazaardata?.bazaarName || "Bazaar Event"}
            </h1>
          )}
        </div>
      </div>

  
      {loading ? (
        <div className="flex items-center gap-4 mb-6 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 flex-shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 mb-6">
          <img
            src={branddata?.logoUrl || "/default.jpg"}
            alt={branddata?.brandName}
            className="w-25 h-25 rounded-full object-cover flex-shrink-0 shadow-sm"
          />
          <div>
            <h2 className="text-lg font-bold text-[#22301D]">
              {branddata?.brandName || "Brand"}
            </h2>
            {branddata?.brandCategory && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {branddata.brandCategory}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-5">

    
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg" width="15" height="15"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "#f5f5f3", border: "1.5px solid #e5e5e2", color: "#22301D" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base leading-none"
            >
              ✕
            </button>
          )}
        </div>

   
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

         
          <button
            onClick={() => setOnlySale((v) => !v)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
            style={
              onlySale
                ? { background: "#16a34a", color: "#fff", border: "1.5px solid #16a34a" }
                : { background: "#f0fdf4", color: "#16a34a", border: "1.5px solid #bbf7d0" }
            }
          >
            🏷️ Sale only
          </button>

  
<button
  onClick={() =>
    setPriceFilter((v) =>
      v === "all" ? "low" : v === "low" ? "high" : "all"
    )
  }
  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
  style={
    priceFilter !== "all"
      ? { background: "#50604A", color: "#fff", border: "1.5px solid #50604A" }
      : { background: "#f5f5f3", color: "#50604A", border: "1.5px solid #d6d6d2" }
  }
>
  {priceFilter === "low" ? "↑ Price: Low to High" : priceFilter === "high" ? "↓ Price: High to Low" : "⇅ Price"}
</button>

          {/* Clear all */}
          {hasActiveFilter && (
            <button
              onClick={() => { setSearch(""); setPriceFilter("all"); setOnlySale(false); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={{ background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fecaca" }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Products Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base sm:text-lg text-[#22301D]">Products</h3>
        {!loading && (
          <span className="text-xs text-gray-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </span>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full animate-pulse">
              <div className="w-full bg-gray-200 rounded-2xl" style={{ paddingBottom: "100%" }} />
              <div className="mt-2 space-y-1.5 px-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: "#f5f5f3" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 mb-2">No products match your filters</p>
          <button
            onClick={() => { setSearch(""); setPriceFilter("all"); setOnlySale(false); }}
            className="text-xs text-[#50604A] underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {filteredProducts.map((product) => (
            <div
              onClick={() => router.push(`/Bazaarprofile/${id}/brand/${brandid}/product/${product._id}`)}
              key={product._id}
              className="w-full bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                <img
                  src={product.images?.[0] || "/default.jpg"}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {product.priceAfterOffer && (
                  <span
                    className="absolute top-2 left-2 text-xs font-semibold text-white px-2 py-0.5 rounded-full"
                    style={{ background: "#16a34a" }}
                  >
                    Sale
                  </span>
                )}
              </div>

              <div className="p-3">
                <h4 className="text-sm font-semibold text-[#22301D] leading-tight line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  {product.description}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  {product.priceAfterOffer ? (
                    <>
                      <span className="text-sm font-bold text-[#50604A]">{product.priceAfterOffer} EGP</span>
                      <span className="text-xs text-gray-400 line-through">{product.price} EGP</span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-[#50604A]">{product.price} EGP</span>
                  )}
                </div>

                <div className="w-full mt-3">
                  {product.quantity === 0 && (
                    <p className="text-xs text-red-500 mb-1">Out of stock</p>
                  )}
                  {product.quantity > 0 && product.quantity <= 5 && (
                    <p className="text-xs text-orange-500 mb-1">
                      Hurry up! Only {product.quantity} left
                    </p>
                  )}

                  <button
                    disabled={product.quantity === 0 || addingId === product._id}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setAddingId(product._id);
                      try { await addToCart(product._id, 1); }
                      finally { setAddingId(null); }
                    }}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
                      ${product.quantity === 0 || addingId === product._id
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#50604A] text-white hover:opacity-90"
                      }`}
                  >
                    {addingId === product._id ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : product.quantity === 0 ? "Out of stock" : "Add to cart"}
                  </button>

                  <button
                    className="w-full py-2 mt-2 rounded-lg text-sm font-medium text-[#50604A] transition-all duration-200 border border-[#50604A] hover:scale-[.98] cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); router.push(`/product/${product._id}`); }}
                  >
                    See More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── BRAND REVIEWS SECTION ── */}
      <div className="border-t border-stone-200 mt-12 pt-10">
        <h3 className="text-lg font-bold text-[#22301D] mb-6">Brand Reviews & Ratings</h3>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Analytics Summary */}
          <div className="w-full lg:w-1/3 bg-stone-50 border border-stone-200 rounded-2xl p-6 h-fit text-center">
            <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Average Brand Rating</p>
            <p className="text-5xl font-extrabold text-[#22301D] mb-2">{Number(avgRating).toFixed(1)}</p>
            <div className="flex justify-center">
              <StarRatingComponent rating={Math.round(avgRating)} size={20} />
            </div>
            <p className="text-xs text-stone-400 mt-2">Based on {ratingCount} review{ratingCount === 1 ? "" : "s"}</p>
          </div>

          {/* Reviews Actions */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Form to Submit / Edit Review */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-[#22301D] mb-3">
                {editingReviewId ? "Edit Your Brand Rating" : "Rate This Brand"}
              </h4>
              {reviewError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">
                  {reviewError}
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <span className="text-xs font-semibold text-stone-500">Select Rating:</span>
                  <StarRatingComponent
                    rating={newRating}
                    size={28}
                    interactive={true}
                    onChange={(r) => setNewRating(r)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(null);
                        setNewRating(5);
                      }}
                      className="px-4 py-1.5 border border-stone-200 text-xs font-semibold text-stone-600 rounded-lg hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-1.5 bg-[#50604A] text-white text-xs font-semibold rounded-lg hover:bg-[#22301D] transition-colors disabled:opacity-60"
                  >
                    {submittingReview ? "Saving..." : editingReviewId ? "Update Rating" : "Submit Rating"}
                  </button>
                </div>
              </form>
            </div>

            {/* Rating List */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-[#22301D] border-b border-stone-100 pb-2">Customer Feedback</h4>
              {loadingReviews ? (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-t-transparent border-[#50604A] rounded-full animate-spin" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No ratings yet for this brand. Be the first to rate!</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {reviews.map((rev) => {
                    const isOwn = (rev.userId?._id || rev.userId) === getLoggedInUserId();
                    return (
                      <div key={rev._id} className="py-4 first:pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StarRatingComponent rating={rev.rating} size={14} />
                          <span className="text-[10px] text-stone-500 font-medium">
                            User: ...{(rev.userId?._id || String(rev.userId)).slice(-6)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-stone-400">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {isOwn && (
                            <button
                              onClick={() => {
                                setEditingReviewId(rev._id);
                                setNewRating(rev.rating);
                              }}
                              className="text-[10px] font-bold text-[#50604A] hover:underline"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}