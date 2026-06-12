
"use client";

import { useEffect, useState } from "react";
import { useParams ,useRouter} from "next/navigation";


const STEP = 4;

export default function Bzaarprofile() {
    const { id } = useParams();
      const router = useRouter();
  const [data, setData] = useState([]);
  const [bazaardata, setbazzardata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(STEP);

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

  const brandsToShow = data.slice(0, visible);
  const hasMore = visible < data.length;

  return (
    <div className=" w-[95%] lg:w-[85%] mx-auto px-4 py-6 pb-12">

      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{ aspectRatio: "21/9", minHeight: "200px" }}
      >
        <img
          src={bazaardata?.logoUrl || "/default.jpg"}
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
            <>
              <h1 className="text-lg sm:text-2xl font-semibold text-white leading-tight">
                {bazaardata?.bazaarName || "Bazaar Event"}
              </h1>

              {/* {bazaardata?.bazaarDescription && (
                <p className="text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed line-clamp-2">
                  {bazaardata.bazaarDescription}
                </p>
              )} */}

        
            </>
          )}
        </div>
      </div>


      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base sm:text-lg text-[#22301D]">
            Explore our brands and enjoy exclusive offers
          </h2>
          {!loading && (
            <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
              {data.length} brands
            </span>
          )}
        </div>

       
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-[180px] sm:h-[300px] bg-gray-200  w-full " />
                <div className="p-3 bg-gray-100 flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
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
                    <h3 className="text-sm font-semibold text-white leading-tight truncate pr-2">
                      {brand.brandName || "Unknown Brand"}
                    </h3>
                    <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
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
                  <span>Show More brands</span>
                  <span>▾</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
