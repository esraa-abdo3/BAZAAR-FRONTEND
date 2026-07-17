
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const STEP = 6;

// small date formatter -> "11 Jun"
function formatShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// breaks a millisecond diff into days/hours/mins/secs, floored at 0
function getTimeParts(diffMs) {
  const clamped = Math.max(diffMs, 0);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

// small gold "frame corner" mark, reused around the QR code
function FrameCorner({ position }) {
  const base = "absolute w-5 h-5";
  const styles = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };
  return (
    <span
      className={`${base} ${styles[position]}`}
      style={{ borderColor: "#D4A853" }}
    />
  );
}

export default function Bzaarprofile() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [bazaardata, setbazzardata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(STEP);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [descExpanded, setDescExpanded] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // grabs the shareable link once we're in the browser (avoids SSR mismatch)
  useEffect(() => {
    if (typeof window !== "undefined") setCurrentUrl(window.location.href);
  }, []);
  

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err);
    }
  }

  // ticks every second to keep the countdown section live
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands`
        );
        const json = await res.json();
        setbazzardata(json?.data?.bazaar || null);
        setData(json?.data?.brands || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);
 

  
  const categories = [
    "All",
    ...Array.from(new Set(data.map((b) => b.brandCategory).filter(Boolean))),
  ];

  const filtered = data.filter((b) => {
    const matchSearch = b.brandName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || b.brandCategory === activeCategory;
    return matchSearch && matchCat;
  });

  const brandsToShow = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const isOffline = bazaardata?.type === "OFFLINE";
  const isHybrid = bazaardata?.type === "HYBRID";
  const showLocation = isOffline || isHybrid;

  const directionsUrl =
    bazaardata?.googleMapsLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      bazaardata?.address || "Cairo International Convention Centre"
    )}`;

  const description = bazaardata?.bazaarDescription;
  const isLongDesc = description && description.length > 140;

  // countdown: "starts in" before startDate, "time left" between start/end, else ended
  const startMs = bazaardata?.startDate ? new Date(bazaardata.startDate).getTime() : null;
  const endMs = bazaardata?.endDate ? new Date(bazaardata.endDate).getTime() : null;
  let countdownState = null;
  let countdownTarget = null;
  if (endMs) {
    if (startMs && now < startMs) {
      countdownState = "upcoming";
      countdownTarget = startMs;
    } else if (now < endMs) {
      countdownState = "ongoing";
      countdownTarget = endMs;
    } else {
      countdownState = "ended";
    }
  }
  const countdown = countdownTarget ? getTimeParts(countdownTarget - now) : null;

  return (
    <div className="w-[100%] lg:w-[100%] mx-auto py-6 pb-0">
      {/* HERO */}
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-[#e8e4de]"
        style={{ aspectRatio: "21/9", minHeight: "300px" }}
      >
        {bazaardata?.backgroundImage && (
          <img
            src={bazaardata.backgroundImage}
            alt={bazaardata?.bazaarName || "hero"}
            className="w-full h-full object-cover block"
          />
        )}
        {/* <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%)",
          }}
        /> */}

        {/* top-right status + dates */}
        <div className="absolute top-3 left-3 right-3 flex gap-2 flex-wrap justify-between items-start">
          <span
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.92)",
              color: bazaardata?.status === "LIVE" ? "#2f7d4f" : "#22301D",
            }}
          >
            {bazaardata?.status === "LIVE" && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ background: "#2f7d4f" }}
              />
            )}
            {bazaardata?.status || "LIVE"}
          </span>

          {(bazaardata?.startDate || bazaardata?.endDate) && (
            <span
              className="text-xs font-medium px-3 py-1 rounded-md text-white"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "0.5px solid rgba(255,255,255,0.35)",
                backdropFilter: "blur(2px)",
              }}
            >
              {formatShort(bazaardata?.startDate)} – {formatShort(bazaardata?.endDate)}
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 w-fit text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: "rgb(80 96 74)",
              border: "1px solid rgba(212,168,83,0.45)",
              color: "#D4A853",
            }}
          >
            ✦ Exclusive Bazaar
          </span>

          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-6 w-48 bg-white/20 rounded" />
              <div className="h-4 w-64 bg-white/10 rounded" />
            </div>
          ) : (
            <>
              <h1 className="text-lg sm:text-2xl font-semibold text-white leading-tight">
                {bazaardata?.bazaarName || "Bazaar Event"}
              </h1>
              {bazaardata?.fullName && (
                <p className="text-xs text-white/70">
                  Organized by {bazaardata.fullName}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="w-[100%] lg:w-[85%] m-auto">
        {/* DESCRIPTION */}
        {!loading && description && (
          <div className="mt-5">
            <p
              className={`text-sm text-[#4b4b46] leading-relaxed ${
                !descExpanded && isLongDesc ? "line-clamp-2" : ""
              }`}
            >
              {description}
            </p>
            {isLongDesc && (
              <button
                onClick={() => setDescExpanded((v) => !v)}
                className="text-xs font-semibold text-[#50604A] mt-1 underline underline-offset-2"
              >
                {descExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* SEARCH + FILTERS */}
        <div className="mt-6 mb-5 flex flex-col gap-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisible(STEP);
              }}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#50604A]/30 transition-shadow"
              style={{
                background: "#f5f5f3",
                border: "1.5px solid #e5e5e2",
                color: "#22301D",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisible(STEP);
                  }}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={
                    activeCategory === cat
                      ? { background: "#50604A", color: "#fff", border: "1.5px solid #50604A" }
                      : { background: "#f5f5f3", color: "#50604A", border: "1.5px solid #d6d6d2" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base sm:text-lg text-[#22301D]">
            Explore our brands and enjoy exclusive offers
          </h2>
          {!loading && (
            <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
              {filtered.length} brands
            </span>
          )}
        </div>

        {/* BRAND GRID */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-[#ece8e2] overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-100 w-full" />
                <div className="p-2 bg-white flex justify-between items-center">
                  <div className="h-3 w-14 bg-gray-200 rounded" />
                  <div className="w-6 h-6 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : brandsToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ background: "#f5f5f3" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">No brands found</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-3 text-xs text-[#50604A] underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {brandsToShow.map((brand) => (
                <div
                  onClick={() => router.push(`${id}/brand/${brand._id}`)}
                  key={brand._id}
                  className="group rounded-xl border border-[#ece8e2] overflow-hidden cursor-pointer bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="aspect-square w-full bg-[#faf9f7] flex items-center justify-center p-3.5">
                    <img
                      src={brand.logoUrl || "/default.jpg"}
                      alt={brand.brandName}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 border-t border-[#ece8e2] flex justify-between items-center">
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-[#22301D] leading-tight truncate pr-1">
                        {brand.brandName || "Unknown Brand"}
                      </h3>
                      {brand.brandCategory && (
                        <span className="text-[9px] text-gray-400">
                          {brand.brandCategory}
                        </span>
                      )}
                    </div>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#f5f5f3" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#50604A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisible((v) => v + STEP)}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm text-white bg-[#50604A] rounded-xl hover:scale-[.98] transition-all duration-200"
                >
                  <span>Show more brands</span>
                  <span>▾</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* LOCATION */}
        {showLocation && !loading && (
          <div
            className="mt-8 rounded-3xl overflow-hidden"
            style={{ border: "1px solid #e8e4de" }}
          >
            <div className="relative w-full" style={{ height: "220px" }}>
              <iframe
                title="Bazaar Location"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  bazaardata?.address || "Cairo International Convention Centre"
                )}&output=embed&z=15`}
              />
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#22301D",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
              >
                <span style={{ color: "#D4A853" }}>📍</span>
                {bazaardata?.address || "Cairo International Convention Centre"}
              </div>
            </div>

            <div className="p-5" style={{ background: "#fafaf8" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#22301D] text-base">
                    Visit the Bazaar in Person
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {bazaardata?.startDate?.split("T")[0]} —{" "}
                    {bazaardata?.endDate?.split("T")[0]}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "#eef2ec", color: "#50604A" }}
                >
                  {bazaardata?.type || "LIVE"}
                </span>
              </div>

              <div
                style={{ height: "1px", background: "#ece8e2", marginBottom: "16px" }}
              />

              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-medium">
                Contact
              </p>
              <div className="flex flex-col gap-2 mb-4">
                {bazaardata?.phone && (
                  <a
                    href={`tel:${bazaardata.phone}`}
                    className="flex items-center gap-3 text-sm text-[#22301D] font-medium hover:opacity-70 transition-opacity"
                  >
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "#eef2ec" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#50604A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.6 4.48 2 2 0 0 1 3.59 2.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    {bazaardata.phone}
                  </a>
                )}

                {bazaardata?.whatsapp && (
                  <a
                    href={`https://wa.me/${bazaardata.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[#22301D] font-medium hover:opacity-70 transition-opacity"
                  >
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "#e8f5e9" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#25D366"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.121 1.523 5.851L.057 23.998l6.304-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 0 1-5.006-1.371l-.361-.214-3.741.981.998-3.648-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                      </svg>
                    </span>
                    WhatsApp: {bazaardata.whatsapp}
                  </a>
                )}
              </div>

              {bazaardata?.address && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-medium">
                    Address
                  </p>
                  <p className="mb-2 text-sm text-[#22301D]">{bazaardata.address}</p>
                </div>
              )}

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[.98]"
                style={{ background: "#50604A", color: "#fff" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Get Directions
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================
          TIMER + SCAN — full-bleed closing section (breaks out of the 85%
          content column on purpose). Top half is the live countdown,
          bottom half is the QR / share panel — read top-to-bottom like a
          single ticket that closes out the page.
      =================================================================== */}
      {!loading && bazaardata && (countdownState || currentUrl) && (
        <div className="mt-10 w-full overflow-hidden" style={{ boxShadow: "0 -1px 0 rgba(0,0,0,0.04)" }}>
          {/* TOP — countdown, on the deep sage field */}
          {countdownState && countdown && (
            <div
              className="w-full flex flex-col items-center text-center px-6 py-10 sm:py-12"
              style={{ background: "#50604A" }}
            >
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-semibold"
                style={{ color: "#D4A853" }}
              >
                {countdownState === "upcoming"
                  ? "Opens Soon"
                  : countdownState === "ongoing"
                  ? "Happening Now"
                  : "Bazaar Closed"}
              </span>

              <h2
                className="mt-3 text-xl sm:text-3xl text-white"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {bazaardata?.bazaarName || "This Bazaar"}
              </h2>

              <div
                className="mt-4 w-16"
                style={{ borderTop: "1px solid rgba(212,168,83,0.5)" }}
              />

              <p className="mt-4 text-xs sm:text-sm text-white/70">
                {countdownState === "upcoming"
                  ? `Doors open ${formatShort(bazaardata?.startDate)}`
                  : countdownState === "ongoing"
                  ? `Open through ${formatShort(bazaardata?.endDate)}`
                  : "Thanks for stopping by — see you at the next one"}
              </p>

              <div className="flex items-center justify-center gap-4 sm:gap-8 mt-6">
                {[
                  { label: "days", value: countdown.days },
                  { label: "hrs", value: countdown.hours },
                  { label: "min", value: countdown.minutes },
                  { label: "sec", value: countdown.seconds },
                ].map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center min-w-[52px] sm:min-w-[68px]">
                    <span
                      className="text-3xl sm:text-5xl leading-none text-white"
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(unit.value).padStart(2, "0")}
                    </span>
                    <span
                      className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-2"
                      style={{ color: "#D4A853" }}
                    >
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOTTOM — scan panel, on the cream field */}
          {currentUrl && (
            <div
              className="w-full flex flex-col items-center text-center px-6 py-10 sm:py-12"
              style={{ background: "#faf6ec" }}
            >
              <div
                className="relative bg-white p-3 rounded-md"
                style={{ boxShadow: "0 10px 28px rgba(34,48,29,0.12)" }}
              >
                <FrameCorner position="tl" />
                <FrameCorner position="tr" />
                <FrameCorner position="bl" />
                <FrameCorner position="br" />
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&color=22301D&bgcolor=ffffff&data=${encodeURIComponent(
                    currentUrl
                  )}`}
                  alt="Scan to open this bazaar"
                  width={140}
                  height={140}
                  className="block"
                />
              </div>

              <p className="mt-5 text-sm font-semibold" style={{ color: "#22301D" }}>
                Scan to browse every brand at{" "}
                {bazaardata?.bazaarName || "the bazaar"}
              </p>


              <div className="flex items-center gap-2.5 justify-center flex-wrap mt-8">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Check out ${bazaardata?.bazaarName || "this bazaar"} on Bazaarna: ${currentUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-transform active:scale-[.97]"
                  style={{ background: "#25D366" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  WhatsApp
                </a>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-[.97]"
                  style={{
                    background: copied ? "#22301D" : "transparent",
                    color: copied ? "#fff" : "#22301D",
                    border: "1.5px solid #22301D",
                  }}
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>

              <p className="mt-8 text-[10px] tracking-[0.25em] uppercase" style={{ color: "#22301D" }}>
                BAZAARNA.COM
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}