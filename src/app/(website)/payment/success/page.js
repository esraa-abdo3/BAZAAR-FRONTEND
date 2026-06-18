"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from "lucide-react";

const stripePromise = loadStripe("pk_test_51Tfg0qF3X8TkLn5begaNuyALoqNR9MBt85CJHMNdL1W48L5WgXjyBiIustCAtPzttXC6t5qJtHJg0qmcxe13OIxS00WqKYLYpQ");

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent_client_secret");
    if (!clientSecret) {
      setStatus("failed");
      return;
    }

    stripePromise.then((stripe) => {
      if (!stripe) return;
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent?.status === "succeeded") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      });
    });
  }, [searchParams]);

  // ── Loading ──
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#9A5F4C]" />
          <p className="text-sm text-gray-500">Verifying your payment…</p>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">

          <div className="inline-flex w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Your brand registration is now complete.
            <br />
            Check your email — your account details are on their way.
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Mail size={16} className="text-emerald-500" />
            </div>
            <p className="text-xs text-gray-600 text-left">
              We've sent your login credentials to your registered email address.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 bg-[#50604A] hover:bg-[#3d4a38] text-white font-semibold px-6 py-3 rounded-2xl transition-colors text-sm"
          >
            Go to Home
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  // ── Failed ──
  return (
    <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">

        <div className="inline-flex w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Something went wrong with your payment.
          <br />
          Please try again or contact support.
        </p>

        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-[#9A5F4C] hover:bg-[#7d4d3d] text-white font-semibold px-6 py-3 rounded-2xl transition-colors text-sm"
          >
            Try Again
            <ArrowRight size={15} />
          </button>
          <a href="mailto:support@bazary.com" className="text-xs text-gray-400 hover:text-[#9A5F4C] transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
