"use client";

import { motion } from "framer-motion";

export default function AnimatedSection({
  children,
  className = "",
  id,
  delay = 0,
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeading({ badge, title, subtitle, align = "center", dark = false }) {
  const alignClass =
    align === "center"
      ? "text-center mx-auto"
      : align === "left"
        ? "text-left"
        : "text-right";

  return (
    <div className={`max-w-2xl mb-12 ${alignClass}`}>
      {badge && (
        <span className={`inline-block text-[14px] tracking-[0.2em] uppercase rounded-full px-3 py-1 mb-4 ${
          dark
            ? "text-[#A8B87A] border border-[#A8B87A]/30 bg-white/5"
            : "text-white border border-primary/20 bg-primary"
        }`}>
          {badge}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl font-medium leading-tight [&_span]:inherit ${
        dark ? "text-white [&_span]:text-white" : "text-background [&_span]:text-background"
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-sm md:text-base leading-relaxed ${
          dark ? "text-white/60" : "text-gray-500"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
