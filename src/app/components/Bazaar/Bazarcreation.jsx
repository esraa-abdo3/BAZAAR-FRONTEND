
"use client";

import { useState, useRef } from "react";
import { FiPhone } from "react-icons/fi";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Link from "next/link";


const stripePromise = loadStripe("pk_test_51Tfg0qF3X8TkLn5begaNuyALoqNR9MBt85CJHMNdL1W48L5WgXjyBiIustCAtPzttXC6t5qJtHJg0qmcxe13OIxS00WqKYLYpQ");

const STEPS = [
  { id: 1, label: "Owner Info" },
  { id: 2, label: "Bazaar Details" },
  { id: 3, label: "Bazaar Booking" },
  { id: 4, label: "Payment" },
];


function PaymentSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative w-20 h-20">
      
        <div className="absolute inset-0 rounded-full border-4 border-[#e8dcc8]" />

        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#9A5F4C]"
          style={{ animation: "spin 0.9s linear infinite" }}
        />
      
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#50604a]"
          style={{ animation: "spin 1.4s linear infinite reverse" }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#9A5F4C]" style={{ animation: "pulse 1s ease-in-out infinite" }} />
        </div>
      </div>
      <p className="mt-5 text-sm font-semibold text-[#2c3020] tracking-wide">Processing Payment…</p>
      <p className="mt-1 text-xs text-gray-400">Please don't close this page</p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.7); } }
      `}</style>
    </div>
  );
}


function PaymentForm({ clientSecret, amount, onSuccess, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement } }
    );

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    } else if (paymentIntent.status === "succeeded") {
      onSuccess();
    }
  }

  return (
    <>
      {loading && <PaymentSpinner />}
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-[8px] bg-[#9A5F4C] flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM2 9v7a2 2 0 002 2h12a2 2 0 002-2V9H2zm4 2h8v2H6v-2z" />
          </svg>
        </div>
        <h2 className="text-sm font-bold text-[#2c3020] uppercase tracking-wide">Complete Payment</h2>
      </div>

      <p className="text-xs text-[#5A5C5C] mb-5">
        Amount due: <span className="font-bold text-[#2c3020]">{amount} EGP</span>
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handlePay} className="grid gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#5A5C5C] mb-2">Card Details</label>
          <div className="border border-gray-200 rounded px-3 py-3 bg-gray-50">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#2c3020",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#e53e3e" },
                },
              }}
            />
          </div>
        </div>

        <div className="flex justify-between mt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading || !stripe}
            className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230] transition-colors disabled:opacity-60"
          >
            {loading ? "Processing..." : `Pay ${amount} EGP →`}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}


export default function Bazaradd() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    whatsapp: "",
    bazaarName: "",
    type: "",
    bazaarDescription: "",
    logoUrl: null,
    logoFile: null,
    address: "",
    googleMapsLink: "",
    startDate: "",
    endDate: "",
    priceOffline: "",
    priceOnline: "",
    priceHybrid: "",
    paymentMethod: "card",
    maxBrandCapacity: 100,
    isAcceptingBrands: true,
    confirmAccuracy: false,
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);


  const [clientSecret, setClientSecret] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const fileInputRef = useRef(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
   
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, logoFile: file, logoUrl: url }));
  }

  function validateStep(s) {
    let newErrors = {};

    if (s === 1) {
      if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";
      if (!form.phone.trim()) newErrors.phone = "Phone is required";
      if (!form.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required";
      if (!form.confirmAccuracy) newErrors.confirmAccuracy = "You must confirm accuracy";
    }

    if (s === 2) {
      if (!form.bazaarName.trim()) newErrors.bazaarName = "Bazaar name is required";
      if (!form.type) newErrors.type = "Select a bazaar type";
      if (!form.bazaarDescription.trim()) newErrors.bazaarDescription = "Description is required";
      if (!form.startDate) newErrors.startDate = "Start date is required";
      if (!form.endDate) newErrors.endDate = "End date is required";
      if (form.startDate && form.endDate && form.endDate <= form.startDate)
        newErrors.endDate = "End date must be after start date";
    }

    if (s === 3) {
      if (!form.priceOffline && form.priceOffline !== 0) newErrors.priceOffline = "Required";
      if (!form.priceOnline && form.priceOnline !== 0) newErrors.priceOnline = "Required";
      if (!form.priceHybrid && form.priceHybrid !== 0) newErrors.priceHybrid = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    setError("");

    try {
    
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("fullName", form.fullName);
      formData.append("phone", form.phone);
      formData.append("whatsapp", form.whatsapp);
      formData.append("bazaarName", form.bazaarName);
      formData.append("type", form.type);
      formData.append("bazaarDescription", form.bazaarDescription);
      formData.append("address", form.address);
      formData.append("googleMapsLink", form.googleMapsLink);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("priceOffline", form.priceOffline);
      formData.append("priceOnline",form.priceOnline);
      formData.append("priceHybrid", form.priceHybrid);
      formData.append("paymentMethod", form.paymentMethod);
      formData.append("maxBrandCapacity", String(Number(form.maxBrandCapacity)));
      formData.append("isAcceptingBrands", String(form.isAcceptingBrands));

   
      if (form.logoFile) {
        formData.append("logoUrl", form.logoFile);
      }

      const res = await fetch("https://bazary-backend.vercel.app/api/auth/register/bazaar", {
        method: "POST",
        body: formData, 
      });

      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data?.message || "Registration failed");

     
      setClientSecret(data.data.clientSecret);
      setPaymentAmount(data.data.amount);
      setStep(4); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  function FieldError({ name }) {
    return errors[name] ? (
      <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
    ) : null;
  }

 
  return (
    <div className="min-h-screen bg-[#F8F6F6]">
      {loading && <PaymentSpinner />}
      <div className="max-w-6xl mx-auto px-4 py-10 mt-15">

       
   {success ? (
  <div className="flex items-center justify-center min-h-[420px] px-4">
    <div className="bg-white border border-gray-200 rounded-xl p-10 max-w-md w-full text-center">

      <div className="w-16 h-16 rounded-full bg-[#f0f4e8] flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#50604a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-xl font-medium text-[#2c3020] mb-2">Bazaar registered successfully</h2>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        We've sent your login password to your email. Check your inbox and use it to sign in to your new bazaar dashboard.
      </p>

      <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6 flex items-center gap-3 text-left">
        <svg className="w-5 h-5 text-[#50604a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed">
          Check your spam folder if you don't see the email within a few minutes.
        </p>
      </div>

      <Link
        href="/auth/login"
        className="flex items-center justify-center gap-2 w-full py-3 bg-[#2c3020] text-white rounded-lg text-sm font-medium hover:bg-[#3c4230] hover:scale-[.98] transition-all"
      >
        Go to login →
      </Link>

    </div>
  </div>
)  : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

       
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-xl font-bold text-[#2c3020]">
                    {step === 1 && "Registration Step 1: Owner Info"}
                    {step === 2 && "Registration Step 2: Bazaar Details"}
                    {step === 3 && "Registration Step 3: Bazaar Booking"}
                    {step === 4 && "Registration Step 4: Payment"}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fill in the details below to complete your bazaar registration.
                  </p>
                </div>
                <span className="text-[11px] text-gray-500 whitespace-nowrap">STEP {step} OF {STEPS.length}</span>
              </div>

              {/* Step Tabs */}
              <div className="flex flex-wrap items-center gap-1 mb-6 mt-4 capitalize">
                {STEPS.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-0">
                    <div
                      className={`flex items-center gap-1.5 px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 rounded text-[11px] sm:text-[13px] font-medium border transition-all whitespace-nowrap ${
                        step === s.id
                          ? "bg-[#50604a] text-white border-[#2c3020]"
                          : step > s.id
                          ? "bg-[#9A5F4C] text-white border-[#9A5F4C]"
                          : "bg-white text-gray-400 border-gray-200"
                      }`}
                    >
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[14px]">
                        {step > s.id ? "✓" : s.id}
                      </span>
                      {s.label}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="hidden sm:block w-5 md:w-10 h-px bg-gray-300 mx-1" />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* ── STEP 1: Owner Info ── */}
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
                    This information links your bazaar to your account and lets us send important notifications.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Full Name */}
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
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                      />
                      <FieldError name="fullName" />
                    </div>

                    {/* Phone */}
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
                          placeholder="+20 10 0000 0000"
                          value={form.phone}
                          onChange={handleChange}
                          className="flex-1 border border-gray-200 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>
                      <FieldError name="phone" />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        WhatsApp Number <span className="text-red-400">*</span>
                      </label>
                      <div className="flex">
                        <span className="border border-r-0 border-gray-200 rounded-l px-2 py-2 text-xs text-gray-500 bg-gray-100">
                          💬
                        </span>
                        <input
                          type="tel"
                          name="whatsapp"
                          placeholder="+20 10 0000 0000"
                          value={form.whatsapp}
                          onChange={handleChange}
                          className="flex-1 border border-gray-200 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>
                      <FieldError name="whatsapp" />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="example@email.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                      />
                      <FieldError name="email" />
                    </div>

                    {/* Confirm */}
                    <div>
                      <label className="flex items-start gap-2 text-xs text-[#5A5C5C] cursor-pointer">
                        <input
                          type="checkbox"
                          name="confirmAccuracy"
                          checked={form.confirmAccuracy}
                          onChange={handleChange}
                          className="mt-0.5 accent-[#4a5a2a]"
                        />
                        I confirm that the information above is accurate and I agree to Bazaarna&apos;s registration guidelines.
                      </label>
                      <FieldError name="confirmAccuracy" />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => { if (validateStep(1)) setStep(2); }}
                      className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230] hover:scale-[.98] transition-all cursor-pointer"
                    >
                      Save &amp; Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Bazaar Details ── */}
              {step === 2 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

                    {/* Logo Upload */}
                    <div>
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
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>

                    {/* Name + Type */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-2">
                        Bazaar Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="bazaarName"
                        placeholder="Eg. Bloom's Bazaar"
                        value={form.bazaarName}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                      />
                      <FieldError name="bazaarName" />

                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-2 mt-4">
                        Bazaar Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                      >
                        <option value="">Select a bazaar type</option>
                        <option value="OFFLINE">Offline</option>
                        <option value="ONLINE">Online</option>
                        <option value="HYBRID">Hybrid</option>
                      </select>
                      <FieldError name="type" />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Bazaar Description <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="bazaarDescription"
                        placeholder="Tell us about your bazaar, entry requirements, and what makes it unique."
                        value={form.bazaarDescription}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50 resize-none"
                      />
                      <FieldError name="bazaarDescription" />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        placeholder="125 Al-Tahrir, Design District"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50 mb-2"
                      />
                      <input
                        type="text"
                        name="googleMapsLink"
                        placeholder="Google Maps URL"
                        value={form.googleMapsLink}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                      />
                    </div>

                    {/* Map placeholder */}
                    <div className="md:col-span-2 rounded-lg overflow-hidden border border-gray-200 h-32 bg-[#e8e0d0] flex items-center justify-center">
           
                    </div>

                    {/* Dates */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Start Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                      />
                      <FieldError name="startDate" />
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
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                      />
                      <FieldError name="endDate" />
                    </div>

                    {/* Capacity + Accepting */}
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
                        onChange={(e) => setForm((prev) => ({ ...prev, isAcceptingBrands: e.target.checked }))}
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
                      onClick={() => setStep(1)}
                      className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 hover:scale-[.98] transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (validateStep(2)) setStep(3); }}
                      className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230] hover:scale-[.98] transition-all cursor-pointer"
                    >
                      Save &amp; Continue →
                    </button>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                    <span className="text-amber-500 text-sm">⚠</span>
                    <div>
                      <p className="text-xs font-semibold text-amber-800">Why this information matters</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Accurate bazaar details help brands find your event and make informed decisions about participation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Bazaar Booking ── */}
              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-[8px] bg-[#9A5F4C] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM2 9v7a2 2 0 002 2h12a2 2 0 002-2V9H2zm4 2h8v2H6v-2z" />
                        </svg>
                      </div>
                      <h2 className="text-sm font-bold text-[#2c3020] uppercase tracking-wide">Bazaar Booking</h2>
                    </div>
                    <p className="text-xs text-[#5A5C5C] mb-5">
                      Set pricing and booking configuration for your bazaar.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Price per brand — Offline (EGP) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          name="priceOffline"
                          value={form.priceOffline}
                          onChange={handleChange}
                          placeholder="500"
                          min={0}
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                        <FieldError name="priceOffline" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Price per brand — Online (EGP) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          name="priceOnline"
                          value={form.priceOnline}
                          onChange={handleChange}
                          placeholder="300"
                          min={0}
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                        <FieldError name="priceOnline" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                          Price per brand — Hybrid (EGP) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          name="priceHybrid"
                          value={form.priceHybrid}
                          onChange={handleChange}
                          placeholder="1000"
                          min={0}
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                        <FieldError name="priceHybrid" />
                      </div>

                      {/* Payment Method */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Payment Method <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-3 flex-wrap">
                          {[{ value: "card", label: "💳 Credit Card / Visa" }].map((method) => (
                            <label
                              key={method.value}
                              className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer text-xs font-medium transition-all ${
                                form.paymentMethod === method.value
                                  ? "border-[#4a5a2a] bg-[#f0f4e8] text-[#2c3020]"
                                  : "border-gray-200 text-gray-500 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.value}
                                checked={form.paymentMethod === method.value}
                                onChange={handleChange}
                                className="accent-[#4a5a2a]"
                              />
                              {method.label}
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
                        I confirm that the information above is accurate and I agree to Bazaarna&apos;s registration guidelines and terms of service.
                      </label>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230] transition-colors disabled:opacity-60"
                      >
                        {loading ? "Registering..." : "Proceed to Payment →"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ── STEP 4: Stripe Payment ── */}
              {step === 4 && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    amount={paymentAmount}
                    onSuccess={() => setSuccess(true)}
                    onBack={() => setStep(3)}
                  />
                </Elements>
              )}
            </div>

  
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-4">
                <h3 className="text-sm font-bold text-[#2c3020] mb-4">Registration Overview</h3>
                <div className="space-y-3">
                  {STEPS.map((s) => (
                    <div key={s.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
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
                          <div
                            className={`w-px flex-1 mt-1 ${step > s.id ? "bg-[#c8b97a]" : "bg-gray-200"}`}
                            style={{ minHeight: "24px" }}
                          />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-xs font-semibold ${step >= s.id ? "text-[#2c3020]" : "text-gray-400"}`}>
                          Step {s.id}: {s.label}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {s.id === 1 && "Your personal details"}
                          {s.id === 2 && "Bazaar details & dates"}
                          {s.id === 3 && "Pricing & booking config"}
                          {s.id === 4 && "Stripe card payment"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-[#f5f0e8] rounded-lg border border-[#e8dcc8]">
                  <p className="text-[11px] font-semibold text-[#2c3020] mb-1">Need help?</p>
                  <p className="text-[11px] text-gray-600 mb-2">
                    For any issues during registration, reach our support team.
                  </p>
                  <a href="#" className="text-[11px] text-[#4a5a2a] font-semibold underline">Visit Help Center</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}