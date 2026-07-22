"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DUMMY_BOOKS } from "@/lib/dummy-data";
import { motion, AnimatePresence } from "framer-motion";

export function Hero({ children }: { children?: React.ReactNode }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeBookIndex, setActiveBookIndex] = React.useState(0);

  React.useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let targetTime = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) based on the entire document height
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScrollY <= 0) return;

      const progress = Math.max(0, Math.min(1, window.scrollY / maxScrollY));

      // Calculate active book index based on progress
      const totalBooks = DUMMY_BOOKS.length;
      const index = Math.min(
        totalBooks - 1,
        Math.floor(progress * totalBooks),
      );
      setActiveBookIndex(index);

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

  const book = DUMMY_BOOKS[activeBookIndex];

  return (
    <div ref={containerRef} className="relative w-full min-h-[300vh] bg-transparent">
      {/* Fixed Background Video spanning the entire page */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
        {/* Background Video */}
        <video
          ref={videoRef}
          src="/video_2026-07-21_17-48-55.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Ambient Overlays for readability of sections above */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10 pointer-events-none" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-20 w-full flex flex-col">
        {/* Hero Top Section (First Viewport) */}
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 text-center h-screen flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBookIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center space-y-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold border border-indigo-500/30 backdrop-blur-md">
                Featured Book {activeBookIndex + 1} of {DUMMY_BOOKS.length}
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
                {book.title}
              </h1>
              <p className="text-xl md:text-3xl font-light text-zinc-300">
                by {book.author}
              </p>
              <p className="text-lg md:text-xl text-zinc-200 max-w-3xl line-clamp-3 mt-4 leading-relaxed drop-shadow-sm">
                {book.description}
              </p>
              <div className="flex gap-4 pt-8">
                <Button
                  size="lg"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 h-12 px-8 text-base shadow-lg shadow-indigo-600/25"
                >
                  Borrow Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10 h-12 px-8 text-base backdrop-blur-sm"
                >
                  Read Summary
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Children Sections (Popular Books, Search, etc.) */}
        <div className="w-full relative z-30">
          {children}
        </div>
      </div>
    </div>
  );
}
