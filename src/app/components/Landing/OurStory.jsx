"use client";

import { motion } from "framer-motion";
import AnimatedSection, { SectionHeading } from "./AnimatedSection";

const timeline = [
  {
    year: "The Challenge",
    title: "Traditional bazaars had limited reach",
    text: "Weekend events in physical locations meant brands could only connect with customers for a brief window.",
  },
  {
    year: "The Struggle",
    title: "Local brands struggled to sustain visibility",
    text: "After the bazaar ended, momentum faded — leaving talented makers without a lasting digital presence.",
  },
  {
    year: "The Idea",
    title: "We imagined a digital alternative",
    text: "What if bazaars could live online, giving local brands a permanent home to grow and thrive?",
  },
  {
    year: "The Birth",
    title: "BazaaRna was born",
    text: "A platform built to bridge offline charm with online convenience — for owners, brands, and shoppers.",
  },
  {
    year: "The Future",
    title: "Building the future of online bazaars",
    text: "Today, we're creating a multi-bazaar ecosystem where local commerce flourishes year-round.",
  },
];

export default function OurStory() {
  return (
    <AnimatedSection className="w-[90%] m-auto py-20">
      <SectionHeading
        badge="Our Journey"
        title="How It All Started"
        subtitle="From a simple observation to a platform transforming local commerce."
      />

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary to-primary/20 md:-translate-x-px" />

        {timeline.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`relative flex items-start gap-6 mb-10 ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <div className="hidden md:block md:w-1/2" />

            <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary border-4 border-zinc-50 -translate-x-1/2 mt-2 z-10" />

            <div
              className={`ml-10 md:ml-0 md:w-1/2 ${
                i % 2 === 0 ? "md:pr-10 md:text-right" : "md:pl-10"
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent">
                {item.year}
              </span>
              <h3 className="text-lg font-medium text-background mt-1 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}
