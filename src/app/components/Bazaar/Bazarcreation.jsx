
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

const PACKAGES = [
  { id: "STARTER", name: "Starter", type: "ONLINE", maxBrandCapacity: 20,  aiAssistant: false, price:1000 },
  { id: "BUSINESS", name: "Business", type: "HYBRID", maxBrandCapacity: 50, aiAssistant: true, price: 1500 },
  { id: "PREMIUM", name: "Premium", type: "HYBRID", maxBrandCapacity: 100,  aiAssistant: true, price:2000 },
];

// Small inline spinner used INSIDE buttons only — never covers page content.
function ButtonSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
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
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading || !stripe}
            className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230] transition-colors disabled:opacity-60"
          >
            {loading ? (<><ButtonSpinner />Processing...</>) : `Pay ${amount} EGP →`}
          </button>
        </div>
      </form>
    </div>
  );
}


export default function Bazaradd() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    whatsapp: "",
    bazaarName: "",
    bazaarDescription: "",
    logoUrl: null,
    logoFile: null,
    backgroundImageUrl: null,
    backgroundImageFile: null,
    address: "",
    googleMapsLink: "",
    socialMediaLinks: [],
    startDate: "",
    endDate: "",
    packageId: "",
    priceOnline: "",
    priceOffline: "",
    priceHybrid: "",
    paymentMethod: "card",
    confirmAccuracy: false,
  });

  const [socialLinkInput, setSocialLinkInput] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const fileInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);

  // Egyptian mobile number: starts with 01, followed by 9 digits (11 digits total)
  const PHONE_REGEX = /^01\d{9}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, logoFile: file, logoUrl: url }));
  }

  function handleBackgroundImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, backgroundImageFile: file, backgroundImageUrl: url }));
    if (errors.backgroundImage) setErrors((prev) => ({ ...prev, backgroundImage: "" }));
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
    let newErrors = {};

    if (s === 1) {
      if (!form.fullName.trim()) newErrors.fullName = "Full name is required";

      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!EMAIL_REGEX.test(form.email)) newErrors.email = "Invalid email address";

      if (!form.phone.trim()) newErrors.phone = "Phone is required";
      else if (!PHONE_REGEX.test(form.phone))
        newErrors.phone = "Phone must start with 01 and be 11 digits (e.g. 01222519040)";

      if (!form.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required";
      else if (!PHONE_REGEX.test(form.whatsapp))
        newErrors.whatsapp = "WhatsApp number must start with 01 and be 11 digits (e.g. 01222519040)";

      if (!form.confirmAccuracy) newErrors.confirmAccuracy = "You must confirm accuracy";
    }

    if (s === 2) {
      if (!form.logoFile) newErrors.logo = "Bazaar logo is required";
      if (!form.backgroundImageFile) newErrors.backgroundImage = "Background image is required";
      if (!form.bazaarName.trim()) newErrors.bazaarName = "Bazaar name is required";
      if (!form.bazaarDescription.trim()) newErrors.bazaarDescription = "Description is required";
      if (!form.address.trim()) newErrors.address = "Address is required";
      // googleMapsLink and socialMediaLinks stay optional

      if (!form.startDate) newErrors.startDate = "Start date is required";
      else if (new Date(form.startDate) < new Date())
        newErrors.startDate = "Start date cannot be in the past";

      if (!form.endDate) newErrors.endDate = "End date is required";
      if (form.startDate && form.endDate && form.endDate <= form.startDate)
        newErrors.endDate = "End date must be after start date";
    }

    if (s === 3) {
      if (!form.packageId) newErrors.packageId = "Please select a package";
      else {
        const selectedPkg = PACKAGES.find((p) => p.id === form.packageId);
        if (selectedPkg?.type === "HYBRID") {
          if (!form.priceOnline) newErrors.priceOnline = "Online price is required";
          if (!form.priceOffline) newErrors.priceOffline = "Offline price is required";
          if (!form.priceHybrid) newErrors.priceHybrid = "Hybrid price is required";
        } else if (selectedPkg?.type === "ONLINE") {
          if (!form.priceOnline) newErrors.priceOnline = "Online price is required";
        } else if (selectedPkg?.type === "OFFLINE") {
          if (!form.priceOffline) newErrors.priceOffline = "Offline price is required";
        }
      }
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
      formData.append("packageId", form.packageId);
      formData.append("bazaarDescription", form.bazaarDescription);
      formData.append("address", form.address);
      formData.append("googleMapsLink", form.googleMapsLink);
      formData.append("socialMediaLinks", JSON.stringify(form.socialMediaLinks));
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("paymentMethod", form.paymentMethod);

      const selectedPkg = PACKAGES.find((p) => p.id === form.packageId);
      if (selectedPkg?.type === "HYBRID") {
        formData.append("priceOnline", form.priceOnline);
        formData.append("priceOffline", form.priceOffline);
        formData.append("priceHybrid", form.priceHybrid);
      } else if (selectedPkg?.type === "ONLINE") {
        formData.append("priceOnline", form.priceOnline);
      } else if (selectedPkg?.type === "OFFLINE") {
        formData.append("priceOffline", form.priceOffline);
      }

      if (form.logoFile) formData.append("logoUrl", form.logoFile);
      if (form.backgroundImageFile) formData.append("backgroundImage", form.backgroundImageFile);

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
    return errors[name] ? <p className="text-red-500 text-xs mt-1">{errors[name]}</p> : null;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F6]">
      <div className="max-w-6xl mx-auto px-4 py-10 mt-15">
        {success ? (
          <div className="flex items-center justify-center min-h-[420px] px-4 mt-10">
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
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
                    {i < STEPS.length - 1 && <div className="hidden sm:block w-5 md:w-10 h-px bg-gray-300 mx-1" />}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{error}</div>
              )}

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
                          placeholder="01222519040"
                          maxLength={11}
                          value={form.phone}
                          onChange={handleChange}
                          className="flex-1 border border-gray-200 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>
                      <FieldError name="phone" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        WhatsApp Number <span className="text-red-400">*</span>
                      </label>
                      <div className="flex">
                        <span className="border border-r-0 border-gray-200 rounded-l px-2 py-2 text-xs text-gray-500 bg-gray-100">💬</span>
                        <input
                          type="tel"
                          name="whatsapp"
                          placeholder="01222519040"
                          maxLength={11}
                          value={form.whatsapp}
                          onChange={handleChange}
                          className="flex-1 border border-gray-200 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                        />
                      </div>
                      <FieldError name="whatsapp" />
                    </div>

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

              {step === 2 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-2">
                        Bazaar Logo <span className="text-red-400">*</span>
                      </label>
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
                      <FieldError name="logo" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-2">
                        Background Image <span className="text-red-400">*</span>
                      </label>
                      <div
                        onClick={() => backgroundImageInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a5a2a] transition-colors bg-gray-50"
                      >
                        {form.backgroundImageUrl ? (
                          <img src={form.backgroundImageUrl} alt="Background preview" className="h-24 object-contain rounded" />
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-xs text-gray-500">Upload background image</span>
                          </>
                        )}
                      </div>
                      <input
                        ref={backgroundImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageChange}
                        className="hidden"
                      />
                      <FieldError name="backgroundImage" />
                    </div>

                    <div className="md:col-span-2">
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
                    </div>

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

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        placeholder="125 Al-Tahrir, Design District"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50 mb-2"
                      />
                      <FieldError name="address" />
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1 mt-2">
                        Google Maps Link <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        name="googleMapsLink"
                        placeholder="Google Maps URL"
                        value={form.googleMapsLink}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Social Media Links <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://instagram.com/yourbazaar"
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
                        <button
                          type="button"
                          onClick={addSocialLink}
                          className="px-4 py-2 bg-[#50604a] text-white rounded text-sm hover:bg-[#3c4230] transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      {form.socialMediaLinks.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {form.socialMediaLinks.map((link, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs text-[#2c3020]"
                            >
                              <span className="truncate">{link}</span>
                              <button
                                type="button"
                                onClick={() => removeSocialLink(index)}
                                className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0"
                              >
                                ✕
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>



                    <div>
                      <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                        Start Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        min={new Date().toISOString().slice(0, 16)}
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
                        min={form.startDate || new Date().toISOString().slice(0, 16)}
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                      />
                      <FieldError name="endDate" />
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
                    <p className="text-xs text-[#5A5C5C] mb-5">Set pricing and booking configuration for your bazaar.</p>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5C5C] mb-3">
                          Choose Your Package <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {PACKAGES.map((pkg) => {
                            const isSelected = form.packageId === pkg.id;
                            return (
                              <div
                                key={pkg.id}
                                onClick={() => setForm((prev) => ({ ...prev, packageId: pkg.id }))}
                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-sm ${
                                  isSelected ? "border-[#50604a] bg-[#f0f4e8]" : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                {pkg.id === "PREMIUM" && (
                                  <span className="absolute -top-2 right-3 bg-[#9A5F4C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    BEST VALUE
                                  </span>
                                )}
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="text-sm font-bold text-[#2c3020]">{pkg.name}</h3>
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                      isSelected ? "border-[#50604a] bg-[#50604a]" : "border-gray-300"
                                    }`}
                                  >
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                </div>
                                <p className="text-lg font-bold text-[#2c3020] mb-2">
                                  {pkg.price} <span className="text-xs font-normal text-gray-500">EGP</span>
                                </p>
                                <ul className="text-[11px] text-gray-600 space-y-1.5">
                                  <li className="flex items-center gap-1.5"><span className="text-[#50604a]">✓</span>{pkg.type} bazaar type</li>
                                  <li className="flex items-center gap-1.5"><span className="text-[#50604a]">✓</span>Up to {pkg.maxBrandCapacity} brands</li>
                        
                                  <li className="flex items-center gap-1.5">
                                    <span className={pkg.aiAssistant ? "text-[#50604a]" : "text-gray-300"}>{pkg.aiAssistant ? "✓" : "✕"}</span>
                                    AI assistant
                                  </li>
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                        <FieldError name="packageId" />
                      </div>

                      {form.packageId && (() => {
                        const selectedPkg = PACKAGES.find((p) => p.id === form.packageId);
                        if (!selectedPkg) return null;
                        return (
                          <div>
                            <label className="block text-xs font-semibold text-[#5A5C5C] mb-1">
                              Brand Participation Price <span className="text-red-400">*</span>
                            </label>
                            <p className="text-[11px] text-gray-500 mb-3">
                              This is what brands will pay to join your bazaar.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {(selectedPkg.type === "ONLINE" || selectedPkg.type === "HYBRID") && (
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5A5C5C] mb-1">
                                    Online Price (EGP)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    name="priceOnline"
                                    placeholder="Eg. 500"
                                    value={form.priceOnline}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                                  />
                                  <FieldError name="priceOnline" />
                                </div>
                              )}

                              {(selectedPkg.type === "OFFLINE" || selectedPkg.type === "HYBRID") && (
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5A5C5C] mb-1">
                                    Offline Price (EGP)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    name="priceOffline"
                                    placeholder="Eg. 500"
                                    value={form.priceOffline}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                                  />
                                  <FieldError name="priceOffline" />
                                </div>
                              )}

                              {selectedPkg.type === "HYBRID" && (
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#5A5C5C] mb-1">
                                    Hybrid Price (EGP)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    name="priceHybrid"
                                    placeholder="Eg. 800"
                                    value={form.priceHybrid}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4a5a2a] bg-gray-50"
                                  />
                                  <FieldError name="priceHybrid" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

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
                        disabled={loading}
                        className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#2c3020] text-white rounded text-sm flex items-center gap-2 hover:bg-[#3c4230] transition-colors disabled:opacity-60"
                      >
                        {loading ? (<><ButtonSpinner />Registering...</>) : "Proceed to Payment →"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

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
                            step > s.id ? "bg-[#9A5F4C] text-white" : step === s.id ? "bg-[#50604a] text-white" : "bg-gray-100 text-gray-400 border border-gray-200"
                          }`}
                        >
                          {step > s.id ? "✓" : s.id}
                        </div>
                        {s.id < STEPS.length && (
                          <div className={`w-px flex-1 mt-1 ${step > s.id ? "bg-[#c8b97a]" : "bg-gray-200"}`} style={{ minHeight: "24px" }} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-xs font-semibold ${step >= s.id ? "text-[#2c3020]" : "text-gray-400"}`}>Step {s.id}: {s.label}</p>
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
                  <p className="text-[11px] text-gray-600 mb-2">For any issues during registration, reach our support team.</p>
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