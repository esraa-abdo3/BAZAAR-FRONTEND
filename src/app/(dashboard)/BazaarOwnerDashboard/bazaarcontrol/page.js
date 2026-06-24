"use client";

import { useState, useEffect, useCallback } from "react";
import {Lock,Unlock,Info,SlidersHorizontal,Loader2,AlertCircle,} from "lucide-react";
import DashboardHeader from "../../../components/Dashboard/BazarownerDashboard/DashboardHeader";
import {getBazaarControl,toggleRegistration,updateAutomation} from "../../../services/bazaarControlService";


function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
  );
}


function Toggle({ checked, onChange, loading = false }) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? "bg-indigo-600" : "bg-gray-200"
      }`}
      aria-checked={checked}
      role="switch"
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={12} className="text-white animate-spin" />
        </span>
      ) : (
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      )}
    </button>
  );
}


function Checkbox({ checked, onChange, loading = false }) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        checked
          ? "bg-indigo-600 border-indigo-600"
          : "border-gray-300 bg-white"
      }`}
    >
      {loading ? (
        <Loader2 size={10} className="text-white animate-spin" />
      ) : checked ? (
        <svg
          className="w-3 h-3 text-white"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 6l3 3 5-5" />
        </svg>
      ) : null}
    </button>
  );
}

