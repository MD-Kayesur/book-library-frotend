"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DUMMY_BOOKS } from "@/lib/dummy-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  return (
    <section className="w-full relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {DUMMY_BOOKS.map((book) => (
            <CarouselItem key={book.id}>
              <div className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-neutral-900 overflow-hidden">
                {/* Premium Ambient Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none z-10" />
                <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-[80px] pointer-events-none z-10" />

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="relative z-20 w-full max-w-5xl mx-auto px-6 md:px-12 text-center flex flex-col items-center space-y-6"
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-md border border-white/20"
                  >
                    Featured Book
                  </motion.span>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-md">
                    {book.title}
                  </h1>
                  <p className="text-xl md:text-3xl font-light text-zinc-300 drop-shadow-sm">
                    by {book.author}
                  </p>
                  <p className="text-lg md:text-xl text-zinc-200 max-w-3xl line-clamp-3 mt-4 drop-shadow-sm">
                    {book.description}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex gap-4 pt-8"
                  >
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-zinc-200 h-12 px-8 text-base"
                    >
                      Borrow Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-white border-white/30 hover:bg-white/20 h-12 px-8 text-base backdrop-blur-sm"
                    >
                      Read Summary
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-8 h-12 w-12 border-white/20 text-white hover:bg-white/20 hover:text-white bg-black/20 backdrop-blur-md" />
        <CarouselNext className="hidden md:flex right-8 h-12 w-12 border-white/20 text-white hover:bg-white/20 hover:text-white bg-black/20 backdrop-blur-md" />
      </Carousel>
    </section>
  );
}
