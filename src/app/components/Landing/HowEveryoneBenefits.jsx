"use client";

import { motion } from "framer-motion";
import { Crown, ShoppingBag, HeartHandshake } from "lucide-react";
import AnimatedSection, { SectionHeading } from "./AnimatedSection";

const personas = [
  {
    icon: Crown,
    role: "Bazaar Owners",
    color: "#50604A",
    benefits: [
      "Create online bazaars effortlessly",
      "Invite brands to your marketplace",
      "Track sales performance in real time",
      "Discover top-performing brands",
      "Access powerful analytics dashboards",
    ],
  },
  {
    icon: ShoppingBag,
    role: "Local Brands",
    color: "#9A5F4C",
    benefits: [
      "Join multiple bazaars at once",
      "Showcase products professionally",
      "Increase visibility to new audiences",
      "Manage orders and stock easily",
      "Grow revenue sustainably",
    ],
  },
  {
    icon: HeartHandshake,
    role: "Customers",
    color: "#A8B87A",
    benefits: [
      "Discover unique local products",
      "Shop anytime, from anywhere",
      "Explore upcoming bazaars",
      "Support local businesses",
      "Enjoy a seamless shopping experience",
    ],
  },
];

export default function HowEveryoneBenefits() {
  return (
    <AnimatedSection className="w-full py-20 bg-gradient-to-b from-zinc-50 to-white">
      <div className="w-[90%] m-auto">
        <SectionHeading
          badge="For Everyone"
          title="How Everyone Benefits"
          subtitle="A multi-bazaar ecosystem designed for bazaar owners, local brands, and shoppers alike."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {personas.map((persona, i) => (
            <motion.div
              key={persona.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${persona.color}15` }}
              >
                <persona.icon
                  className="w-7 h-7"
                  style={{ color: persona.color }}
                />
              </div>
              <h3 className="text-xl font-medium text-background mb-4">
                {persona.role}
              </h3>
              <ul className="space-y-3">
                {persona.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-gray-500"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: persona.color }}
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: persona.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
