// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useCart } from "../../../../../../../context/CartContext";

// function StarRatingComponent({ rating, size = 16, interactive = false, onChange }) {
//   const [hoverRating, setHoverRating] = useState(0);

//   return (
//     <div className="flex items-center gap-0.5">
//       {[1, 2, 3, 4, 5].map((star) => {
//         const fillValue = hoverRating || rating;
//         const isFilled = star <= fillValue;
//         return (
//           <button
//             key={star}
//             type="button"
//             disabled={!interactive}
//             onClick={() => onChange && onChange(star)}
//             onMouseEnter={() => interactive && setHoverRating(star)}
//             onMouseLeave={() => interactive && setHoverRating(0)}
//             className={`${interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}`}
//           >
//             <svg
//               width={size}
//               height={size}
//               viewBox="0 0 24 24"
//               fill={isFilled ? "#f59e0b" : "none"}
//               stroke={isFilled ? "#f59e0b" : "#d6d3d1"}
//               strokeWidth={1.5}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M11.48 3.499c.15-.461.782-.461.932 0l1.374 4.225a1 1 0 00.95.69h4.436c.484 0 .684.62.293.925l-3.59 2.585a1 1 0 00-.364 1.118l1.374 4.226c.15.461-.377.844-.768.552l-3.59-2.585a1 1 0 00-1.175 0l-3.59 2.585c-.391.292-.918-.09-.768-.552l1.374-4.226a1 1 0 00-.364-1.118l-3.59-2.585c-.391-.305-.19-.925.293-.925h4.436a1 1 0 00.95-.69l1.374-4.225z"
//               />
//             </svg>
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// function getLoggedInUserId() {
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   if (!token) return null;
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     const parsed = JSON.parse(jsonPayload);
//     return parsed.id || parsed._id || parsed.userId || null;
//   } catch {
//     return null;
//   }
// }

// export default function ProductProfile() {
//   const { id, brandid, productid } = useParams();
//   const [brand, setBrand] = useState(null);
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [imgIndex, setImgIndex] = useState(0);
//   const { addToCart, cart, updateCartQuantity, removeFromCart } = useCart();

//   // Reviews states
//   const [reviews, setReviews] = useState([]);
//   const [avgRating, setAvgRating] = useState(0);
//   const [ratingCount, setRatingCount] = useState(0);
//   const [loadingReviews, setLoadingReviews] = useState(false);
//   const [newRating, setNewRating] = useState(5);
//   const [newComment, setNewComment] = useState("");
//   const [submittingReview, setSubmittingReview] = useState(false);
//   const [reviewError, setReviewError] = useState("");
//   const [editingReviewId, setEditingReviewId] = useState(null);

//   const cartItem = cart?.items?.find(
//     (item) => (item.productId?._id || item.productId) === productid
//   );
//   const cartQuantity = cartItem ? cartItem.quantity : 0;

