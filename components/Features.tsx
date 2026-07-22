"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, Compass, Users, Zap } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="w-8 h-8 text-indigo-400" />,
    title: "Vast Library",
    description: "Access thousands of books across all genres, from classic literature to modern bestsellers.",
  },
  {
    icon: <Compass className="w-8 h-8 text-indigo-400" />,
    title: "Personalized Discovery",
    description: "Our recommendation engine finds the perfect next read tailored just for you.",
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-400" />,
    title: "Community Driven",
    description: "Join discussions, write reviews, and connect with fellow book lovers worldwide.",
  },
  {
    icon: <Zap className="w-8 h-8 text-indigo-400" />,
    title: "Instant Access",
    description: "Borrow and read instantly from any device, anywhere, anytime.",
  },
];

export function Features() {
  return (
    <section className="w-full py-32 px-6 ">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-16 text-center drop-shadow-md"
        >
          Why Choose Our Library?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md hover:bg-black/30 transition-colors"
            >
              <div className="p-4 rounded-full bg-white/5 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
