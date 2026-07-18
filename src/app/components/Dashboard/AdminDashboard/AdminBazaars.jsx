"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAdminBazaars, getAdminOneBazaar, updateAdminBazaar, createAdminBazaar } from "@/app/services/adminService";

const STATUSES = ["LIVE", "UPCOMING", "PENDING_PAYMENT", "ENDED"];

const PACKAGES = ["STARTER", "BUSINESS", "PREMIUM"];
const EGYPT_PHONE_REGEX = /^01[0125][0-9]{8}$/;

const EMPTY_ADD_FORM = {
  email: "",
  fullName: "",
  phone: "",
  whatsapp: "",
  bazaarName: "",
  bazaarDescription: "",
  address: "",
  googleMapsLink: "",
  startDate: "",
  endDate: "",
  packageId: "",
  paymentMethod: "card",
};

export default function AdminBazaars() {
  const [bazaars, setBazaars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBazaar, setEditingBazaar] = useState(null);
  const [detailBazaar, setDetailBazaar] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Add Bazaar modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_ADD_FORM);
  const [addFormError, setAddFormError] = useState(null);
  const [adding, setAdding] = useState(false);

  // صور اللوجو والباك جراوند في مودال التعديل
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoInputRef = useRef(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const backgroundInputRef = useRef(null);

  const fetchBazaarsList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminBazaars({
        page,
        limit: 10,
        status: statusFilter || undefined,
      });
      setBazaars(res.bazaars || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError("Failed to fetch bazaars list.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchBazaarsList();
  }, [fetchBazaarsList]);

  // Search filter at client side for real-time responsiveness
  const filteredBazaars = bazaars.filter((b) =>
    b.bazaarName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = async (bazaarId) => {
    try {
      setError(null);
      const details = await getAdminOneBazaar(bazaarId);
      setEditingBazaar(details);
      setLogoPreview(details.logoUrl ?? null);
      setLogoFile(null);
      setBackgroundPreview(details.backgroundImage ?? null);
      setBackgroundFile(null);
    } catch {
      setError("Failed to load bazaar details for editing.");
    }
  };

  const handleCloseEdit = () => {
    setEditingBazaar(null);
    setLogoFile(null);
    setLogoPreview(null);
    setBackgroundFile(null);
    setBackgroundPreview(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackgroundFile(file);
    setBackgroundPreview(URL.createObjectURL(file));
  };

  const handleDetailClick = async (bazaarId) => {
    try {
      setError(null);
      const details = await getAdminOneBazaar(bazaarId);
      setDetailBazaar(details);
    } catch {
      setError("Failed to load bazaar details.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingBazaar) return;
    try {
      setUpdating(true);
      setError(null);

      let payload;
      if (logoFile || backgroundFile) {
        payload = new FormData();
        payload.append("bazaarName", editingBazaar.bazaarName);
        payload.append("bazaarDescription", editingBazaar.bazaarDescription ?? "");
        payload.append("status", editingBazaar.status);
        payload.append("isPaid", editingBazaar.isPaid);
        payload.append("priceOffline", Number(editingBazaar.priceOffline));
        payload.append("priceOnline", Number(editingBazaar.priceOnline));
        payload.append("priceHybrid", Number(editingBazaar.priceHybrid));
        payload.append("maxBrandCapacity", Number(editingBazaar.maxBrandCapacity));
        payload.append("isAcceptingBrands", editingBazaar.isAcceptingBrands);
        payload.append("address", editingBazaar.address ?? "");
        if (logoFile) payload.append("logoUrl", logoFile);
        if (backgroundFile) payload.append("backgroundImage", backgroundFile);
      } else {
        payload = {
          bazaarName: editingBazaar.bazaarName,
          bazaarDescription: editingBazaar.bazaarDescription,
          status: editingBazaar.status,
          isPaid: editingBazaar.isPaid,
          priceOffline: Number(editingBazaar.priceOffline),
          priceOnline: Number(editingBazaar.priceOnline),
          priceHybrid: Number(editingBazaar.priceHybrid),
          maxBrandCapacity: Number(editingBazaar.maxBrandCapacity),
          isAcceptingBrands: editingBazaar.isAcceptingBrands,
          address: editingBazaar.address,
        };
      }

      await updateAdminBazaar(editingBazaar._id, payload);
      setSuccess("Bazaar updated successfully!");
      handleCloseEdit();
      fetchBazaarsList();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to update bazaar details.");
    } finally {
      setUpdating(false);
    }
  };

  const openAddModal = () => {
    setAddForm(EMPTY_ADD_FORM);
    setAddFormError(null);
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setAddForm(EMPTY_ADD_FORM);
    setAddFormError(null);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateAddForm = () => {
    const f = addForm;
    if (!f.fullName.trim()) return "Owner full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return "Please enter a valid email address.";
    if (!EGYPT_PHONE_REGEX.test(f.phone.trim())) return "Please enter a valid 11-digit Egyptian phone number.";
    if (!EGYPT_PHONE_REGEX.test(f.whatsapp.trim())) return "Please enter a valid 11-digit Egyptian WhatsApp number.";
    if (!f.bazaarName.trim()) return "Bazaar name is required.";
    if (!f.bazaarDescription.trim()) return "Bazaar description is required.";
    if (!f.address.trim()) return "Address is required.";
  
    if (!f.startDate) return "Start date is required.";
    const today = new Date();
today.setHours(0, 0, 0, 0);

const startDate = new Date(f.startDate);
startDate.setHours(0, 0, 0, 0);

if (startDate < today) {
  return "Start date cannot be in the past.";
}
    if (!f.endDate) return "End date is required.";
    if (new Date(f.endDate) < new Date(f.startDate)) return "End date must be after the start date.";
    if (!f.packageId) return "Please select a package.";
    return null;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateAddForm();
    if (validationError) {
      setAddFormError(validationError);
      return;
    }
    try {
      setAdding(true);
      setAddFormError(null);
      setError(null);
      await createAdminBazaar({ ...addForm, paymentMethod: "card" });
      setSuccess(`Bazaar "${addForm.bazaarName}" created successfully!`);
      closeAddModal();
      setPage(1);
      fetchBazaarsList();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setAddFormError(err?.response?.data?.message || "Failed to create bazaar.");
    } finally {
      setAdding(false);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex flex-col gap-6">
      {/* Messages */}
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

      {/* Header, Search & Filter controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-stone-800">Bazaars Management</h2>
          <p className="text-xs text-stone-400">
            Monitor registration status, capacity, pricing packages, and locations.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search bazaar name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700 placeholder-stone-400"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none pl-8 pr-8 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-600 font-medium"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st.replace("_", " ")}
                </option>
              ))}
            </select>
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </span>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>

          {/* Add Bazaar button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2  bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Bazaar
          </button>
        </div>
      </div>

      {/* Bazaars List Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#3d4f38", borderTopColor: "transparent" }}
            />
            <p className="text-xs text-stone-400">Loading bazaars catalog...</p>
          </div>
        ) : filteredBazaars.length === 0 ? (
          <div className="text-center py-20">
            <span className="mx-auto text-stone-300 mb-3 block w-8 h-8">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-stone-700">No Bazaars Found</p>
            <p className="text-[10px] text-stone-400 mt-1">Try adapting your search or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] text-stone-400 font-semibold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3.5">Bazaar</th>
                  <th className="px-6 py-3.5">Organizer</th>
                  <th className="px-6 py-3.5">Schedule</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredBazaars.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50/40 transition-colors">
                    {/* Bazaar Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {b.logoUrl ? (
                          <img
                            src={b.logoUrl}
                            alt={b.bazaarName}
                            className="w-9 h-9 rounded-lg object-cover border border-stone-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                              <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-stone-800">{b.bazaarName}</p>
                          <span className="text-[10px] text-[#3d4f38] bg-stone-100 px-1.5 py-0.5 rounded font-medium">
                            Cap: {b.maxBrandCapacity}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Organizer details */}
                    <td className="px-6 py-4">
                      <p className="text-stone-700 font-medium">{b.fullName}</p>
                      <p className="text-[10px] text-stone-400">{b.phone}</p>
                    </td>

                    {/* Schedule */}
                    <td className="px-6 py-4">
                      <p className="text-stone-700 flex items-center gap-1.5 text-[11px]">
                        <span className="text-stone-400">
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </span>
                        {new Date(b.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(b.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          b.status === "LIVE"
                            ? "bg-green-100 border-green-200 text-green-700"
                            : b.status === "UPCOMING"
                            ? "bg-[#f5f5f0] border-stone-200 text-stone-700"
                            : b.status === "PENDING_PAYMENT"
                            ? "bg-orange-100 border-orange-200 text-orange-700"
                            : "bg-stone-100 border-stone-200 text-stone-500"
                        }`}
                      >
                        {b.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Payment status */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          b.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>

                    {/* Actions buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDetailClick(b._id)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-stone-50 border border-stone-200 text-stone-500 hover:bg-stone-100 transition-colors"
                          title="View Info"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditClick(b._id)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                          title="Edit Bazaar"
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-stone-100">
            <p className="text-[10px] text-stone-400">
              Page {page} of {totalPages} (Total {total} Bazaars)
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

      {/* Add Bazaar Modal overlay */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-stone-800 text-sm">Add New Bazaar</h3>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Create a bazaar and its owner account on behalf of an organizer.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="text-stone-400 hover:text-stone-600"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              {addFormError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg font-medium">
                  {addFormError}
                </div>
              )}

              {/* Owner details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Owner Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={addForm.fullName}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Owner Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={addForm.email}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    inputMode="numeric"
                    maxLength={11}
                    pattern="01[0125][0-9]{8}"
                    title="Enter a valid 11-digit Egyptian phone number (e.g. 01012345678)"
                    placeholder="01012345678"
                    value={addForm.phone}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">WhatsApp</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    inputMode="numeric"
                    maxLength={11}
                    pattern="01[0125][0-9]{8}"
                    title="Enter a valid 11-digit Egyptian WhatsApp number (e.g. 01012345678)"
                    placeholder="01012345678"
                    value={addForm.whatsapp}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                  />
                </div>
              </div>

              {/* Bazaar details */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Bazaar Name</label>
                <input
                  type="text"
                  name="bazaarName"
                  required
                  value={addForm.bazaarName}
                  onChange={handleAddFormChange}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Description</label>
                <textarea
                  name="bazaarDescription"
                  rows={2}
                  required
                  value={addForm.bazaarDescription}
                  onChange={handleAddFormChange}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={addForm.address}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Google Maps Link</label>
                  <input
                    type="url"
                    name="googleMapsLink"
                 
                    placeholder="https://maps.google.com/..."
                    value={addForm.googleMapsLink}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    value={addForm.startDate}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    value={addForm.endDate}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Package</label>
                  <select
                    name="packageId"
                    required
                    value={addForm.packageId}
                    onChange={handleAddFormChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700"
                  >
                    <option value="">Select package</option>
                    {PACKAGES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Payment Method</label>
                  <div className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 rounded-lg text-xs bg-stone-50 text-stone-600 font-semibold">
                    💳 Card
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-2 border-t border-stone-100 pt-4">
                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={adding}
                  className="px-4 py-2 border border-stone-200 text-xs font-semibold rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50 cursor-pointer text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-4 py-2 bg-[#3d4f38] hover:bg-[#2d3f28] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {adding ? (
                    <>
                      <div
                        className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: "#ffffff", borderTopColor: "transparent" }}
                      />
                      Creating...
                    </>
                  ) : (
                    "Create Bazaar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bazaar Detail Modal overlay */}
      {detailBazaar && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl p-6 w-full max-w-md flex flex-col gap-4 relative">
            <button
              onClick={() => setDetailBazaar(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              {detailBazaar.logoUrl ? (
                <img
                  src={detailBazaar.logoUrl}
                  alt={detailBazaar.bazaarName}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center border border-stone-100 text-stone-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-stone-800 text-sm">{detailBazaar.bazaarName}</h3>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mt-0.5">{detailBazaar.type} Bazaar</p>
              </div>
            </div>

            <div className="text-xs text-stone-500 flex flex-col gap-2">
              <p className="leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-stone-600">
                {detailBazaar.bazaarDescription || "No description provided."}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 border border-stone-100 rounded-lg bg-stone-50/50">
                  <span className="text-[9px] text-stone-400 block font-semibold uppercase tracking-wider">Status</span>
                  <span className="font-bold text-stone-700">{detailBazaar.status}</span>
                </div>
                <div className="p-2 border border-stone-100 rounded-lg bg-stone-50/50">
                  <span className="text-[9px] text-stone-400 block font-semibold uppercase tracking-wider">Max Capacity</span>
                  <span className="font-bold text-stone-700">{detailBazaar.maxBrandCapacity} brands</span>
                </div>
                <div className="p-2 border border-stone-100 rounded-lg bg-stone-50/50">
                  <span className="text-[9px] text-stone-400 block font-semibold uppercase tracking-wider">Pricing (Offline)</span>
                  <span className="font-bold text-[#3d4f38]">{detailBazaar.priceOffline} EGP</span>
                </div>
                <div className="p-2 border border-stone-100 rounded-lg bg-stone-50/50">
                  <span className="text-[9px] text-stone-400 block font-semibold uppercase tracking-wider">Pricing (Online)</span>
                  <span className="font-bold text-[#3d4f38]">{detailBazaar.priceOnline} EGP</span>
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-1.5 text-[11px] text-stone-600 border-t border-stone-100 pt-2">
                <p className="flex items-center gap-1.5">
                  <span className="text-stone-400">
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  {detailBazaar.address || "Address unspecified"}
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="font-semibold text-stone-400">Organizer:</span>
                  {detailBazaar.fullName} ({detailBazaar.phone})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal Overlay */}
      {editingBazaar && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl p-6 w-full max-w-lg flex flex-col gap-4 relative my-8">
            <button
              onClick={handleCloseEdit}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h3 className="font-semibold text-stone-850 text-sm">Edit Bazaar settings</h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bazaar Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Bazaar Name</label>
                  <input
                    type="text"
                    required
                    value={editingBazaar.bazaarName}
                    onChange={(e) => setEditingBazaar({ ...editingBazaar, bazaarName: e.target.value })}
                    className="px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 text-stone-800 bg-white"
                  />
                </div>

                {/* Status selection */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Status</label>
                  <select
                    value={editingBazaar.status}
                    onChange={(e) => setEditingBazaar({ ...editingBazaar, status: e.target.value })}
                    className="px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-800"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={editingBazaar.bazaarDescription || ""}
                  onChange={(e) => setEditingBazaar({ ...editingBazaar, bazaarDescription: e.target.value })}
                  rows={2}
                  className="px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 text-stone-800 bg-white resize-none"
                />
              </div>

              {/* Logo & Background Images */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Logo</label>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="relative w-full aspect-square border border-dashed border-stone-200 rounded-lg overflow-hidden flex items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-stone-400">Upload logo</span>
                    )}
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Background</label>
                  <button
                    type="button"
                    onClick={() => backgroundInputRef.current?.click()}
                    className="relative w-full aspect-square border border-dashed border-stone-200 rounded-lg overflow-hidden flex items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    {backgroundPreview ? (
                      <img src={backgroundPreview} alt="Background preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-stone-400">Upload background</span>
                    )}
                  </button>
                  <input
                    ref={backgroundInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Price Offline</label>
                  <input
                    type="number"
                    value={editingBazaar.priceOffline}
                    onChange={(e) => setEditingBazaar({ ...editingBazaar, priceOffline: e.target.value })}
                    className="px-2 py-1.5 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400 text-stone-800 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Price Online</label>
                  <input
                    type="number"
                    value={editingBazaar.priceOnline}
                    onChange={(e) => setEditingBazaar({ ...editingBazaar, priceOnline: e.target.value })}
                    className="px-2 py-1.5 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400 text-stone-800 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Price Hybrid</label>
                  <input
                    type="number"
                    value={editingBazaar.priceHybrid}
                    onChange={(e) => setEditingBazaar({ ...editingBazaar, priceHybrid: e.target.value })}
                    className="px-2 py-1.5 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400 text-stone-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Max Brand Capacity */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Max Brand Capacity</label>
                  <input
                    type="number"
                    value={editingBazaar.maxBrandCapacity}
                    onChange={(e) => setEditingBazaar({ ...editingBazaar, maxBrandCapacity: e.target.value })}
                    className="px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 text-stone-800 bg-white"
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Address / Venue</label>
                  <input
                    type="text"
                    value={editingBazaar.address || ""}
                    onChange={(e) => setEditingBazaar({ ...editingBazaar, address: e.target.value })}
                    className="px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 text-stone-800 bg-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 mt-2 border-t border-stone-100 pt-3">
                <label className="flex items-center gap-2 text-xs text-stone-600 font-semibold select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBazaar.isPaid}
                    onChange={(e) => setEditingBazaar({ ...editingBazaar, isPaid: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3d4f38] border-stone-300 focus:ring-[#3d4f38]/30 cursor-pointer"
                  />
                  Bazaar Paid status
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-600 font-semibold select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBazaar.isAcceptingBrands}
                    onChange={(e) => setEditingBazaar({ ...editingBazaar, isAcceptingBrands: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3d4f38] border-stone-300 focus:ring-[#3d4f38]/30 cursor-pointer"
                  />
                  Open Registration
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-stone-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={updating}
                  className="px-4 py-2 border border-stone-200 text-xs font-semibold rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50 cursor-pointer text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-[#3d4f38] hover:bg-[#2d3f28] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {updating ? (
                    <>
                      <div
                        className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: "#ffffff", borderTopColor: "transparent" }}
                      />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