//   async function fetchReviews() {
//     if (!productid) return;
//     setLoadingReviews(true);
//     try {
//       const res = await fetch(`https://bazary-backend.vercel.app/api/events/products/${productid}/reviews`);
//       const json = await res.json();
//       setReviews(json.reviews || []);
//       setAvgRating(json.avgRating || 0);
//       setRatingCount(json.ratingCount || 0);
//     } catch (err) {
//       console.log("Failed to fetch reviews", err);
//     } finally {
//       setLoadingReviews(false);
//     }
//   }

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     setSubmittingReview(true);
//     setReviewError("");
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     if (!token) {
//       setReviewError("Please login to write a review.");
//       setSubmittingReview(false);
//       return;
//     }
//     try {
//       const method = editingReviewId ? "PATCH" : "POST";
//       const res = await fetch(`https://bazary-backend.vercel.app/api/events/products/${productid}/review`, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({ rating: newRating, comment: newComment })
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         const msg = data.message || "";
//         if (msg.includes("duplicate") || msg.includes("dup key") || res.status === 409) {
//           throw new Error("You already submitted a review for this product. Please edit it instead.");
//         }
//         if (res.status === 401 || res.status === 403) {
//           throw new Error("Please login first to write a review.");
//         }
//         throw new Error(msg || "Failed to save review");
//       }
//       setNewComment("");
//       setNewRating(5);
//       setEditingReviewId(null);
//       fetchReviews();
//     } catch (err) {
//       const msg = err.message || "";
//       if (msg.includes("duplicate") || msg.includes("dup key")) {
//         setReviewError("You already submitted a review for this product. Please edit it instead.");
//       } else {
//         setReviewError(msg || "Something went wrong, please try again.");
//       }
//     } finally {
//       setSubmittingReview(false);
//     }
//   };

//   useEffect(() => {
//     async function fetchAll() {
//       try {
//         const bazaarRes = await fetch(
//           `https://bazary-backend.vercel.app/api/events/live/${id}/brands`
//         );
//         const bazaarJson = await bazaarRes.json();
//         setBrand(bazaarJson?.data?.brands?.find((b) => b._id === brandid) || null);

//         const prodRes = await fetch(
//           `https://bazary-backend.vercel.app/api/events/live/${id}/brands/${brandid}/products/${productid}`
//         );
//         const prodJson = await prodRes.json();
//         setProduct(prodJson?.data || null);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (id && brandid && productid) {
//       fetchAll();
//       fetchReviews();
//     }
//   }, [id, brandid, productid]);

//   const isOutOfStock = product?.quantity === 0;
//   const isLowStock = product?.quantity > 0 && product?.quantity <= 5;
//   const maxQty = product?.quantity || 1;

//   // ── Quantity Handlers ─────────────────────────────────────────────────────
//   const handleIncrease = async () => {
//     if (cartQuantity === 0) {
//       await addToCart(product._id);
//     } else {
//       await updateCartQuantity(product._id, cartQuantity + 1);
//     }
//   };

//   const handleDecrease = async () => {
//     if (cartQuantity <= 1) {
//       await removeFromCart(product._id);
//     } else {
//       await updateCartQuantity(product._id, cartQuantity - 1);
//     }
//   };

//   return (
//     <div className="w-[95%] lg:w-[85%] mx-auto px-4 py-6 pb-12 mt-15">

//       {/* ── PRODUCT CONTENT ── */}
//       {loading ? (
//         <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
//           <div className="w-full lg:w-1/2 animate-pulse">
//             <div className="w-full bg-gray-200 rounded-2xl" style={{ paddingBottom: "100%" }} />
//             <div className="flex gap-2 mt-3">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
//               ))}
//             </div>
//           </div>
//           <div className="w-full lg:w-1/2 space-y-4 animate-pulse">
//             <div className="h-7 w-3/4 bg-gray-200 rounded" />
//             <div className="h-4 w-1/3 bg-gray-100 rounded" />
//             <div className="space-y-2 mt-4">
//               <div className="h-3 w-full bg-gray-100 rounded" />
//               <div className="h-3 w-5/6 bg-gray-100 rounded" />
//               <div className="h-3 w-4/6 bg-gray-100 rounded" />
//             </div>
//             <div className="h-8 w-1/2 bg-gray-200 rounded mt-4" />
//             <div className="h-12 w-full bg-gray-200 rounded-xl mt-4" />
//           </div>
//         </div>
//       ) : !product ? (
//         <p className="text-sm text-gray-400 text-center py-20">Product not found</p>
//       ) : (
//         <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

//           {/* ── Images ── */}
//           <div className="w-full lg:w-1/2">
//             <div
//               className="relative w-full rounded-2xl overflow-hidden bg-gray-50"
//               style={{ paddingBottom: "100%" }}
//             >
//               <img
//                 src={product.images?.[imgIndex] || "/default.jpg"}
//                 alt={product.name}
//                 className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
//               />
//               {product.priceAfterOffer && (
//                 <span
//                   className="absolute top-3 left-3 text-xs font-semibold text-white px-3 py-1 rounded-full"
//                   style={{ background: "#50604A" }}
//                 >
//                   Sale
//                 </span>
//               )}
//             </div>

//             {product.images?.length > 1 && (
//               <div className="flex justify-center gap-2 mt-3 overflow-x-auto pb-1">
//                 {product.images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setImgIndex(i)}
//                     className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200"
//                     style={{ borderColor: imgIndex === i ? "#50604A" : "transparent" }}
//                   >
//                     <img src={img} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ── Info ── */}
//           <div className="w-full lg:w-1/2 flex flex-col gap-5">
//             <h1 className="uppercase">{brand?.brandName || "null"}</h1>

//             <h2 className="text-xl sm:text-2xl font-bold text-[#22301D] leading-tight">
//               {product.name}
//             </h2>

//             {/* Price */}
//             <div className="flex items-baseline gap-3">
//               {product.priceAfterOffer ? (
//                 <>
//                   <span className="text-2xl font-bold text-[#50604A]">
//                     {product.priceAfterOffer} EGP
//                   </span>
//                   <span className="text-base text-gray-400 line-through">
//                     {product.price} EGP
//                   </span>
//                   <span
//                     className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
//                     style={{ background: "#50604A" }}
//                   >
//                     {Math.round(
//                       ((product.price - product.priceAfterOffer) / product.price) * 100
//                     )}% OFF
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-2xl font-bold text-[#50604A]">
//                   {product.price} EGP
//                 </span>
//               )}
//             </div>

//             <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>

//             <div className="border-t border-gray-100 my-1" />

//             {isOutOfStock && (
//               <p className="text-sm font-medium text-red-500">Out of stock</p>
//             )}
//             {isLowStock && (
//               <p className="text-sm font-medium text-orange-500">
//                 🔥 Hurry up! Only {product.quantity} left
//               </p>
//             )}

//             {/* ── Quantity Controls ── */}
//             {!isOutOfStock && (
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-500 font-medium">Quantity</span>

//                 <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
//                   {/* − button */}
//                   <button
//                     onClick={handleDecrease}
//                     disabled={cartQuantity === 0}
//                     className={`w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors
//                       ${cartQuantity === 0
//                         ? "text-gray-300 cursor-not-allowed"
//                         : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
//                       }`}
//                   >
//                     −
//                   </button>

//                   <span className="w-10 text-center text-sm font-semibold text-[#22301D]">
//                     {cartQuantity}
//                   </span>

//                   {/* + button */}
//                   <button
//                     onClick={handleIncrease}
//                     disabled={cartQuantity >= maxQty}
//                     className={`w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors
//                       ${cartQuantity >= maxQty
//                         ? "text-gray-300 cursor-not-allowed"
//                         : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
//                       }`}
//                   >
//                     +
//                   </button>
//                 </div>

//                 <span className="text-xs text-gray-400">{product.quantity} available</span>
//               </div>
//             )}

//             {/* Total */}
//             {!isOutOfStock && (
//               <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
//                 <span className="text-sm text-gray-500">Total</span>
//                 <span className="text-base font-bold text-[#22301D]">
//                   {(product.priceAfterOffer || product.price) * (cartQuantity || 0)} EGP
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* ── REVIEWS SECTION ── */}
//           <div className="border-t border-stone-200 mt-12 pt-10">
//             <h3 className="text-lg font-bold text-[#22301D] mb-6">Customer Reviews</h3>

//             <div className="flex flex-col lg:flex-row gap-8">
//               {/* Analytics summary */}
//               <div className="w-full lg:w-1/3 bg-stone-50 border border-stone-200 rounded-2xl p-6 h-fit">
//                 <div className="text-center mb-6">
//                   <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Average Rating</p>
//                   <p className="text-5xl font-extrabold text-[#22301D] mb-2">{Number(avgRating).toFixed(1)}</p>
//                   <div className="flex justify-center">
//                     <StarRatingComponent rating={Math.round(avgRating)} size={20} />
//                   </div>
//                   <p className="text-xs text-stone-400 mt-2">Based on {ratingCount} review{ratingCount === 1 ? "" : "s"}</p>
//                 </div>
//               </div>

//               {/* Reviews List & Write Review */}
//               <div className="w-full lg:w-2/3 flex flex-col gap-6">
//                 {/* Form to Write or Edit a review */}
//                 <div className="bg-white border border-stone-200 rounded-2xl p-6">
//                   <h4 className="text-sm font-bold text-[#22301D] mb-4">
//                     {editingReviewId ? "Edit Your Review" : "Write a Review"}
//                   </h4>
//                   {reviewError && (
//                     <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">
//                       {reviewError}
//                     </div>
//                   )}
//                   <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
//                     <div>
//                       <label className="block text-xs font-semibold text-stone-500 mb-1.5">Rating</label>
//                       <StarRatingComponent
//                         rating={newRating}
//                         size={24}
//                         interactive={true}
//                         onChange={(r) => setNewRating(r)}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-semibold text-stone-500 mb-1.5">Your Comment</label>
//                       <textarea
//                         rows={3}
//                         required
//                         value={newComment}
//                         onChange={(e) => setNewComment(e.target.value)}
//                         placeholder="What did you think about this product?"
//                         className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-[#50604A] transition-colors placeholder:text-stone-300 resize-none"
//                       />
//                     </div>
//                     <div className="flex gap-2 justify-end">
//                       {editingReviewId && (
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setEditingReviewId(null);
//                             setNewComment("");
//                             setNewRating(5);
//                           }}
//                           className="px-4 py-1.5 border border-stone-200 text-xs font-semibold text-stone-600 rounded-lg hover:bg-stone-50"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                       <button
//                         type="submit"
//                         disabled={submittingReview}
//                         className="px-5 py-1.5 bg-[#50604A] text-white text-xs font-semibold rounded-lg hover:bg-[#22301D] transition-colors disabled:opacity-60"
//                       >
//                         {submittingReview ? "Saving..." : editingReviewId ? "Update Review" : "Submit Review"}
//                       </button>
//                     </div>
//                   </form>
//                 </div>

//                 {/* Reviews List */}
//                 <div className="flex flex-col gap-4">
//                   <h4 className="text-sm font-bold text-[#22301D] border-b border-stone-100 pb-2">Feedback & Comments</h4>
//                   {loadingReviews ? (
//                     <div className="flex justify-center py-8">
//                       <div className="w-5 h-5 border-2 border-t-transparent border-[#50604A] rounded-full animate-spin" />
//                     </div>
//                   ) : reviews.length === 0 ? (
//                     <p className="text-xs text-stone-400 italic">No reviews yet. Be the first to share your thoughts!</p>
//                   ) : (
//                     <div className="divide-y divide-stone-100">
//                       {reviews.map((rev) => {
//                         const isOwn = (rev.userId?._id || rev.userId) === getLoggedInUserId();
//                         return (
//                           <div key={rev._id} className="py-4 first:pt-0 flex flex-col gap-1.5">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 <StarRatingComponent rating={rev.rating} size={12} />
//                                 <span className="text-[10px] font-semibold text-stone-500">
//                                   User: ...{(rev.userId?._id || String(rev.userId)).slice(-6)}
//                                 </span>
//                               </div>
//                               <div className="flex items-center gap-3">
//                                 <span className="text-[10px] text-stone-400">
//                                   {new Date(rev.createdAt).toLocaleDateString(undefined, {
//                                     year: "numeric",
//                                     month: "short",
//                                     day: "numeric",
//                                   })}
//                                 </span>
//                                 {isOwn && (
//                                   <button
//                                     onClick={() => {
//                                       setEditingReviewId(rev._id);
//                                       setNewRating(rev.rating);
//                                       setNewComment(rev.comment || "");
//                                     }}
//                                     className="text-[10px] font-bold text-[#50604A] hover:underline"
//                                   >
//                                     Edit
//                                   </button>
//                                 )}
//                               </div>
//                             </div>
//                             {rev.comment && (
//                               <p className="text-xs text-stone-600 leading-relaxed font-sans bg-stone-50/50 p-2.5 rounded-lg border border-stone-100/50">
//                                 {rev.comment}
//                               </p>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../../../../../../context/CartContext";

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
  const [brand, setBrand] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const { addToCart, cart, updateCartQuantity, removeFromCart } = useCart();

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

  const isOutOfStock = product?.quantity === 0;
  const isLowStock = product?.quantity > 0 && product?.quantity <= 5;
  const maxQty = product?.quantity || 1;

  // ── Quantity Handlers ─────────────────────────────────────────────────────
  const handleIncrease = async () => {
    if (cartQuantity === 0) {
      await addToCart(product._id);
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
    <div className="w-[95%] lg:w-[85%] mx-auto px-4 py-6 pb-12 mt-15">

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

            <h2 className="text-xl sm:text-2xl font-bold text-[#22301D] leading-tight">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.priceAfterOffer ? (
                <>
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

            <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>

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
          </div>

     
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

            <div className="flex flex-col items-center gap-6">
              {/* Analytics summary */}
              <div className="w-full lg:w-2/3 bg-white border border-stone-200 rounded-2xl p-6 h-fit">
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

              {/* Reviews List & Write Review */}
              <div className="w-full lg:w-2/3 flex flex-col gap-5">
                {/* Form to Write or Edit a review */}
                <div className="bg-[#22301D] rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-white mb-1">
                    {editingReviewId ? "Edit Your Review" : "Write a Review"}
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

                {/* Reviews List */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-[#22301D]">Feedback & Comments</h4>
                  {loadingReviews ? (
                    <div className="flex justify-center py-10">
                      <div className="w-5 h-5 border-2 border-t-transparent border-[#50604A] rounded-full animate-spin" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center bg-stone-50 border border-dashed border-stone-200 rounded-2xl py-10">
                      <span className="text-2xl mb-2">★</span>
                      <p className="text-xs text-stone-400">No reviews yet.</p>
                      <p className="text-xs text-stone-400">Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {reviews.map((rev) => {
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
                  )}
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}