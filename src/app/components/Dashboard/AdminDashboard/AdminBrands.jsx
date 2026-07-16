"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAdminBrands,
  getAdminOneBrand,
  updateAdminBrand,
  deleteAdminBrand,
} from "@/app/services/adminService";

const BRAND_TYPES = ["OFFLINE", "ONLINE", "HYBRID"];

// Fallback shown when a brand's logoUrl is broken/404 (e.g. deleted or invalid image host path)
const FALLBACK_LOGO =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Crect x='2' y='7' width='20' height='14' rx='2' ry='2'/%3E%3Cpath d='M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16'/%3E%3C/svg%3E";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailBrand, setDetailBrand] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [blockModal, setBlockModal] = useState({ open: false, brandId: null });
  const [blockReason, setBlockReason] = useState("");
  const [editModal, setEditModal] = useState({ open: false, brand: null });
  const [editForm, setEditForm] = useState({});
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchBrandsList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminBrands({ page, limit: 10 });
      setBrands(res.brands || []);
      setTotal(res.total || 0);
    } catch {
      setError("Failed to fetch brands list.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBrandsList();
  }, [fetchBrandsList]);

  // Search filter
  const filteredBrands = brands.filter(
    (b) =>
      b.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetailClick = async (brandId) => {
    try {
      setError(null);
      const details = await getAdminOneBrand(brandId);
      setDetailBrand(details);
    } catch {
      setError("Failed to load brand details.");
    }
  };

  const openEditModal = (brand) => {
    setEditForm({
      firstName: brand.firstName || "",
      lastName: brand.lastName || "",
      phone: brand.phone || "",
      whatsapp: brand.whatsapp || "",
      email: brand.email || "",
      brandName: brand.brandName || "",
      brandCategory: brand.brandCategory || "",
      brandDescription: brand.brandDescription || "",
      brandType: brand.brandType || "",
      location: brand.location || "",
    });
    setEditLogoFile(null);
    setEditLogoPreview(brand.logoUrl || null);
    setEditModal({ open: true, brand });
  };

  const closeEditModal = () => {
    setEditModal({ open: false, brand: null });
    setEditForm({});
    setEditLogoFile(null);
    setEditLogoPreview(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditLogoFile(file);
    setEditLogoPreview(URL.createObjectURL(file));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editModal.brand) return;
    try {
      setSavingEdit(true);
      setError(null);

      let payload = editForm;
      if (editLogoFile) {
        const fd = new FormData();
        Object.entries(editForm).forEach(([key, value]) => {
          fd.append(key, value ?? "");
        });
        fd.append("logoUrl", editLogoFile);
        payload = fd;
      }

      const updated = await updateAdminBrand(editModal.brand._id, payload);
      setSuccess(`Brand ${editForm.brandName || editModal.brand.brandName} updated successfully!`);
      fetchBrandsList();
      if (detailBrand && detailBrand._id === editModal.brand._id) {
        setDetailBrand({ ...detailBrand, ...editForm, ...(updated || {}) });
      }
      closeEditModal();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to update brand.");
    } finally {
      setSavingEdit(false);
    }
  };

  const openBlockModal = (brandId) => {
    setBlockModal({ open: true, brandId });
    setBlockReason("");
  };

  const handleBlock = async () => {
    if (!blockReason.trim()) return;
    try {
      setDeletingId(blockModal.brandId);
      setError(null);
      await deleteAdminBrand(blockModal.brandId, blockReason.trim());
      setSuccess("Brand blocked successfully!");
      setBlockModal({ open: false, brandId: null });
      fetchBrandsList();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to block brand.");
    } finally {
      setDeletingId(null);
    }
  };

  console.log("brands",brands)
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex flex-col gap-6">
      {/* Toast notifications */}
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

      {/* Header & search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Brands Directory</h2>
          <p className="text-xs text-gray-400">
            Verify newly registered brands, view contact information, and moderate access.
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
            placeholder="Search by brand or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Brands Table list */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#4f46e5", borderTopColor: "transparent" }}
            />
            <p className="text-xs text-gray-400">Loading brands catalog...</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-20">
            <span className="mx-auto text-gray-300 mb-3 block w-8 h-8">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-gray-700">No Brands Found</p>
            <p className="text-[10px] text-gray-400 mt-1">New brands will show up here once registered.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3.5">Brand Details</th>
                  <th className="px-6 py-3.5">Owner Contact</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredBrands.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/40 transition-colors">
                    {/* Brand Name & Category */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {b.logoUrl ? (
                          <img
                            src={b.logoUrl}
                            alt={b.brandName}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_LOGO;
                            }}
                            className="w-9 h-9 rounded-lg object-cover border border-gray-100 bg-gray-50"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">{b.brandName}</p>
                          <p className="text-[10px] font-semibold text-indigo-500">{b.brandCategory}</p>
                        </div>
                      </div>
                    </td>

                    {/* Owner detail */}
                    <td className="px-6 py-4">
                      <p className="text-gray-700 font-medium">
                        {b.firstName} {b.lastName}
                      </p>
                      <p className="text-[10px] text-gray-400">{b.phone}</p>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="text-gray-400">
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </span>
                        {b.location || "N/A"}
                      </span>
                    </td>

                    {/* Active Toggle Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          b.status === "BLOCKED"
                            ? "bg-red-100 border-red-200 text-red-800"
                            : b.isActive
                            ? "bg-green-100 border-green-200 text-green-700"
                            : "bg-amber-100 border-amber-200 text-amber-700"
                        }`}
                      >
                        {b.status === "BLOCKED" ? "Blocked" : b.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDetailClick(b._id)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 transition-colors"
                          title="View brand details"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(b)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-indigo-50 border border-indigo-100 text-indigo-500 hover:bg-indigo-100 transition-colors cursor-pointer"
                          title="Edit brand"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          disabled={deletingId === b._id || b.status === "BLOCKED"}
                          onClick={() => openBlockModal(b._id)}
                          className={`w-7 h-7 flex items-center justify-center rounded border transition-colors ${
                            b.status === "BLOCKED"
                              ? "bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-50 border-red-100 text-red-500 hover:bg-red-100 cursor-pointer"
                          }`}
                          title={b.status === "BLOCKED" ? "Brand Blocked" : "Block Brand"}
                        >
                          {deletingId === b._id ? (
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
              Page {page} of {totalPages} (Total {total} Brands)
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

      {/* Brand Details Modal Overlay */}
      {detailBrand && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xl p-6 w-full max-w-md flex flex-col gap-4 relative">
            <button
              onClick={() => setDetailBrand(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              {detailBrand.logoUrl ? (
                <img
                  src={detailBrand.logoUrl}
                  alt={detailBrand.brandName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_LOGO;
                  }}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-gray-50"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{detailBrand.brandName}</h3>
                <p className="text-[10px] font-semibold text-indigo-600 bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
                  {detailBrand.brandCategory}
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 flex flex-col gap-2">
              <p className="leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-gray-600">
                {detailBrand.brandDescription || "No brand description provided."}
              </p>

              {/* Owner card */}
              <div className="p-3 border border-gray-100 rounded-xl flex flex-col gap-2 mt-2">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Owner Contact Details</span>
                <p className="font-semibold text-gray-700 text-sm">
                  {detailBrand.firstName} {detailBrand.lastName}
                </p>
                <div className="flex flex-col gap-1.5 mt-1 text-[11px] text-gray-600">
                  <p className="flex items-center gap-1.5">
                    <span className="text-gray-400">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </span>
                    {detailBrand.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-gray-400">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    {detailBrand.email || "Email not available"}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-gray-400">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    Location: {detailBrand.location || "N/A"}
                  </p>
                </div>
              </div>

              {/* Bazaars Joined */}
              <div className="mt-2">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Participating In</span>
                {detailBrand.bazaars && detailBrand.bazaars.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {detailBrand.bazaars.map((baz, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {baz.name || baz.bazaarName || "Bazaar event"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-400 italic">Not registered in any active bazaar.</p>
                )}
              </div>

              {/* Quick Status Control inside Modal */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-3">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Status</span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {detailBrand.status === "BLOCKED" ? "Blocked" : detailBrand.isActive ? "Active" : "Suspended"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setDetailBrand(null);
                    openEditModal(detailBrand);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer transition-colors"
                >
                  Edit Brand
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Block Brand</h3>
                <p className="text-[10px] text-gray-400">This brand will be blocked from the platform.</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Block Reason</label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter the reason for blocking this brand..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700 resize-none placeholder-gray-400"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBlockModal({ open: false, brandId: null })}
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
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                )}
                Block Brand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Edit Brand</h3>
                <p className="text-[10px] text-gray-400">Update brand and owner information.</p>
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
              {/* Logo upload */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Brand Logo</label>
                <div className="flex items-center gap-3">
                  {editLogoPreview ? (
                    <img
                      src={editLogoPreview}
                      alt="Logo preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_LOGO;
                      }}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-100 bg-gray-50"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                      </svg>
                    </div>
                  )}
                  <label className="px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                    Change Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">WhatsApp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={editForm.whatsapp || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email || ""}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={editForm.brandName || ""}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Brand Category</label>
                  <input
                    type="text"
                    name="brandCategory"
                    value={editForm.brandCategory || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Brand Type</label>
                  <select
                    name="brandType"
                    value={editForm.brandType || ""}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                  >
                    <option value="">Select type</option>
                    {BRAND_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editForm.location || ""}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Brand Description</label>
                <textarea
                  name="brandDescription"
                  value={editForm.brandDescription || ""}
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