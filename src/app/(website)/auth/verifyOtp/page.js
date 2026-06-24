"use client";

export default function VerifyOtp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm max-w-md w-full text-center">
        <h1 className="text-xl font-bold text-stone-800 mb-2">Verify OTP</h1>
        <p className="text-xs text-stone-400">Please check your email for the verification code.</p>
      </div>
    </div>
  );
}
