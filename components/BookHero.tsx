"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { Book } from "@/lib/types/booksdata.type";

export function BookHero({ book }: { book: Book }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let targetTime = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollHeight = rect.height - window.innerHeight;
      if (scrollHeight <= 0) return;

      // Calculate scroll progress (0 to 1) inside container
      const progress = Math.max(0, Math.min(1, -rect.top / scrollHeight));

      if (video.duration) {
        targetTime = progress * video.duration;
      }
    };

    const updateVideoTime = () => {
      if (video && video.duration && !video.seeking) {
        // Smoothly interpolate the current time towards target time
        const diff = targetTime - video.currentTime;
        if (Math.abs(diff) > 0.01) {
          video.currentTime += diff * 0.25;
        }
      }
      animationFrameId = requestAnimationFrame(updateVideoTime);
    };

    window.addEventListener("scroll", handleScroll);
    animationFrameId = requestAnimationFrame(updateVideoTime);

    // Initial check when metadata loads
    const onLoadedMetadata = () => {
      handleScroll();
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  if (!book.video) return null;

  return (
    <div ref={containerRef} className="relative w-full h-[200vh] bg-zinc-950">
      {/* Sticky Frame */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          ref={videoRef}
          src={book.video}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Ambient Overlays */}
        <div className="absolute inset-0 bg-zinc-950/65 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Content Wrapper */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 md:px-12 text-center h-[70vh] flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
              {book.title}
            </h1>
            <p className="text-xl md:text-3xl font-light text-zinc-300">
              by {book.author}
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Scroll to explore details
          </span>
          <div className="w-[24px] h-[40px] rounded-full border-2 border-zinc-500 flex justify-center p-1.5">
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-white/70"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
