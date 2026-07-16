"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";

const stripePromise = loadStripe("pk_test_51Tfg0qF3X8TkLn5begaNuyALoqNR9MBt85CJHMNdL1W48L5WgXjyBiIustCAtPzttXC6t5qJtHJg0qmcxe13OIxS00WqKYLYpQ");


function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
          <span className="text-red-500 text-sm">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full flex items-center justify-center gap-2 bg-[#50604A] hover:bg-[#3d4a38] disabled:opacity-60 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing Payment…
          </>
        ) : (
          <>
            <CreditCard size={16} />
            Complete Payment
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck size={13} className="text-gray-400" />
        Secured by Stripe · SSL Encrypted
      </div>
    </form>
  );
}


export default function PaymentPage() {
  const { clientSecret } = useParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (clientSecret) setReady(true);
  }, [clientSecret]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <Loader2 size={28} className="animate-spin text-[#9A5F4C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[90%] m-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#50604A] items-center justify-center mb-4">
            <CreditCard size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Complete Your Registration</h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Pay to activate your brand in the bazaar
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#50604A",
                  colorBackground: "#ffffff",
                  colorText: "#1f2937",
                  borderRadius: "12px",
                  fontFamily: "inherit",
                },
              },
            }}
          >
            <CheckoutForm />
          </Elements>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Having trouble?{" "}
          <a href="mailto:support@bazary.com" className="text-[#9A5F4C] hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
