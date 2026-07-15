
"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 3;

export default function LiveBazaar({ livebazars }) {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const allBazaars = livebazars?.data ?? [];

  const totalPages = Math.ceil(allBazaars.length / PAGE_SIZE) || 1;
  const pageItems = useMemo(
    () => allBazaars.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [allBazaars, page]
  );

  const featured = pageItems[0];
  const side = pageItems.slice(1, 3);

  const remaining = Math.max(allBazaars.length - (page + 1) * PAGE_SIZE, 0);
  const showPagination = allBazaars.length > 3;

  const goPrev = () => setPage((p) => Math.max(p - 1, 0));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  if (!featured) return null;

  return (
    <section  id="live-bazaars" className="w-[95%] mx-auto px-4 sm:px-6 lg:px-10 py-10 min-h-screen scroll-mt-20">
 
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Live Bazaars
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
            Experience real-time shopping events happening right now across the globe.
          </p>
        </div>

      </div>

      <div className="flex flex-col lg:flex-row gap-4">
           {allBazaars.length === 0 ? (
            <div className="text-gray-400 text-sm">
              No other live bazaars
            </div>
        ) : (
            <>
                    <div
  onClick={() => router.push(`/Bazaarprofile/${featured._id}`)}
  className="relative cursor-pointer rounded-2xl overflow-hidden bg-gray-900 flex-shrink-0 w-full lg:w-[62%]"
  style={{ height: "580px" }}
>
  <BazaarImage src={featured.logoUrl} alt={featured.bazaarName} />

  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />


 
    <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
      Live Now
    </span>


  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
    
    {featured.address && (
      <p className="text-xs text-white/60 uppercase tracking-widest mb-1">
        {featured.address}
      </p>
    )}

    <h3 className="text-2xl font-bold mb-4">
      {featured.bazaarName}
    </h3>

    <div className="flex items-end justify-between">
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/Bazaarprofile/${featured._id}`);
        }}
        className="text-xs font-semibold bg-white/20 border border-white/40 rounded-full px-5 py-2 hover:bg-white hover:text-black transition cursor-pointer"
      >
        Enter Bazaar
      </button>

      {featured.endDate && (
        <p className="text-[11px] text-white/60">
          End at: {featured.endDate.split("T")[0]}
        </p>
      )}
    </div>
  </div>
</div>

   
        <div className="flex flex-col gap-4 flex-1">
      {side.map((bazaar) => (
            <div
              key={bazaar._id}
              onClick={() => router.push(`/Bazaarprofile/${bazaar._id}`)}
              className="relative cursor-pointer rounded-2xl overflow-hidden bg-gray-900"
              style={{ minHeight: "280px" }}
            >
              <BazaarImage src={bazaar.logoUrl} alt={bazaar.bazaarName} />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Live
              </span>

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
    


    <h3 className="text-2xl font-bold mb-4">
      {bazaar.bazaarName}
    </h3>

    <div className="flex items-end justify-between">
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/Bazaarprofile/${bazaar._id}`);
        }}
        className="text-xs font-semibold bg-white/20 border border-white/40 rounded-full px-5 py-2 hover:bg-white hover:text-black transition cursor-pointer"
      >
        Enter Bazaar
      </button>

      {bazaar.endDate && (
        <p className="text-[11px] text-white/60">
          End at: {bazaar.endDate.split("T")[0]}
        </p>
      )}
    </div>
  </div>
            </div>
          ))}

        </div>
            </>

          )}



      </div>

      {/* Pagination controls — only shown when there are more than 3 live bazaars */}
      {showPagination && (
        <div className="flex items-center justify-center gap-5 mt-8">
          <button
            onClick={goPrev}
            disabled={page === 0}
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition ${
              page === 0
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 cursor-pointer"
            }`}
          >
            <span>←</span>
            Previous
          </button>

          <p className="text-sm text-gray-500 min-w-[140px] text-center">
            {remaining > 0
              ? `${remaining} more bazaar${remaining === 1 ? "" : "s"} left`
              : "That's all for now"}
          </p>

          <button
            onClick={goNext}
            disabled={page >= totalPages - 1}
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition ${
              page >= totalPages - 1
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 cursor-pointer"
            }`}
          >
            Next
            <span>→</span>
          </button>
        </div>
      )}
    </section>
  );
}


function BazaarImage({ src, alt }) {
  const fallback =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23374151'/%3E%3C/svg%3E";

  return (
    <img
      src={src || fallback}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
    />
  );
}