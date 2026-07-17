
 "use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/services/authService";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // The email was already collected on the Forgot Password step — reuse it
  // here instead of asking the person to type it again.
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/auth/forgetPassword");
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = {};

    if (!otp.trim()) {
      errors.otp = "OTP is required";
    }

    if (!password) {
      errors.password = "New password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setError(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);

      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        password,
      });

      setSuccess(true);
      localStorage.removeItem("email");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err) {
      setError({
        server:
          err.response?.data?.message ||
          err.response?.data?.msg ||
          "Oops, something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full mt-10 flex items-start md:items-center justify-center p-8 mt-20">
      <div className="bg-white rounded-2xl border border-stone-200 p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-1">Reset Password</h2>
          <p className="text-sm text-stone-400">
            Enter the OTP we sent you and choose a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email (read-only, carried over from the Forgot Password step) */}
          {email && (
            <p className="text-center text-xs text-stone-500">
              Resetting password for <span className="font-medium text-stone-700">{email}</span>
            </p>
          )}

          {/* OTP */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className={`w-full border-0 border-b ${
                error.otp ? "border-red-500" : "border-stone-300"
              } p-2 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
            />

            {error.otp && (
              <p className="text-red-500 text-xs mt-1">{error.otp}</p>
            )}
          </div>

          {/* New Password */}
  <div>
  <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
    New Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setNewPassword(e.target.value)}
      placeholder="••••••••"
      className={`w-full border-0 border-b ${
        error.password ? "border-red-500" : "border-stone-300"
      } p-2 pr-8 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
      tabIndex={-1}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ?  <Eye size={16} />  : <EyeOff size={16} />}
    </button>
  </div>
  {error.password && (
    <p className="text-red-500 text-xs mt-1">{error.password}</p>
  )}
</div>

          {/* Confirm Password */}
    <div>
  <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
    Confirm Password
  </label>
  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="••••••••"
      className={`w-full border-0 border-b ${
        error.confirmPassword ? "border-red-500" : "border-stone-300"
      } p-2 pr-8 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword((prev) => !prev)}
      className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
      tabIndex={-1}
      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
    >
      {showConfirmPassword ?  <Eye size={16} /> :  <EyeOff size={16} />}
    </button>
  </div>
  {error.confirmPassword && (
    <p className="text-red-500 text-xs mt-1">{error.confirmPassword}</p>
  )}
</div>

          {error.server && (
            <p className="text-red-500 text-xs">{error.server}</p>
          )}

          {success && (
            <p className="text-green-600 text-xs text-center">
              Password reset successfully! Redirecting...
            </p>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-2 py-3 bg-primary text-white text-xs font-medium uppercase tracking-widest rounded-lg hover:bg-stone-700 hover:scale-[0.98] transition-all duration-500 cursor-pointer flex justify-center disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>

          <p className="text-center text-sm text-stone-500">
            Back to{" "}
            <Link
              href="/auth/login"
              className="text-stone-800 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}