"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, Rocket, Heart, Cpu, Ghost } from "lucide-react";

const genres = [
  { name: "Fiction", icon: <Sparkles className="w-6 h-6 text-purple-400" />, color: "bg-purple-500/10 border-purple-500/20" },
  { name: "Sci-Fi", icon: <Rocket className="w-6 h-6 text-blue-400" />, color: "bg-blue-500/10 border-blue-500/20" },
  { name: "Romance", icon: <Heart className="w-6 h-6 text-pink-400" />, color: "bg-pink-500/10 border-pink-500/20" },
  { name: "Mystery", icon: <Ghost className="w-6 h-6 text-zinc-400" />, color: "bg-zinc-500/10 border-zinc-500/20" },
  { name: "Technology", icon: <Cpu className="w-6 h-6 text-emerald-400" />, color: "bg-emerald-500/10 border-emerald-500/20" },
  { name: "Adventure", icon: <Compass className="w-6 h-6 text-amber-400" />, color: "bg-amber-500/10 border-amber-500/20" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function Genres() {
  return (
    <section className="w-full py-24 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            Explore by Genre
          </h2>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Dive into worlds unknown. Whatever you&apos;re in the mood for, we&apos;ve got you covered.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full"
        >
          {genres.map((genre, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border backdrop-blur-md cursor-pointer transition-all ${genre.color} hover:bg-white/10`}
            >
              <div className="mb-4">
                {genre.icon}
              </div>
              <h3 className="text-lg font-semibold text-white tracking-wide">{genre.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
