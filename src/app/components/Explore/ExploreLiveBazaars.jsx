"use client";

import Livebazaar from "@/app/components/LiveBazar/livebazar";

export default function ExploreLiveBazaars({ livebazars }) {
  const count = livebazars?.data?.length ?? 0;

  return (
    <section
      id="explore-live-bazaars"
      className="w-full px-4 sm:px-6 lg:px-10 py-16 scroll-mt-20"
      style={{ background: "#f9fafb" }}
    >
      <div className="max-w-7xl mx-auto">
        <Livebazaar livebazars={livebazars} />
      </div>
    </section>
  );
}
