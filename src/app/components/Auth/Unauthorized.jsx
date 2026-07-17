"use client";

import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import { LockedIllustration, BlockedIllustration } from "./illustrations";

/**
 * Full-page "not allowed" screen.
 *
 * type:
 *  - "no-auth"    -> not logged in at all (no token found)
 *  - "wrong-role" -> logged in, but the account's role doesn't match
 *                    what this page requires (e.g. a customer trying
 *                    to open the Brand Owner dashboard)
 */
export default function Unauthorized({ type = "no-auth", title, message }) {
  const router = useRouter();

  const isNoAuth = type === "no-auth";
  const Illustration = isNoAuth ? LockedIllustration : BlockedIllustration;

  const defaultTitle = isNoAuth
    ? "You need to sign in"
    : "You don't have access to this page";

  const defaultMessage = isNoAuth
    ? "This page is for logged-in users only. Please sign in with an account that has access."
    : "You're signed in, but your account doesn't have permission to view this dashboard.";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 p-6">
      <div className="max-w-md w-full text-center bg-white border border-stone-200 rounded-2xl shadow-sm p-10">
          <div
  className="w-100 h-100 mx-auto mb-4 bg-center bg-contain bg-no-repeat"
  style={{
    backgroundImage: "url('/403 Error Forbidden-bro.svg')",
  }}
/>

        <h2 className="text-lg font-bold text-stone-800 mb-2">
          {title || defaultTitle}
        </h2>
        <p className="text-sm text-stone-400 mb-8 leading-relaxed">
          {message || defaultMessage}
        </p>

        <button
          onClick={() => router.push("/auth/login")}
          className="w-full py-3 bg-primary text-white text-xs font-medium uppercase tracking-widest rounded-lg hover:bg-stone-700 hover:scale-[0.98] transition-all duration-500 cursor-pointer flex items-center justify-center gap-2"
        >
          <Store size={14} />
          Go to Website
        </button>
      </div>
    </div>
  );
}
