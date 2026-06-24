"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DUMMY_BOOKS } from "@/lib/dummy-data";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Hero Slider Section */}
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
                 <div className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center">
                   {/* Background Image with Overlay */}
                   <Image 
                     src={book.cover} 
                     alt={book.title} 
                     fill 
                     priority
                     sizes="100vw"
                     className="object-cover" 
                   />
                   <div className="absolute inset-0 bg-zinc-950/70 z-10" />
                   
                   {/* Content */}
                   <div className="relative z-20 w-full max-w-5xl mx-auto px-6 md:px-12 text-center flex flex-col items-center space-y-6">
                      <span className="px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-md border border-white/20">
                        Featured Book
                      </span>
                      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-md">
                        {book.title}
                      </h1>
                      <p className="text-xl md:text-3xl font-light text-zinc-300 drop-shadow-sm">
                        by {book.author}
                      </p>
                      <p className="text-lg md:text-xl text-zinc-200 max-w-3xl line-clamp-3 mt-4 drop-shadow-sm">
                        {book.description}
                      </p>
                      <div className="flex gap-4 pt-8">
                         <Button size="lg" className="bg-white text-black hover:bg-zinc-200 h-12 px-8 text-base">
                           Borrow Now
                         </Button>
                         <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/20 h-12 px-8 text-base backdrop-blur-sm">
                           Read Summary
                         </Button>
                      </div>
                   </div>
                 </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-8 h-12 w-12 border-white/20 text-white hover:bg-white/20 hover:text-white bg-black/20 backdrop-blur-md" />
          <CarouselNext className="hidden md:flex right-8 h-12 w-12 border-white/20 text-white hover:bg-white/20 hover:text-white bg-black/20 backdrop-blur-md" />
        </Carousel>
      </section>
      
      {/* Search Bar Section */}
      <section className="w-full py-12 px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Find your next adventure</h2>
          <div className="flex w-full items-center space-x-2">
            <Input type="text" placeholder="Search by title, author, or genre..." className="h-12 text-lg bg-zinc-50 dark:bg-zinc-950" />
            <Button type="submit" size="lg" className="h-12 px-8">Search</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
