"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../../../../../context/CartContext";
import { useWishlist } from "../../../../../../../context/WishlistContext";
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

export default function ProductProfile() {
  const { id, brandid, productid } = useParams();
  const router = useRouter();
  const [brand, setBrand] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const { addToCart, cart, updateCartQuantity, removeFromCart, openLogin, closeLogin } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // "You Also May Have Loved" states
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [addingRelatedId, setAddingRelatedId] = useState(null);

  // Feedback pagination
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  const FEEDBACK_PREVIEW_COUNT = 2;

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Quick (stars-only) rating states — mirrors the brand page's inline rating
  const [quickRating, setQuickRating] = useState(5);
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickError, setQuickError] = useState("");
  const [quickRatingSubmitted, setQuickRatingSubmitted] = useState(false);

  const currentUserId = getLoggedInUserId();
  const myReview = reviews.find(
    (r) => (r.userId?._id || r.userId) === currentUserId
  );

  useEffect(() => {
    if (myReview) {
      setQuickRating(myReview.rating);
      setQuickRatingSubmitted(true);
    }
  }, [reviews]);

  const cartItem = cart?.items?.find(
    (item) => (item.productId?._id || item.productId) === productid
  );
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  async function fetchReviews() {
    if (!productid) return;
    setLoadingReviews(true);
    try {
      const res = await fetch(`https://bazary-backend.vercel.app/api/events/products/${productid}/reviews`);
      const json = await res.json();
      setReviews(json.reviews || []);
      setAvgRating(json.avgRating || 0);
      setRatingCount(json.ratingCount || 0);
    } catch (err) {
      console.log("Failed to fetch reviews", err);
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
      const res = await fetch(`https://bazary-backend.vercel.app/api/events/products/${productid}/review`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating: newRating, comment: newComment })
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || "";
        if (msg.includes("duplicate") || msg.includes("dup key") || res.status === 409) {
          throw new Error("You already submitted a review for this product. Please edit it instead.");
        }
        if (res.status === 401 || res.status === 403) {
          throw new Error("Please login first to write a review.");
        }
        throw new Error(msg || "Failed to save review");
      }
      setNewComment("");
      setNewRating(5);
      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("duplicate") || msg.includes("dup key")) {
        setReviewError("You already submitted a review for this product. Please edit it instead.");
      } else {
        setReviewError(msg || "Something went wrong, please try again.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleQuickRatingSubmit = async () => {
    setQuickSubmitting(true);
    setQuickError("");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setQuickError("Please login to rate this product.");
      setQuickSubmitting(false);
      return;
    }
    try {
      const method = myReview ? "PATCH" : "POST";
      const res = await fetch(`https://bazary-backend.vercel.app/api/events/products/${productid}/review`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating: quickRating })
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || "";
        if (msg.includes("duplicate") || msg.includes("dup key") || res.status === 409) {
          throw new Error("You already rated this product. Please edit your existing rating instead.");
        }
        if (res.status === 401 || res.status === 403) {
          throw new Error("Please login first to rate this product.");
        }
        throw new Error(msg || "Failed to save rating");
      }
      await fetchReviews();
      setQuickRatingSubmitted(true);
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("duplicate") || msg.includes("dup key")) {
        setQuickError("You already rated this product. Please edit your existing rating instead.");
      } else {
        setQuickError(msg || "Something went wrong, please try again.");
      }
    } finally {
      setQuickSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchAll() {
      try {
        const bazaarRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands`
        );
        const bazaarJson = await bazaarRes.json();
        setBrand(bazaarJson?.data?.brands?.find((b) => b._id === brandid) || null);

        const prodRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands/${brandid}/products/${productid}`
        );
        const prodJson = await prodRes.json();
        setProduct(prodJson?.data || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    if (id && brandid && productid) {
      fetchAll();
      fetchReviews();
    }
  }, [id, brandid, productid]);

  useEffect(() => {
    async function fetchRelated() {
      if (!id || !brandid) return;
      setLoadingRelated(true);
      try {
        const res = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands/${brandid}/products`
        );
        const json = await res.json();
        const all = json?.data || [];
        const others = all.filter((p) => p._id !== productid);

        // Fisher–Yates shuffle so we get a different random 3 each visit
        const shuffled = [...others];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setRelatedProducts(shuffled.slice(0, 3));
      } catch (err) {
        console.log("Failed to fetch related products", err);
      } finally {
        setLoadingRelated(false);
      }
    }
    fetchRelated();
  }, [id, brandid, productid]);

  const isOutOfStock = product?.quantity === 0;
  const isLowStock = product?.quantity > 0 && product?.quantity <= 5;
  const maxQty = product?.quantity || 1;
  console.log("broduct " , product)

  // ── Quantity Handlers ─────────────────────────────────────────────────────
  const handleIncrease = async () => {
    if (cartQuantity === 0) {
      await addToCart(product._id, id, 1);
    } else {
      await updateCartQuantity(product._id, cartQuantity + 1);
    }
  };

  const handleDecrease = async () => {
    if (cartQuantity <= 1) {
      await removeFromCart(product._id);
    } else {
      await updateCartQuantity(product._id, cartQuantity - 1);
    }
  };

  return (
    <div className="w-[95%] lg:w-[85%] mx-auto px-4 py-6 pb-12 mt-25">

      {openLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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

      {/* ── PRODUCT CONTENT ── */}
      {loading ? (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="w-full lg:w-1/2 animate-pulse">
            <div className="w-full bg-gray-200 rounded-2xl" style={{ paddingBottom: "100%" }} />
            <div className="flex gap-2 mt-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-4 animate-pulse">
            <div className="h-7 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-100 rounded" />
            <div className="space-y-2 mt-4">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded" />
              <div className="h-3 w-4/6 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-1/2 bg-gray-200 rounded mt-4" />
            <div className="h-12 w-full bg-gray-200 rounded-xl mt-4" />
          </div>
        </div>
      ) : !product ? (
        <p className="text-sm text-gray-400 text-center py-20">Product not found</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* ── Images ── */}
          <div className="w-full lg:w-1/2">
            <div
              className="relative w-full rounded-2xl overflow-hidden bg-gray-50"
              style={{ paddingBottom: "100%" }}
            >
              <img
                src={product.images?.[imgIndex] || "/default.jpg"}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              />
              {product.priceAfterOffer && (
                <span
                  className="absolute top-3 left-3 text-xs font-semibold text-white px-3 py-1 rounded-full"
                  style={{ background: "#50604A" }}
                >
                  Sale
                </span>
              )}

              {/* Wishlist Heart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product, id);
                }}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200 cursor-pointer group/heart hover:scale-110 active:scale-95"
                title={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <FiHeart
                  size={19}
                  className={`transition-colors duration-200 ${
                    isInWishlist(product._id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-600 group-hover/heart:text-red-500"
                  }`}
                />
              </button>
            </div>

            {product.images?.length > 1 && (
              <div className="flex justify-center gap-2 mt-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200"
                    style={{ borderColor: imgIndex === i ? "#50604A" : "transparent" }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <h1 className="uppercase">{brand?.brandName || "null"}</h1>

            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-[#22301D] leading-tight">
                {product.name}
              </h2>
              {ratingCount > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-[#22301D] bg-[#faf6ec] border border-[#ece3cd] px-2 py-0.5 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#D4A853">
                    <path d="M11.48 3.499c.15-.461.782-.461.932 0l1.374 4.225a1 1 0 00.95.69h4.436c.484 0 .684.62.293.925l-3.59 2.585a1 1 0 00-.364 1.118l1.374 4.226c.15.461-.377.844-.768.552l-3.59-2.585a1 1 0 00-1.175 0l-3.59 2.585c-.391.292-.918-.09-.768-.552l1.374-4.226a1 1 0 00-.364-1.118l-3.59-2.585c-.391-.305-.19-.925.293-.925h4.436a1 1 0 00.95-.69l1.374-4.225z" />
                  </svg>
                  {Number(avgRating).toFixed(1)}
                  <span className="font-normal text-stone-400">
                    ({ratingCount})
                  </span>
                </span>
              )}
            </div>

            {/* Quick stars-only rating — same pattern as the brand page */}
            {!quickRatingSubmitted && (
              <div className="flex items-center gap-2.5 flex-wrap -mt-2">
                <span className="text-xs font-semibold text-[#50604A]">Your rating</span>
                <StarRatingComponent
                  rating={quickRating}
                  size={18}
                  interactive={true}
                  onChange={(r) => setQuickRating(r)}
                />
                <button
                  type="button"
                  disabled={quickSubmitting}
                  onClick={handleQuickRatingSubmit}
                  className="px-3 py-1 bg-[#50604A] text-white text-[11px] font-bold rounded-full hover:bg-[#3e4d39] transition-all duration-200 disabled:opacity-60 flex items-center gap-1.5"
                >
                  {quickSubmitting ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                      {myReview ? "Update" : "Submit"}
                    </>
                  )}
                </button>
              </div>
            )}
            {quickRatingSubmitted && (
              <div className="flex items-center gap-1.5 flex-wrap -mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-xs font-semibold text-green-600">Rating submitted</span>
                <StarRatingComponent rating={quickRating} size={14} />
                <button
                  type="button"
                  onClick={() => setQuickRatingSubmitted(false)}
                  className="text-[11px] text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
            {quickError && (
              <p className="text-[11px] text-red-500 -mt-2">{quickError}</p>
            )}

            {/* Price */}
     

                <p className="text-sm text-gray-500 leading-relaxed">
                  <p className="text-black font-bold">product description :</p>
                  
                  {product.description}</p>
                       <div className="flex items-baseline gap-3">
              {product.priceAfterOffer ? (
                    <>
                      <span className="text-black font-bold text-l" >price:</span>
                  <span className="text-2xl font-bold text-[#50604A]">
                    {product.priceAfterOffer} EGP
                  </span>
                  <span className="text-base text-gray-400 line-through">
                    {product.price} EGP
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "#50604A" }}
                  >
                    {Math.round(
                      ((product.price - product.priceAfterOffer) / product.price) * 100
                    )}% OFF
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#50604A]">
                  {product.price} EGP
                </span>
              )}
            </div>

            <div className="border-t border-gray-100 my-1" />

            {isOutOfStock && (
              <p className="text-sm font-medium text-red-500">Out of stock</p>
            )}
            {isLowStock && (
              <p className="text-sm font-medium text-orange-500">
                🔥 Hurry up! Only {product.quantity} left
              </p>
            )}

            {/* ── Quantity Controls ── */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 font-medium">Quantity</span>

                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  {/* − button */}
                  <button
                    onClick={handleDecrease}
                    disabled={cartQuantity === 0}
                    className={`w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors
                      ${cartQuantity === 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                  >
                    −
                  </button>

                  <span className="w-10 text-center text-sm font-semibold text-[#22301D]">
                    {cartQuantity}
                  </span>

                  {/* + button */}
                  <button
                    onClick={handleIncrease}
                    disabled={cartQuantity >= maxQty}
                    className={`w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors
                      ${cartQuantity >= maxQty
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                  >
                    +
                  </button>
                </div>

                <span className="text-xs text-gray-400">{product.quantity} available</span>
              </div>
            )}

            {/* Total */}
            {!isOutOfStock && (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-base font-bold text-[#22301D]">
                  {(product.priceAfterOffer || product.price) * (cartQuantity || 0)} EGP
                </span>
              </div>
            )}

            {/* Service badges */}
     <div className=" flex-column gap-7 pt-4 border-t border-gray-100">

  <div className=" py-2 flex items-center gap-2 text-xs text-gray-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#50604A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 2.64-6.36" />
      <path d="M3 3v6h6" />
      <path d="M12 7v5l3 3" />
    </svg>
    <span>Returnable within 24 hours</span>
  </div>


  <div className=" py-2 flex items-center gap-2 text-xs text-gray-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#50604A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="15" height="12" rx="1" />
      <path d="M16 8h4l3 3v5h-7z" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="18.5" cy="18.5" r="2" />
    </svg>
    <span>Same-day delivery &amp; shipping</span>
  </div>


  <div className=" py-2 flex items-center gap-2 text-xs text-gray-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#50604A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
    <span>100% Secure Payment</span>
  </div>

 
  <div className="py-2 flex items-center gap-2 text-xs text-gray-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#50604A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 18l-6.2 3.1 1.2-6.9-5-4.9 6.9-1L12 2z" />
    </svg>
    <span>Premium Quality Guaranteed</span>
  </div>
</div>
          </div>

     
        </div>
      )}
      {!loading && product && (
        <div className="border-t border-stone-200 mt-12 pt-10">
          <h3 className="text-lg font-bold text-[#22301D] mb-6">You May Also Like</h3>

          {loadingRelated ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-40 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : relatedProducts.length === 0 ? (
            <p className="text-sm text-gray-400"></p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {relatedProducts.map((rp) => (
                <div
                  key={rp._id}
                  onClick={() => router.push(`/Bazaarprofile/${id}/brand/${brandid}/product/${rp._id}`)}
                  className="w-full bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer border border-stone-100"
                >
                  <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                    <img
                      src={rp.images?.[0] || "/default.jpg"}
                      alt={rp.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {rp.priceAfterOffer && (
                      <span
                        className="absolute top-1.5 left-1.5 text-[9px] font-semibold text-white px-1.5 py-0.5 rounded-full"
                        style={{ background: "#16a34a" }}
                      >
                        Sale
                      </span>
                    )}

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(rp, id);
                      }}
                      className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200 cursor-pointer group/heart hover:scale-110 active:scale-95"
                      title={isInWishlist(rp._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <FiHeart
                        size={12}
                        className={`transition-colors duration-200 ${
                          isInWishlist(rp._id)
                            ? "text-red-500 fill-red-500"
                            : "text-gray-600 group-hover/heart:text-red-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-2 text-[14px] ">
                    <h4 className="text-xs font-semibold text-[#22301D] leading-tight line-clamp-1">
                      {rp.name}
                    </h4>

                    <div className=" flex items-center gap-1.5 mt-1">
                      {rp.priceAfterOffer ? (
                        <>
                          <span className="text-xs font-bold text-[#50604A text-[14px] ]">{rp.priceAfterOffer} EGP</span>
                          <span className="text-[10px] text-gray-400 line-through text-[14px] ">{rp.price} EGP</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-[#50604A] text-[14px] ">{rp.price} EGP</span>
                      )}
                    </div>

                    <div className="w-full mt-2">
                      {rp.quantity === 0 && (
                        <p className="text-[10px] text-red-500 mb-1">Out of stock</p>
                      )}
                      {rp.quantity > 0 && rp.quantity <= 5 && (
                        <p className="text-[10px] text-orange-500 mb-1">
                          Only {rp.quantity} left
                        </p>
                      )}

                      <button
                        disabled={rp.quantity === 0 || addingRelatedId === rp._id}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (rp.quantity === 0) return;
                          setAddingRelatedId(rp._id);
                          try {
                            await addToCart(rp._id, id, 1);
                          } finally {
                            setAddingRelatedId(null);
                          }
                        }}
                        className={`w-full py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 flex items-center justify-center
                          ${rp.quantity === 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : addingRelatedId === rp._id
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#50604A] text-white hover:opacity-90"
                          }`}
                      >
                        {rp.quantity === 0 ? (
                          "Out of stock"
                        ) : addingRelatedId === rp._id ? (
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "Add to cart"
                        )}
                      </button>

                      <button
                        className="w-full py-1.5 mt-1.5 rounded-md text-[11px] font-medium text-[#50604A] transition-all duration-200 border border-[#50604A] hover:scale-[.98] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/Bazaarprofile/${id}/brand/${brandid}/product/${rp._id}`);
                        }}
                      >
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

           {/* ── REVIEWS SECTION ── */}
          <div className="border-t border-stone-200 mt-12 pt-10">
            <div className=" mb-6">
              <h3 className="text-lg font-bold text-[#22301D]">Customer Reviews</h3>
              {ratingCount > 0 && (
                <span className="text-xs font-semibold text-stone-400">
                  {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
                </span>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              {/* Average Rating card */}
              <div className="w-full lg:w-1/2 bg-white border border-stone-200 rounded-2xl p-6 h-fit">
                <h4 className="text-sm font-bold text-[#22301D] mb-4">Average Rating</h4>
                <div className="text-center pb-5 mb-5 border-b border-stone-100">
                  <p className="text-5xl font-extrabold text-[#22301D] leading-none">
                    {ratingCount ? Number(avgRating).toFixed(1) : "—"}
                  </p>
                  <div className="flex justify-center mt-2">
                    <StarRatingComponent rating={Math.round(avgRating)} size={18} />
                  </div>
                  <p className="text-xs text-stone-400 mt-2">
                    {ratingCount ? `Based on ${ratingCount} review${ratingCount === 1 ? "" : "s"}` : "No reviews yet"}
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

              {/* Submit Your Review card */}
              <div className="w-full lg:w-1/2 bg-[#50604a] rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-1">
                  {editingReviewId ? "Edit Your Review" : "Submit Your Review"}
                </h4>
                <p className="text-[11px] text-white/50 mb-4">
                  {editingReviewId
                    ? "Update your rating or comment below."
                    : "Tell other shoppers what you thought of this product."}
                </p>
                {reviewError && (
                  <div className="bg-red-500/10 border border-red-400/30 text-red-300 text-xs px-3 py-2 rounded-lg mb-4">
                    {reviewError}
                  </div>
                )}
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 w-fit">
                    <span className="text-xs font-semibold text-white/70">Your rating</span>
                    <StarRatingComponent
                      rating={newRating}
                      size={20}
                      interactive={true}
                      onChange={(r) => setNewRating(r)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">Your comment</label>
                    <textarea
                      rows={3}
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="What did you think about this product?"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4A853] transition-colors placeholder:text-white/30 resize-none"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    {editingReviewId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReviewId(null);
                          setNewComment("");
                          setNewRating(5);
                        }}
                        className="px-3 py-1.5 border border-white/20 text-[11px] font-semibold text-white/70 rounded-md hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-3.5 py-1.5 bg-[#D4A853] text-[#22301D] text-[11px] font-bold rounded-md hover:bg-[#c79a44] transition-colors disabled:opacity-60"
                    >
                      {submittingReview ? "Saving..." : editingReviewId ? "Update Review" : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Customer Feedback — full width below, only entries with a written comment */}
            <div className="flex flex-col gap-3 mt-8">
              <h4 className="text-sm font-bold text-[#22301D]">Customer Feedback</h4>
              {loadingReviews ? (
                <div className="flex justify-center py-10">
                  <div className="w-5 h-5 border-2 border-t-transparent border-[#50604A] rounded-full animate-spin" />
                </div>
              ) : (() => {
                const commentedReviews = reviews.filter((rev) => rev.comment && rev.comment.trim());
                if (commentedReviews.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center text-center bg-stone-50 border border-dashed border-stone-200 rounded-2xl py-10">
                      <span className="text-2xl mb-2">★</span>
                      <p className="text-xs text-stone-400">No written reviews yet.</p>
                      <p className="text-xs text-stone-400">Be the first to share your thoughts!</p>
                    </div>
                  );
                }
                const visible = showAllFeedback
                  ? commentedReviews
                  : commentedReviews.slice(0, FEEDBACK_PREVIEW_COUNT);
                return (
                  <>
                    <div className="flex flex-col gap-2.5">
                      {visible.map((rev) => {
                        const isOwn = (rev.userId?._id || rev.userId) === getLoggedInUserId();
                        return (
                          <div
                            key={rev._id}
                            className={`flex flex-col gap-2.5 p-4 rounded-xl border ${
                              isOwn ? "bg-[#f0f4e8] border-[#cdd9bf]" : "bg-white border-stone-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#50604A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                  {reviewerInitial(rev)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-[#22301D]">
                                      {reviewerLabel(rev)}
                                    </span>
                                    {isOwn && (
                                      <span className="text-[9px] font-bold uppercase tracking-wide text-[#50604A] bg-[#dfe8d4] px-1.5 py-0.5 rounded">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <StarRatingComponent rating={rev.rating} size={12} />
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-[10px] text-stone-400 whitespace-nowrap">
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
                                      setNewComment(rev.comment || "");
                                    }}
                                    className="text-[10px] font-bold text-[#50604A] hover:underline"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            </div>
                            {rev.comment && (
                              <p className="text-xs text-stone-600 leading-relaxed pl-11">
                                {rev.comment}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {commentedReviews.length > FEEDBACK_PREVIEW_COUNT && (
                      <button
                        type="button"
                        onClick={() => setShowAllFeedback((v) => !v)}
                        className="self-center mt-1 px-4 py-1.5 text-xs font-semibold text-[#50604A] border border-[#50604A] rounded-full hover:bg-[#f0f4e8] transition-colors"
                      >
                        {showAllFeedback ? "See Less" : `See More (${commentedReviews.length - FEEDBACK_PREVIEW_COUNT})`}
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
    </div>
  );
}