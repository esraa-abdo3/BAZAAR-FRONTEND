"use client";

import { useState, useRef } from "react";
import { FiPhone } from "react-icons/fi";

const STEPS = [
  { id: 1, label: "Owner Info" },
  { id: 2, label: "Bazzar Detalis" },
{ id: 3, label: "Bazaar Booking" },
  
];

export default function Bazaradd() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    whatsappNumber: "",
    bazaarName: "",
    type: "",
    bazaarDescription: "",
    logoUrl: null,
    logoFile: null,
    address: "",
    startDate: "",
    endDate: "",
    priceOffline: 0,
    priceOnline: 0,
    priceHybrid: 0,
    paymentMethod: "Credit Card",
    maxBrandCapacity: 100,
    isAcceptingBrands: true,
    confirmAccuracy: false,
  });
console.log(form)

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    }
    function validateStep(step) {
  let newErrors = {};

  if (step === 1) {
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";

    if (!form.confirmAccuracy) {
      newErrors.confirmAccuracy = "You must confirm accuracy";
    }
  }

  if (step === 2) {
    if (!form.bazaarName.trim()) newErrors.bazaarName = "Bazaar name required";
    if (!form.type) newErrors.type = "Select bazaar type";
    if (!form.bazaarDescription.trim())
      newErrors.bazaarDescription = "Description required";
  }

  if (step === 3) {
    if (!form.priceOffline) newErrors.priceOffline = "Required";
    if (!form.priceOnline) newErrors.priceOnline = "Required";
    if (!form.priceHybrid) newErrors.priceHybrid = "Required";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
}

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, logoFile: file, logoUrl: url }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // If there's a file, we could upload it first, but since API accepts logoUrl string:
      const payload = {
        email: form.email,
        fullName: form.fullName,
        phone: form.phone,
        bazaarName: form.bazaarName,
        type: form.type,
        bazaarDescription: form.bazaarDescription,
        logoUrl: form.logoFile ? form.logoUrl : form.logoUrl,
        address: form.address,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : "",
        endDate: form.endDate ? new Date(form.endDate).toISOString() : "",
        priceOffline: Number(form.priceOffline),
        priceOnline: Number(form.priceOnline),
        priceHybrid: Number(form.priceHybrid),
        paymentMethod: form.paymentMethod,
        maxBrandCapacity: Number(form.maxBrandCapacity),
        isAcceptingBrands: form.isAcceptingBrands,
      };

      const res = await fetch("http://localhost:3000/api/auth/register/bazaar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const completedSteps = step - 1;

  return (
    <div className="min-h-screen bg-[#F8F6F6] ">
      {/* Navbar */}
      {/* <nav className="bg-[#2c3020] text-white px-8 py-3 flex items-center justify-between text-xs">
        <div className="font-bold text-base tracking-widest text-[#c8b97a]">BAZAARNA</div>
        <div className="hidden md:flex gap-6 text-[11px] text-gray-300">
          {["Home", "Live Bazaars", "Upcoming Bazaars", "About Us", "Testimonials", "Contact"].map((item) => (
            <a key={item} href="#" className="hover:text-[#c8b97a] transition-colors">{item}</a>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="text-[11px] text-gray-300 hover:text-white">Login</button>
          <button className="bg-[#4a5a2a] text-white text-[11px] px-4 py-1.5 rounded hover:bg-[#5a6a3a] transition-colors">
            Sign Up
          </button>
        </div>
      </nav> */}

   
      <div className="max-w-6xl mx-auto px-4 py-10">
        {success ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-[#2c3020] mb-2">Bazaar Registered Successfully!</h2>
            <p className="text-gray-600">Your bazaar is now pending payment. Check your email for next steps.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
     
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-xl font-bold text-[#2c3020]">
                    {step === 1 && "Registration Step 1: Owner Info"}
                    {step === 2 && "Registration Step 2: Bazaar details"}
                    {step === 3 && "Registration Step 2: Bazaar Booking"}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fill in your personal details to begin the bazaar registration process.
                  </p>
                </div>
                <span className="text-[11px] text-gray-500 whitespace-nowrap">STEP {step} OF 4</span>
              </div>
      <div className="flex flex-wrap items-center gap-1 mb-6 mt-4 capitalize">
  {STEPS.map((s, i) => (
    <div key={s.id} className="flex items-center gap-0">
      
      <div
        className={`flex items-center gap-1.5 
        px-2 sm:px-3 md:px-5 
        py-1.5 sm:py-2 
        rounded text-[11px] sm:text-[13px] md:text-[14px] 
        font-medium border transition-all whitespace-nowrap ${
          step === s.id
            ? "bg-[#50604a] text-white border-[#2c3020]"
            : step > s.id
            ? "bg-[#9A5F4C] text-white border-[#9A5F4C]"
            : "bg-white text-gray-400 border-gray-200"
        }`}
      >
        <span
          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[14px] ${
            step === s.id
              ? " text-white"
              : step > s.id
              ? " text-white"
              : " text-gray-500"
          }`}
        >
          {step > s.id ? "✓" : s.id}
        </span>

        {s.label}
      </div>

      {i < STEPS.length - 1 && (
        <div className="hidden sm:block w-5 md:w-15 h-px bg-gray-300 mx-1" />
      )}
    </div>
  ))}
</div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* info  */}
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
                    <p className="text- text-[#5A5C5C] mb-5">
                      This information will be used to link your bazaar to your account and send you important notifications.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Eg. John Doe"
                          value={form.fullName}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                                              </div> 
                                              {errors.fullName && (
  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
)}
                     <div>
                          <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                            Phone Number <span className="text-red-400">*</span>
                          </label>
                          <div className="flex">
                            <span className="border border-r-0 border-gray-200 rounded-l px-2 py-2 text-xs text-gray-500 bg-gray-100">
                            <FiPhone size={16} />
                            </span>
                            <input
                              type="tel"
                              name="phone"
                              placeholder="+1 (800) 000-0000"
                              value={form.phone}
                              onChange={handleChange}
                              required
                              className="flex-1 border border-gray-200 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                            />
                        
                        </div>
            
                                              </div>
                                                                                            {errors.fullName && (
  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
)}

                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="@gmail.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                                              </div>
                                                                                                                                          {errors.fullName && (
  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
)}

                      <label className="flex items-start gap-2 text-xs text-[#5A5C5C] cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          name="confirmAccuracy"
                          checked={form.confirmAccuracy}
                          onChange={handleChange}
                          className="mt-0.5 accent-[#4a5a2a]"
                        />
                        I confirm that the information provided above is accurate and I agree to Bazaarna&apos;s registration guidelines.
                                              </label>
                                                                                                                                                   {errors.fullName && (
  <p className="text-red-500 text-xs mt-1">{errors.confirmAccuracy}</p>
)}

                                            
                    </div>

                    <div className="flex justify-end mt-6">
               
                      <button
                        type="button"
                        onClick={() => {
  if (validateStep(step)) {
    setStep((prev) => prev + 1);
  }
}}
                        className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230]  hover:scale-[.98] transition-all cursor-pointer"
                      >
                        Save &amp; Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Bazaar Details ── */}
                {step === 2 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-2">Bazaar Logo</label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a5a2a] transition-colors bg-gray-50"
                        >
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
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-2 mt-3">
                          Bazaar Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="bazaarName"
                          placeholder="Eg. Bloom's Bazaar"
                          value={form.bazaarName}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />

                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-2 mt-5">
                          Bazaar Types <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="type"
                          value={form.type}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        >
                          <option value="">Select a bazaar type</option>
                          <option value="OFFLINE">Offline</option>
                          <option value="ONLINE">Online</option>
                          <option value="HYBRID">Hybrid</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Bazaar Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          name="bazaarDescription"
                          placeholder="Tell us about your bazaar, entry requirements, and what makes your bazaar a unique experience."
                          value={form.bazaarDescription}
                          onChange={handleChange}
                          rows={3}
                          required
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50 resize-none"
                        />
                      </div>

                    
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          placeholder="125 al-Tahrir Tahrir Design District"
                          value={form.address}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50 mb-2"
                        />
                        <input
                          type="text"
                          placeholder="Google maps url"
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>

                    
                      <div className="md:col-span-2 rounded-lg overflow-hidden border border-gray-200 h-32 bg-[#e8e0d0] flex items-center justify-center">
                        <div className="text-xs text-gray-400 flex flex-col items-center gap-1">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Map Preview
                        </div>
                      </div>

                  
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Start Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          name="startDate"
                          value={form.startDate}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          End Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          name="endDate"
                          value={form.endDate}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">Max Brand Capacity</label>
                        <input
                          type="number"
                          name="maxBrandCapacity"
                          value={form.maxBrandCapacity}
                          onChange={handleChange}
                          min={1}
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>

                      <div className="flex items-center gap-2 self-end pb-2">
                        <input
                          type="checkbox"
                          name="isAcceptingBrands"
                          id="isAcceptingBrands"
                          checked={form.isAcceptingBrands}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, isAcceptingBrands: e.target.checked }))
                          }
                          className="accent-[#4a5a2a] w-4 h-4"
                        />
                        <label htmlFor="isAcceptingBrands" className="text-xs font-semibold text-gray-700">
                          Accepting Brands
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => {

    setStep((prev) => prev - 1);
  
}}
                        className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50  hover:scale-[.98] transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230]  hover:scale-[.98] transition-all cursor-pointer"
                      >
                        Save and Continue →
                      </button>
                    </div>

                    {/* Info box */}
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                      <span className="text-amber-500 text-sm">⚠</span>
                      <div>
                        <p className="text-xs font-semibold text-amber-800">Why this information matters</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Providing accurate bazaar details helps brands find your event and make informed decisions about participation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Bazaar Booking ── */}
                {step === 3 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-[8px] bg-[#9A5F4C] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM2 9v7a2 2 0 002 2h12a2 2 0 002-2V9H2zm4 2h8v2H6v-2z" />
                        </svg>
                      </div>
                      <h2 className="text-sm font-bold text-[#2c3020] uppercase tracking-wide">Bazaar Booking</h2>
                    </div>
                    <p className="text-xs text-[#5A5C5C] mb-5 px-4">
                      Set pricing and booking configuration for your bazaar.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Price for a brand (only offline) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          name="priceOffline"
                          value={form.priceOffline}
                          onChange={handleChange}
                          placeholder="$200"
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Price for a brand (only online) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          name="priceOnline"
                          value={form.priceOnline}
                          onChange={handleChange}
                          placeholder="$s."
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Price for a brand (hybrid) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          name="priceHybrid"
                          value={form.priceHybrid}
                          onChange={handleChange}
                          placeholder="$s."
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Payment Method <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-3 flex-wrap">
                          {["Credit Card"].map((method) => (
                            <label
                              key={method}
                              className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer text-xs font-medium transition-all ${
                                form.paymentMethod === method
                                  ? "border-[#4a5a2a] bg-[#f0f4e8] text-[#2c3020]"
                                  : "border-gray-200 text-gray-500 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={form.paymentMethod === method}
                                onChange={handleChange}
                                className="accent-[#4a5a2a]"
                                  />
                                  <div className="flex items-center justify-center">
                                      <span>  {method === "Credit Card" && "💳"}</span>
                                      <span>{" "}{method}/visa</span>
                                      </div>
                          
                            </label>
                          ))}
                        </div>
                      </div>

                      <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          name="confirmAccuracy"
                          checked={form.confirmAccuracy}
                          onChange={handleChange}
                          className="mt-0.5 accent-[#4a5a2a]"
                        />
                        I confirm that the information provided above is accurate and I agree to Bazaarna&apos;s registration guidelines and terms of service.
                      </label>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                       onClick={() => {

    setStep((prev) => prev - 1);
  
}}
                        className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230] transition-colors disabled:opacity-60"
                      >
                        {loading ? "Registering..." : "Save & Continue →"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

          <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-4">
                <h3 className="text-sm font-bold text-[#2c3020] mb-4">Registration Overview</h3>
                <div className="space-y-3">
                  {STEPS.map((s) => (
                    <div key={s.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center  text-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            step > s.id
                              ? "bg-[#9A5F4C] text-white"
                              : step === s.id
                              ? "bg-[#50604a] text-white"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          }`}
                        >
                          {step > s.id ? "✓" : s.id}
                        </div>
                        {s.id < STEPS.length && (
                          <div className={`w-px flex-1 mt-1 ${step > s.id ? "bg-[#c8b97a]" : "bg-gray-200"}`} style={{ minHeight: "24px" }} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-xs font-semibold ${step >= s.id ? "text-[#2c3020]" : "text-gray-400"}`}>
                          Step {s.id}: {s.id === 1 ? "Owner Info" : s.id === 2 ? "Bazaar Details" : "Bazaar Booking"}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {s.id === 1 && "Your personal details"}
                          {s.id === 2 && "Bazaar details"}
                          {s.id === 3 && " Bazaar Booking"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendation Box */}
                <div className="mt-4 p-3 bg-[#f5f0e8] rounded-lg border border-[#e8dcc8]">
                  <p className="text-[11px] font-semibold text-[#2c3020] mb-1">Recommendation?</p>
                  <p className="text-[11px] text-gray-600 mb-2">
                    For celebrating bazaars, add your bazaarna QR code to your booth to make check-in easier.
                  </p>
                  <a href="#" className="text-[11px] text-[#4a5a2a] font-semibold underline">Get Help Center</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#2c3020] text-white mt-16 px-8 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div>
            <div className="text-[#c8b97a] font-bold text-base tracking-widest mb-3">BAZAARNA</div>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              Connecting buyers, creators, and sellers through distinctive digital marketplace experiences.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-3 tracking-wider text-gray-300">EXPLORE</p>
            {["Privacy Policy", "Host a Bazaar", "Vendor Handbook", "Support"].map((item) => (
              <a key={item} href="#" className="block text-gray-400 hover:text-[#c8b97a] mb-1 text-[11px] transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <p className="font-semibold mb-3 tracking-wider text-gray-300">PARTNERSHIPS</p>
            {["Become a Vendor", "Host a Bazaar", "Affiliate Program"].map((item) => (
              <a key={item} href="#" className="block text-gray-400 hover:text-[#c8b97a] mb-1 text-[11px] transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <p className="font-semibold mb-3 tracking-wider text-gray-300">NEWSLETTER</p>
            <p className="text-gray-400 text-[11px] mb-3">Get updates on upcoming bazaars and new vendors from our platform.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-[#3c4230] border border-[#4c5240] rounded-l px-3 py-1.5 text-[11px] text-white placeholder-gray-500 focus:outline-none"
              />
              <button className="bg-[#4a5a2a] px-3 py-1.5 rounded-r text-[11px] hover:bg-[#5a6a3a] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-[#3c4230] mt-8 pt-4 flex justify-between items-center">
          <p className="text-[10px] text-gray-500">© 2024 The Digital Bazaar. All rights reserved.</p>
          <p className="text-[10px] text-gray-500">English (US) · EGP LE</p>
        </div>
      </footer>
    </div>
  );
}