"use client";

import { useState, useEffect, useRef } from "react";
import { getAdminSetting, updateAdminSetting } from "@/app/services/adminService";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Profile settings matching the actual backend schema
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    role: "",
    photoUrl: null,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await getAdminSetting();
        const profile = res || {};
        setForm({
          fullName: profile.fullName ?? "",
          phone: profile.phone ?? "",
          email: profile.email ?? "",
          role: profile.role ?? "ADMIN",
          photoUrl: profile.photoUrl ?? null,
        });
        if (profile.photoUrl) {
          setPhotoPreview(profile.photoUrl);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load admin profile settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setForm((prev) => ({ ...prev, photoUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      let payload;
      
      if (photoFile) {
        // Use FormData when uploading a photo
        payload = new FormData();
        payload.append("fullName", form.fullName);
        payload.append("phone", form.phone);
        payload.append("photo", photoFile);
      } else {
        payload = {
          fullName: form.fullName,
          phone: form.phone,
        };
      }
      
      const updatedProfile = await updateAdminSetting(payload);
      
      // Update photoUrl from response if available
      if (updatedProfile?.photoUrl) {
        setForm((prev) => ({ ...prev, photoUrl: updatedProfile.photoUrl }));
        setPhotoPreview(updatedProfile.photoUrl);
      }
      
      // Update local storage so other components (e.g. sidebar) reflect the new name instantly
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.fullName = form.fullName;
            parsed.phone = form.phone;
            if (updatedProfile?.photoUrl) parsed.photoUrl = updatedProfile.photoUrl;
            localStorage.setItem("user", JSON.stringify(parsed));
          } catch (err) {
            console.error("Localstorage update error:", err);
          }
        } else {
          localStorage.setItem("user", JSON.stringify({
            fullName: form.fullName,
            phone: form.phone,
            email: form.email,
            role: form.role
          }));
        }
        
        // Dispatch event to dynamically trigger sidebar refresh
        window.dispatchEvent(new Event("userUpdate"));
      }

      setPhotoFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#4f46e5", borderTopColor: "transparent" }}
        />
        <p className="text-xs text-gray-400">Loading profile settings...</p>
      </div>
    );
  }

  // Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800">Account Settings</h2>
        <p className="text-xs text-gray-400">
          Manage your administrator profile details and keep your contact information up to date.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs px-4 py-3 rounded-xl font-medium">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Profile updated successfully!
        </div>
      )}

      {/* Profile Card & Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        
        {/* Avatar & Photo Upload card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-indigo-600 border border-gray-100">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Profile Photo</h3>
              <p className="text-[10px] text-gray-400">Upload a profile picture to personalize your account.</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Avatar preview */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-full border-2 border-gray-100 overflow-hidden bg-[#f9fafb] flex items-center justify-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-600 text-xl font-bold">
                    {getInitials(form.fullName)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>

            {/* Upload actions */}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Photo
              </button>
              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-4 py-2 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Remove
                </button>
              )}
              <p className="text-[10px] text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Editable settings */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-indigo-600 border border-gray-100">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Personal Information</h3>
              <p className="text-[10px] text-gray-400">Update your public name and telephone contact.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Aya Ahmed"
                  className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-800"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 01012345678"
                  className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Read-only account credentials */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Account Security</h3>
              <p className="text-[10px] text-gray-400">Security metadata cannot be modified directly.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email (Read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-100 rounded-lg text-xs bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Role (Read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                User Role
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.role.replace("_", " ")}
                  disabled
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-100 rounded-lg text-xs bg-gray-50 text-gray-500 cursor-not-allowed uppercase tracking-wider font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            {saving ? (
              <div
                className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "#ffffff", borderTopColor: "transparent" }}
              />
            ) : (
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            )}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
