"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";


const STATIC_REVIEWS = [
  {
    id: 1,
    name: "Ahmed Ali",
    initials: "AA",
    color: "#50604A",
    stars: 5,
    date: "March 2024",
    text: "This bazaar was absolutely incredible! Amazing vendors, great atmosphere, and found the perfect gifts.",
  },
  {
    id: 2,
    name: "Sara Mohamed",
    initials: "SM",
    color: "#9A5F4C",
    stars: 5,
    date: "March 2024",
    text: "Well-organized event with unique brands I've never seen before. Will definitely attend the next one!",
  },
  {
    id: 3,
    name: "Youssef Khaled",
    initials: "YK",
    color: "#3a4a7a",
    stars: 4,
    date: "February 2024",
    text: "Really enjoyed the variety of products and the venue was perfect. The team did a great job.",
  },
  {
    id: 4,
    name: "Nour Hassan",
    initials: "NH",
    color: "#7a5a2a",
    stars: 5,
    date: "February 2024",
    text: "Loved every moment! The brands were amazing and the prices were very reasonable. Highly recommended.",
  },
];



function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill={i < count ? "#f59e0b" : "none"}
          stroke={i < count ? "#f59e0b" : "#d1d5db"}
          strokeWidth="1.5" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ))}
    </div>
  );
}

function TypeBadge({ type }) {
  const config = {
    ONLINE:  { icon: "🌐", label: "Online",  bg: "#dbeafe", color: "#1d4ed8" },
    OFFLINE: { icon: "📍", label: "Offline", bg: "#dcfce7", color: "#15803d" },
    HYBRID:  { icon: "⚡", label: "Hybrid",  bg: "#fef9c3", color: "#a16207" },
  };
  const c = config[type?.toUpperCase()] || config.HYBRID;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full"
      style={{ background: c.bg, color: c.color }}>
      {c.icon} {c.label}
    </span>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl"
      style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-0.5">{label}</p>
        <p className="text-gray-900 font-semibold text-sm">{value || "—"}</p>
      </div>
    </div>
  );
}

function SkeletonPage() {
  return (
    <div className="w-full lg:w-[85%] mx-auto px-4 py-6 pb-12 mt-16 animate-pulse">
      <div className="skeleton w-full rounded-2xl mb-8" style={{ height: "320px" }} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
      </div>
      <div className="skeleton h-48 rounded-2xl mb-8" />
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
      </div>
    </div>
  );
}


export default function UpcomingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [bazaar, setBazaar]   = useState(null);
  const [brands, setBrands]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
     
const res = await fetch(
  `https://bazary-backend.vercel.app/api/events/upcoming`,
  { cache: "no-store" }
);
        console.log("bazaar data", res)
     const json = await res.json();

const allBazaars = json?.data || json || [];

const currentBazaar = allBazaars.find(
  (item) => item._id === id
);

