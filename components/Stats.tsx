"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Library, Star } from "lucide-react";

const stats = [
  { label: "Active Readers", value: "50k+", icon: <Users className="w-8 h-8 text-indigo-400" /> },
  { label: "Books Available", value: "120k+", icon: <BookOpen className="w-8 h-8 text-rose-400" /> },
  { label: "Partner Libraries", value: "350+", icon: <Library className="w-8 h-8 text-emerald-400" /> },
  { label: "Average Rating", value: "4.9", icon: <Star className="w-8 h-8 text-amber-400" /> },
];

export function Stats() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="w-full py-24 px-6 bg-black/20 backdrop-blur-sm border-y border-white/5 relative z-10" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-inner">
                {stat.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
                  {stat.value}
                </h4>
                <p className="text-sm md:text-base font-medium text-zinc-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
