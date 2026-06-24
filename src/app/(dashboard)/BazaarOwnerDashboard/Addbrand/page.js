"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Loader2, CheckCircle, AlertCircle,
  User, Phone, Mail, Store, MapPin, Tag, ImagePlus, X,
} from "lucide-react";
import DashboardHeader from "../../../components/Dashboard/BazarownerDashboard/DashboardHeader";
import { addBrandDirect } from "../../../services/Bazaarbrandservice";
import { getBazaarSetting } from "@/app/services/bazaarSettingsService";


function getBrandTypeOptions(bazaarType) {
  if (bazaarType === "ONLINE")  return ["ONLINE"];
  if (bazaarType === "OFFLINE") return ["OFFLINE"];

  return ["ONLINE", "OFFLINE", "HYBRID"];
}

const BRAND_CATEGORIES = [
  "Accessories", "Clothing", "Shoes", "Bags", "Jewelry",
  "Beauty", "Home Decor", "Food & Beverages", "Kids",
  "Sports", "Electronics", "Art & Crafts", "Other",
];


function InputField({ label, icon: Icon, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={14} />
          </span>
        )}
        <input
          {...props}
          className={`w-full rounded-xl border text-sm py-2.5 pr-3 ${Icon ? "pl-9" : "pl-3"} outline-none transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 ${
            error
              ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function SelectField({ label, icon: Icon, options, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={14} />
          </span>
        )}
        <select
          {...props}
          className={`w-full rounded-xl border text-sm py-2.5 pr-3 ${Icon ? "pl-9" : "pl-3"} outline-none appearance-none transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white ${
            error ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}


function BrandTypeSelector({ options, value, onChange, loading, error }) {

  const palette = {
    ONLINE:  { active: "bg-indigo-600 text-white border-indigo-600",  idle: "border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600" },
    OFFLINE: { active: "bg-emerald-600 text-white border-emerald-600", idle: "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600" },
    HYBRID:    { active: "bg-amber-500 text-white border-amber-500",     idle: "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-500" },
  };

  const label = {
    ONLINE:  " Online",
    OFFLINE: " Offline",
    BOTH:    " Both",
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        Brand Type
        {loading && <span className="ml-1 text-gray-400 font-normal">(loading…)</span>}
      </label>

      <div className="flex gap-2 flex-wrap">
        {loading ? (
          // skeleton pills while fetching bazaar type
          [1, 2, 3].map((n) => (
            <div key={n} className="h-9 w-24 rounded-xl bg-gray-100 animate-pulse" />
          ))
        ) : (
          options.map((opt) => {
            const isActive = value === opt;
            const colors = palette[opt] ?? { active: "bg-gray-700 text-white border-gray-700", idle: "border-gray-200 text-gray-500" };
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${isActive ? colors.active : colors.idle}`}
              >
                {label[opt] ?? opt}
              </button>
            );
          })
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}


function LogoUpload({ file, onFileChange, onClear, error }) {
  const inputRef = useRef(null);
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        Brand Logo <span className="text-gray-400 font-normal">(optional)</span>
      </label>

      {preview ? (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
          <img src={preview} alt="Logo preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <X size={11} className="text-gray-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed transition-colors ${
            error
              ? "border-red-300 bg-red-50 hover:border-red-400"
              : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30"
          }`}
        >
          <ImagePlus size={22} className={error ? "text-red-400" : "text-gray-400"} />
          <p className="text-xs text-gray-400">
            Click to upload logo{" "}
            <span className="text-indigo-500 font-medium">PNG, JPG, WEBP</span>
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}


const INITIAL_FORM = {
  firstName: "", lastName: "", phone: "", whatsapp: "",
  email: "", brandType: "", brandName: "",
  brandCategory: "", brandDescription: "", location: "",
};

export default function AddBrandPage() {
  const router = useRouter();
  const [form, setForm]           = useState(INITIAL_FORM);
  const [logoFile, setLogoFile]   = useState(null);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [apiError, setApiError]   = useState(null);

  const [bazaarType, setBazaarType] = useState(null);   
  const [bazaarTypeLoading, setBazaarTypeLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const setting = await getBazaarSetting();
        const type = setting?.type ?? "HYBRID";
        setBazaarType(type);

        const opts = getBrandTypeOptions(type);
        if (opts.length === 1) {
          setForm((prev) => ({ ...prev, brandType: opts[0] }));
        }
      } catch (err) {
        console.error(err);
        setBazaarType("HYBRID"); 
      } finally {
        setBazaarTypeLoading(false);
      }
    };
    fetchSetting();
  }, []);

    const brandTypeOptions = getBrandTypeOptions(bazaarType ?? "HYBRID");
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleBrandTypeChange = (val) => {
    setForm((prev) => ({ ...prev, brandType: val }));
    if (errors.brandType) setErrors((prev) => ({ ...prev, brandType: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim())  errs.firstName  = "First name is required";
    if (!form.lastName.trim())   errs.lastName   = "Last name is required";
    if (!form.phone.trim())      errs.phone      = "Phone is required";
    if (!form.email.trim())      errs.email      = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.brandType)         errs.brandType  = "Brand type is required";
    if (!form.brandName.trim())  errs.brandName  = "Brand name is required";
    if (!form.brandCategory)     errs.brandCategory = "Category is required";
    if (!form.location.trim())   errs.location   = "Location is required";
    return errs;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError(null);
    try {
      await addBrandDirect({ ...form, logoUrl: logoFile });
      setSuccess(true);
      setTimeout(() => router.push("/BazaarOwnerDashboard"), 2000);
    } catch (err) {
      setApiError(
        err?.response?.data?.message || err?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardHeader />

      <main className="px-4 sm:px-6 py-6 w-[90%] m-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={15} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-gray-800">Add Brand Directly</h1>
            <p className="text-xs text-[#2d1372]">Add a brand without going through registration</p>
          </div>
        </div>

        {/* Banners */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-5">
            <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">Brand added successfully!</p>
              <p className="text-xs text-emerald-600 mt-0.5">Redirecting back to Bazaar Control…</p>
            </div>
          </div>
        )}
        {apiError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-5">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Failed to add brand</p>
              <p className="text-xs text-red-500 mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-6">

          {/* Owner Info */}
          <div>
            <p className="text-xs font-semibold text-[#2d1372] uppercase tracking-wider mb-3">Owner Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="First Name" icon={User} name="firstName" placeholder="Nouran"
                value={form.firstName} onChange={handleChange} error={errors.firstName} />
              <InputField label="Last Name" icon={User} name="lastName" placeholder="Ali"
                value={form.lastName} onChange={handleChange} error={errors.lastName} />
              <InputField label="Phone" icon={Phone} name="phone" placeholder="01012345678"
                value={form.phone} onChange={handleChange} error={errors.phone} />
              <InputField label="WhatsApp (optional)" icon={Phone} name="whatsapp" placeholder="01012345678"
                value={form.whatsapp} onChange={handleChange} error={errors.whatsapp} />
              <div className="sm:col-span-2">
                <InputField label="Email" icon={Mail} name="email" type="email" placeholder="nour@example.com"
                  value={form.email} onChange={handleChange} error={errors.email} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Brand Details */}
          <div>
            <p className="text-xs font-semibold text-[#2d1372] uppercase tracking-wider mb-3">Brand Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Logo — full row */}
              <div className="sm:col-span-2">
                <LogoUpload
                  file={logoFile}
                  onFileChange={setLogoFile}
                  onClear={() => setLogoFile(null)}
                  error={errors.logoUrl}
                />
              </div>

              <InputField label="Brand Name" icon={Store} name="brandName" placeholder="N.A. Store"
                value={form.brandName} onChange={handleChange} error={errors.brandName} />

              {/* Brand Category */}
              <SelectField label="Brand Category" icon={Tag} name="brandCategory" options={BRAND_CATEGORIES}
                value={form.brandCategory} onChange={handleChange} error={errors.brandCategory} />

              {/* Brand Type pills — full row */}
              <div className="sm:col-span-2">
                <BrandTypeSelector
                  options={brandTypeOptions}
                  value={form.brandType}
                  onChange={handleBrandTypeChange}
                  loading={bazaarTypeLoading}
                  error={errors.brandType}
                />
              </div>

              <div className="sm:col-span-2">
                <InputField label="Location" icon={MapPin} name="location" placeholder="PortSaid"
                  value={form.location} onChange={handleChange} error={errors.location} />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Brand Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="brandDescription"
                  placeholder="Stylish accessories and fashion items…"
                  value={form.brandDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 text-sm py-2.5 px-3 outline-none resize-none transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 hover:border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || success || bazaarTypeLoading}
              className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Adding Brand…</>
              ) : success ? (
                <><CheckCircle size={15} /> Added!</>
              ) : (
                "Add Brand"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}