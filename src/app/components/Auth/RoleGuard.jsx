"use client";

import { useEffect, useState } from "react";
import Unauthorized from "./Unauthorized";

/**
 * Wrap any dashboard page/layout with this to protect it by role.
 *
 * Usage:
 *   <RoleGuard allowedRoles="ADMIN">
 *     <AdminDashboardContent />
 *   </RoleGuard>
 *
 *   <RoleGuard allowedRoles={["BAZAAR_OWNER"]}>
 *     {children}
 *   </RoleGuard>
 */
export default function RoleGuard({ allowedRoles, children }) {
  // "checking" | "no-auth" | "wrong-role" | "ok"
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!token || !userStr) {
      setStatus("no-auth");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const roles = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      if (user?.role && roles.includes(user.role)) {
        setStatus("ok");
      } else {
        setStatus("wrong-role");
      }
    } catch {
      setStatus("no-auth");
    }
  }, [allowedRoles]);

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "no-auth") {
    return (
      <Unauthorized
        type="no-auth"
        title="You need to sign in"
        message="You're not signed in, so you can't access this page. Please log in with an account that has access."
      />
    );
  }

  if (status === "wrong-role") {
    return (
      <Unauthorized
        type="wrong-role"
        title="Access restricted"
        message="You're signed in, but your account type doesn't have permission to view this dashboard."
      />
    );
  }

  return children;
}
