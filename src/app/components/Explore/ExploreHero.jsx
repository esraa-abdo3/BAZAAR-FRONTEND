"use client";

import { motion } from "framer-motion";

export default function ExploreHero() {
  const scrollToSection = () => {
    const el = document.getElementById("explore-live-bazaars");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>
    
      <img
        src="/exploresection.jpg"
        alt="Bazaar marketplace"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "/Hero Section.png";
        }}
      />

   
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

     
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(80,96,74,0.28) 0%, transparent 70%)",
        }}
      />

   
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-16"
        style={{ minHeight: "92vh" }}>

     
        <motion.span
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-full mb-6 border border-white/20"
          style={{ background: "rgba(80,96,74,0.45)", color: "#c8dbb8", backdropFilter: "blur(8px)" , margin:"20px 0" }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live Bazaars Happening Now
        </motion.span>

     
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="text-white font-extrabold leading-tight mb-6"
          style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)", maxWidth: "820px" }}
        >
          Discover Amazing{" "}
          <span
            style={{
              background: "linear-gradient(90deg,#a8d08d,#50604A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bazaars
          </span>{" "}
          &amp; Exclusive Deals
        </motion.h1>

 
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22 }}
          className="text-white/70 leading-relaxed mb-10"
          style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: "560px" }}
        >
          Explore live events, upcoming bazaars, and top trending products —
          all in one premium marketplace experience.
        </motion.p>

     
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={scrollToSection}
            className="px-8 py-4 rounded-xl text-white font-semibold text-base cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg,#50604A,#3a4a35)",
              boxShadow: "0 8px 28px rgba(80,96,74,0.55)",
            }}
          >
            Explore Now →
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("explore-products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              backdropFilter: "blur(8px)",
            }}
          >
            View Top Products
          </button>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="flex gap-10 mt-16 flex-wrap justify-center"
        >
          {[
            { label: "Live Bazaars", value: "50+" },
            { label: "Registered Brands", value: "300+" },
            { label: "Happy Shoppers", value: "12K+" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-white font-bold text-3xl">{s.value}</p>
              <p className="text-white/55 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

    
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full" style={{ height: "60px" }}>
          <path d="M0,30 C300,60 900,0 1200,30 L1200,60 L0,60 Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  );
}
