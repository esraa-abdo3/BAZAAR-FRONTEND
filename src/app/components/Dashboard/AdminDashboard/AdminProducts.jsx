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
  const [deletingId, setDeletingId] = useState(null);
  const [blockModal, setBlockModal] = useState({ open: false, productId: null, productName: "" });
  const [blockReason, setBlockReason] = useState("");
  const [editModal, setEditModal] = useState({ open: false, product: null });
  const [editForm, setEditForm] = useState({});
  const [editImages, setEditImages] = useState([]); // existing image URLs kept
  const [editNewImages, setEditNewImages] = useState([]); // newly added File objects
  const [editNewPreviews, setEditNewPreviews] = useState([]); // preview URLs for new files
  const [savingEdit, setSavingEdit] = useState(false);

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

  const openEditModal = (product) => {
    setEditForm({
      quantity: product.quantity ?? "",
      price: product.price ?? "",
      priceAfterOffer: product.priceAfterOffer ?? "",
      description: product.description || "",
    });
    setEditImages(product.images || []);
    setEditNewImages([]);
    setEditNewPreviews([]);
    setEditModal({ open: true, product });
  };

  const closeEditModal = () => {
    setEditModal({ open: false, product: null });
    setEditForm({});
    setEditImages([]);
    setEditNewImages([]);
    setEditNewPreviews([]);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const removeExistingImage = (idx) => {
    setEditImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx) => {
    setEditNewImages((prev) => prev.filter((_, i) => i !== idx));
    setEditNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setEditNewImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setEditNewPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editModal.product) return;
    try {
      setSavingEdit(true);
      setError(null);

      let payload;
      if (editNewImages.length > 0) {
        const fd = new FormData();
        fd.append("quantity", editForm.quantity);
        fd.append("price", editForm.price);
        if (editForm.priceAfterOffer !== "") {
          fd.append("priceAfterOffer", editForm.priceAfterOffer);
        }
        fd.append("description", editForm.description ?? "");
        // Send both kept existing image URLs and newly uploaded files under
        // the same "images" field — the backend should merge string values
        // (existing URLs) coming through req.body.images with uploaded files
        // coming through req.files.
        editImages.forEach((url) => fd.append("images", url));
        editNewImages.forEach((file) => fd.append("images", file));
        payload = fd;
      } else {
        payload = {
          quantity: Number(editForm.quantity),
          price: Number(editForm.price),
          priceAfterOffer: editForm.priceAfterOffer === "" ? null : Number(editForm.priceAfterOffer),
          description: editForm.description,
          images: editImages,
        };
      }

      const updated = await updateAdminProduct(editModal.product._id, payload);
      setSuccess(`Product "${editModal.product.name}" updated successfully!`);
      fetchProductsList();
      if (detailProduct && detailProduct._id === editModal.product._id) {
        setDetailProduct({ ...detailProduct, ...(updated || {}) });
      }
      closeEditModal();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Update product failed:", err?.response?.data || err);
      setError(err?.response?.data?.message || "Failed to update product.");
    } finally {
      setSavingEdit(false);
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
        <div className="bg-green-50 border border-gray-100 text-indigo-600 text-xs px-4 py-3 rounded-xl font-medium">
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
          <h2 className="text-sm font-semibold text-gray-800">Products Catalog</h2>
          <p className="text-xs text-gray-400">
            Moderate product listings, check stock quantities, and verify active promotions.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
            className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#4f46e5", borderTopColor: "transparent" }}
            />
            <p className="text-xs text-gray-400">Loading products list...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="mx-auto text-gray-300 mb-3 block w-8 h-8">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-gray-700">No Products Listed</p>
            <p className="text-[10px] text-gray-400 mt-1">Vendor product entries will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
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
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/40 transition-colors">
                    {/* Image, Name, ID */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.images && p.images[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                              <line x1="3" y1="6" x2="21" y2="6" />
                              <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0 max-w-[200px]">
                          <p className="font-semibold text-gray-800 truncate" title={p.name}>
                            {p.name}
                          </p>
                          <p className="text-[9px] text-gray-400 font-mono truncate">{p._id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Brand source */}
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {p.brandId?.brandName || "Platform Brand"}
                    </td>

                    {/* Standard Price */}
                    <td className="px-6 py-4 text-right text-gray-700 font-semibold">
                      {p.price.toLocaleString()} EGP
                    </td>

                    {/* Offer Price */}
                    <td className="px-6 py-4 text-right font-medium">
                      {p.priceAfterOffer ? (
                        <span className="text-indigo-600 bg-gray-100 px-2 py-0.5 rounded font-semibold text-[10px]">
                          {p.priceAfterOffer.toLocaleString()} EGP
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Stock level */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block min-w-[32px] px-1.5 py-0.5 rounded font-semibold text-[10px] ${
                          p.quantity > 10
                            ? "bg-gray-100 text-gray-700"
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
                          className="w-7 h-7 flex items-center justify-center rounded bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 transition-colors"
                          title="View product details"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-indigo-50 border border-indigo-100 text-indigo-500 hover:bg-indigo-100 transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
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
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400">
              Page {page} of {totalPages} (Total {total} Products)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-100 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-xl p-6 w-full max-w-md flex flex-col gap-4 relative">
            <button
              onClick={() => setDetailProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h3 className="font-semibold text-gray-800 text-sm">Product specifications</h3>

            <div className="flex gap-4 items-start border-b border-gray-100 pb-4">
              {detailProduct.images && detailProduct.images[0] ? (
                <img
                  src={detailProduct.images[0]}
                  alt={detailProduct.name}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 flex-shrink-0">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-sm leading-snug truncate">{detailProduct.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Brand: {detailProduct.brandId?.brandName || "Unknown Brand"}
                </p>
                <div className="flex gap-2 items-center mt-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-700">{detailProduct.price} EGP</span>
                  {detailProduct.priceAfterOffer && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-gray-100 px-1.5 py-0.5 rounded">
                      Promo: {detailProduct.priceAfterOffer} EGP
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 flex flex-col gap-2.5">
              <p className="leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-stone-650">
                {detailProduct.description || "No product description provided."}
              </p>

              {/* Product meta grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <div className="p-2 border border-gray-100 rounded-lg bg-gray-50/50">
                  <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Stock quantity</span>
                  <span className="font-semibold">{detailProduct.quantity} items</span>
                </div>
                <div className="p-2 border border-gray-100 rounded-lg bg-gray-50/50">
                  <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Status state</span>
                  <span className="font-semibold">{detailProduct.isActive ? "Active / Visible" : "Hidden"}</span>
                </div>
              </div>

              {/* Bazaars Listed In */}
              <div className="mt-1">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Listed In Bazaars</span>
                {detailProduct.bazaars && detailProduct.bazaars.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {detailProduct.bazaars.map((baz, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-indigo-600 text-[10px] px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 border border-gray-100"
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
                  <p className="text-[10px] text-gray-400 italic">Not assigned to any event.</p>
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

              <div className="flex justify-end border-t border-gray-100 pt-4 mt-1">
                <button
                  onClick={() => {
                    setDetailProduct(null);
                    openEditModal(detailProduct);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer transition-colors"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Reason Modal */}
      {blockModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Block Product</h3>
                <p className="text-[10px] text-gray-400">This product will be blocked from the platform.</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Block Reason</label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter the reason for blocking this product..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700 resize-none placeholder-gray-400"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBlockModal({ open: false, productId: null, productName: "" })}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
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

      {/* Edit Product Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Edit Product</h3>
                <p className="text-[10px] text-gray-400" title={editModal.product?.name}>
                  {editModal.product?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              {/* Images management */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Product Images</label>
                <div className="flex flex-wrap gap-2">
                  {editImages.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative w-16 h-16">
                      <img
                        src={url}
                        alt={`img-${idx}`}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] hover:bg-red-600"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {editNewPreviews.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative w-16 h-16">
                      <img
                        src={url}
                        alt={`new-img-${idx}`}
                        className="w-16 h-16 rounded-lg object-cover border border-indigo-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] hover:bg-red-600"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewImagesChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    name="quantity"
                    value={editForm.quantity}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Price (EGP)</label>
                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Offer Price (EGP)</label>
                <input
                  type="number"
                  min="0"
                  name="priceAfterOffer"
                  placeholder="Leave empty for no offer"
                  value={editForm.priceAfterOffer}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {savingEdit && (
                    <div className="w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
