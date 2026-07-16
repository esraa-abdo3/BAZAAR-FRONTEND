"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BrandPagination from "./BrandPagination";

const BASE_URL = "https://bazary-backend.vercel.app/api";
const PAGE_SIZE = 5;

function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper components
function StarRating({ rating, size = 16, interactive = false, onChange }) {
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

export default function BrandReviews({ brandId }) {
  const [activeTab, setActiveTab] = useState("brand"); // "brand" | "product"
  
  // Brand Reviews State
  const [brandReviews, setBrandReviews] = useState([]);
  const [brandAvgRating, setBrandAvgRating] = useState(0);
  const [brandRatingCount, setBrandRatingCount] = useState(0);
  const [loadingBrand, setLoadingBrand] = useState(false);

  // Product Reviews State
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productReviews, setProductReviews] = useState([]);
  const [productAvgRating, setProductAvgRating] = useState(0);
  const [productRatingCount, setProductRatingCount] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingProductReviews, setLoadingProductReviews] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add-brand"); // "add-brand" | "edit-brand" | "add-product" | "edit-product"
  const [modalData, setModalData] = useState({ rating: 5, comment: "" });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [page, setPage] = useState(1);

  // Fetch brand reviews
  async function loadBrandReviews() {
    if (!brandId) return;
    setLoadingBrand(true);
    try {
      const res = await axios.get(`${BASE_URL}/events/brands/${brandId}/reviews`, {
        headers: getHeaders(),
      });
      const list = res.data?.reviews ?? [];
      setBrandReviews(list);
      setBrandAvgRating(res.data?.avgRating ?? 0);
      setBrandRatingCount(res.data?.ratingCount ?? 0);
    } catch (err) {
      console.error("Failed to load brand reviews", err);
    } finally {
      setLoadingBrand(false);
    }
  }

  // Fetch brand products
  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const res = await axios.get(`${BASE_URL}/brand/products`, {
        headers: getHeaders(),
      });
      const list = res.data?.data?.products ?? res.data?.data ?? res.data ?? [];
      setProducts(list);
      if (list.length > 0) {
        setSelectedProductId(list[0]._id);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoadingProducts(false);
    }
  }

  // Fetch reviews for selected product
  async function loadProductReviews(productId) {
    if (!productId) return;
    setLoadingProductReviews(true);
    try {
      const res = await axios.get(`${BASE_URL}/events/products/${productId}/reviews`, {
        headers: getHeaders(),
      });
      setProductReviews(res.data?.reviews ?? []);
      setProductAvgRating(res.data?.avgRating ?? 0);
      setProductRatingCount(res.data?.ratingCount ?? 0);
    } catch (err) {
      console.error("Failed to load product reviews", err);
    } finally {
      setLoadingProductReviews(false);
    }
  }

  useEffect(() => {
    if (brandId) {
      loadBrandReviews();
      loadProducts();
    }
  }, [brandId]);

  useEffect(() => {
    if (selectedProductId) {
      loadProductReviews(selectedProductId);
    }
  }, [selectedProductId]);

  // Handle Add/Edit Form submit
  async function handleModalSubmit(e) {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");

    try {
      let url = "";
      let method = "POST";
      let payload = { rating: modalData.rating };

      if (modalType.includes("product")) {
        payload.comment = modalData.comment;
      }

      if (modalType === "add-brand") {
        url = `${BASE_URL}/events/brands/${brandId}/review`;
        method = "POST";
      } else if (modalType === "edit-brand") {
        url = `${BASE_URL}/events/brands/${brandId}/review`;
        method = "PATCH";
      } else if (modalType === "add-product") {
        url = `${BASE_URL}/events/products/${selectedProductId}/review`;
        method = "POST";
      } else if (modalType === "edit-product") {
        url = `${BASE_URL}/events/products/${selectedProductId}/review`;
        method = "PATCH";
      }

      await axios({
        method,
        url,
        data: payload,
        headers: getHeaders(),
      });

      // Refresh data
      if (modalType.includes("brand")) {
        await loadBrandReviews();
      } else {
        await loadProductReviews(selectedProductId);
      }

      setShowModal(false);
      setModalData({ rating: 5, comment: "" });
    } catch (err) {
      setModalError(
        err?.response?.data?.message ?? "An error occurred. Please try again."
      );
    } finally {
      setModalLoading(false);
    }
  }

  // Open modals
  function openAddBrandModal() {
    setModalType("add-brand");
    setModalData({ rating: 5, comment: "" });
    setModalError("");
    setShowModal(true);
  }

  function openEditBrandModal(currentRating) {
    setModalType("edit-brand");
    setModalData({ rating: currentRating, comment: "" });
    setModalError("");
    setShowModal(true);
  }

  function openAddProductModal() {
    setModalType("add-product");
    setModalData({ rating: 5, comment: "" });
    setModalError("");
    setShowModal(true);
  }

  function openEditProductModal(currentRating, currentComment) {
    setModalType("edit-product");
    setModalData({ rating: currentRating, comment: currentComment || "" });
    setModalError("");
    setShowModal(true);
  }

  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedProductId]);

  // Calculate rating breakdown percentage
  function getRatingBreakdown(reviews) {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });
    const total = reviews.length || 1;
    return Object.keys(counts).map((stars) => ({
      stars: Number(stars),
      count: counts[stars],
      percentage: Math.round((counts[stars] / total) * 100),
    })).reverse();
  }

  const selectedProduct = products.find((p) => p._id === selectedProductId);
  const activeReviews = activeTab === "brand" ? brandReviews : productReviews;
  const activeAvg = activeTab === "brand" ? brandAvgRating : productAvgRating;
  const activeCount = activeTab === "brand" ? brandRatingCount : productRatingCount;
  const breakdown = getRatingBreakdown(activeReviews);
  const totalPages = Math.max(1, Math.ceil(activeReviews.length / PAGE_SIZE));
  const paginatedReviews = activeReviews.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">Dashboard / Reviews</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Reviews & Feedback
          </h1>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("brand")}
          className={`px-4 py-2.5 font-medium text-xs border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "brand"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Brand Reviews
        </button>
        <button
          onClick={() => setActiveTab("product")}
          className={`px-4 py-2.5 font-medium text-xs border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "product"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Product Reviews
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 flex flex-col justify-center items-center shadow-sm">
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">
            Average Rating
          </p>
          <p className="text-5xl font-extrabold text-stone-900 mb-2">
            {Number(activeAvg).toFixed(1)}
          </p>
          <StarRating rating={Math.round(activeAvg)} size={20} />
          <p className="text-xs text-stone-400 mt-2">
            Based on {activeCount} {activeCount === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Breakdown bar */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 md:col-span-2 flex flex-col justify-between shadow-sm">
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-4">
            Rating Distribution
          </p>
          <div className="flex flex-col gap-2">
            {breakdown.map((b) => (
              <div key={b.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-stone-500 font-medium">
                  {b.stars} {b.stars === 1 ? "star" : "stars"}
                </span>
                <div className="flex-1 bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>
                <span className="w-10 text-stone-400 text-right">
                  {b.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Reviews Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {activeTab === "product" && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 h-fit shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Select Product
            </h2>
            {loadingProducts ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-t-transparent border-indigo-400 rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-xs text-gray-400">No products found.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                {products.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => setSelectedProductId(p._id)}
                    className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-all ${
                      selectedProductId === p._id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-100 hover:bg-gray-50/50"
                    }`}
                  >
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded border shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-indigo-600 font-medium">
                        ${Number(p.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className={`bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm ${
            activeTab === "product" ? "md:col-span-2" : "md:col-span-3"
          }`}
        >
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {activeTab === "brand" ? "Brand Reviews" : "Product Reviews"}
              </h2>
              {activeTab === "product" && selectedProduct && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Showing feedback for &quot;{selectedProduct.name}&quot;
                </p>
              )}
            </div>
            
            {/* Simulation trigger */}
            <button
              onClick={activeTab === "brand" ? openAddBrandModal : openAddProductModal}
              disabled={activeTab === "product" && !selectedProductId}
              className="text-[11px] font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shrink-0"
            >
              + Write Review (Demo)
            </button>
          </div>

          {/* List display */}
          <div className="divide-y divide-gray-100">
            {(activeTab === "brand" ? loadingBrand : loadingProductReviews) ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-t-transparent border-indigo-400 rounded-full animate-spin" />
              </div>
            ) : activeReviews.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-400 text-xs">No reviews found.</p>
              </div>
            ) : (
              paginatedReviews.map((rev) => (
                <div key={rev._id} className="p-5 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={rev.rating} size={14} />
                        <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          Rating: {rev.rating}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1">
                        By User: {rev.userId?._id ? `...${rev.userId._id.slice(-8)}` : `...${String(rev.userId).slice(-8)}`}
                        {" • "}
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        activeTab === "brand"
                          ? openEditBrandModal(rev.rating)
                          : openEditProductModal(rev.rating, rev.comment)
                      }
                      className="text-[10px] font-semibold border border-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors shrink-0"
                    >
                      Edit (Demo)
                    </button>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-stone-600 italic bg-stone-50/50 p-2.5 rounded-lg border border-stone-100 mt-1 leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
          {!loadingBrand && !loadingProductReviews && activeReviews.length > 0 && (
            <BrandPagination
              page={page}
              totalPages={totalPages}
              totalItems={activeReviews.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="reviews"
            />
          )}
        </div>
      </div>

      {/* Write / Edit Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h3 className="text-sm font-bold text-stone-800">
                {modalType === "add-brand" && "Add Brand Review"}
                {modalType === "edit-brand" && "Edit Brand Review"}
                {modalType === "add-product" && "Add Product Review"}
                {modalType === "edit-product" && "Edit Product Review"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} className="p-5 flex flex-col gap-4">
              {modalError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-lg">
                  {modalError}
                </div>
              )}

              {/* Rating Star Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-2">
                  Select Star Rating
                </label>
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 flex justify-center">
                  <StarRating
                    rating={modalData.rating}
                    size={28}
                    interactive={true}
                    onChange={(r) => setModalData({ ...modalData, rating: r })}
                  />
                </div>
              </div>

              {/* Comment Box (Product only) */}
              {modalType.includes("product") && (
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                    Write Comment
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={modalData.comment}
                    onChange={(e) => setModalData({ ...modalData, comment: e.target.value })}
                    placeholder="Enter review comments (e.g. Quality, size, shipping...)"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-xs text-stone-800 bg-white focus:outline-none focus:border-[#3d4f38] transition-colors placeholder:text-stone-300 resize-none"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-stone-200 text-xs font-semibold text-stone-600 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {modalLoading && (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {modalLoading ? "Saving..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
