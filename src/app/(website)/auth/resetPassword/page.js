// "use client";
 
// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { resetPassword } from "@/app/services/authService";
 
// export default function ResetPassword() {
//   const router = useRouter();
//   const [token, setToken] = useState("");
//   const [password, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState({});
//   const [success, setSuccess] = useState(false);
 
//   async function handleSubmit(e) {
//     e.preventDefault();
//     const errors = {};
 
//     if (!token.trim()) {
//       errors.token = "Reset token is required";
//     }
 
//     if (!password) {
//       errors.password = "New password is required";
//     } else if (password.length < 6) {
//       errors.password = "Password must be at least 6 characters";
//     }
 
//     if (password !== confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//     }
 
//     setError(errors);
//     if (Object.keys(errors).length > 0) return;
 
//     try {
//       setLoading(true);
//       await resetPassword({ token: token.trim(), password });
//       setSuccess(true);
//       setTimeout(() => router.push("/auth/login"), 1500);
//     } catch (err) {
//       setError({
//         server:
//           err.response?.data?.msg?.data ||
//           err.response?.data?.message ||
//           "Oops, something went wrong",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }
 
//   return (
//     <section className="w-full mt-10 flex items-start md:items-center justify-center p-8">
//       <div className="bg-white rounded-2xl border border-stone-200 p-10 w-full max-w-md">
//         <div className="text-center mb-8">
//           <h2 className="text-2xl font-medium mb-1">Reset Password</h2>
//           <p className="text-sm text-stone-400">
//             Enter the reset token from your email, then choose a new password.
//           </p>
//         </div>
 
//         <div className="flex flex-col gap-5">
 
//           {/* Reset Token */}
//           <div>
//             <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
//               Reset Token
//             </label>
//             <input
//               onChange={(e) => setToken(e.target.value)}
//               type="text"
//               value={token}
//               placeholder="Paste your reset token here"
//               className={`w-full border-0 border-b ${
//                 error.token ? "border-red-500" : "border-stone-300"
//               } p-2 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
//             />
//             {error.token && (
//               <p className="text-red-500 text-xs mt-1">{error.token}</p>
//             )}
//           </div>
 
//           {/* New Password */}
//           <div>
//             <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
//               New Password
//             </label>
//             <input
//               onChange={(e) => setNewPassword(e.target.value)}
//               type="password"
//               value={password}
//               placeholder="••••••••"
//               className={`w-full border-0 border-b ${
//                 error.newPassword ? "border-red-500" : "border-stone-300"
//               } p-2 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
//             />
//             {error.password && (
//               <p className="text-red-500 text-xs mt-1">{error.password}</p>
//             )}
//           </div>
 
//           {/* Confirm Password */}
//           <div>
//             <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
//               Confirm Password
//             </label>
//             <input
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               type="password"
//               value={confirmPassword}
//               placeholder="••••••••"
//               className={`w-full border-0 border-b ${
//                 error.confirmPassword ? "border-red-500" : "border-stone-300"
//               } p-2 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
//             />
//             {error.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1">{error.confirmPassword}</p>
//             )}
//           </div>
 
//           {error.server && (
//             <p className="text-red-500 text-xs">{error.server}</p>
//           )}
 
//           {success && (
//             <p className="text-green-600 text-xs text-center">
//               Password reset successfully! Redirecting…
//             </p>
//           )}
 
//           <button
//             onClick={handleSubmit}
//             disabled={loading || success}
//             className="w-full mt-2 py-3 bg-primary text-white text-xs font-medium uppercase tracking-widest rounded-lg hover:bg-stone-700 hover:scale-[0.98] transition-all duration-500 cursor-pointer flex justify-center disabled:opacity-60"
//           >
//             {loading ? (
//               <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
//             ) : (
//               "Reset Password"
//             )}
//           </button>
 
//           <p className="text-center text-sm text-stone-500">
//             Back to{" "}
//             <Link href="/auth/login" className="text-stone-800 font-medium hover:underline">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }
 "use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/services/authService";

export default function ResetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    }

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
    <section className="w-full mt-10 flex items-start md:items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-1">Reset Password</h2>
          <p className="text-sm text-stone-400">
            Enter your email, OTP, and new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className={`w-full border-0 border-b ${
                error.email ? "border-red-500" : "border-stone-300"
              } p-2 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
            />

            {error.email && (
              <p className="text-red-500 text-xs mt-1">{error.email}</p>
            )}
          </div>

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

            <input
              type="password"
              value={password}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full border-0 border-b ${
                error.password ? "border-red-500" : "border-stone-300"
              } p-2 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
            />

            {error.password && (
              <p className="text-red-500 text-xs mt-1">{error.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full border-0 border-b ${
                error.confirmPassword
                  ? "border-red-500"
                  : "border-stone-300"
              } p-2 rounded-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
            />

            {error.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {error.confirmPassword}
              </p>
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