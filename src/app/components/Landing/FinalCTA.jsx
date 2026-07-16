"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="relative w-[90%] m-auto my-10 overflow-hidden font-sans rounded-[8px] min-h-[400px]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2418] via-[#2c3828] to-[#50604A]" />
        <img
          src="/Hero Section.png"
          alt=""
          className="w-full h-full object-cover mix-blend-overlay opacity-40"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center text-center py-20 px-6 md:px-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-white text-3xl md:text-5xl font-light leading-tight mb-6 max-w-2xl"
        >
          Your Bazaar Deserves More Than{" "}
          <span className="font-bold italic" style={{ color: "#A8B87A" }}>
            Two Days.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-white/70 text-sm md:text-base max-w-lg mb-10 leading-relaxed"
        >
          Bring your community online, empower local brands, and create
          experiences that last.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <Link href="/Bazaarcreation">
            <button
              className="px-8 py-3 rounded-[8px] text-white text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-[.98] cursor-pointer"
              style={{ background: "rgba(90, 100, 70, 0.55)" }}
            >
              Start Your Bazaar Today
            </button>
          </Link>
          <Link href="/#live-bazaars">
            <button className="px-8 py-3 rounded-[8px] text-gray-900 text-sm font-medium bg-white transition-all duration-300 hover:bg-white/90 hover:scale-[.98] cursor-pointer">
              Explore Live Bazaars
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
