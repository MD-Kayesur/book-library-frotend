"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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

  // Title fades out early
  const titleOpacity = useTransform(smoothScrollY, [0, 0.15], [1, 0]);
  
  // Cards split left and right to reveal the building in the center
  // The first 2 cards move exactly together to the left, the next 2 move exactly together to the right
  const card0X = useTransform(smoothScrollY, [0.15, 0.5], [0, -1200]);
  const card1X = useTransform(smoothScrollY, [0.15, 0.5], [0, -1200]);
  const card2X = useTransform(smoothScrollY, [0.15, 0.5], [0, 1200]);
  const card3X = useTransform(smoothScrollY, [0.15, 0.5], [0, 1200]);
  
  const cardTransforms = [card0X, card1X, card2X, card3X];

  // Overall section fades out so it hides completely
  const sectionOpacity = useTransform(smoothScrollY, [0.6, 0.8], [1, 0]);
  // Disable pointer events after it fades out so we can click things behind it
  const pointerEvents = useTransform(smoothScrollY, v => v > 0.6 ? "none" : "auto");

  return (
    <section ref={sectionRef} className="w-full relative h-[250vh]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div 
          style={{ opacity: sectionOpacity, pointerEvents: pointerEvents as any }} 
          className="max-w-6xl mx-auto w-full flex flex-col items-center"
        >
          <motion.h2
            style={{ opacity: titleOpacity }}
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
                style={{ x: cardTransforms[index] }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md hover:bg-black/50 transition-colors"
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
        </motion.div>
      </div>
    </section>
  );
}
