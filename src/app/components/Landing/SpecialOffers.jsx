"use client";

import { motion } from "framer-motion";
import { Clock, Star, Zap, Layers } from "lucide-react";
import AnimatedSection, { SectionHeading } from "./AnimatedSection";

const offers = [
  {
    icon: Clock,
    badge: "New Bazaar",
    title: "First Bazaar Launch Discount",
    price: "20% OFF",
    description:
      "New bazaar organizers receive a special discount on their first bazaar setup and management fees.",
    highlight: true,
  },
{
  icon: Star,
  badge: "New Brand",
  title: "First Bazaar Participation",
  price: "20% OFF",
  description:
    "Brands joining a bazaar for the first time receive a 20% discount on their first participation fee.",
  highlight: false,
},
  {
    icon: Layers,
    badge: "Loyalty Reward",
    title: "Multi-Bazaar Discounts",
    price: "Save 15%",
    description:
      "Brands that participate in multiple bazaars receive exclusive discounts on future registrations.",
    highlight: false,
  },
  {
    icon: Zap,
    badge: "Performance Bonus",
    title: "Target Achievement Cashback",
    price: "Cashback",
    description:
      "Brands that achieve sales or engagement targets earn cashback rewards and promotional benefits.",
    highlight: false,
  },
];

export default function SpecialOffers() {
  return (
    <AnimatedSection className="w-[90%] m-auto py-20">
      <SectionHeading
        badge="Offers"
        title="Grow With Us"
        subtitle="Exclusive launch offers to help you get started and scale on BazaaRna."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((offer, i) => (
          <motion.div
            key={offer.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className={`relative p-6 rounded-2xl border transition-all duration-300 ${
              offer.highlight
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-white border-stone-200 hover:shadow-lg hover:shadow-primary/5"
            }`}
          >
            <span
              className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full mb-4 ${
                offer.highlight
                  ? "bg-white/20 text-white"
                  : "bg-accent/10 text-accent"
              }`}
            >
              {offer.badge}
            </span>
            <div
              className={`w-10 h-10 rounded-[8px] flex items-center justify-center mb-4 ${
                offer.highlight ? "bg-white/15" : "bg-[#DFF0D4]"
              }`}
            >
              <offer.icon
                className={`w-5 h-5 ${offer.highlight ? "text-white" : "text-primary"}`}
              />
            </div>
            <h3
              className={`font-medium mb-2 text-sm leading-snug ${
                offer.highlight ? "text-white" : "text-background"
              }`}
            >
              {offer.title}
            </h3>
            <p
              className={`text-2xl font-light mb-3 ${
                offer.highlight ? "text-[#A8B87A]" : "text-primary"
              }`}
            >
              {offer.price}
            </p>
            <p
              className={`text-xs leading-relaxed ${
                offer.highlight ? "text-white/70" : "text-gray-500"
              }`}
            >
              {offer.description}
            </p>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}
