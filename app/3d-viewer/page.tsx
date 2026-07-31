"use client";

import * as React from "react";
import { Book3DViewer } from "@/components/Book3DViewer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Box, Sparkles, Move3d, MousePointerClick, ShieldCheck } from "lucide-react";

export default function ThreeDViewerPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-10 mt-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
            <Move3d className="w-4 h-4" />
            <span>Interactive WebGL 3D Experience</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">3D Book Showcase</span>
          </h1>

          <p className="max-w-2xl text-lg text-zinc-400 font-light">
            Built with Three.js and WebGL. Click and drag with your mouse to rotate the model, scroll to zoom in/out, and customize materials and lighting in real time.
          </p>
        </div>

        {/* 3D Canvas Showcase Component */}
        <div className="w-full">
          <Book3DViewer />
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Orbit Mouse Controls</h3>
            <p className="text-sm text-zinc-400">
              Full 360-degree rotation using left-click drag, precise zoom via mouse scroll wheel, and camera panning with right-click drag.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Live Material Customization</h3>
            <p className="text-sm text-zinc-400">
              Change book cover colors on the fly, adjust gold metallic accents, and toggle open/close book cover physics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Studio Lighting & Shadows</h3>
            <p className="text-sm text-zinc-400">
              Real-time soft PCF shadow maps, specular highlights, environment lighting presets, and wireframe diagnostic mode.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
