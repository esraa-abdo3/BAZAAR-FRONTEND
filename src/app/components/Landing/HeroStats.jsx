"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Active Bazaars", key: "bazaars" },
  { label: "Local Brands", key: "brands" },
  { label: "Happy Customers", key: "customers" },
  { label: "Products Sold", key: "products" },
];

export default function HeroStats({ counts = {} }) {
  const values = {
    bazaars: counts.bazaars ?? 24,
    brands: counts.brands ?? 180,
    customers: counts.customers ?? "2.5K+",
    products: counts.products ?? "12K+",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute bottom-6 right-6 left-6 md:left-auto md:w-auto z-10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-[8px] px-4 py-3 text-center"
          >
            <p className="text-white text-xl md:text-2xl font-light">
              {values[stat.key]}
            </p>
            <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
