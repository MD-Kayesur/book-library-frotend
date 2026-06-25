"use client";

import * as React from "react";
import Marquee from "react-fast-marquee";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  coverClass: string;
  decoration: React.ReactNode;
}

const POPULAR_BOOKS: Book[] = [
  {
    id: 1,
    title: "Origin",
    author: "Dan Brown",
    genre: "Thriller / Mystery",
    coverClass: "bg-gradient-to-br from-red-950 via-rose-900 to-zinc-950 border-rose-800/40 text-rose-100",
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
    decoration: (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <div className="text-3xl font-extrabold text-fuchsia-500">?</div>
      </div>
    )
  }
];

export function PopularBooks() {
  const marqueeItems = [...POPULAR_BOOKS, ...POPULAR_BOOKS, ...POPULAR_BOOKS];

  return (
    <section className="w-full py-16 bg-zinc-950 overflow-hidden relative border-b border-zinc-900">
      {/* Section Header */}
      <div className=" mx-auto px-6 md:px-12 mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Popular Books
        </h2>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative w-full flex items-center overflow-hidden">
        {/* Ambient fade overlays on the sides */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Inner Track using react-fast-marquee */}
        <Marquee
          pauseOnHover={true}
          speed={55}
          gradient={false}
          className="py-4"
        >
          {marqueeItems.map((book, index) => (
            <div key={`${book.id}-${index}`} className="flex flex-col items-start w-[180px] flex-shrink-0 group mx-4">
              {/* Book Cover Artwork Container */}
              <div className={`relative w-[180px] h-[260px] rounded-t-lg rounded-br-lg ${book.coverClass} border shadow-lg overflow-hidden flex flex-col justify-between p-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-white/30`}>
                {/* Book Spine Line */}
                <div className="absolute left-1.5 top-0 bottom-0 w-[1px] bg-white/10 dark:bg-black/20 z-20" />
                {/* Book Spine Shadow Overlay */}
                <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-gradient-to-r from-black/35 to-transparent z-20" />
                
                {/* Design Content on Cover */}
                <div className="flex flex-col items-center justify-between h-full text-center py-2 relative z-10">
                  <span className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
                    {book.author}
                  </span>
                  <span className="text-base font-extrabold tracking-tight whitespace-normal break-words px-2 my-auto leading-snug drop-shadow-md">
                    {book.title}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">
                    {book.genre.split(" / ")[0]}
                  </span>
                </div>

                {/* Cover Decoration Shape */}
                {book.decoration}
                
                {/* Bottom Pages Line Simulation */}
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-stone-200 border-t border-zinc-400/50 flex flex-col justify-center px-1 z-20">
                  <div className="w-full h-[1px] bg-stone-300" />
                  <div className="w-full h-[1px] bg-stone-300 mt-[2px]" />
                </div>
              </div>

              {/* Book Info below cover */}
              <div className="mt-4 text-left w-full px-1">
                <h3 className="font-semibold text-zinc-200 text-sm line-clamp-1 group-hover:text-white transition-colors duration-250">
                  {book.title} - By {book.author}
                </h3>
                <p className="text-xs text-zinc-400 italic mt-0.5">
                  {book.genre}
                </p>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
