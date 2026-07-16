
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Loader2, CheckCircle, AlertCircle, User, Phone, Mail, Store,
  MapPin, Tag, ImagePlus, X, Trash2, ShoppingBag, Package, Wallet,
  TrendingUp, Clock, Truck, CheckCheck, PackageCheck,
} from "lucide-react";
import DashboardHeader from "../../../../components/Dashboard/BazarownerDashboard/DashboardHeader";
import { getOneBrand, editBrand, deleteBrand } from "../../../../services/Bazaarbrandservice";
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

const EGP = (n) =>
  new Intl.NumberFormat("en-EG", { maximumFractionDigits: 2 }).format(n ?? 0);

const STATUS_META = {
  PENDING:   { label: "Pending",   icon: Clock,        color: "text-amber-500",   bg: "bg-amber-50" },
  PREPARING: { label: "Preparing", icon: Package,       color: "text-indigo-500",  bg: "bg-indigo-50" },
  SHIPPED:   { label: "Shipped",   icon: Truck,         color: "text-sky-500",    bg: "bg-sky-50" },
  DELIVERED: { label: "Delivered", icon: PackageCheck,  color: "text-emerald-500",bg: "bg-emerald-50" },
};


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
    ONLINE:  { active: "bg-indigo-600 text-white border-indigo-600",   idle: "border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600" },
    OFFLINE: { active: "bg-emerald-600 text-white border-emerald-600", idle: "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600" },
    HYBRID:    { active: "bg-amber-500 text-white border-amber-500",      idle: "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-500" },
  };
  const label = { ONLINE: " Online", OFFLINE: " Offline", HYBRID: "HYBRID" };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        Brand Type {loading && <span className="text-gray-400 font-normal ml-1">(loading…)</span>}
      </label>
      <div className="flex gap-2 flex-wrap">
        {loading
          ? [1, 2, 3].map((n) => <div key={n} className="h-9 w-24 rounded-xl bg-gray-100 animate-pulse" />)
          : options.map((opt) => {
              const isActive = value === opt;
              const colors = palette[opt] ?? { active: "bg-gray-700 text-white border-gray-700", idle: "border-gray-200 text-gray-500" };
              return (
                <button key={opt} type="button" onClick={() => onChange(opt)}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${isActive ? colors.active : colors.idle}`}>
                  {label[opt] ?? opt}
                </button>
              );
            })}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function LogoUpload({ file, existingUrl, onFileChange, onClear, error }) {
  const inputRef = useRef(null);

  const preview = file ? URL.createObjectURL(file) : existingUrl || null;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        Brand Logo <span className="text-gray-400 font-normal">(optional)</span>
      </label>

      {preview ? (
        <div className="flex items-center gap-3">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
            <img src={preview} alt="Logo" className="w-full h-full object-cover" />
            <button type="button" onClick={onClear}
              className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors">
              <X size={11} className="text-gray-500" />
            </button>
          </div>
          <button type="button" onClick={() => inputRef.current?.click()}
            className="text-xs text-indigo-500 font-medium hover:underline">
            Change logo
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed transition-colors ${
            error ? "border-red-300 bg-red-50 hover:border-red-400"
                  : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30"
          }`}>
          <ImagePlus size={22} className={error ? "text-red-400" : "text-gray-400"} />
          <p className="text-xs text-gray-400">
            Click to upload logo{" "}
            <span className="text-indigo-500 font-medium">PNG, JPG, WEBP</span>
          </p>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp"
        className="hidden" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}


function DeleteModal({ brandName, loading, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 text-center mb-1">Delete Brand?</h3>
        <p className="text-xs text-gray-500 text-center mb-5 leading-relaxed">
          You're about to permanently delete{" "}
          <span className="font-semibold text-gray-700">{brandName}</span>.
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}


function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent.bg}`}>
        <Icon size={18} className={accent.text} />
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-[11px] font-medium text-gray-400 truncate">{label}</p>
        <p className="text-base font-bold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function StatsSection({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[64px] rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const {
    totalOrders = 0,
    totalProducts = 0,
    totalRevenue = 0,
    avgOrderValue = 0,
    ordersByStatus = {},
  } = stats;

  const statusEntries = Object.entries(ordersByStatus).filter(([, count]) => count > 0);

  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders}
          accent={{ bg: "bg-indigo-50", text: "text-indigo-500" }} />
        <StatCard icon={Package} label="Total Products" value={totalProducts}
          accent={{ bg: "bg-violet-50", text: "text-violet-500" }} />
        <StatCard icon={Wallet} label="Total Revenue" value={`${EGP(totalRevenue)} EGP`}
          accent={{ bg: "bg-emerald-50", text: "text-emerald-500" }} />
        <StatCard icon={TrendingUp} label="Avg Order Value" value={`${EGP(avgOrderValue)} EGP`}
          accent={{ bg: "bg-amber-50", text: "text-amber-500" }} />
      </div>

      {statusEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-[#2d1372] uppercase tracking-wider mb-3">
            Orders by Status
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statusEntries.map(([status, count]) => {
              const meta = STATUS_META[status] ?? {
                label: status, icon: CheckCheck, color: "text-gray-500", bg: "bg-gray-50",
              };
              const Icon = meta.icon;
              return (
                <div key={status} className={`flex items-center gap-2.5 rounded-xl p-3 ${meta.bg}`}>
                  <Icon size={16} className={meta.color} />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-gray-500">{meta.label}</span>
                    <span className={`text-sm font-bold ${meta.color}`}>{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


export default function UpdateBrandPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm]               = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);
  const [logoFile, setLogoFile]       = useState(null);
  const [stats, setStats]             = useState(null);
  const [errors, setErrors]           = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [success, setSuccess]         = useState(false);
  const [apiError, setApiError]       = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bazaarType, setBazaarType]           = useState(null);
  const [bazaarTypeLoading, setBazaarTypeLoading] = useState(true);


  useEffect(() => {
    if (!id) return;
    const loadAll = async () => {
      try {
        const [data, setting] = await Promise.all([
          getOneBrand(id),     // { brand, stats }
          getBazaarSetting(),
        ]);

        const brand = data?.brand ?? data;

        setForm({
          firstName:        brand.ownerName       ?? "",
          phone:            brand.ownerPhone      ?? brand.phone       ?? "",
          whatsapp:         brand.ownerWhatsapp    ?? brand.whatsapp    ?? "",
          email:            brand.ownerEmail       ?? brand.email       ?? "",
          brandType:        brand.brandType        ?? "",
          brandName:        brand.brandName        ?? "",
          brandCategory:    brand.brandCategory    ?? "",
          brandDescription: brand.brandDescription ?? "",
          location:         brand.location         ?? "",
        });
        setExistingLogo(brand.logoUrl ?? null);
        setStats(data?.stats ?? null);

        const type = setting?.type ?? "HYBRID";
        setBazaarType(type);
      } catch (err) {
        setApiError("Failed to load brand data.");
        setBazaarType("HYBRID");
      } finally {
        setPageLoading(false);
        setBazaarTypeLoading(false);
      }
    };
    loadAll();
  }, [id]);

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
    if (!form.phone.trim())      errs.phone      = "Phone is required";
    if (!form.email.trim())      errs.email      = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.brandType)         errs.brandType  = "Brand type is required";
    if (!form.brandName.trim())  errs.brandName  = "Brand name is required";
    if (!form.brandCategory)     errs.brandCategory = "Category is required";
    if (!form.location.trim())   errs.location   = "Location is required";
    return errs;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSaveLoading(true);
    setApiError(null);
    try {
      await editBrand(id, { ...form, ...(logoFile ? { logoUrl: logoFile } : {}) });
      setSuccess(true);
      setTimeout(() => router.push("/BazaarOwnerDashboard"), 2000);
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || "Something went wrong.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteBrand(id);
      router.push("/BazaarOwnerDashboard");
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || "Failed to delete brand.");
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };


  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <DashboardHeader />
        <main className="px-4 sm:px-6 py-6 w-[90%] m-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>

          <StatsSection loading stats={null} />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`flex flex-col gap-1.5 ${i >= 8 ? "sm:col-span-2" : ""}`}>
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          brandName={form?.brandName || "this brand"}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="min-h-screen bg-gray-50/50">
        <DashboardHeader />

        <main className="px-4 sm:px-6 py-6 w-[90%] m-auto">

          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ArrowLeft size={15} className="text-gray-500" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-800">Edit Brand</h1>
                <p className="text-xs text-[#2d1372]">{form?.brandName || "Update brand details"}</p>
              </div>
            </div>

            {/* Delete button */}
            <button onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors">
              <Trash2 size={13} />
              Delete Brand
            </button>
          </div>

          {/* Stats cards */}
          <StatsSection stats={stats} loading={false} />

          {success && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-5">
              <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Brand updated successfully!</p>
                <p className="text-xs text-emerald-600 mt-0.5">Redirecting back to Dashboard…</p>
              </div>
            </div>
          )}
          {apiError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-5">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Error</p>
                <p className="text-xs text-red-500 mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {form && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-6">

              <div>
                <p className="text-xs font-semibold text-[#2d1372] uppercase tracking-wider mb-3">Owner Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <InputField label="First Name" icon={User} name="firstName" placeholder="Nouran"
                      value={form.firstName} onChange={handleChange} error={errors.firstName} />
                  </div>
                  <InputField label="Phone" icon={Phone} name="phone" placeholder="01012345678"
                    value={form.phone} onChange={handleChange} error={errors.phone} />
                  <InputField label="WhatsApp (optional)" icon={Phone} name="whatsapp" placeholder="01012345678"
                    value={form.whatsapp} onChange={handleChange} error={errors.whatsapp} />
                  <div className="sm:col-span-2">
                    <InputField label="Email" icon={Mail} name="email" type="email" placeholder="nour@example.com"
                      value={form.email} onChange={handleChange} error={errors.email} disabled />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Brand Details */}
              <div>
                <p className="text-xs font-semibold text-[#2d1372] uppercase tracking-wider mb-3">Brand Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Logo */}
                  <div className="sm:col-span-2">
                    <LogoUpload
                      file={logoFile}
                      existingUrl={existingLogo}
                      onFileChange={setLogoFile}
                      onClear={() => { setLogoFile(null); setExistingLogo(null); }}
                      error={errors.logoUrl}
                    />
                  </div>

                  <InputField label="Brand Name" icon={Store} name="brandName" placeholder="N.A. Store"
                    value={form.brandName} onChange={handleChange} error={errors.brandName} />
                  <SelectField label="Brand Category" icon={Tag} name="brandCategory" options={BRAND_CATEGORIES}
                    value={form.brandCategory} onChange={handleChange} error={errors.brandCategory} />

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
                    <textarea name="brandDescription" rows={3}
                      placeholder="Stylish accessories and fashion items…"
                      value={form.brandDescription} onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 text-sm py-2.5 px-3 outline-none resize-none transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 hover:border-gray-300" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => router.back()} disabled={saveLoading}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saveLoading || success || bazaarTypeLoading}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {saveLoading
                    ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                    : success
                    ? <><CheckCircle size={15} /> Saved!</>
                    : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}