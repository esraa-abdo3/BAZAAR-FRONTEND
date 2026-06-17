"use client";

import { motion } from "framer-motion";
import { Heart, Eye, Sparkles } from "lucide-react";
import AnimatedSection, { SectionHeading } from "./AnimatedSection";

const values = [
  {
    icon: Heart,
    title: "Community First",
    text: "We celebrate local makers and the communities that support them.",
  },
  {
    icon: Eye,
    title: "Visibility That Lasts",
    text: "Digital presence that continues long after the physical event ends.",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    text: "An elegant marketplace designed for discovery and delight.",
  },
];

export default function WhoAreWe() {
  return (
    <AnimatedSection
      id="who-we-are"
      className="w-[90%] m-auto py-20 scroll-mt-24"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-2xl overflow-hidden " style={{backgroundImage: 'url("/digit bazaars.jpg")'}}>
       
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-[#A8B87A]/20 -z-10" />
        </motion.div>

        <div>
          <SectionHeading
            badge="Who Are We?"
            title="Extending the Life of Every Bazaar"
            subtitle="Traditional bazaars create incredible opportunities for local brands, but they're often limited by time and location. Once the event ends, so does the visibility.
            At BazaaRna, we're changing that.
        We preserve the excitement and uniqueness of every bazaar while giving it a digital extension that continues beyond the event itself. Bazaar owners can host their bazaars online, local brands can participate in multiple bazaars at the same time, and customers can keep discovering and supporting their favorite brands whenever they want.
             Because great brands deserve more than just a weekend to shine.."
            align="left"
          />

          <div className="space-y-4 mb-8">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-[8px] bg-accent flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-background">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-stone-200 bg-white"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent cursor-default">
                Mission
              </span>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed cursor-default">
     To empower bazaar owners and local brands with a platform that extends the impact of every bazaar, increases visibility, and creates new opportunities for sustainable growth.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-stone-200 bg-white cursor-default"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent cursor-default">
                Vision
              </span>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed cursor-default">
             To become the leading multi-bazaar platform where local brands can thrive beyond geographical and time limitations, connecting with more communities and customers than ever before.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
