import { DUMMY_BOOKS } from "@/lib/data/books.data";
import { slugify } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Star, User, Book as BookIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BookDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const book = DUMMY_BOOKS.find((b) => slugify(b.title) === resolvedParams.slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300 flex justify-center items-center">
      <div className="w-full max-w-5xl space-y-8">
        
        <Link href="/books" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Library Catalog
        </Link>
        
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/20 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col md:flex-row">
          {/* Book Cover */}
          <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:h-auto bg-zinc-100 dark:bg-zinc-950 relative min-h-[400px]">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover object-center"
            />
            <div 
              className="absolute top-6 left-6 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg z-10"
              style={{ backgroundColor: book.color }}
            >
              {book.genre}
            </div>
            {book.isLoanedBook && (
              <span className="absolute bottom-6 left-6 text-emerald-100 bg-emerald-700/95 dark:bg-emerald-950/95 backdrop-blur-sm text-xs uppercase tracking-widest font-black px-4 py-2 rounded-lg shadow-md z-10 border border-emerald-500/20">
                Currently Borrowed
              </span>
            )}
          </div>

          {/* Content */}
          <div className="w-full md:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-between space-y-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-amber-500 text-sm font-bold flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-500/10">
                    <Star className="h-4 w-4 fill-amber-500 stroke-amber-500" />
                    <span>{book.rating.toFixed(1)} / 5.0 Rating</span>
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight tracking-tight">
                  {book.title}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{book.author}</span>
                </p>
              </div>

              {/* Availability */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  <span>Library Availability</span>
                  <span>{book.available_copies} / {book.total_copies} copies available</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
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

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                  Overview & Summary
                </h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  {book.summary}
                </p>
                <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed italic border-l-2 border-zinc-200 dark:border-zinc-800 pl-4 mt-6">
                  "{book.description}"
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-zinc-100 dark:border-zinc-800">
              {book.pdfUrl && (
                <Button 
                  asChild
                  className="flex-1 text-white hover:opacity-90 rounded-2xl py-7 font-semibold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] text-lg"
                  style={{ backgroundColor: book.color }}
                >
                  <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <BookIcon className="h-5 w-5" />
                    Read PDF Format
                  </a>
                </Button>
              )}
              {book.isLoanedBook ? (
                <Button className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-2xl py-7 font-semibold text-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                  Return Book
                </Button>
              ) : book.available_copies === 0 ? (
                <Button disabled className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 rounded-2xl py-7 font-semibold text-lg cursor-not-allowed border border-zinc-200/20">
                  Out of Stock
                </Button>
              ) : (
                <Button className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-2xl py-7 font-semibold text-lg shadow-xl shadow-zinc-900/10 dark:shadow-white/5 transition-all hover:scale-[1.02]">
                  Borrow Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
