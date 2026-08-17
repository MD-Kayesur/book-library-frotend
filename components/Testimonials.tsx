"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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
  const sectionRef = React.useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  // Title fades out very fast as we start scrolling
  const titleOpacity = useTransform(smoothScrollY, [0, 0.15], [1, 0]);

  // Left card moves left, right moves right, middle zooms and vanishes rapidly
  const leftX = useTransform(smoothScrollY, [0, 0.3], [0, -1500]);
  const rightX = useTransform(smoothScrollY, [0, 0.3], [0, 1500]);
  const middleScale = useTransform(smoothScrollY, [0, 0.3], [1, 4]);
  const middleOpacity = useTransform(smoothScrollY, [0, 0.15], [1, 0]);
  const sideOpacity = useTransform(smoothScrollY, [0, 0.2], [1, 0]);

  return (
    <section ref={sectionRef} className="w-full h-[200vh] relative">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col items-center w-full pointer-events-auto">
          <motion.h2
            style={{ opacity: titleOpacity }}
            className="text-4xl md:text-5xl font-bold text-white mb-16 text-center drop-shadow-md"
          >
            Loved by Readers
          </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {testimonials.map((testimonial, index) => {
            let x: any = 0;
            let scale: any = 1;
            let opacity: any = sideOpacity;
            
            if (index === 0) {
              x = leftX;
            } else if (index === 1) {
              scale = middleScale;
              opacity = middleOpacity;
            } else if (index === 2) {
              x = rightX;
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                style={{ x, scale, opacity: opacity }}
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
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
