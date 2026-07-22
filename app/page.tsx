"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent font-sans">
      {/* The Hero component now acts as the global scroll container for the video */}
      <Hero>

        {/* Features Section */}
        <Features />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* Search Bar / CTA Section */}
        <section className="w-full py-32 px-6 bg-transparent border-t border-white/10">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
            <h2 className="text-4xl font-bold text-white drop-shadow-md">Ready to start your next adventure?</h2>
            <p className="text-xl text-zinc-300">Join thousands of readers and discover your next favorite book today.</p>
            <div className="flex w-full items-center space-x-2 mt-4">
              <Input type="text" placeholder="Search by title, author, or genre..." className="h-14 text-lg bg-black/40 border-white/20 text-white backdrop-blur-md" />
              <Button type="submit" size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25">Search</Button>
            </div>
          </div>
        </section>
      </Hero>
    </div>
  );
}
