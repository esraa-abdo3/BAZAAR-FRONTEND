
"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiPhone } from "react-icons/fi";
import Link from "next/link";

const BASE_URL = "https://bazary-backend.vercel.app";

const ALL_BRAND_TYPES = [
  { value: "OFFLINE", label: "Offline", icon: "📍", desc: "Physical presence only" },
  { value: "ONLINE",  label: "Online",  icon: "🌐", desc: "Digital / online only" },
  { value: "HYBRID",  label: "Hybrid",  icon: "⚡", desc: "Both online & offline" },
];

const STEPS = [
  { id: 1, label: "Owner Info" },
  { id: 2, label: "Brand Details" },
];

// Egyptian mobile number: 01 + 9 digits (11 digits total)
const PHONE_REGEX = /^01\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Small inline spinner used INSIDE buttons only — never covers page content.
function ButtonSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function BrandRegister() {
  const params   = useParams();
  const bazaarId = params?.id;

  // ── bazaar meta ──
  const [bazaar,        setBazaar]        = useState(null);
  const [bazaarLoading, setBazaarLoading] = useState(true);
  const [bazaarError,   setBazaarError]   = useState("");

  // ── form ──
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "",
    phone: "", whatsapp: "",
    brandName: "", brandCategory: "", brandDescription: "",
    location: "", brandType: "",
    logoUrl: null, logoFile: null,
    socialMediaLinks: [],
    confirmAccuracy: false,
  });

  const [socialLinkInput, setSocialLinkInput] = useState("");
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // ── fetch bazaar on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!bazaarId) return;
    async function fetchBazaar() {
      try {
        const res  = await fetch(`${BASE_URL}/api/events/upcoming`, { cache: "no-store" });
        const json = await res.json();
        const list = json?.data || json || [];
        const found = Array.isArray(list) ? list.find((b) => b._id === bazaarId) : null;
        if (found) {
          setBazaar(found);
          if (found.type && found.type !== "HYBRID") {
            setForm((prev) => ({ ...prev, brandType: found.type }));
          }
        } else {
          setBazaarError("Bazaar not found.");
        }
      } catch {
        setBazaarError("Could not load bazaar info.");
      } finally {
        setBazaarLoading(false);
      }
    }
    fetchBazaar();
  }, [bazaarId]);

  const allowedTypes = bazaar?.type
    ? bazaar.type === "HYBRID"
      ? ALL_BRAND_TYPES
      : ALL_BRAND_TYPES.filter((t) => t.value === bazaar.type)
    : ALL_BRAND_TYPES;

  // ── handlers ─────────────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, logoFile: file, logoUrl: URL.createObjectURL(file) }));
    if (errors.logo) setErrors((prev) => ({ ...prev, logo: "" }));
  }

  function addSocialLink() {
    const link = socialLinkInput.trim();
    if (!link) return;
    setForm((prev) => ({ ...prev, socialMediaLinks: [...prev.socialMediaLinks, link] }));
    setSocialLinkInput("");
  }

  function removeSocialLink(index) {
    setForm((prev) => ({
      ...prev,
      socialMediaLinks: prev.socialMediaLinks.filter((_, i) => i !== index),
    }));
  }

  function validateStep(s) {
    const newErrors = {};
    if (s === 1) {
      if (!form.firstName.trim())    newErrors.firstName    = "First name is required";
      if (!form.lastName.trim())     newErrors.lastName     = "Last name is required";

      if (!form.email.trim())        newErrors.email        = "Email is required";
      else if (!EMAIL_REGEX.test(form.email)) newErrors.email = "Invalid email address";

      if (!form.phone.trim())        newErrors.phone        = "Phone is required";
      else if (!PHONE_REGEX.test(form.phone))
        newErrors.phone = "Phone must start with 01 and be 11 digits (e.g. 01222519040)";

      // WhatsApp stays optional, but must be valid if provided
      if (form.whatsapp.trim() && !PHONE_REGEX.test(form.whatsapp))
        newErrors.whatsapp = "WhatsApp number must start with 01 and be 11 digits (e.g. 01222519040)";

      if (!form.confirmAccuracy)     newErrors.confirmAccuracy = "You must confirm accuracy";
    }
    if (s === 2) {
      if (!form.logoFile)            newErrors.logo         = "Brand logo is required";
      if (!form.brandName.trim())    newErrors.brandName    = "Brand name is required";
      if (!form.brandType)           newErrors.brandType    = "Select a brand type";
      if (!form.brandCategory.trim()) newErrors.brandCategory = "Brand category is required";
      if (!form.location.trim())     newErrors.location     = "Location is required";

      if (!form.brandDescription.trim()) newErrors.brandDescription = "Brand description is required";
      else if (form.brandDescription.length < 10 || form.brandDescription.length > 600)
        newErrors.brandDescription = "Description must be 10–600 characters";
      // socialMediaLinks stays optional
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(2)) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("email",            form.email);
      fd.append("firstName",        form.firstName);
      fd.append("lastName",         form.lastName);
      fd.append("phone",            form.phone);
      fd.append("whatsapp",         form.whatsapp);
      fd.append("brandName",        form.brandName);
      fd.append("brandCategory",    form.brandCategory);
      fd.append("brandDescription", form.brandDescription);
      fd.append("location",         form.location);
      fd.append("brandType",        form.brandType);
      fd.append("socialMediaLinks", JSON.stringify(form.socialMediaLinks));
      if (form.logoFile) fd.append("logoUrl", form.logoFile);

      const res  = await fetch(`${BASE_URL}/api/auth/bazaars/${bazaarId}/brands/register`, {
        method: "POST", body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Registration failed");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function FieldError({ name }) {
    return errors[name] ? <p className="text-red-500 text-xs mt-1">{errors[name]}</p> : null;
  }

  // ── loading state (initial bazaar fetch — page-level, left as-is) ─────────
  if (bazaarLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-[#e8dcc8]" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#9A5F4C]"
              style={{ animation: "spin 0.9s linear infinite" }} />
          </div>
          <p className="text-sm text-gray-400">Loading bazaar info…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ── bazaar not found ──────────────────────────────────────────────────────
  if (bazaarError && !bazaar) {
    return (
      <div className="min-h-screen bg-[#F8F6F6] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[#2c3020] mb-2">Bazaar Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">{bazaarError}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2c3020] text-white rounded-lg text-sm hover:bg-[#3c4230] transition-all">
            Back to Home →
          </Link>
        </div>
      </div>
    );
  }

  // ─── SUCCESS ──────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F6F6] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#f0f4e8] flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-[#50604a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1.5 bg-[#faeeda] text-[#854F0B] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Approval
          </span>

          <h2 className="text-xl font-medium text-[#2c3020] mb-2">Application submitted!</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Your brand has been added to the waiting list. The bazaar owner will review your application and you'll be notified once it's approved.
          </p>

          <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6 flex items-start gap-3 text-left">
            <svg className="w-5 h-5 text-[#50604a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-500 leading-relaxed">
              A confirmation email has been sent to{" "}
              <span className="font-semibold text-[#2c3020]">{form.email}</span>.
              Check your spam folder if you don't see it within a few minutes.
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#2c3020] text-white rounded-lg text-sm font-medium hover:bg-[#3c4230] hover:scale-[.98] transition-all"
          >
            Back to Home →
          </Link>
        </div>
      </div>
    );
  }

  // ─── FORM ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F6F6]">
      <div className="max-w-6xl mx-auto px-4 py-10 mt-15">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main ─────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-xl font-bold text-[#2c3020]">
                  {step === 1 ? "Registration Step 1: Owner Info" : "Registration Step 2: Brand Details"}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fill in the details below to register your brand
                  {bazaar?.name ? ` in ${bazaar.name}` : " in this bazaar"}.
                </p>
              </div>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">STEP {step} OF {STEPS.length}</span>
            </div>

            {/* Step tabs */}
            <div className="flex flex-wrap items-center gap-1 mb-6 mt-4">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className={`flex items-center gap-1.5 px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 rounded text-[11px] sm:text-[13px] font-medium border transition-all whitespace-nowrap ${
                    step === s.id  ? "bg-[#50604a] text-white border-[#2c3020]"
                    : step > s.id ? "bg-[#9A5F4C] text-white border-[#9A5F4C]"
                    :               "bg-white text-gray-400 border-gray-200"
                  }`}>
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[14px]">
                      {step > s.id ? "✓" : s.id}
                    </span>
                    {s.label}
                  </div>
                  {i < STEPS.length - 1 && <div className="hidden sm:block w-5 md:w-10 h-px bg-gray-300 mx-1" />}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{error}</div>
            )}

            {/* ── STEP 1 ─────────────────────────────────────────────────── */}
            {step === 1 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-[8px] bg-[#9A5F4C] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-[#2c3020] uppercase tracking-wide">Personal Details</h2>
                </div>
                <p className="text-sm text-[#5A5C5C] mb-5">
                  This information links your brand to your account and lets us send important notifications.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">First Name <span className="text-red-400">*</span></label>
                    <input type="text" name="firstName" placeholder="Eg. John" value={form.firstName} onChange={handleChange}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50" />
                    <FieldError name="firstName" />
                  </div>

                  {/* Last name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">Last Name <span className="text-red-400">*</span></label>
                    <input type="text" name="lastName" placeholder="Eg. Doe" value={form.lastName} onChange={handleChange}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50" />
                    <FieldError name="lastName" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">Phone Number <span className="text-red-400">*</span></label>
                    <div className="flex">
                      <span className="border border-r-0 border-gray-200 rounded-l px-2 py-2 text-xs text-gray-500 bg-gray-100"><FiPhone size={16} /></span>
                      <input type="tel" name="phone" placeholder="01222519040" maxLength={11} value={form.phone} onChange={handleChange}
                        className="flex-1 border border-gray-200 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50" />
                    </div>
                    <FieldError name="phone" />
                  </div>

                  {/* WhatsApp (optional, validated if filled) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                      WhatsApp Number <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex">
                      <span className="border border-r-0 border-gray-200 rounded-l px-2 py-2 text-xs text-gray-500 bg-gray-100">💬</span>
                      <input type="tel" name="whatsapp" placeholder="01222519040" maxLength={11} value={form.whatsapp} onChange={handleChange}
                        className="flex-1 border border-gray-200 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50" />
                    </div>
                    <FieldError name="whatsapp" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">Email Address <span className="text-red-400">*</span></label>
                    <input type="email" name="email" placeholder="example@email.com" value={form.email} onChange={handleChange}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50" />
                    <FieldError name="email" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-start gap-2 text-xs text-[#5A5C5C] cursor-pointer">
                      <input type="checkbox" name="confirmAccuracy" checked={form.confirmAccuracy} onChange={handleChange}
                        className="mt-0.5 accent-[#4a5a2a]" />
                      I confirm that the information above is accurate and I agree to Bazaarna&apos;s registration guidelines.
                    </label>
                    <FieldError name="confirmAccuracy" />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button type="button" onClick={() => { if (validateStep(1)) setStep(2); }}
                    className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230] hover:scale-[.98] transition-all cursor-pointer">
                    Save &amp; Continue →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2 ─────────────────────────────────────────────────── */}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-[8px] bg-[#9A5F4C] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-sm font-bold text-[#2c3020] uppercase tracking-wide">Brand Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

                    {/* Logo */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-2">
                        Brand Logo <span className="text-red-400">*</span>
                      </label>
                      <div onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a5a2a] transition-colors bg-gray-50">
                        {form.logoUrl ? (
                          <img src={form.logoUrl} alt="Logo preview" className="h-24 object-contain rounded" />
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-xs text-gray-500">Upload your logo</span>
                          </>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <FieldError name="logo" />
                    </div>

                    {/* Name + Type */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-2">Brand Name <span className="text-red-400">*</span></label>
                      <input type="text" name="brandName" placeholder="Eg. Lumiere Beauty" value={form.brandName} onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50" />
                      <FieldError name="brandName" />

                      {/* ── Brand Type ── */}
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-2 mt-4">
                        Brand Type <span className="text-red-400">*</span>
                      </label>

                      {allowedTypes.length === 1 ? (
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f4e8] border border-[#c6d4b0] rounded text-sm text-[#2c3020]">
                          <span>{allowedTypes[0].icon}</span>
                          <span className="font-medium">{allowedTypes[0].label}</span>
                          <span className="text-xs text-[#5A5C5C] ml-1">— {allowedTypes[0].desc}</span>
                          <span className="ml-auto text-[10px] bg-[#50604a] text-white px-2 py-0.5 rounded-full">Fixed by bazaar</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {allowedTypes.map((t) => (
                            <label key={t.value}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded border cursor-pointer transition-all ${
                                form.brandType === t.value
                                  ? "border-[#50604a] bg-[#f0f4e8]"
                                  : "border-gray-200 bg-gray-50 hover:border-[#9A5F4C]/40"
                              }`}>
                              <input type="radio" name="brandType" value={t.value}
                                checked={form.brandType === t.value}
                                onChange={handleChange}
                                className="accent-[#50604a]" />
                              <div>
                                <p className="text-xs font-semibold text-[#2c3020]">{t.label}</p>
                                <p className="text-[11px] text-gray-400">{t.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                      <FieldError name="brandType" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Brand Category <span className="text-red-400">*</span>
                      </label>
                      <input type="text" name="brandCategory" placeholder="Eg. ملابس، عطور" value={form.brandCategory} onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50" />
                      <FieldError name="brandCategory" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Location <span className="text-red-400">*</span>
                      </label>
                      <input type="text" name="location" placeholder="Eg. Cairo, Egypt" value={form.location} onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50" />
                      <FieldError name="location" />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Brand Description <span className="text-red-400">*</span>
                      </label>
                      <textarea name="brandDescription" placeholder="Tell us about your brand (10–600 characters)."
                        value={form.brandDescription} onChange={handleChange} rows={3}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50 resize-none" />
                      <FieldError name="brandDescription" />
                    </div>

                    {/* Social Media Links (optional) */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Social Media Links <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://instagram.com/yourbrand"
                          value={socialLinkInput}
                          onChange={(e) => setSocialLinkInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSocialLink();
                            }
                          }}
                          className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                        <button type="button" onClick={addSocialLink}
                          className="px-4 py-2 bg-[#50604a] text-white rounded text-sm hover:bg-[#3c4230] transition-colors">
                          Add
                        </button>
                      </div>

                      {form.socialMediaLinks.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {form.socialMediaLinks.map((link, index) => (
                            <li key={index}
                              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs text-[#2c3020]">
                              <span className="truncate">{link}</span>
                              <button type="button" onClick={() => removeSocialLink(index)}
                                className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
                                ✕
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => setStep(1)} disabled={loading}
                      className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 hover:scale-[.98] transition-all cursor-pointer disabled:opacity-60">
                      Back
                    </button>
                    <button type="submit" disabled={loading}
                      className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230] hover:scale-[.98] transition-all cursor-pointer disabled:opacity-60">
                      {loading ? (<><ButtonSpinner />Submitting...</>) : "Submit Application →"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-4">
              <h3 className="text-sm font-bold text-[#2c3020] mb-4">Registration Overview</h3>

              <div className="space-y-3">
                {STEPS.map((s) => (
                  <div key={s.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        step > s.id  ? "bg-[#9A5F4C] text-white"
                        : step === s.id ? "bg-[#50604a] text-white"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}>
                        {step > s.id ? "✓" : s.id}
                      </div>
                      {s.id < STEPS.length && (
                        <div className={`w-px flex-1 mt-1 ${step > s.id ? "bg-[#c8b97a]" : "bg-gray-200"}`} style={{ minHeight: "24px" }} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`text-xs font-semibold ${step >= s.id ? "text-[#2c3020]" : "text-gray-400"}`}>Step {s.id}: {s.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {s.id === 1 ? "Your personal details" : "Brand info & category"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {bazaar?.type && (
                <div className="mt-4 p-3 bg-[#f0f4e8] rounded-lg border border-[#c6d4b0]">
                  <p className="text-[11px] font-semibold text-[#2c3020] mb-1">This bazaar accepts</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allowedTypes.map((t) => (
                      <span key={t.value} className="inline-flex items-center gap-1 text-[11px] font-medium bg-white border border-[#c6d4b0] px-2 py-0.5 rounded-full text-[#2c3020]">
                     {t.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 p-3 bg-[#f5f0e8] rounded-lg border border-[#e8dcc8]">
                <p className="text-[11px] font-semibold text-[#2c3020] mb-1">What happens next?</p>
                <p className="text-[11px] text-gray-600">
                  After submitting, your application goes to the bazaar owner for review. You'll receive an email once approved.
                </p>
              </div>

              <div className="mt-3 p-3 bg-[#f5f0e8] rounded-lg border border-[#e8dcc8]">
                <p className="text-[11px] font-semibold text-[#2c3020] mb-1">Need help?</p>
                <p className="text-[11px] text-gray-600 mb-2">For any issues during registration, reach our support team.</p>
                <a href="#" className="text-[11px] text-[#4a5a2a] font-semibold underline">Visit Help Center</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}