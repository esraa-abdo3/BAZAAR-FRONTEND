"use client";

import { useRouter } from "next/navigation";

export default function JoinUsCTA() {
  const router = useRouter();

  return (
    <section className="w-full bg-[#f8f7f4] py-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto rounded-[32px] bg-white shadow-2xl border border-gray-100 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-10 items-center p-8 lg:p-16">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#50604A]/10 text-[#50604A] text-sm font-semibold">
              ✨ Bazaar Owner Program
            </span>

            <h2 className="text-4xl lg:text-5xl font-extrabold mt-6 text-gray-900 leading-tight">
              Build Your Own
              <span className="text-[#50604A]"> Bazaar</span>
            </h2>

            <p className="mt-6 text-gray-600 leading-8">
              Launch a modern marketplace, manage vendors, track orders,
              monitor revenue, and grow your community from one powerful dashboard.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => router.push("/Bazaarcreation")}
                className="bg-[#50604A] hover:bg-[#44523f] text-white px-7 py-4 rounded-xl font-semibold transition"
              >
                Create Your Bazaar
              </button>

              <button
                onClick={() => router.push("/")}
                className="text-[#50604A] font-semibold"
              >
                Learn More →
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-10">
              {
            [
  ["🛍️", "Reach More Shoppers"],
  ["🤖", "AI-Powered Insights"],
  ["📈", "Grow Your Sales"],
]
              .map(([i,t])=>(
                <div key={t} className="rounded-2xl bg-[#f8f7f4] p-4">
                  <div className="text-2xl">{i}</div>
                  <p className="font-semibold mt-2">{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[400px]">
            <div className="width-[100%] left-0 absolute inset-8 rounded-3xl bg-[#50604A] p-6 text-white shadow-2xl">
              <div className="flex justify-between">
                <h3 className="font-bold">Bazaar Dashboard</h3>
                <span>⚙️</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  ["Revenue","$28.4K"],
                  ["Orders","1,286"],
                  ["Vendors","64"],
                  ["Visitors","18.2K"],
                ].map(([t,v])=>(
                  <div key={t} className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                    <p className="text-white/70 text-sm">{t}</p>
                    <h4 className="text-2xl font-bold mt-2">{v}</h4>
                  </div>
                ))}
              </div>

   
            </div>

           

    
          </div>
        </div>
      </div>
    </section>
  );
}
