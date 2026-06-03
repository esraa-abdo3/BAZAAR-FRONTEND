"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerCustomer } from "@/app/services/authService";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};

    if (!form.fullName || !form.password || !form.email) {
      errors.fields = "All fields are required";
    }

    if (form.fullName && form.fullName.length < 2) {
      errors.FullName = "Full name must be at least 2 characters";
    }

    if (form.password && form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      errors.email = "Invalid email address";
    }

    setError(errors);
    if (Object.keys(errors).length > 0) return;
console.log(form)
    try {
      setLoading(true);
      await registerCustomer(form);
      // Save email for OTP verification
      localStorage.setItem("email", form.email);
      router.push("/");
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
    <section className="min-h-screen w-full bg-stone-50 flex items-start md:items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-1">Create Account</h2>
          <p className="text-sm text-stone-400">
            Join our curated community of artisans and collectors.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {error.fields && (
            <p className="text-red-500 text-xs">{error.fields}</p>
          )}

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
              Full Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              value={form.fullName}
              name="fullName"
              placeholder="Elias Thorne"
              className={`w-full border-0 border-b ${
                error.fullName ? "border-red-500" : "border-stone-300"
              } p-2 bg-transparent text-sm focus:outline-none focus:border-background rounded-sm`}
            />
            {error.fullName && (
              <p className="text-red-500 text-xs mt-1">{error.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
              Email Address
            </label>
            <input
              onChange={handleChange}
              type="email"
              value={form.email}
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

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              value={form.password}
              name="password"
              placeholder="••••••••"
              className={`w-full border-0 border-b ${
                error.password ? "border-red-500" : "border-stone-300"
              } p-2 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
            />
            {error.password && (
              <p className="text-red-500 text-xs mt-1">{error.password}</p>
            )}
          </div>

          {error.server && (
            <p className="text-red-500 text-xs">{error.server}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-2 py-3 bg-primary text-white text-xs font-medium uppercase tracking-widest rounded-lg hover:bg-stone-700 hover:scale-[0.98] transition-all duration-500 cursor-pointer flex justify-center disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center">
            <p className="text-xs text-stone-400 mb-3">Or continue with</p>
            <button className="w-full py-2.5 border border-stone-200 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-stone-50 hover:scale-[.98] transition-all cursor-pointer">
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-stone-500">
            Already have an account?{" "}
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