export default function BazaarControlPage() {
  const [bazaar, setBazaar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [autoFullLoading, setAutoFullLoading] = useState(false);
  const [autoBeforeLoading, setAutoBeforeLoading] = useState(false);
  const [autoSwitchLoading, setAutoSwitchLoading] = useState(false);


  const fetchControl = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBazaarControl();
      setBazaar(data);
    } catch (err) {
      setError("Failed to load bazaar control data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchControl();
  }, [fetchControl]);


  const handleToggleRegistration = async () => {
    setToggleLoading(true);
    try {
      const data = await toggleRegistration(!bazaar.isAcceptingBrands);
      setBazaar((prev) => ({ ...prev, isAcceptingBrands: data.isAcceptingBrands }));
    } catch {
      setError("Failed to update registration status.");
    } finally {
      setToggleLoading(false);
    }
  };


  const handleAutomation = async (field) => {
    if (!bazaar) return;

    const setFieldLoading =
      field === "autoCloseOnFull" ? setAutoFullLoading : setAutoBeforeLoading;

    const newValues = {
      autoCloseOnFull: bazaar.autoCloseOnFull,
      autoCloseBeforeEvent: bazaar.autoCloseBeforeEvent,
      [field]: !bazaar[field],
    };

    setFieldLoading(true);
    try {
      const data = await updateAutomation(newValues);
      setBazaar((prev) => ({ ...prev, ...data }));
    } catch {
      setError("Failed to update automation rule.");
    } finally {
      setFieldLoading(false);
    }
  };


  const handleAutoSwitchToggle = async () => {
    if (!bazaar) return;
    const bothOff = !bazaar.autoCloseOnFull && !bazaar.autoCloseBeforeEvent;
    const newValues = {
      autoCloseOnFull: bothOff,
      autoCloseBeforeEvent: false,
    };
    setAutoSwitchLoading(true);
    try {
      const data = await updateAutomation(newValues);
      setBazaar((prev) => ({ ...prev, ...data }));
    } catch {
      setError("Failed to update automation.");
    } finally {
      setAutoSwitchLoading(false);
    }
  };


  const isAccepting = bazaar?.isAcceptingBrands ?? false;
  const autoEnabled = bazaar?.autoCloseOnFull || bazaar?.autoCloseBeforeEvent;
  const startDate = bazaar?.startDate
    ? new Date(bazaar.startDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";


  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader greeting="good morning" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8  mx-auto w-full">
       
        {error && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

      
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-5">
    
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Registration Management
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Enable or disable vendor applications in real-time.
              </p>
            </div>
            {loading ? (
              <Skeleton className="h-5 w-36 rounded-full" />
            ) : (
              <span
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${
                  isAccepting
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAccepting ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
                {isAccepting ? "Accepting Brands" : "Registration Closed"}
              </span>
            )}
          </div>

        
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            <button
              onClick={() => !isAccepting && !toggleLoading && handleToggleRegistration()}
              disabled={toggleLoading || loading}
              className={`group relative rounded-xl border-2 p-5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed ${
                isAccepting
                  ? "border-indigo-400 bg-indigo-50/60"
                  : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30"
              }`}
            >
              {toggleLoading && !isAccepting ? (
                <Loader2
                  size={22}
                  className="mx-auto mb-3 text-indigo-400 animate-spin"
                />
              ) : (
                <Unlock
                  size={22}
                  className={`mb-3 transition-colors ${
                    isAccepting ? "text-indigo-500" : "text-gray-400 group-hover:text-indigo-400"
                  }`}
                />
              )}
              <p
                className={`text-sm font-semibold mb-1 ${
                  isAccepting ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                Open Registration
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Allow new vendors to submit their applications immediately.
              </p>
            </button>

  
            <button
              onClick={() => isAccepting && !toggleLoading && handleToggleRegistration()}
              disabled={toggleLoading || loading}
              className={`group relative rounded-xl border-2 p-5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed ${
                !isAccepting
                  ? "border-gray-400 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              {toggleLoading && isAccepting ? (
                <Loader2
                  size={22}
                  className="mx-auto mb-3 text-gray-400 animate-spin"
                />
              ) : (
                <Lock
                  size={22}
                  className={`mb-3 transition-colors ${
                    !isAccepting ? "text-gray-600" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
              )}
              <p
                className={`text-sm font-semibold mb-1 ${
                  !isAccepting ? "text-gray-700" : "text-gray-500"
                }`}
              >
                Close Registration
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Stop accepting new applications and hide the registration form.
              </p>
            </button>
          </div>

          <div className="mt-4 flex gap-2.5 bg-indigo-50/70 rounded-xl p-4 border border-indigo-100">
            <Info size={15} className="text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-0.5">
                Registration Insight
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Manual overrides will supersede any automation rules currently
                set. Re-opening registration when capacity is full will notify
                waitlisted vendors.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
       
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <SlidersHorizontal size={15} className="text-indigo-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Automation Rules
                </h2>
                <p className="text-xs text-gray-400">
                  Configure triggers to manage registration windows automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500 hidden sm:block">
                Auto-Close Registration
              </span>
              {loading ? (
                <Skeleton className="h-6 w-11 rounded-full" />
              ) : (
                <Toggle
                  checked={!!autoEnabled}
                  onChange={handleAutoSwitchToggle}
                  loading={autoSwitchLoading}
                />
              )}
            </div>
          </div>

       
          <div className="flex flex-col gap-3">
            {/* Rule 1 — close on full */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-colors">
              {loading ? (
                <Skeleton className="w-5 h-5 mt-0.5 rounded flex-shrink-0" />
              ) : (
                <Checkbox
                  checked={!!bazaar?.autoCloseOnFull}
                  onChange={() => handleAutomation("autoCloseOnFull")}
                  loading={autoFullLoading}
                />
              )}
              <div className="min-w-0">
                {loading ? (
                  <>
                    <Skeleton className="h-3.5 w-48 mb-1.5" />
                    <Skeleton className="h-3 w-36" />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700">
                      Close when maximum capacity is reached
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Currently set to {bazaar?.maxBrandCapacity ?? "—"} brands
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Rule 2 — close before event */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-colors">
              {loading ? (
                <Skeleton className="w-5 h-5 mt-0.5 rounded flex-shrink-0" />
              ) : (
                <Checkbox
                  checked={!!bazaar?.autoCloseBeforeEvent}
                  onChange={() => handleAutomation("autoCloseBeforeEvent")}
                  loading={autoBeforeLoading}
                />
              )}
              <div className="min-w-0">
                {loading ? (
                  <>
                    <Skeleton className="h-3.5 w-52 mb-1.5" />
                    <Skeleton className="h-3 w-44" />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700">
                      Close 24 hours before event start date
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Calculated based on schedule: {startDate}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}