"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/services/authService";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};

    if (!form.email || !form.password) {
      errors.fields = "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      errors.email = "Invalid email address";
    }

    setError(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      await login({ ...form, router });
   
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
    <section className="w-full mt-25 flex items-start md:items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-1">Welcome Back</h2>
          <p className="text-sm text-stone-400">
            Login to continue to your account.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {error.fields && (
            <p className="text-red-500 text-xs">{error.fields}</p>
          )}

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

          {/* Forgot Password Link */}
          <div className="flex justify-end -mt-2">
            <Link
              href="/auth/forgetPassword"
              className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-2 py-3 bg-primary text-white text-xs font-medium uppercase tracking-widest rounded-lg hover:bg-stone-700 hover:scale-[0.98] transition-all duration-500 cursor-pointer flex justify-center disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>



          <p className="text-center text-sm text-stone-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-stone-800 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