setBazaar(currentBazaar || null);
      } catch (e) {
        console.error(e);
      }

    
      try {
        const bRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/upcoming/${id}/brands`,
          { cache: "no-store" }
        );
        if (bRes.ok) {
          const bJson = await bRes.json();
          setBrands(bJson?.data?.brands || bJson?.data || []);
        }
      } catch {  }

      setLoading(false);
    }
    fetchData();
  }, [id]);
  console.log(bazaar)

  const getDaysLeft = (startDate) => {
    const diff = new Date(startDate) - new Date();
    if (diff <= 0) return "Starting Soon";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  const isOffline = bazaar?.type === "OFFLINE";
  const isHybrid  = bazaar?.type === "HYBRID";
  const showMap   = isOffline || isHybrid;

  if (loading) return <SkeletonPage />;

  
  const name        = bazaar?.bazaarName || bazaar?.title || "Upcoming Bazaar";
  const description = bazaar?.bazaarDescription || "A wonderful upcoming bazaar experience awaiting you.";
  const logoUrl     = bazaar?.logoUrl;
  const address     = bazaar?.address;

  const type        = bazaar?.type || "HYBRID";
  const startDate   = bazaar?.startDate;
  const endDate     = bazaar?.endDate;
  const phone       = bazaar?.phone;
  const whatsapp = bazaar?.whatsapp;
  const getPriceDisplay = () => {
  if (!bazaar) return null;

  switch (bazaar.type) {
    case "ONLINE":
      return {
        label: "Online Price",
        value: bazaar.priceOnline,
      };

    case "OFFLINE":
      return {
        label: "Offline Price",
        value: bazaar.priceOffline,
      };

    case "HYBRID":
      return {
        label: "Hybrid Package",
        value: {
          online: bazaar.priceOnline,
          offline: bazaar.priceOffline,
          hybrid: bazaar.priceHybrid,
        },
      };

    default:
      return null;
  }
  };
  const priceData = getPriceDisplay();

  return (
    <div className="w-full lg:w-[85%] mx-auto px-4 py-6 pb-16 mt-16">

      
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        ← Back
      </button>

     
      <div className="relative w-full rounded-3xl overflow-hidden mb-8"
        style={{ aspectRatio: "21/8", minHeight: "220px" }}>
        <img
          src={imgError || !logoUrl
            ? "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1400&q=80"
            : logoUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.15) 60%,transparent 100%)" }} />

     
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
            style={{ background: "rgba(80,96,74,0.88)", backdropFilter: "blur(6px)" }}>
            📅 Upcoming
          </span>
          {startDate && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full text-white"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
              {getDaysLeft(startDate)}
            </span>
          )}
        </div>

   
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">{name}</h1>
          {description && (
            <p className="text-white/70 text-sm mt-2 max-w-2xl line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <InfoCard icon="📅" label="Start Date"
          value={startDate ? new Date(startDate).toLocaleDateString("en-EG", { day:"numeric", month:"short", year:"numeric" }) : "TBA"} />
        <InfoCard icon="🏁" label="End Date"
          value={endDate   ? new Date(endDate  ).toLocaleDateString("en-EG", { day:"numeric", month:"short", year:"numeric" }) : "TBA"} />
      
        <div className="flex flex-col justify-center p-4 rounded-2xl" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">Type</p>
          <TypeBadge type={type} />
        </div>
      </div>

   
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

     
        <div className="lg:col-span-2 flex flex-col gap-8">

        
          <section className="rounded-3xl p-6" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
            <h2 className="font-extrabold text-gray-900 text-xl mb-3">About This Bazaar</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </section>

     
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-gray-900 text-xl">
                Participating Brands
                {brands.length > 0 && (
                  <span className="ml-2 text-sm font-medium text-gray-400">({brands.length})</span>
                )}
              </h2>
            </div>

            {brands.length === 0 ? (
              <div className="rounded-3xl p-10 text-center" style={{ background: "#f9fafb", border: "1.5px dashed #d1d5db" }}>
                <p className="text-4xl mb-3">🏪</p>
                <p className="font-semibold text-gray-700">Brands coming soon</p>
                <p className="text-sm text-gray-400 mt-1">Brand registrations are still open for this bazaar.</p>
                {bazaar?.isAcceptingBrands && (
                  <Link href={`/Brandcreation/${id}`}>
                    <button className="mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:brightness-110 cursor-pointer"
                      style={{ background: "#50604A" }}>
                      Register Your Brand
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <div key={brand._id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="h-36 overflow-hidden">
                      <img src={brand.logoUrl || "/default.jpg"} alt={brand.brandName}
                        className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 bg-[#9A5F4C]">
                      <h3 className="text-sm font-semibold text-white truncate">{brand.brandName}</h3>
                      {brand.brandCategory && (
                        <p className="text-[10px] text-white/60 mt-0.5">{brand.brandCategory}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

      
          {showMap && address && (
            <section>
              <h2 className="font-extrabold text-gray-900 text-xl mb-4">📍 Location</h2>
              <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
                <div className="relative w-full" style={{ height: "250px" }}>
                  <iframe
                    title="Bazaar Location"
                    width="100%" height="100%"
                    style={{ border: 0, display: "block" }}
                    loading="lazy" allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(255,255,255,0.95)", color: "#22301D", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                    <span style={{ color: "#D4A853" }}>📍</span>
                    {address}
                  </div>
                </div>
                <div className="p-5" style={{ background: "#fafaf8" }}>
                  <p className="text-sm text-gray-600 mb-4">{address}</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition hover:brightness-110"
                    style={{ background: "#22301D", color: "#fff" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
            </section>
          )}
        </div>

      
        <div className="flex flex-col gap-6">

      
          <div className="rounded-3xl p-6 sticky top-24"
            style={{ background: "linear-gradient(135deg,#50604A,#3a4a35)", boxShadow: "0 8px 32px rgba(80,96,74,0.3)" }}>
            <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-1">Secure Your Spot</p>
            <h3 className="text-white text-xl font-extrabold mb-1">{name}</h3>
            <p className="text-white/60 text-sm mb-5">
              {startDate ? new Date(startDate).toLocaleDateString("en-EG", { weekday:"long", month:"long", day:"numeric" }) : "Date TBA"}
            </p>

       {priceData && bazaar?.type !== "HYBRID" && (
  <div className="flex items-baseline gap-1 mb-5">
    <span className="text-3xl font-extrabold text-white">
      EGP {Number(priceData.value).toLocaleString()}
    </span>
    <span className="text-white/50 text-sm">/ entry</span>
  </div>
)}

{bazaar?.type === "HYBRID" && priceData && (
  <div className="flex flex-col gap-2 mb-5 text-white">
    <div className="text-sm font-semibold">Online: EGP {priceData.value.online}</div>
    <div className="text-sm font-semibold">Offline: EGP {priceData.value.offline}</div>
    <div className="text-sm font-bold text-green-300">
      Package: EGP {priceData.value.hybrid}
    </div>
  </div>
)}

{!priceData && (
  <div className="text-2xl font-extrabold text-green-300 mb-5">
    Free Entry 🎉
  </div>
)}
            {!priceData && (
              <div className="text-2xl font-extrabold text-green-300 mb-5">Free Entry </div>
            )}

            {bazaar?.isAcceptingBrands ? (
              <Link href={`/Brandcreation/${id}`} className="block">
                <button className="w-full py-3 rounded-2xl text-sm font-bold bg-white text-[#50604A] hover:bg-white/90 transition cursor-pointer">
                  Join as a Brand
                </button>
              </Link>
            ) : (
              <button disabled
                className="w-full py-3 rounded-2xl text-sm font-bold opacity-60 cursor-not-allowed"
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                Registration Closed
              </button>
            )}

            {/* Contact */}
            {(phone || whatsapp) && (
              <div className="mt-5 pt-5 border-t border-white/20 flex flex-col gap-3">
                {phone && (
                  <a href={`tel:${phone}`}
                    className="flex items-center gap-3 text-white/80 text-sm hover:text-white transition">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.15)" }}>📞</span>
                    {phone}
                  </a>
                )}
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/80 text-sm hover:text-white transition">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.15)" }}>💬</span>
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

     
      <section className="mt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-extrabold text-gray-900 text-2xl">What Attendees Said</h2>
            <p className="text-gray-400 text-sm mt-1">Reviews from the previous edition of this bazaar</p>
          </div>
          <div className="flex items-center gap-2">
            <StarRating count={5} />
            <span className="font-bold text-gray-800 text-sm">4.9</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATIC_REVIEWS.map((review) => (
            <div key={review.id}
              className="bg-white rounded-2xl p-5 flex flex-col gap-3 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

              {/* Quote */}
              <div className="text-3xl font-serif leading-none" style={{ color: "#50604A", opacity: 0.2 }}>"</div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1 -mt-3">{review.text}</p>

              <StarRating count={review.stars} />

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: review.color }}>
                  {review.initials}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{review.name}</p>
                  <p className="text-gray-400 text-xs">{review.date}</p>
                </div>
                <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{ background: "rgba(80,96,74,0.1)", color: "#50604A" }}>✓</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
