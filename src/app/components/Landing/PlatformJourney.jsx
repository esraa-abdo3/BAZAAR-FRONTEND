"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedSection, { SectionHeading } from "./AnimatedSection";

const journeys = [
  {
    title: "Bazaar Owner Journey",
    color: "#50604A",
    steps: [
      "Register",
      "Create Bazaar",
      "Subscribe",
      "Invite Brands",
      "Track Performance",
    ],
  },
  {
    title: "Brand Journey",
    color: "#9A5F4C",
    steps: [
      "Join Bazaar",
      "Subscribe",
      "Add Products",
      "Receive Orders",
      "Grow Sales",
    ],
  },
  {
    title: "Customer Journey",
    color: "#A8B87A",
    steps: [
      "Explore",
      "Discover Brands",
      "Shop",
      "Support Local Businesses",
    ],
  },
];

export default function PlatformJourney() {
  return (
    <AnimatedSection className="w-full py-20 bg-white">
      <div className="w-[90%] m-auto">
        <SectionHeading
          badge="Platform Journey"
          title="Your Path to Success"
          subtitle="Simple, guided journeys for every role in the BazaaRna ecosystem."
        />

        <div className="space-y-12 justify-center m-auto">
          {journeys.map((journey, ji) => (
            <motion.div
              key={journey.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: ji * 0.1 }}
            >
              <h3
                className="text-lg font-medium mb-6 text-center"
                style={{ color: journey.color }}
              >
                {journey.title}
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-3">
                {journey.steps.map((step, si) => (
                  <div key={step} className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-5 py-3 rounded-[8px] border border-stone-200 bg-zinc-50 text-sm font-medium text-background hover:border-primary/30 hover:bg-[#DFF0D4]/30 transition-all duration-300"
                    >
                      <span
                        className="inline-block w-6 h-6 rounded-full text-white text-xs leading-6 text-center mr-2"
                        style={{ backgroundColor: journey.color }}
                      >
                        {si + 1}
                      </span>
                      {step}
                    </motion.div>
                    {si < journey.steps.length - 1 && (
                      <ArrowRight
                        className="w-4 h-4 text-gray-300 hidden sm:block shrink-0"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
