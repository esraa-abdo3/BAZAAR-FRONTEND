"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAdminProducts,
  getAdminOneProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/app/services/adminService";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailProduct, setDetailProduct] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [blockModal, setBlockModal] = useState({ open: false, productId: null, productName: "" });
  const [blockReason, setBlockReason] = useState("");

  const fetchProductsList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminProducts({ page, limit: 10 });
      setProducts(res.products || []);
      setTotal(res.total || 0);
    } catch {
      setError("Failed to fetch products list.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  // Client side search
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetailClick = async (productId) => {
    try {
      setError(null);
      const details = await getAdminOneProduct(productId);
      setDetailProduct(details);
    } catch {
      setError("Failed to load product details.");
    }
  };

  const handleToggleActive = async (product) => {
    try {
      setTogglingId(product._id);
      setError(null);
      
      let payload = {};
      let successMsg = "";
      
      if (product.status === "BLOCKED") {
        payload = { status: "ACTIVE", isActive: true };
        successMsg = `Product "${product.name}" unblocked and activated successfully.`;
      } else {
        const newActiveState = !product.isActive;
        payload = { isActive: newActiveState };
        successMsg = `Product "${product.name}" is now ${newActiveState ? "active" : "inactive"}.`;
      }
      
      await updateAdminProduct(product._id, payload);
      setSuccess(successMsg);
      fetchProductsList();
      if (detailProduct && detailProduct._id === product._id) {
        setDetailProduct({ ...detailProduct, ...payload });
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to update product state.");
    } finally {
      setTogglingId(null);
    }
  };

  const openBlockModal = (productId, productName) => {
    setBlockModal({ open: true, productId, productName });
    setBlockReason("");
  };

  const handleBlock = async () => {
    if (!blockReason.trim()) return;
    try {
      setDeletingId(blockModal.productId);
      setError(null);
      await deleteAdminProduct(blockModal.productId, blockReason.trim());
      setSuccess(`Product "${blockModal.productName}" blocked successfully.`);
      setBlockModal({ open: false, productId: null, productName: "" });
      fetchProductsList();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to block product.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex flex-col gap-6">
      {/* Toast feedback */}
      {success && (
        <div className="bg-green-50 border border-stone-200 text-[#3d4f38] text-xs px-4 py-3 rounded-xl font-medium">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-stone-800">Products Catalog</h2>
          <p className="text-xs text-stone-400">
            Moderate product listings, check stock quantities, and verify active promotions.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700 placeholder-stone-400"
          />
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#3d4f38", borderTopColor: "transparent" }}
            />
            <p className="text-xs text-stone-400">Loading products list...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="mx-auto text-stone-300 mb-3 block w-8 h-8">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-stone-700">No Products Listed</p>
            <p className="text-[10px] text-stone-400 mt-1">Vendor product entries will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] text-stone-400 font-semibold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3.5">Product Details</th>
                  <th className="px-6 py-3.5">Brand Source</th>
                  <th className="px-6 py-3.5 text-right">Standard Price</th>
                  <th className="px-6 py-3.5 text-right">Offer Price</th>
                  <th className="px-6 py-3.5 text-center">Stock</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50/40 transition-colors">
                    {/* Image, Name, ID */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.images && p.images[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                              <line x1="3" y1="6" x2="21" y2="6" />
                              <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0 max-w-[200px]">
                          <p className="font-semibold text-stone-800 truncate" title={p.name}>
                            {p.name}
                          </p>
                          <p className="text-[9px] text-stone-400 font-mono truncate">{p._id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Brand source */}
                    <td className="px-6 py-4 text-stone-700 font-medium">
                      {p.brandId?.brandName || "Platform Brand"}
                    </td>

                    {/* Standard Price */}
                    <td className="px-6 py-4 text-right text-stone-700 font-semibold">
                      {p.price.toLocaleString()} EGP
                    </td>

                    {/* Offer Price */}
                    <td className="px-6 py-4 text-right font-medium">
                      {p.priceAfterOffer ? (
                        <span className="text-[#3d4f38] bg-stone-100 px-2 py-0.5 rounded font-semibold text-[10px]">
                          {p.priceAfterOffer.toLocaleString()} EGP
                        </span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>

                    {/* Stock level */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block min-w-[32px] px-1.5 py-0.5 rounded font-semibold text-[10px] ${
                          p.quantity > 10
                            ? "bg-stone-100 text-stone-700"
                            : p.quantity > 0
                            ? "bg-orange-100 text-orange-850"
                            : "bg-red-105 text-red-800"
                        }`}
                      >
                        {p.quantity}
                      </span>
                    </td>

                    {/* Status indicator */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          p.isActive && p.status !== "BLOCKED"
                            ? "bg-green-100 border-green-200 text-green-700"
                            : "bg-red-105 border-red-200 text-red-800"
                        }`}
                      >
                        {p.status === "BLOCKED" ? "Blocked" : p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDetailClick(p._id)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-stone-50 border border-stone-200 text-stone-500 hover:bg-stone-100 transition-colors"
                          title="View product details"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          disabled={togglingId === p._id}
                          onClick={() => handleToggleActive(p)}
                          className={`w-7 h-7 flex items-center justify-center rounded border transition-colors cursor-pointer ${
                            p.status === "BLOCKED"
                              ? "bg-green-50 border-green-100 text-green-700 hover:bg-green-100"
                              : p.isActive
                              ? "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                              : "bg-green-50 border-green-100 text-green-700 hover:bg-green-100"
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                          title={p.status === "BLOCKED" ? "Unblock & Activate" : p.isActive ? "Deactivate" : "Activate"}
                        >
                          {togglingId === p._id ? (
                            <div
                              className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin"
                              style={{ borderColor: "#3d4f38", borderTopColor: "transparent" }}
                            />
                          ) : p.isActive ? (
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                          ) : (
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 019.9-1" />
                            </svg>
                          )}
                        </button>
                        <button
                          disabled={deletingId === p._id || p.status === "BLOCKED"}
                          onClick={() => openBlockModal(p._id, p.name)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Block / Delete Product"
                        >
                          {deletingId === p._id ? (
                            <div
                              className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin"
                              style={{ borderColor: "#ef4444", borderTopColor: "transparent" }}
                            />
                          ) : (
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-stone-100">
            <p className="text-[10px] text-stone-400">
              Page {page} of {totalPages} (Total {total} Products)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                    page === i + 1
                      ? "bg-[#3d4f38] text-white"
                      : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal Overlay */}
      {detailProduct && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl p-6 w-full max-w-md flex flex-col gap-4 relative">
            <button
              onClick={() => setDetailProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h3 className="font-semibold text-stone-850 text-sm">Product specifications</h3>

            <div className="flex gap-4 items-start border-b border-stone-100 pb-4">
              {detailProduct.images && detailProduct.images[0] ? (
                <img
                  src={detailProduct.images[0]}
                  alt={detailProduct.name}
                  className="w-20 h-20 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400 flex-shrink-0">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-stone-800 text-sm leading-snug truncate">{detailProduct.name}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Brand: {detailProduct.brandId?.brandName || "Unknown Brand"}
                </p>
                <div className="flex gap-2 items-center mt-2 flex-wrap">
                  <span className="text-xs font-bold text-stone-700">{detailProduct.price} EGP</span>
                  {detailProduct.priceAfterOffer && (
                    <span className="text-[10px] font-bold text-[#3d4f38] bg-stone-100 px-1.5 py-0.5 rounded">
                      Promo: {detailProduct.priceAfterOffer} EGP
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-500 flex flex-col gap-2.5">
              <p className="leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-stone-650">
                {detailProduct.description || "No product description provided."}
              </p>

              {/* Product meta grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                <div className="p-2 border border-stone-100 rounded-lg bg-stone-50/50">
                  <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Stock quantity</span>
                  <span className="font-semibold">{detailProduct.quantity} items</span>
                </div>
                <div className="p-2 border border-stone-100 rounded-lg bg-stone-50/50">
                  <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Status state</span>
                  <span className="font-semibold">{detailProduct.isActive ? "Active / Visible" : "Hidden"}</span>
                </div>
              </div>

              {/* Bazaars Listed In */}
              <div className="mt-1">
                <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block mb-1.5">Listed In Bazaars</span>
                {detailProduct.bazaars && detailProduct.bazaars.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {detailProduct.bazaars.map((baz, index) => (
                      <span
                        key={index}
                        className="bg-stone-100 text-[#3d4f38] text-[10px] px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 border border-stone-200"
                      >
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        {baz.name || baz.bazaarName || "Bazaar"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-stone-400 italic">Not assigned to any event.</p>
                )}
              </div>

              {/* Warnings if blocked */}
              {detailProduct.status === "BLOCKED" && (
                <div className="bg-red-50 text-red-800 text-[11px] p-2.5 rounded-lg border border-red-200 flex items-center gap-2">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>This product is blocked by system administrators.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Block Reason Modal */}
      {blockModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">Block Product</h3>
                <p className="text-[10px] text-stone-400">This product will be blocked from the platform.</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Block Reason</label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter the reason for blocking this product..."
                rows={3}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700 resize-none placeholder-stone-400"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBlockModal({ open: false, productId: null, productName: "" })}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >Cancel</button>
              <button
                type="button"
                disabled={!blockReason.trim() || deletingId}
                onClick={handleBlock}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {deletingId ? (
                  <div className="w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
                ) : (
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                )}
                Block Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
