"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hero } from "@/components/Hero";
import { PopularBooks } from "@/components/PopularBooks";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent font-sans">
      {/* The Hero component now acts as the global scroll container for the video */}
      <Hero>
        {/* Popular Books Section */}
        <PopularBooks />
        
        {/* Search Bar Section */}
        <section className="w-full py-24 px-6 bg-transparent border-t border-white/10">
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-semibold text-white drop-shadow-md">Find your next adventure</h2>
            <div className="flex w-full items-center space-x-2">
              <Input type="text" placeholder="Search by title, author, or genre..." className="h-14 text-lg bg-black/40 border-white/20 text-white backdrop-blur-md" />
              <Button type="submit" size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white">Search</Button>
            </div>
          </div>
        </section>
      </Hero>
    </div>
  );
}
