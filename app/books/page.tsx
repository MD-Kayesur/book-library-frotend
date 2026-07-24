"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PopularBooks } from "@/components/PopularBooks";

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Video Hero Header */}
      <div className="relative w-full h-[calc(100vh-64px)] min-h-[400px] flex items-center justify-center overflow-hidden border-b border-zinc-200/50 dark:border-white/10 shadow-lg">
          <video 
            src="/Create_a_highly_realistic_cine%20(1).mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10" />
          
          <div className="relative z-20 text-center space-y-4 px-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg"
            >
              Explore Library Catalog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-zinc-200 max-w-2xl mx-auto drop-shadow-md font-medium"
            >
              Search and discover your next favorite book from our curated collection.
            </motion.p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto space-y-12 px-4 sm:px-6 lg:px-8 py-12 w-full">
          {/* Popular Books Slider */}
        <div className="w-full">
          <PopularBooks />
        </div>
      </div>
    </div>
  );
}
