
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../../../context/CartContext";
import { useWishlist } from "../../../../../context/WishlistContext";
import { FiHeart } from "react-icons/fi";

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

function getRatingBreakdown(reviews) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating);
    if (counts[star] !== undefined) counts[star] += 1;
  });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percent: Math.round((counts[star] / total) * 100),
  }));
}

function reviewerLabel(rev) {
  const rawId = rev.userId?._id || String(rev.userId || "");
  return rawId ? `Customer #${rawId.slice(-5).toUpperCase()}` : "Customer";
}

function reviewerInitial(rev) {
  const rawId = rev.userId?._id || String(rev.userId || "");
  return rawId ? rawId.slice(-1).toUpperCase() : "?";
}

const REVIEWER_COLORS = ["#50604A", "#9A5F4C", "#22301D", "#7d6a4f", "#6b7a5e"];
function reviewerColor(rev) {
  const key = reviewerLabel(rev);
  let h = 0;
  for (const c of key) h = (h + c.charCodeAt(0)) % REVIEWER_COLORS.length;
  return REVIEWER_COLORS[h];
}

function formatReviewDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const REVIEWS_STEP = 5;

export default function BrandProfile() {
  const { id, brandid } = useParams();
  const router = useRouter();
  const { addToCart, openLogin, closeLogin } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

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
  const [visibleReviews, setVisibleReviews] = useState(REVIEWS_STEP);
  const [toastMounted, setToastMounted] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  // Best Sellers (top products by brand) states
  const [topProducts, setTopProducts] = useState([]);
  const [loadingTopProducts, setLoadingTopProducts] = useState(true);
  const [addingTopId, setAddingTopId] = useState(null);
 const [linkCopied, setLinkCopied] = useState(false);

async function handleShareBrand() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareData = {
    title: branddata?.brandName || "Brand",
    text: `Check out ${branddata?.brandName || "this brand"} on Bazary`,
    url: shareUrl,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // user cancelled or share failed, ignore
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.log("Failed to copy link", err);
    }
  }
}
  const currentUserId = getLoggedInUserId();

  function popSuccessToast() {
    setRatingSubmitted(true);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 2500);
  }

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

  async function fetchTopProducts() {
    setLoadingTopProducts(true);
    try {
      const res = await fetch(`https://bazary-backend.vercel.app/api/events/live/top-products-by-brand`);
      const json = await res.json();
      const brands = json?.data?.brands || [];
      const thisBrand = brands.find((b) => b.brandId === brandid);
      setTopProducts(thisBrand?.topProducts || []);
    } catch (err) {
      console.log("Failed to fetch top products", err);
    } finally {
      setLoadingTopProducts(false);
    }
  }

  const handleReviewSubmit = async (e) => {
    e?.preventDefault();
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
      setEditingReviewId(null);
      await fetchReviews();
      popSuccessToast();
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

  function startEditingReview(rev) {
    setEditingReviewId(rev._id || null);
    setNewRating(rev.rating);
    setReviewError("");
    if (typeof window !== "undefined") {
      document.getElementById("rate-this-brand")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

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
      fetchTopProducts();
    }
  }, [id, brandid]);
     console.log("brand data" , branddata)


  // Cross-reference top products with the full products list to get
  // real-time stock (quantity) and the real product _id for cart/navigation.
  function getFullProduct(topProduct) {
    return products.find(
      (p) => p._id === topProduct.productId || p.productId === topProduct.productId
    );
  }

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

  const reviewsToShow = reviews.slice(0, visibleReviews);
  const hasMoreReviews = visibleReviews < reviews.length;

  return (
    <div className="w-[100%] lg:w-[100%] mx-auto  py-0 pb-12 ">

      {openLogin && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center shadow-m">
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
          src={bazaardata?.backgroundImage}
          alt="bazaar"
          className="w-full h-full object-cover block"
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

      <div className="w-[95%] lg:w-[85%] m-auto">


      {loading ? (
        <div className="flex items-center gap-4 mb-6 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 flex-shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      ) : (
        <>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={branddata?.logoUrl || "/default.jpg"}
            alt={branddata?.brandName}
            className="w-25 h-25 rounded-full object-cover flex-shrink-0 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-[#22301D]">
                {branddata?.brandName || "Brand"}
              </h2>
              {ratingCount > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-[#22301D] bg-[#faf6ec] border border-[#ece3cd] px-2 py-0.5 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#D4A853">
                    <path d="M11.48 3.499c.15-.461.782-.461.932 0l1.374 4.225a1 1 0 00.95.69h4.436c.484 0 .684.62.293.925l-3.59 2.585a1 1 0 00-.364 1.118l1.374 4.226c.15.461-.377.844-.768.552l-3.59-2.585a1 1 0 00-1.175 0l-3.59 2.585c-.391.292-.918-.09-.768-.552l1.374-4.226a1 1 0 00-.364-1.118l-3.59-2.585c-.391-.305-.19-.925.293-.925h4.436a1 1 0 00.95-.69l1.374-4.225z" />
                  </svg>
                  {Number(avgRating).toFixed(1)}
                </span>
              )}
            </div>
            {branddata?.brandCategory && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {branddata.brandCategory}
              </span>
            )}
            {/* Inline Your Rating - flex next to brand name */}
            {!ratingSubmitted && (
              <div className="flex items-center gap-2.5 mt-2">
                <span className="text-xs font-semibold text-[#50604A]">Your rating</span>
                <StarRatingComponent
                  rating={newRating}
                  size={18}
                  interactive={true}
                  onChange={(r) => setNewRating(r)}
                />
                <button
                  type="button"
                  disabled={submittingReview}
                  onClick={handleReviewSubmit}
                  className="px-3 py-1 bg-[#50604A] text-white text-[11px] font-bold rounded-full hover:bg-[#3e4d39] transition-all duration-200 disabled:opacity-60 flex items-center gap-1.5"
                >
                  {submittingReview ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                      {editingReviewId ? "Update" : "Submit"}
                    </>
                  )}
                </button>
                {editingReviewId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReviewId(null);
                      setNewRating(5);
                    }}
                    className="text-[11px] text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
            {ratingSubmitted && (
              <div className="flex items-center gap-1.5 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-xs font-semibold text-green-600">Rating submitted</span>
                <StarRatingComponent rating={newRating} size={14} />
              </div>
            )}
            {reviewError && (
              <p className="text-[11px] text-red-500 mt-1">{reviewError}</p>
            )}
          </div>
        </div>

        {/* Success Popup with animation */}
    {popupVisible && (
  <div
    className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
    style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)" }}
  >
    <div
      className="pointer-events-auto flex flex-col items-center gap-4 px-10 py-8 rounded-3xl"
      style={{
        background: "white",
        boxShadow: "0 20px 60px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.03)",
        animation: "popupBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
          boxShadow: "0 0 0 6px rgba(22,163,74,0.08)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
          stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: "checkDraw 0.4s ease-out 0.3s both" }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-base font-bold text-[#22301D]">Rating submitted successfully</p>
        <p className="text-xs text-gray-400">Thank you for your feedback</p>
      </div>

      <div className="flex items-center gap-0.5 mt-1">
        <StarRatingComponent rating={newRating} size={18} />
      </div>
    </div>
  </div>
)}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes popupBounceIn {
            0% { opacity: 0; transform: scale(0.5) translateY(20px); }
            60% { opacity: 1; transform: scale(1.05) translateY(-5px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes checkDraw {
            0% { stroke-dasharray: 40; stroke-dashoffset: 40; }
            100% { stroke-dasharray: 40; stroke-dashoffset: 0; }
          }
        ` }} />
        </>
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

  {!loadingTopProducts && topProducts.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center text-center justify-center gap-2 mb-4">
        
            <div>
              <h3 className="text-base font-bold text-[#22301D] leading-tight">Best Sellers</h3>
              <p className="text-[11px] text-stone-400">Most loved products from this brand</p>
            </div>
          </div>

          <div className="flex gap-3 lg:justify-center overflow-x-auto pb-2 scrollbar-hide">
            {topProducts.map((p, idx) => {
              const fullProduct = getFullProduct(p);
              const realId = fullProduct?._id || p.productId;
              const quantity = fullProduct?.quantity;
              const hasStockInfo = quantity !== undefined && quantity !== null;

              return (
                         <div
                  key={p.productId}
                  className="flex-shrink-0 w-[200px]  bg-white rounded-2xl shadow-sm overflow-hidden relative border border-stone-100"
                >
                  <div
                    onClick={() => router.push(`/Bazaarprofile/${id}/brand/${brandid}/product/${realId}`)}
                    className="relative w-full cursor-pointer"
                    style={{ paddingBottom: "100%" }}
                  >
                    <img
                      src={p.images?.[0] || "/default.jpg"}
                      alt={p.productName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {p.priceAfterOffer && (
                      <span
                        className="absolute top-2 left-2 text-[10px] font-semibold text-white px-2 py-0.5 rounded-full"
                        style={{ background: "#16a34a" }}
                      >
                        Sale
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(
                          fullProduct || {
                            _id: realId,
                            name: p.productName,
                            images: p.images,
                            price: p.price,
                            priceAfterOffer: p.priceAfterOffer,
                          },
                          id
                        );
                      }}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200 cursor-pointer group/heart hover:scale-110 active:scale-95"
                      title={isInWishlist(realId) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <FiHeart
                        size={14}
                        className={`transition-colors duration-200 ${
                          isInWishlist(realId)
                            ? "text-red-500 fill-red-500"
                            : "text-gray-600 group-hover/heart:text-red-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-2.5">
                    <h4
                      onClick={() => router.push(`/Bazaarprofile/${id}/brand/${brandid}/product/${realId}`)}
                      className="text-xs font-semibold text-[#22301D] leading-tight line-clamp-1 cursor-pointer"
                    >
                      {p.productName}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {p.priceAfterOffer ? (
                        <>
                          <span className="text-xs font-bold text-[#50604A]">{p.priceAfterOffer} EGP</span>
                          <span className="text-[10px] text-gray-400 line-through">{p.price} EGP</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-[#50604A]">{p.price} EGP</span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-1.5 py-0.5 rounded-full">
                       {p.totalSold} sold out
                    </span>

                    <div className="w-full mt-2.5">
                      {hasStockInfo && quantity === 0 && (
                        <p className="text-[10px] text-red-500 mb-1">Out of stock</p>
                      )}
                      {hasStockInfo && quantity > 0 && quantity <= 5 && (
                        <p className="text-[10px] text-orange-500 mb-1">
                          Hurry up! Only {quantity} left
                        </p>
                      )}

                      {(!hasStockInfo || quantity > 0) && (
                        <button
                          disabled={addingTopId === p.productId}
                          onClick={async (e) => {
                            e.stopPropagation();
                            setAddingTopId(p.productId);
                            try {
                              await addToCart(realId, id, 1);
                            } finally {
                              setAddingTopId(null);
                            }
                          }}
                          className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center
                            ${addingTopId === p.productId
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-[#50604A] text-white hover:opacity-90"
                            }`}
                        >
                          {addingTopId === p.productId ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : "Add to cart"}
                        </button>
                      )}

                      <button
                        className="w-full py-1.5 mt-1.5 rounded-lg text-xs font-medium text-[#50604A] transition-all duration-200 border border-[#50604A] hover:scale-[.98] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/Bazaarprofile/${id}/brand/${brandid}/product/${realId}`);
                        }}
                      >
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    
      {loadingTopProducts && (
        <div className="flex gap-3 justify-center overflow-x-auto pb-2 mb-7">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-[150px] sm:w-[168px] animate-pulse">
              <div className="w-full bg-gray-200 rounded-2xl" style={{ paddingBottom: "100%" }} />
              <div className="mt-2 space-y-1.5">
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-100 rounded" />
                <div className="h-6 w-full bg-gray-100 rounded-lg mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
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
        <div className="flex flex-col items-center justify-center py-16 text-center border-t border-stone-200 pt-4">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full border-t border-stone-200  pt-4">
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

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product, id);
                  }}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200 cursor-pointer group/heart hover:scale-110 active:scale-95"
                  title={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <FiHeart
                    size={16}
                    className={`transition-colors duration-200 ${
                      isInWishlist(product._id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600 group-hover/heart:text-red-500"
                    }`}
                  />
                </button>
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

  {product.quantity > 0 && (
    <button
      disabled={addingId === product._id}
      onClick={async (e) => {
        e.stopPropagation();
        setAddingId(product._id);
        try {
          // bazaarId comes from the route param `id`
          await addToCart(product._id, id, 1);
        } finally {
          setAddingId(null);
        }
      }}
      className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
        ${addingId === product._id
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-[#50604A] text-white hover:opacity-90"
        }`}
    >
      {addingId === product._id ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : "Add to cart"}
    </button>
  )}

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
             <div className="border-t border-stone-200 mt-12 pt-10">
        <div className=" mb-6">
          <h3 className="text-lg font-bold text-[#22301D]">Brand Reviews & Ratings</h3>
          {ratingCount > 0 && (
            <span className="text-xs font-semibold text-stone-400">
              {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>

        <div className="flex flex-col  justify-center items-center gap-6">

          <div className="w-full lg:w-3/3 bg-white border border-stone-200 rounded-2xl p-6 h-fit">
            <div className="text-center pb-5 mb-5 border-b border-stone-100">
              <p className="text-5xl font-extrabold text-[#22301D] leading-none">
                {ratingCount ? Number(avgRating).toFixed(1) : "—"}
              </p>
              <div className="flex justify-center mt-2">
                <StarRatingComponent rating={Math.round(avgRating)} size={18} />
              </div>
              <p className="text-xs text-stone-400 mt-2">
                {ratingCount ? `Based on ${ratingCount} review${ratingCount === 1 ? "" : "s"}` : "No ratings yet"}
              </p>
            </div>

            {ratingCount > 0 && (
              <div className="flex flex-col gap-2">
                {getRatingBreakdown(reviews).map(({ star, count, percent }) => (
                  <div key={star} className="flex items-center gap-2.5">
                    <span className="text-[11px] font-semibold text-stone-500 w-2.5">{star}</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#D4A853">
                      <path d="M11.48 3.499c.15-.461.782-.461.932 0l1.374 4.225a1 1 0 00.95.69h4.436c.484 0 .684.62.293.925l-3.59 2.585a1 1 0 00-.364 1.118l1.374 4.226c.15.461-.377.844-.768.552l-3.59-2.585a1 1 0 00-1.175 0l-3.59 2.585c-.391.292-.918-.09-.768-.552l1.374-4.226a1 1 0 00-.364-1.118l-3.59-2.585c-.391-.305-.19-.925.293-.925h4.436a1 1 0 00.95-.69l1.374-4.225z" />
                    </svg>
                    <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4A853] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-400 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        </div>


        {/* Contact Us Section */}

{/* Contact Us Section */}
<div
  className="relative overflow-hidden rounded-3xl mt-12 px-6 sm:px-10 py-10 sm:py-14"
  style={{ background: "#50604a" }}
>
  {/* subtle decorative circles */}
  <div
    className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
    style={{ background: "rgba(212,168,83,0.08)" }}
  />
  <div
    className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full"
    style={{ background: "rgba(212,168,83,0.06)" }}
  />

  <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
    <div>
      <span
        className="inline-block text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
        style={{ background: "rgba(212,168,83,0.12)", color: "#da9f2f", border: "1px solid rgba(212,168,83,0.3)" }}
      >
        Get in touch
      </span>
      <h2
        className="text-white font-extrabold leading-[0.95] tracking-tight"
        style={{ fontSize: "clamp(2.2rem, 6vw, 3.6rem)" }}
      >
        Let's <span style={{ color: "#da9f2f" }}>Connect</span>
      </h2>
      <p className="text-sm mt-3 max-w-md" style={{ color: "rgba(255,255,255,0.55)" }}>
        Have a question about {branddata?.brandName || "this brand"}? Reach out directly or share this page.
      </p>
    </div>
  </div>

  <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0">
    {/* Phone */}
    {branddata?.phone && (
      <a
        href={`tel:${branddata.phone}`}
        className="flex flex-col items-center text-center px-3 sm:border-r"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2.5">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
        <p className="text-[11px] tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>CALL US</p>
        <p className="text-sm font-semibold text-white">{branddata.phone}</p>
      </a>
    )}

    {/* WhatsApp */}
    {branddata?.whatsapp && (
      <a
        href={`https://wa.me/${branddata.whatsapp.replace(/[^0-9]/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center text-center px-3 sm:border-r"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#D4A853" className="mb-2.5">
          <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 004.84 1.23h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2zm5.85 14.2c-.25.7-1.45 1.34-2 1.42-.51.08-1.15.11-1.86-.12a17 17 0 01-1.68-.62 13.4 13.4 0 01-4.9-4.33c-.5-.68-.98-1.47-.98-2.28 0-.85.44-1.27.6-1.44.16-.17.35-.2.47-.2h.34c.11 0 .26-.04.4.31.15.36.5 1.23.55 1.32.05.1.08.21.02.34-.06.13-.09.21-.18.32-.09.11-.19.24-.27.32-.09.09-.18.19-.08.37.1.18.44.73.95 1.18.65.58 1.2.76 1.38.85.18.09.29.08.4-.05.11-.13.46-.54.58-.72.12-.18.24-.15.4-.09.16.06 1.03.49 1.21.58.18.09.3.13.34.2.05.08.05.44-.2 1.14z" />
        </svg>
        <p className="text-[11px] tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>WHATSAPP</p>
        <p className="text-sm font-semibold text-white">{branddata.whatsapp}</p>
      </a>
    )}

    {/* Email */}
    {branddata?.email && (
      <a
        href={`mailto:${branddata.email}`}
        className="flex flex-col items-center text-center px-3 sm:border-r"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <p className="text-[11px] tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>EMAIL</p>
        <p className="text-sm font-semibold text-white break-all">{branddata.email}</p>
      </a>
    )}

    {/* Share Brand Link */}
    <button
      onClick={handleShareBrand}
      className="flex flex-col items-center text-center px-3 cursor-pointer group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="#D4A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={`mb-2.5 transition-transform duration-300 ${linkCopied ? "scale-110" : "group-hover:scale-110"}`}
      >
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      <p className="text-[11px] tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>SHARE PAGE</p>
      <p className="text-sm font-semibold" style={{ color: linkCopied ? "#4ade80" : "#fff" }}>
        {linkCopied ? "Link copied!" : "Tap to share"}
      </p>
    </button>
  </div>
</div>
        
         </div>

    </div>
  );
}