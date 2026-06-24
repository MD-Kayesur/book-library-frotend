"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DUMMY_BOOKS } from "@/lib/dummy-data";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Section 1: Hero */}
      <section className="w-full py-20 px-6 md:px-12 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome to the Book Library
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
            Discover your next great read. Explore our collection of thousands of books across all genres.
          </p>
          <div className="flex w-full max-w-sm mx-auto items-center space-x-2 pt-4">
            <Input type="text" placeholder="Search for books..." className="bg-white dark:bg-zinc-950" />
            <Button type="submit">Search</Button>
          </div>
        </div>
      </section>

      {/* Section 2: Book Slider */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Featured Books
          </h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {DUMMY_BOOKS.map((book) => (
              <CarouselItem key={book.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                <Card className="overflow-hidden flex flex-col h-full">
                  <div className="relative w-full h-48">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                    <CardDescription>{book.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {book.description}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button className="w-full" variant="secondary">Borrow</Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </section>
    </div>
  );
}
