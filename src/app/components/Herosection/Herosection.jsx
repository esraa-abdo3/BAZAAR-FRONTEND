"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroStats from "../Landing/HeroStats";

export default function HeroSection({ stats = {} }) {
  return (
    <section className="relative w-[90%] m-auto my-2 h-screen min-h-[680px] overflow-hidden font-sans rounded-[8px] mt-20">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2418] via-[#2c3828] to-[#50604A]" />
        <img
          src="/Hero Section.png"
          alt="BazaaRna marketplace"
          className="w-full h-full object-cover mix-blend-overlay opacity-60"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      <div className="absolute bottom-28 md:bottom-32 left-6 z-10">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#4C5B45] text-[10px] tracking-[0.2em] uppercase border border-white/30 rounded-full px-3 py-1 bg-[#DFF0D4] cursor-default"
        >
          The Future of Commerce
        </motion.span>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6 md:px-16 max-w-4xl mx-auto pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-white text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6"
        >
          The Future of Local{" "}
          <span className="font-bold italic" style={{ color: "#A8B87A" }}>
            Bazaars
          </span>{" "}
          Starts Here.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-white/70 text-sm md:text-base max-w-xl mb-8 leading-relaxed"
        >
          Connecting Bazaar Owners, Local Brands, and Shoppers through one
          seamless online experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <Link href="/#live-bazaars">
            <button
              className="px-6 py-3 rounded-[8px] text-white text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-[.98] cursor-pointer"
              style={{ background: "rgba(90, 100, 70, 0.55)" }}
            >
              Explore Bazaars
            </button>
          </Link>
          <Link href="/Bazaarcreation">
            <button className="px-6 py-3 rounded-[8px] text-gray-900 text-sm font-medium bg-white transition-all duration-300 hover:bg-white/90 hover:scale-[.98] cursor-pointer">
              Start Your Bazaar
            </button>
          </Link>
        </motion.div>
      </div>

      <HeroStats counts={stats} />
    </section>
  );
}
