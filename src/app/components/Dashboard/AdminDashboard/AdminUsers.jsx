"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminUsers, deleteAdminUser } from "@/app/services/adminService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsersList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminUsers({ page, limit: 10 });
      setUsers(res.users || []);
      setTotal(res.total || 0);
    } catch {
      setError("Failed to fetch users list.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  // Client side filters
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (userId, userFullName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userFullName}"? All associated data will be removed.`)) return;
    try {
      setDeletingId(userId);
      setError(null);
      await deleteAdminUser(userId);
      setSuccess(`User ${userFullName} deleted successfully!`);
      fetchUsersList();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex flex-col gap-6">
      {/* Toast notifications */}
      {success && (
        <div className="bg-green-50 border border-stone-200 text-[#3d4f38] text-xs px-4 py-3 rounded-xl font-medium">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-stone-800">User Management</h2>
          <p className="text-xs text-stone-400">
            View all registered customers, vendors (brand owners), and bazaar hosts.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search users name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-700 placeholder-stone-400"
            />
          </div>

          {/* Role Filter dropdown */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 bg-white text-stone-600 font-medium"
            >
              <option value="">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="BRAND_OWNER">Brand Owner</option>
              <option value="BAZAAR_OWNER">Bazaar Owner</option>
              <option value="ADMIN">Administrator</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#3d4f38", borderTopColor: "transparent" }}
            />
            <p className="text-xs text-stone-400">Loading user directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <span className="mx-auto text-stone-300 mb-3 block w-8 h-8">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-stone-700">No Users Found</p>
            <p className="text-[10px] text-stone-400 mt-1">Adjust search parameters or verify filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] text-stone-400 font-semibold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Contact info</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Registered</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-stone-50/40 transition-colors">
                    {/* User profile details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-[#3d4f38] text-xs font-bold uppercase">
                          {u.fullName ? u.fullName[0] : "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800">{u.fullName || "N/A"}</p>
                          <p className="text-[10px] text-stone-400 font-mono">{u._id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email and Phone */}
                    <td className="px-6 py-4">
                      <p className="text-stone-700 flex items-center gap-1.5">
                        <span className="text-stone-400">
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </span>
                        {u.email}
                      </p>
                      {u.phone && (
                        <p className="text-[10px] text-stone-400 flex items-center gap-1.5 mt-1">
                          <span className="text-stone-400">
                            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                            </svg>
                          </span>
                          {u.phone}
                        </p>
                      )}
                    </td>

                    {/* Role badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          u.role === "ADMIN"
                            ? "bg-red-100 border-red-200 text-red-700"
                            : u.role === "BAZAAR_OWNER"
                            ? "bg-[#f5f5f0] border-stone-200 text-stone-700"
                            : u.role === "BRAND_OWNER"
                            ? "bg-stone-100 border-stone-200 text-[#3d4f38]"
                            : "bg-stone-50 border-stone-200 text-stone-600"
                        }`}
                      >
                        {u.role.replace("_", " ")}
                      </span>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4 text-stone-600 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <span className="text-stone-400">
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </span>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </td>

                    {/* Delete Action button */}
                    <td className="px-6 py-4 text-right">
                      {u.role !== "ADMIN" ? (
                        <button
                          disabled={deletingId === u._id}
                          onClick={() => handleDelete(u._id, u.fullName)}
                          className="w-7 h-7 inline-flex items-center justify-center rounded bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                          title="Delete User account"
                        >
                          {deletingId === u._id ? (
                            <div
                              className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin"
                              style={{ borderColor: "#ef4444", borderTopColor: "transparent" }}
                            />
                          ) : (
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-300 select-none">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-stone-100">
            <p className="text-[10px] text-stone-400">
              Page {page} of {totalPages} (Total {total} Users)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                    page === i + 1
                      ? "bg-[#3d4f38] text-white"
                      : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
