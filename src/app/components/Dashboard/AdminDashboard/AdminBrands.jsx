"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAdminBrands,
  getAdminOneBrand,
  updateAdminBrand,
  deleteAdminBrand,
} from "@/app/services/adminService";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailBrand, setDetailBrand] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [blockModal, setBlockModal] = useState({ open: false, brandId: null });
  const [blockReason, setBlockReason] = useState("");

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

  const handleToggleActive = async (brand) => {
    try {
      setTogglingId(brand._id);
      setError(null);
      
      let payload = {};
      let successMsg = "";
      
      if (brand.status === "BLOCKED") {
        payload = { status: "ACTIVE", isActive: true };
        successMsg = `Brand ${brand.brandName} unblocked and activated successfully!`;
      } else {
        const newActiveState = !brand.isActive;
        payload = { isActive: newActiveState };
        successMsg = `Brand ${brand.brandName} ${newActiveState ? "activated" : "suspended"} successfully!`;
      }
      
      await updateAdminBrand(brand._id, payload);
      setSuccess(successMsg);
      fetchBrandsList();
      if (detailBrand && detailBrand._id === brand._id) {
        setDetailBrand({ ...detailBrand, ...payload });
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to change brand status.");
    } finally {
      setTogglingId(null);
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

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex flex-col gap-6">
      {/* Toast notifications */}
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

      {/* Header & search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-stone-800">Brands Directory</h2>
          <p className="text-xs text-stone-400">
            Verify newly registered brands, view contact information, and moderate access.
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
            placeholder="Search by brand or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700 placeholder-stone-400"
          />
        </div>
      </div>

      {/* Brands Table list */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#3d4f38", borderTopColor: "transparent" }}
            />
            <p className="text-xs text-stone-400">Loading brands catalog...</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-20">
            <span className="mx-auto text-stone-300 mb-3 block w-8 h-8">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-stone-700">No Brands Found</p>
            <p className="text-[10px] text-stone-400 mt-1">New brands will show up here once registered.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] text-stone-400 font-semibold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3.5">Brand Details</th>
                  <th className="px-6 py-3.5">Owner Contact</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredBrands.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50/40 transition-colors">
                    {/* Brand Name & Category */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {b.logoUrl ? (
                          <img
                            src={b.logoUrl}
                            alt={b.brandName}
                            className="w-9 h-9 rounded-lg object-cover border border-stone-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-stone-800">{b.brandName}</p>
                          <p className="text-[10px] font-semibold text-[#50604A]">{b.brandCategory}</p>
                        </div>
                      </div>
                    </td>

                    {/* Owner detail */}
                    <td className="px-6 py-4">
                      <p className="text-stone-700 font-medium">
                        {b.firstName} {b.lastName}
                      </p>
                      <p className="text-[10px] text-stone-400">{b.phone}</p>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-stone-600">
                      <span className="flex items-center gap-1">
                        <span className="text-stone-400">
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
                          className="w-7 h-7 flex items-center justify-center rounded bg-stone-50 border border-stone-200 text-stone-500 hover:bg-stone-100 transition-colors"
                          title="View brand details"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          disabled={togglingId === b._id}
                          onClick={() => handleToggleActive(b)}
                          className={`w-7 h-7 flex items-center justify-center rounded border transition-colors cursor-pointer ${
                            b.isActive
                              ? "bg-red-50 border-red-100 text-red-500 hover:bg-red-100"
                              : "bg-green-50 border-green-100 text-green-700 hover:bg-green-100"
                          }`}
                          title={b.isActive ? "Suspend Access" : "Approve/Activate"}
                        >
                          {togglingId === b._id ? (
                            <div
                              className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin"
                              style={{ borderColor: "#3d4f38", borderTopColor: "transparent" }}
                            />
                          ) : b.isActive ? (
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                              <line x1="12" y1="9" x2="12" y2="13" />
                              <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                          ) : (
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                          )}
                        </button>
                        <button
                          disabled={deletingId === b._id || b.status === "BLOCKED"}
                          onClick={() => openBlockModal(b._id)}
                          className={`w-7 h-7 flex items-center justify-center rounded border transition-colors ${
                            b.status === "BLOCKED"
                              ? "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed"
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
          <div className="flex items-center justify-between px-6 py-3 border-t border-stone-100">
            <p className="text-[10px] text-stone-400">
              Page {page} of {totalPages} (Total {total} Brands)
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

      {/* Brand Details Modal Overlay */}
      {detailBrand && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl p-6 w-full max-w-md flex flex-col gap-4 relative">
            <button
              onClick={() => setDetailBrand(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
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
                  className="w-12 h-12 rounded-xl object-cover border border-stone-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-stone-800 text-sm">{detailBrand.brandName}</h3>
                <p className="text-[10px] font-semibold text-[#3d4f38] bg-stone-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
                  {detailBrand.brandCategory}
                </p>
              </div>
            </div>

            <div className="text-xs text-stone-500 flex flex-col gap-2">
              <p className="leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-stone-600">
                {detailBrand.brandDescription || "No brand description provided."}
              </p>

              {/* Owner card */}
              <div className="p-3 border border-stone-100 rounded-xl flex flex-col gap-2 mt-2">
                <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Owner Contact Details</span>
                <p className="font-semibold text-stone-700 text-sm">
                  {detailBrand.firstName} {detailBrand.lastName}
                </p>
                <div className="flex flex-col gap-1.5 mt-1 text-[11px] text-stone-600">
                  <p className="flex items-center gap-1.5">
                    <span className="text-stone-400">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </span>
                    {detailBrand.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-stone-400">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    {detailBrand.email || "Email not available"}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-stone-400">
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
                <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block mb-1.5">Participating In</span>
                {detailBrand.bazaars && detailBrand.bazaars.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {detailBrand.bazaars.map((baz, index) => (
                      <span
                        key={index}
                        className="bg-stone-100 text-stone-700 text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {baz.name || baz.bazaarName || "Bazaar event"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-stone-400 italic">Not registered in any active bazaar.</p>
                )}
              </div>

              {/* Quick Status Control inside Modal */}
              <div className="flex justify-between items-center border-t border-stone-100 pt-4 mt-3">
                <div className="flex flex-col">
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Moderate Access</span>
                  <span className="text-[10px] text-stone-500 font-medium">
                    Status: {detailBrand.isActive ? "Approved" : "Suspended"}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleActive(detailBrand)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    detailBrand.isActive
                      ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                      : "bg-green-50 border-green-100 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {togglingId ? "Toggling..." : detailBrand.isActive ? "Suspend Access" : "Approve access"}
                </button>
              </div>
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">Block Brand</h3>
                <p className="text-[10px] text-stone-400">This brand will be blocked from the platform.</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Block Reason</label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter the reason for blocking this brand..."
                rows={3}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700 resize-none placeholder-stone-400"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBlockModal({ open: false, brandId: null })}
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
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                )}
                Block Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
