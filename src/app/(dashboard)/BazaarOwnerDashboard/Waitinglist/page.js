"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Loader2, CheckCircle, XCircle, AlertCircle, Clock,
  MapPin, Tag, Phone, Mail, Globe, Store as StoreIcon,
} from "lucide-react";
import DashboardHeader from "../../../components/Dashboard/BazarownerDashboard/DashboardHeader";
import {
  getWaitingList, approveWaitingEntry, rejectWaitingEntry,
} from "../../../services/Bazaarwaitingservice.js";

const TYPE_META = {
  ONLINE:  { label: "Online",  bg: "bg-indigo-50",  text: "text-indigo-600" },
  OFFLINE: { label: "Offline", bg: "bg-emerald-50", text: "text-emerald-600" },
  HYBRID:  { label: "Hybrid",  bg: "bg-amber-50",   text: "text-amber-600" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function RejectConfirm({ brandName, loading, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
          <XCircle size={20} className="text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 text-center mb-1">Reject this brand?</h3>
        <p className="text-xs text-gray-500 text-center mb-5 leading-relaxed">
          <span className="font-semibold text-gray-700">{brandName}</span> will be notified and removed
          from your waiting list. This can't be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={14} className="animate-spin" /> Rejecting…</> : "Yes, Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandRow({ entry, onApprove, onReject, rowState }) {
  const type = TYPE_META[entry.brandType] ?? { label: entry.brandType, bg: "bg-gray-50", text: "text-gray-500" };
  const isBusy = rowState === "approving" || rowState === "rejecting";

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
      {/* Brand */}
      <td className="py-3.5 pl-5 pr-3">
        <div className="flex items-center gap-3 min-w-0">
          {entry.logoUrl ? (
            <img src={entry.logoUrl} alt={entry.brandName}
              className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <StoreIcon size={15} className="text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{entry.brandName}</p>
            <p className="text-xs text-gray-400 truncate flex items-center gap-1">
              <Tag size={10} /> {entry.brandCategory}
            </p>
          </div>
        </div>
      </td>

      {/* Owner */}
      <td className="py-3.5 px-3">
        <p className="text-sm text-gray-700">{entry.firstName} {entry.lastName}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 truncate max-w-[180px]">
          <Mail size={10} className="flex-shrink-0" /> {entry.email}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Phone size={10} /> {entry.phone}
        </p>
      </td>

      {/* Type */}
      <td className="py-3.5 px-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${type.bg} ${type.text}`}>
          <Globe size={10} /> {type.label}
        </span>
      </td>

      {/* Location */}
      <td className="py-3.5 px-3">
        <span className="text-xs text-gray-600 flex items-center gap-1">
          <MapPin size={11} className="text-gray-400" /> {entry.location}
        </span>
      </td>

      {/* Date */}
      <td className="py-3.5 px-3">
        <span className="text-xs text-gray-500">{formatDate(entry.createdAt)}</span>
      </td>

      {/* Actions */}
      <td className="py-3.5 pl-3 pr-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onReject(entry)}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {rowState === "rejecting" ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
            Reject
          </button>
          <button
            onClick={() => onApprove(entry)}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-60"
          >
            {rowState === "approving" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
            Approve
          </button>
        </div>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 last:border-0">
          <td className="py-3.5 pl-5 pr-3" colSpan={6}>
            <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default function WaitingListPage() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowStates, setRowStates] = useState({}); // { [id]: "approving" | "rejecting" }
  const [rejectTarget, setRejectTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getWaitingList();
      setEntries(list.filter((e) => e.status === "PENDING"));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load waiting list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const showToast = (message, kind = "success") => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (entry) => {
    setRowStates((prev) => ({ ...prev, [entry._id]: "approving" }));
    try {
      await approveWaitingEntry(entry._id);
      setEntries((prev) => prev.filter((e) => e._id !== entry._id));
      showToast(`${entry.brandName} approved — payment link sent.`, "success");
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || "Couldn't approve this brand.", "error");
    } finally {
      setRowStates((prev) => {
        const next = { ...prev };
        delete next[entry._id];
        return next;
      });
    }
  };

  const handleReject = async () => {
    const entry = rejectTarget;
    if (!entry) return;
    setRowStates((prev) => ({ ...prev, [entry._id]: "rejecting" }));
    try {
      await rejectWaitingEntry(entry._id);
      setEntries((prev) => prev.filter((e) => e._id !== entry._id));
      showToast(`${entry.brandName} was rejected.`, "success");
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || "Couldn't reject this brand.", "error");
    } finally {
      setRowStates((prev) => {
        const next = { ...prev };
        delete next[entry._id];
        return next;
      });
      setRejectTarget(null);
    }
  };

  return (
    <>
      {rejectTarget && (
        <RejectConfirm
          brandName={rejectTarget.brandName}
          loading={rowStates[rejectTarget._id] === "rejecting"}
          onConfirm={handleReject}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.kind === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
        }`}>
          {toast.kind === "error" ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
          {toast.message}
        </div>
      )}

      <div className="min-h-screen bg-gray-50/50">
        <DashboardHeader />

        <main className="px-4 sm:px-6 py-6 w-[90%] m-auto">

          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ArrowLeft size={15} className="text-gray-500" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-800">Waiting List</h1>
                <p className="text-xs text-[#2d1372]">Review and respond to brand applications</p>
              </div>
            </div>

            {!loading && entries.length > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-500 text-xs font-semibold">
                <Clock size={12} /> {entries.length} pending
              </span>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-5">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Error</p>
                <p className="text-xs text-red-500 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="py-3 pl-5 pr-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Brand</th>
                    <th className="py-3 px-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Owner</th>
                    <th className="py-3 px-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="py-3 px-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Applied</th>
                    <th className="py-3 pl-3 pr-5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                {loading ? (
                  <TableSkeleton />
                ) : (
                  <tbody>
                    {entries.map((entry) => (
                      <BrandRow
                        key={entry._id}
                        entry={entry}
                        rowState={rowStates[entry._id]}
                        onApprove={handleApprove}
                        onReject={setRejectTarget}
                      />
                    ))}
                  </tbody>
                )}
              </table>
            </div>

            {!loading && entries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <Clock size={20} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-700">No pending applications</p>
                <p className="text-xs text-gray-400 mt-1">New brand requests will show up here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}