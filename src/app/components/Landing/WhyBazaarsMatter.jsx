"use client";

import { motion } from "framer-motion";
import { Store, Rocket, Users,Gem, TrendingUp,} from "lucide-react";
import AnimatedSection, { SectionHeading } from "./AnimatedSection";

const reasons = [
  {
    icon: Store,
    title: "Empower Local Businesses",
    text: "Give small brands a platform to showcase their craft and grow sustainably.",
  },
  {
    icon: Rocket,
    title: "Support Entrepreneurship",
    text: "Lower barriers for new brands to enter the market and build their audience.",
  },
  {
    icon: Users,
    title: "Create Communities",
    text: "Bring together shoppers, sellers, and bazaar owners in vibrant digital spaces.",
  },
  {
    icon: Gem,
    title: "Discover Unique Products",
    text: "Help customers find one-of-a-kind items they won't see in mainstream stores.",
  },
  {
    icon: TrendingUp,
    title: "Sustainable Growth",
    text: "Enable small brands to build lasting revenue beyond weekend events.",
  },
];

export default function WhyBazaarsMatter() {
  return (
    <AnimatedSection className="w-full py-20 bg-white">
      <div className="w-[90%] m-auto">
        <SectionHeading
          badge="Our Purpose"
          title="Why Bazaars Matter"
          subtitle="Bazaars are more than markets — they are cultural hubs where creativity, commerce, and community come alive."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl border border-stone-100 bg-zinc-50 hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-[8px] bg-accent group-hover:bg-primary transition-colors duration-300 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-medium text-background mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
