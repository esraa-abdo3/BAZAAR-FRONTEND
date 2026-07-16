"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, MessageSquare, ImageIcon } from "lucide-react";
import AnimatedSection, { SectionHeading } from "./AnimatedSection";

const aiFeatures = [
  {
    icon: MessageSquare,
    title: "AI Sales Assistant",
    description:
      "A smart shopping assistant that understands customer intent and recommends products based on budget, style, and preferences through natural conversations.",
    status: "Available",
  },
  {
    icon: Bot,
    title: "Brand Owner AI Agent",
    description:
      "Provides intelligent recommendations for pricing, inventory management, and product performance optimization to help brands maximize sales.",
    status: "Available",
  },
  {
    icon: Sparkles,
    title: "Bazaar AI Insights",
    description:
      "Analyzes marketplace performance, identifies top-selling categories, peak shopping times, and suggests actionable improvements for growth.",
    status: "Available",
  },
  {
    icon: ImageIcon,
    title: "AI Product Description Generator",
    description:
      "Automatically generates engaging product descriptions to improve product presentation and increase conversion rates.",
    status: "Available",
  },
];

export default function AIFeatures() {
  return (
    <AnimatedSection className="w-full py-20 bg-gradient-to-br from-[#22301D] to-[#2a3426]">
      <div className="w-[90%] m-auto">
        <SectionHeading
          badge="Innovation"
          dark
          title={
            <span className="text-white">
              Powered by{" "}
              <span className="italic font-bold" style={{ color: "#A8B87A" }}>
                Smart Tools
              </span>
            </span>
          }
          subtitle="Intelligent features that help brands save time and sell more."
        />

        <div className="grid md:grid-cols-2 gap-6">
          {aiFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-[8px] bg-[#A8B87A]/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-[#A8B87A]" />
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                    feature.status === "Available"
                      ? "bg-[#DFF0D4]/20 text-[#A8B87A]"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {feature.status}
                </span>
              </div>
              <h3 className="text-white font-medium mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
