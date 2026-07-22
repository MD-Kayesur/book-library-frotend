"use client";

import * as React from "react";
import { DUMMY_BOOKS } from "@/lib/data/books.data";
import type { Book } from "@/lib/types/booksdata.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Search, Book as BookIcon, User, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { PopularBooks } from "@/components/PopularBooks";


export default function BooksPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredBooks = DUMMY_BOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Video Hero Header */}
        <div className="relative w-full min-h-[calc(100vh-100px)] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-white/10">
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

        {/* Popular Books Marquee */}
        <div className="w-full">
          <PopularBooks />
        </div>

        {/* Search Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative max-w-lg mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
            <Input
              type="text"
              placeholder="Search by title, author, genre, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 w-full text-base bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </motion.div>

        {/* Grid of Books */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="h-full flex flex-col bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-300 rounded-2xl overflow-hidden group"
                  style={{ 
                    borderColor: 'var(--card-border)',
                    boxShadow: 'var(--card-shadow)'
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty('--card-border', `${book.color}44`);
                    e.currentTarget.style.setProperty('--card-shadow', `0 10px 15px -3px ${book.color}15, 0 4px 6px -4px ${book.color}15`);
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--card-border', '');
                    e.currentTarget.style.setProperty('--card-shadow', '');
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800/50">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Genre Badge */}
                    <span 
                      className="absolute top-3 left-3 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md z-10 backdrop-blur-sm"
                      style={{ backgroundColor: `${book.color}bb` }}
                    >
                      {book.genre}
                    </span>

                    {/* Rating Badge */}
                    <span className="absolute top-3 right-3 text-amber-500 bg-white/95 dark:bg-zinc-900/95 text-xs font-bold px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1 z-10 border border-zinc-100 dark:border-zinc-850">
                      <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
                      <span>{book.rating.toFixed(1)}</span>
                    </span>

                    {/* Loaned Badge */}
                    {book.isLoanedBook && (
                      <span className="absolute bottom-3 left-3 text-emerald-100 bg-emerald-700/90 dark:bg-emerald-950/90 backdrop-blur-sm text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md shadow-sm z-10 border border-emerald-500/20">
                        Borrowed
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <CardHeader className="space-y-3 pb-4 pt-5">
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                          {book.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium text-sm">
                          <User className="h-3.5 w-3.5" />
                          <span>{book.author}</span>
                        </CardDescription>
                      </div>

                      {/* Copies Availability Indicator */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          <span>Availability</span>
                          <span>{book.available_copies} / {book.total_copies} copies</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              book.available_copies === 0 
                                ? "bg-rose-500" 
                                : book.available_copies < 3 
                                ? "bg-amber-500" 
                                : "bg-indigo-600 dark:bg-indigo-500"
                            }`}
                            style={{ width: `${(book.available_copies / book.total_copies) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-6">
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                        {book.description}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="pt-4 pb-6 flex gap-3 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto px-6">
                      {book.isLoanedBook ? (
                        <Button className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-xl py-5 font-semibold text-sm shadow-md shadow-emerald-500/10">
                          Return Book
                        </Button>
                      ) : book.available_copies === 0 ? (
                        <Button disabled className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 rounded-xl py-5 font-semibold text-sm cursor-not-allowed border border-zinc-200/20">
                          Out of Stock
                        </Button>
                      ) : (
                        <Button className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl py-5 font-semibold text-sm">
                          Borrow Now
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="flex-1 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl py-5 font-semibold text-sm"
                        onClick={() => router.push(`/books/${slugify(book.title)}`)}
                      >
                        Summary
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-4"
          >
            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mx-auto">
              <BookIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                No books found
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs mx-auto">
                We couldn't find any books matching "{searchQuery}". Try
                refining your search term.
              </p>
            </div>
          </motion.div>
        )}

        {/* Book Summary Modal removed in favor of details page */}
      </div>
    </div>
  );
}
