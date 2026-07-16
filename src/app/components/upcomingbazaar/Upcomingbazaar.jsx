"use client";

import Link from "next/link";

export default function Upcomingbazaar({ upcoming }) {
  const bazaars = upcoming?.data || [];

  const getDaysLeft = (startDate) => {
  const now = new Date();
  const start = new Date(startDate);

  const diff = start - now;

  if (diff <= 0) {
    return "Started";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return `${days} DAYS LEFT`;
};

  return (
    <section id="upcoming-bazaars" className=" w-[100%] lg:w-[100%] py-10">


      <div className="relative">
      <div className="flex gap-4 overflow-x-auto scroll-smooth custom-scrollbar px-4 py-5">
          {bazaars.map((item, idx) => (
            <div
              key={idx}
              className="w-[220px] lg:w-[300px] bg-white rounded-2xl shadow-md overflow-hidden flex-shrink-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
           
              <div className=" h-[180px] lg:h-[260px] w-full overflow-hidden relative">
                <img
                  src={item.logoUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Days left badge */}
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: "rgba(80,96,74,0.85)", backdropFilter: "blur(4px)" }}>
                  {getDaysLeft(item.startDate)}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 line-clamp-1">{item.title || item.bazaarName}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {item.bazaarDescription}
                </p>

                {/* Action buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  {item.isAcceptingBrands && (
                    <Link href={`/Brandcreation/${item._id}`}>
                      <button className="w-full bg-[#50604a] text-white py-2 rounded-lg hover:scale-[.98] transition-all duration-300 cursor-pointer text-sm font-semibold">
                        Join now
                      </button>
                    </Link>
                  )}

                  <Link href={`/upcoming/${item._id}`}>
                    <button className="w-full border-2 border-[#50604a] text-[#50604a] py-2 rounded-lg hover:bg-[#50604a] hover:text-white transition-all duration-300 cursor-pointer text-sm font-semibold">
                      More Details →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
}