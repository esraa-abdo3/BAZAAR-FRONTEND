
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const STEP = 4;

export default function Bzaarprofile() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [bazaardata, setbazzardata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(STEP);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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

  const categories = ["All", ...Array.from(new Set(data.map((b) => b.brandCategory).filter(Boolean)))];

  const filtered = data.filter((b) => {
    const matchSearch = b.brandName?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || b.brandCategory === activeCategory;
    return matchSearch && matchCat;
  });

  const brandsToShow = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const isOffline = bazaardata?.type === "OFFLINE";
  const isHybrid = bazaardata?.type === "HYBRID";
  const showLocation = isOffline || isHybrid;

  return (
    <div className="w-[100%] lg:w-[100%] mx-auto  py-6 pb-12">

      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{ aspectRatio: "21/9", minHeight: "300px" }}
      >
        <img
          src={bazaardata?.logoUrl}
          alt="hero"
          className="w-full h-full object-cover block"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 flex gap-2 mt-1 flex-wrap">
          <span
            className="flex items-center gap-1.5 text-xs text-[#22301D] font-bold px-3 py-1 rounded-md"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "0.5px solid rgba(255,255,255,0.2)",
            }}
          >
            End date: {bazaardata?.endDate?.split("T")[0] || "N/A"}
          </span>
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
            <h1 className="text-lg sm:text-2xl font-semibold text-white leading-tight">
              {bazaardata?.bazaarName || "Bazaar Event"}
            </h1>
          )}
        </div>
      </div>

      <div className=" w-[100%] lg:w-[85%] m-auto">
              <div className="mt-8 mb-5 flex flex-col gap-3">
        {/* Search */}
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
            onChange={(e) => { setSearch(e.target.value); setVisible(STEP); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
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

        {/* Category Pills */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisible(STEP); }}
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

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
              <div className="h-[180px] sm:h-[300px] bg-gray-200 w-full" />
              <div className="p-3 bg-gray-100 flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="w-8 h-8 rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : brandsToShow.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
            style={{ background: "#f5f5f3" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">No brands found</p>
          <button onClick={() => { setSearch(""); setActiveCategory("All"); }}
            className="mt-3 text-xs text-[#50604A] underline underline-offset-2">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {brandsToShow.map((brand) => (
              <div
                onClick={() => router.push(`${id}/brand/${brand._id}`)}
                key={brand._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-[180px] sm:h-[300px] w-full overflow-hidden">
                  <img
                    src={brand.logoUrl || "/default.jpg"}
                    alt={brand.brandName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 bg-[#9A5F4C] flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-tight truncate pr-2">
                      {brand.brandName || "Unknown Brand"}
                    </h3>
                    {brand.brandCategory && (
                      <span className="text-[10px] text-white/60">{brand.brandCategory}</span>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <span>Show More brands</span>
                <span>▾</span>
              </button>
            </div>
          )}
        </>
      )}
  

{showLocation && !loading && (
  <div className="mt-6 rounded-3xl overflow-hidden" style={{ border: "1px solid #e8e4de" }}>
    
 
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
        style={{ background: "rgba(255,255,255,0.95)", color: "#22301D", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
      >
        <span style={{ color: "#D4A853" }}>📍</span>
        {bazaardata?.address || "Cairo International Convention Centre"}
      </div>
    </div>

  
    <div className="p-5" style={{ background: "#fafaf8" }}>
      
      <div className="flex items-center justify-between mb-4">
        <div>
         <h3 className="font-bold text-[#22301D] text-base">Visit the Bazaar in Person</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {bazaardata?.startDate?.split("T")[0]} — {bazaardata?.endDate?.split("T")[0]}
          </p>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: "#eef2ec", color: "#50604A" }}
        >
          {bazaardata?.type || "LIVE"}
        </span>
      </div>

      <div style={{ height: "1px", background: "#ece8e2", marginBottom: "16px" }} />

      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-medium">Contact</p>
      <div className="flex flex-col gap-2 mb-4">
        {bazaardata?.phone && (
          <a
            href={`tel:${bazaardata.phone}`}
            className="flex items-center gap-3 text-sm text-[#22301D] font-medium hover:opacity-70 transition-opacity"
          >
            <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#eef2ec" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#50604A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.6 4.48 2 2 0 0 1 3.59 2.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
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
            <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#e8f5e9" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.121 1.523 5.851L.057 23.998l6.304-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 0 1-5.006-1.371l-.361-.214-3.741.981.998-3.648-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
            </span>
            WhatsApp: {bazaardata.whatsapp}
          </a>
        )}
            </div>
             
            
<div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-medium">Address</p>
              <p  className="mb-2">{ bazaardata.address}</p>
              
  </div>


      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          bazaardata?.address || "Cairo International Convention Centre"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[.98]"
        style={{ background: "#22301D", color: "#fff" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        Get Directions
      </a>
    </div>
  </div>
)}
        
</div>

    </div>
  );
}