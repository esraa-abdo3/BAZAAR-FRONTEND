
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Pencil,Mail,Phone,Loader2,AlertCircle,CheckCircle2,ImagePlus} from "lucide-react";
import DashboardHeader from "../../../components/Dashboard/BazarownerDashboard/DashboardHeader";
import {getBazaarSetting,updateBazaarSetting} from "../../../services/bazaarSettingsService";


function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;
}


function Field({ label, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

const MAX_DESC = 250;

export default function BazaarSettingsPage() {
 
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [bazaarName, setBazaarName] = useState("");
  const [bazaarDescription, setBazaarDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [priceOffline, setPriceOffline] = useState("");
  const [priceOnline, setPriceOnline] = useState("");
  const [priceHybrid, setPriceHybrid] = useState("");
  const [maxBrandCapacity, setMaxBrandCapacity] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const backgroundInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);


  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getBazaarSetting();
      setOriginal(data);
      setBazaarName(data.bazaarName ?? "");
      setBazaarDescription(data.bazaarDescription ?? "");
      setPhone(data.phone ?? "");
      setWhatsapp(data.whatsapp ?? "");
      setPriceOffline(data.priceOffline ?? "");
      setPriceOnline(data.priceOnline ?? "");
      setPriceHybrid(data.priceHybrid ?? "");

      setLogoPreview(data.logoUrl ?? null);
      setBackgroundPreview(data.backgroundImage ?? null);
    } catch {
      setFetchError("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

 
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


  const handleDiscard = () => {
    if (!original) return;
    setBazaarName(original.bazaarName ?? "");
    setBazaarDescription(original.bazaarDescription ?? "");
    setPhone(original.phone ?? "");
    setWhatsapp(original.whatsapp ?? "");
    setPriceOffline(original.priceOffline ?? "");
    setPriceOnline(original.priceOnline ?? "");
    setPriceHybrid(original.priceHybrid ?? "");
    setMaxBrandCapacity(original.maxBrandCapacity ?? "");
    setLogoPreview(original.logoUrl ?? null);
    setLogoFile(null);
    setBackgroundPreview(original.backgroundImage ?? null);
    setBackgroundFile(null);
    setSaveError(null);
    setSaveSuccess(false);
  };


  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      let body;
      if (logoFile || backgroundFile) {
        body = new FormData();
        body.append("bazaarName", bazaarName);
        body.append("bazaarDescription", bazaarDescription);
        body.append("phone", phone);
        body.append("priceOffline", priceOffline);
        body.append("priceOnline", priceOnline);
        body.append("priceHybrid", priceHybrid);
       
        if (logoFile) body.append("logoUrl", logoFile);
        if (backgroundFile) body.append("backgroundImage", backgroundFile);
      } else {
        body = {
          bazaarName,
          bazaarDescription,
          phone,

          priceOffline: Number(priceOffline),
          priceOnline: Number(priceOnline),
          priceHybrid: Number(priceHybrid),
         
        };
      }
      const updated = await updateBazaarSetting(body);
        setOriginal((prev) => ({ ...prev, ...updated }));
        setSaving(false)
      setLogoFile(null);
      setBackgroundFile(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
         console.log("STATUS", error?.response?.status);
  console.log("DATA", error?.response?.data);
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };


  const isDirty =
    original &&
    (bazaarName !== (original.bazaarName ?? "") ||
      bazaarDescription !== (original.bazaarDescription ?? "") ||
      phone !== (original.phone ?? "") ||
      whatsapp !== (original.whatsapp ?? "") ||
      String(priceOffline) !== String(original.priceOffline ?? "") ||
      String(priceOnline) !== String(original.priceOnline ?? "") ||
      String(priceHybrid) !== String(original.priceHybrid ?? "") ||
  
      !!logoFile ||
      !!backgroundFile);

  const inputCls =
    "w-full px-3 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition placeholder-gray-300 disabled:bg-gray-50 disabled:text-gray-400";


  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader greeting="good morning" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8  mx-auto w-[90%]">

    
        {fetchError && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}
        {saveError && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{saveError}</span>
            <button onClick={() => setSaveError(null)} className="ml-auto text-xs underline text-red-400">Dismiss</button>
          </div>
        )}
        {saveSuccess && (
          <div className="mb-5 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
            <CheckCircle2 size={15} className="flex-shrink-0" />
            <span>Changes saved successfully.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">

          <div className="flex flex-col gap-5">

        
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-4">
                Bazaar Visuals
              </p>
              <div className="flex flex-col items-center gap-3">

                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                  {loading ? (
                    <Skeleton className="w-full h-full rounded-2xl" />
                  ) : logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Bazaar Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <ImagePlus size={28} className="text-gray-300" />
                  )}
                </div>

                {!loading && (
                  <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                    Recommended size 512×512px.
                    <br />
                    PNG or SVG preferred.
                  </p>
                )}

             
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                {!loading && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#50604a] hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    <Pencil size={12} />
                    Change Logo
                  </button>
                )}
                {logoFile && (
                  <p className="text-[11px] text-emerald-600 truncate max-w-full px-2">
                    ✓ {logoFile.name}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-50 flex flex-col items-center gap-3">
                <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase self-start">
                  Background Image
                </p>

                <div className="w-full h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden relative">
                  {loading ? (
                    <Skeleton className="w-full h-full rounded-xl" />
                  ) : backgroundPreview ? (
                    <img
                      src={backgroundPreview}
                      alt="Bazaar Background"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={22} className="text-gray-300" />
                  )}
                </div>

                {!loading && (
                  <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                    Shown behind your bazaar's public page.
                    <br />
                    Landscape, 1600×600px recommended.
                  </p>
                )}

                <input
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleBackgroundChange}
                />
                {!loading && (
                  <button
                    onClick={() => backgroundInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#50604a] hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    <Pencil size={12} />
                    Change Background
                  </button>
                )}
                {backgroundFile && (
                  <p className="text-[11px] text-emerald-600 truncate max-w-full px-2">
                    ✓ {backgroundFile.name}
                  </p>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Mail size={14} className="text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">Contact Details</p>
              </div>

              <div className="flex flex-col gap-4">
                <Field label="Phone Number">
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div className="relative">
                      <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01012345678"
                        className={`${inputCls} pl-8`}
                      />
                    </div>
                  )}
                </Field>

                <Field label="WhatsApp Number">
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div className="relative">
                      <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="01012345678"
                        className={`${inputCls} pl-8`}
                      />
                    </div>
                  )}
                </Field>
              </div>

           
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-50">
                <button
                  onClick={handleDiscard}
                  disabled={!isDirty || saving}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-[#50604a] rounded-lg  active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </section>
          </div>

     
          <div className="flex flex-col gap-5">

         
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-800">Bazzar Identity</h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-5">
                How your brand appears to the global marketplace.
              </p>

              <div className="flex flex-col gap-5">
                <Field label="Bazaar Name">
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <input
                      type="text"
                      value={bazaarName}
                      onChange={(e) => setBazaarName(e.target.value)}
                      placeholder="e.g. Summer Vibes Festival"
                      className={inputCls}
                    />
                  )}
                </Field>

                <Field label="Bazaar Description">
                  {loading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : (
                    <>
                      <textarea
                        value={bazaarDescription}
                        onChange={(e) =>
                          setBazaarDescription(e.target.value.slice(0, MAX_DESC))
                        }
                        rows={4}
                        placeholder="Describe your mission and values"
                        className={`${inputCls} resize-none leading-relaxed`}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[11px] text-gray-400">
                          Describe your mission and values
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {bazaarDescription.length} / {MAX_DESC} characters
                        </span>
                      </div>
                    </>
                  )}
                </Field>
              </div>
            </section>

          
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-5">Bazaar Booking</h2>

              <div className="flex flex-col gap-4">
                <Field label="Price for a brand [only offline]">
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <input
                      type="number"
                      min={0}
                      value={priceOffline}
                      onChange={(e) => setPriceOffline(e.target.value)}
                      placeholder="e.g. 3000"
                      className={inputCls}
                    />
                  )}
                </Field>

                <Field label="Price for a brand [only online]">
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <input
                      type="number"
                      min={0}
                      value={priceOnline}
                      onChange={(e) => setPriceOnline(e.target.value)}
                      placeholder="e.g. 2000"
                      className={inputCls}
                    />
                  )}
                </Field>

                <Field label="Price for a brand [Hybrid]">
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <input
                      type="number"
                      min={0}
                      value={priceHybrid}
                      onChange={(e) => setPriceHybrid(e.target.value)}
                      placeholder="e.g. 6500"
                      className={inputCls}
                    />
                  )}
                </Field>

      
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
