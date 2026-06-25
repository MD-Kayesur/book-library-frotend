"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hero } from "@/components/Hero";
import { PopularBooks } from "@/components/PopularBooks";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Hero Slider Section */}
      <Hero />
      
      {/* Popular Books Section */}
      <PopularBooks />
      
      {/* Search Bar Section */}
      {/* <section className="w-full py-12 px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-4"
        >
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Find your next adventure</h2>
          <div className="flex w-full items-center space-x-2">
            <Input type="text" placeholder="Search by title, author, or genre..." className="h-12 text-lg bg-zinc-50 dark:bg-zinc-950" />
            <Button type="submit" size="lg" className="h-12 px-8">Search</Button>
          </div>
        </motion.div>
      </section> */}
    </div>
  );
}
