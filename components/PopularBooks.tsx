"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  coverClass: string;
  decoration: React.ReactNode;
  description: string;
  rating: number;
}

const POPULAR_BOOKS: Book[] = [
  {
    id: 1,
    title: "Origin",
    author: "Dan Brown",
    genre: "Thriller / Mystery",
    coverClass: "bg-gradient-to-br from-red-950 via-rose-900 to-zinc-950 border-rose-800/40 text-rose-100",
    description: "A thrilling quest to answer the two fundamental questions of human existence: Where do we come from? Where are we going? Following symbologist Robert Langdon in a fast-paced journey.",
    rating: 4.8,
    decoration: (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-20 h-20 rounded-full border border-white/40" />
      </div>
    )
  },
  {
    id: 2,
    title: "The Fury",
    author: "Alex Michaelides",
    genre: "Psychological Thriller",
    coverClass: "bg-gradient-to-br from-amber-100 via-yellow-50 to-stone-200 border-yellow-300/40 text-stone-900",
    description: "A masterfully plotted tale of murder and obsession, told by an unreliable narrator who weaves a web of deceit on a secluded Greek island.",
    rating: 4.5,
    decoration: (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-900/20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-indigo-900/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-indigo-950" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "The Maidens",
    author: "Alex Michaelides",
    genre: "Psychological Thriller",
    coverClass: "bg-gradient-to-br from-zinc-900 via-neutral-800 to-stone-950 border-neutral-700/40 text-neutral-100",
    description: "A brilliant, troubled therapist travels to Cambridge University to investigate a secret society of female students and their charismatic, menacing professor.",
    rating: 4.2,
    decoration: (
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-full h-0.5 bg-amber-500/30 rotate-12 transform -translate-y-4" />
        <div className="w-full h-0.5 bg-amber-500/30 -rotate-12 transform translate-y-4" />
      </div>
    )
  },
  {
    id: 4,
    title: "Gerald's Game",
    author: "Stephen King",
    genre: "Horror Game",
    coverClass: "bg-gradient-to-br from-red-800 via-red-900 to-black border-red-700/40 text-white",
    description: "A romantic weekend turns into a nightmare when a woman is left handcuffed to a bed in a remote cabin, facing her darkest fears and inner demons.",
    rating: 4.7,
    decoration: (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-8 h-8 rounded-full border-2 border-white mr-2" />
        <div className="w-8 h-8 rounded-full border-2 border-white" />
      </div>
    )
  },
  {
    id: 5,
    title: "Don't Turn Around",
    author: "Jessica Barry",
    genre: "Thriller / Suspense",
    coverClass: "bg-gradient-to-br from-cyan-950 via-teal-900 to-zinc-950 border-cyan-800/40 text-cyan-200",
    description: "Two women from vastly different worlds find their lives intertwined as they flee across the country, trying to outrun the dark secrets of their pasts.",
    rating: 4.3,
    decoration: (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="w-16 h-24 border border-white/40 rotate-6" />
      </div>
    )
  },
  {
    id: 6,
    title: "Amazing Facts",
    author: "Interesting Stuff",
    genre: "General Knowledge",
    coverClass: "bg-gradient-to-br from-purple-950 via-fuchsia-900 to-zinc-950 border-fuchsia-800/40 text-fuchsia-100",
    description: "A captivating collection of mind-blowing facts covering science, history, and the natural world, designed to satisfy the most curious minds.",
    rating: 4.6,
    decoration: (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <div className="text-3xl font-extrabold text-fuchsia-500">?</div>
      </div>
    )
  }
];

export function PopularBooks() {
  const router = useRouter();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [transforms, setTransforms] = React.useState<Array<{ scale: number, opacity: number, translateY: number, blur: number, brightness: number }>>([]);
  const [activeIndex, setActiveIndex] = React.useState(1);

  const scrollItems = [...POPULAR_BOOKS, ...POPULAR_BOOKS, ...POPULAR_BOOKS];

  const handleScroll = React.useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let minDistance = Infinity;
    let centerIndex = 0;

    const children = Array.from(container.children) as HTMLElement[];
    const newTransforms = children.map((child, index) => {
      const childRect = child.getBoundingClientRect();
      const childCenter = childRect.left + childRect.width / 2;
      
      const distance = Math.abs(containerCenter - childCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        centerIndex = index;
      }
      
      const maxDistance = containerRect.width / 2 || 500;
      const normalized = Math.min(distance / maxDistance, 1);
      
      return {
        scale: 1 - normalized * 0.25,
        opacity: 1 - normalized * 0.5,
        translateY: Math.pow(normalized, 1.5) * 60,
        blur: normalized * 4,
        brightness: 1 - normalized * 0.4,
      };
    });
    
    setTransforms(newTransforms);
    setActiveIndex(centerIndex);
  }, []);

  React.useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    
    // Initial center on load
    if (scrollRef.current) {
      const targetIndex = POPULAR_BOOKS.length + Math.floor(POPULAR_BOOKS.length / 2);
      const child = scrollRef.current.children[targetIndex] as HTMLElement;
      if (child) {
        scrollRef.current.scrollTo({
          left: child.offsetLeft - scrollRef.current.offsetWidth / 2 + child.offsetWidth / 2,
        });
      }
    }
    
    const timeout = setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timeout);
    };
  }, [handleScroll]);

  const activeBook = scrollItems[activeIndex] || scrollItems[0];

  return (
    <section className="w-full py-16 overflow-hidden relative border-b border-zinc-200 dark:border-white/10 flex flex-col items-center">
      <div className="mx-auto px-6 md:px-12 mb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white drop-shadow-md">
          Popular Books
        </h2>
        <p className="text-sm text-zinc-500 mt-2">Scroll horizontally to explore</p>
      </div>

      <div className="relative w-full flex items-center justify-center overflow-hidden h-[360px]">
        {/* Horizontal Scroll Track */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto gap-4 px-[calc(50%-100px)] pt-10 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-start scroll-smooth"
        >
          {scrollItems.map((book, index) => {
            const t = transforms[index] || { scale: 1, opacity: 1, translateY: 0, blur: 0, brightness: 1 };
            const isCenter = index === activeIndex; 

            return (
              <div 
                key={`${book.id}-${index}`} 
                className="flex flex-col items-center flex-shrink-0 group snap-center"
                style={{ 
                  width: '200px',
                  transform: `scale(${t.scale}) translateY(${t.translateY}px)`,
                  opacity: t.opacity,
                  filter: `blur(${t.blur}px) brightness(${t.brightness})`,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out',
                  zIndex: Math.round(t.scale * 100),
                }}
                onClick={() => {
                  if (!isCenter) {
                    const container = scrollRef.current;
                    if (container) {
                      const child = container.children[index] as HTMLElement;
                      container.scrollTo({
                        left: child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2,
                        behavior: 'smooth'
                      });
                    }
                  }
                }}
              >
                {/* Book Cover Artwork Container */}
                <div className={`relative w-[200px] h-[290px] rounded-t-lg rounded-br-lg ${book.coverClass} border shadow-2xl overflow-hidden flex flex-col justify-between p-4 cursor-pointer`}>
                  <div className="absolute left-1.5 top-0 bottom-0 w-[1px] bg-white/10 dark:bg-black/20 z-20" />
                  <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-gradient-to-r from-black/35 to-transparent z-20" />
                  
                  <div className="flex flex-col items-center justify-between h-full text-center py-2 relative z-10">
                    <span className="text-[11px] uppercase tracking-widest font-semibold opacity-70">
                      {book.author}
                    </span>
                    <span className="text-lg font-extrabold tracking-tight whitespace-normal break-words px-2 my-auto leading-snug drop-shadow-md">
                      {book.title}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                      {book.genre.split(" / ")[0]}
                    </span>
                  </div>

                  {book.decoration}

                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-stone-200 border-t border-zinc-400/50 flex flex-col justify-center px-1 z-20">
                    <div className="w-full h-[1px] bg-stone-300" />
                    <div className="w-full h-[1px] bg-stone-300 mt-[2px]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Book Details Panel Below Slider */}
      {activeBook && (
        <div className="w-full max-w-2xl px-6 flex flex-col items-center text-center transition-all duration-300 transform min-h-[180px] mt-2">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 tracking-tight">
            {activeBook.title}
          </h3>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center justify-center gap-3">
            <span>{activeBook.author}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span>{activeBook.genre}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current mr-1" />
              {activeBook.rating}
            </span>
          </p>
          <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-xl leading-relaxed mb-6">
            {activeBook.description}
          </p>
          
          <Button 
            className="rounded-full px-8 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-lg font-semibold"
            onClick={() => router.push(`/books/${slugify(activeBook.title)}`)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Read Full Details
          </Button>
        </div>
      )}
    </section>
  );
}
