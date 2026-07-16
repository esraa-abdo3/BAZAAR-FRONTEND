"use client";

import Upcomingbazaar from "@/app/components/upcomingbazaar/Upcomingbazaar";

export default function ExploreUpcoming({ upcoming }) {
  const count = upcoming?.data?.length ?? 0;

  return (
    <section
      id="explore-upcoming"
      className="w-full px-4 sm:px-6 lg:px-10 py-12 scroll-mt-20"
      style={{ background: "linear-gradient(180deg,#f9fafb 0%,#eef2eb 100%)" }}
    >
      <div className="max-w-6xl mx-auto mb-2">
        <div className="flex items-center gap-3 mb-1">
          <span
            className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
            style={{ background: "rgba(80,96,74,0.12)", color: "#50604A" }}
          >
             Coming Soon
          </span>
          {count > 0 && (
            <span className="text-sm text-gray-400 font-medium">
              {count} upcoming event{count !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
          Upcoming Bazaars
        </h2>
        <p className="text-gray-500 mt-2 max-w-xl">
          Register early to secure your spot at the next exciting bazaar near you.
        </p>
      </div>

     
      <div className="max-w-6xl mx-auto">
        <Upcomingbazaar upcoming={upcoming} />
      </div>
    </section>
  );
}
