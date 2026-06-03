"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgetPassword } from "@/app/services/authService";

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Invalid email address";
      }
    }

    setError(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      await forgetPassword({ email });
      // Save email for reset password page
      localStorage.setItem("email", email);
      setSuccess(true);
      // Redirect to reset password after short delay
      setTimeout(() => router.push("/auth/resetPassword"), 1500);
    } catch (err) {
      setError({
        server:
          err.response?.data?.msg?.data ||
          err.response?.data?.message ||
          "Oops, something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full mt-10 flex items-start md:items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-1">Forgot Password?</h2>
          <p className="text-sm text-stone-400">
            Enter your email and we&apos;ll send you a reset code.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
              name="email"
              placeholder="elias@atelier.com"
              className={`w-full border-0 border-b ${
                error.email ? "border-red-500" : "border-stone-300"
              } p-2 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
            />
            {error.email && (
              <p className="text-red-500 text-xs mt-1">{error.email}</p>
            )}
          </div>

          {error.server && (
            <p className="text-red-500 text-xs">{error.server}</p>
          )}

          {success && (
            <p className="text-green-600 text-xs text-center">
              Reset code sent! Redirecting…
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="w-full mt-2 py-3 bg-primary text-white text-xs font-medium uppercase tracking-widest rounded-lg hover:bg-stone-700 hover:scale-[0.98] transition-all duration-500 cursor-pointer flex justify-center disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
            ) : (
              "Send Reset Code"
            )}
          </button>

          <p className="text-center text-sm text-stone-500">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-stone-800 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}