"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api";
function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function BrandSettings() {
  const logoRef = useRef(null);
  const [form, setForm] = useState({
    brandName: "",
    description: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    logo: null,
  });
  const [logoPrev, setLogoPrev] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState("");
  const [hasSuggested, setHasSuggested] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${BASE_URL}/brand`, {
          headers: getHeaders(),
        });
        const data = res.data?.data ?? res.data ?? {};
        setForm({
          brandName: data.brandName ?? data.name ?? "",
          description: data.description ?? "",
          phone: data.phone ?? "",
          whatsapp: data.whatsapp ?? data.phone ?? "",
          email: data.email ?? "",
          address: data.address ?? data.location ?? "",
          logo: null,
        });
        if (data.logo || data.logoUrl) setLogoPrev(data.logo ?? data.logoUrl);
      } catch {
        // start with empty form if profile fetch fails
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
    setError("");
  }

  function handleLogo(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, logo: file });
    setLogoPrev(URL.createObjectURL(file));
  }

  async function handleSuggestDescription() {
    setSuggesting(true);
    setSuggestError("");
    try {
      const url = hasSuggested
        ? `${BASE_URL}/brand/suggest-description?regenerate=true`
        : `${BASE_URL}/brand/suggest-description`;
      const res = await axios.post(url, {}, { headers: getHeaders() });
      const suggestion = res.data?.data?.suggestion ?? "";
      if (suggestion) {
        setForm((f) => ({ ...f, description: suggestion }));
        setHasSuggested(true);
        setSuccess(false);
      } else {
        setSuggestError("No suggestion returned. Try again.");
      }
    } catch (err) {
      setSuggestError(
        err?.response?.data?.message ?? "Failed to get suggestion. Try again.",
      );
    } finally {
      setSuggesting(false);
    }
  }

  async function handleSave() {
    if (!form.brandName.trim()) {
      setError("Brand name is required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const fd = new FormData();
      fd.append("brandName", form.brandName);
      fd.append("brandDescription", form.description);
      fd.append("phone", form.phone);
      fd.append("whatsapp", form.whatsapp);

      fd.append("location", form.address);
      if (form.logo) fd.append("logoUrl", form.logo);
      await axios.patch(`${BASE_URL}/brand`, fd, { headers: getHeaders() });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-300";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-xs text-gray-400 mt-1">
            Curate your brand&apos;s digital presence and core identity.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {saving ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() =>
              setForm({
                brandName: "",
                description: "",
                phone: "",
                whatsapp: "",
                email: "",
                address: "",
                logo: null,
              })
            }
            className="px-4 py-2 border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Discard
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Brand Identity */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 mb-4 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-800 mb-5">
          Brand Identity
        </h2>

        {/* Logo + Name row */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-5">
          {/* Logo */}
          <div
            onClick={() => logoRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#3d4f38] transition-colors shrink-0 group"
          >
            {logoPrev ? (
              <img
                src={logoPrev}
                alt="logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-stone-300 group-hover:text-[#3d4f38] transition-colors">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-[9px] font-medium">Upload Logo</span>
              </div>
            )}
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogo}
            />
          </div>

          {/* Name + Description */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className={labelClass}>Brand Name</label>
              <input
                name="brandName"
                value={form.brandName}
                onChange={handleChange}
                placeholder="Digital Atelier"
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-stone-500">
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleSuggestDescription}
                  disabled={suggesting}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-60"
                >
                  {suggesting ? (
                    <div className="w-3 h-3 border-2 border-[#3d4f38] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.36-6.36l-2.12 2.12M8.76 15.24l-2.12 2.12m12.72 0l-2.12-2.12M8.76 8.76L6.64 6.64" />
                    </svg>
                  )}
                  {suggesting
                    ? "Generating..."
                    : hasSuggested
                      ? "Regenerate with AI"
                      : "Suggest with AI"}
                </button>
              </div>
              {suggestError && (
                <p className="text-[11px] text-red-500 mb-1.5">
                  {suggestError}
                </p>
              )}
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="A high-end marketplace gallery showcasing curated artisan collections from around the globe."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 mb-4 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-800 mb-5">
          Contact Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Phone Number</label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                width="13"
                height="13"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 13.7a19.79 19.79 0 01-3.07-8.67A2 2 0 013.56 3h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 17z" />
              </svg>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 012-3456"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>WhatsApp Number</label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                width="13"
                height="13"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 13.7a19.79 19.79 0 01-3.07-8.67A2 2 0 013.56 3h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 17z" />
              </svg>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="+1 (555) 098-7654"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
        </div>
        <div>
          <label className={labelClass}>Official Email</label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              width="13"
              height="13"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="concierge@digitalatelier.com"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-sm font-semibold text-stone-800 mb-5">
          Location Details
        </h2>
        <div>
          <label className={labelClass}>Current Address</label>
          <div className="relative">
            <svg
              className="absolute left-3 top-3 text-stone-400"
              width="13"
              height="13"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              placeholder="742 Evergreen Terrace, Creative District, NY 10001"
              className={`${inputClass} pl-9 resize-none`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
