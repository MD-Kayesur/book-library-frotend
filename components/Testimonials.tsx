"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Avid Reader",
    content: "This platform has completely changed how I consume books. The interface is stunning and the recommendations are always spot on.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Literature Student",
    content: "An invaluable resource for my studies. The vast collection means I can always find the obscure texts I need for my research.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Book Club Host",
    content: "We use this for our monthly book club. The seamless borrowing experience means everyone is always ready for our meetings.",
    rating: 4
  }
];

export function Testimonials() {
  return (
    <section className="w-full py-32 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-16 text-center drop-shadow-md"
        >
          Loved by Readers
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col p-8 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                <Star className="w-32 h-32 text-white" />
              </div>
              <div className="flex space-x-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? "fill-indigo-500 text-indigo-500" : "text-zinc-600"}`} 
                  />
                ))}
              </div>
              <p className="text-lg text-zinc-200 mb-8 flex-grow relative z-10 leading-relaxed italic">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="relative z-10">
                <h4 className="text-white font-semibold">{testimonial.name}</h4>
                <span className="text-indigo-400 text-sm">{testimonial.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
