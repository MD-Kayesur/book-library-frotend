"use client";

import * as React from "react";
import { Alphafly3DViewer } from "@/components/Alphafly3DViewer";
import { Shoe3DViewer } from "@/components/Shoe3DViewer";
import { ShoeViewer as GeckoCharacterViewer } from "@/components/snackanimaiton";
import { Book3DViewer } from "@/components/Book3DViewer";
import { Move3d, MousePointerClick, Sparkles, Box, Footprints, BookOpen, Zap } from "lucide-react";

export default function ThreeDViewerPage() {
  const [activeTab, setActiveTab] = React.useState<"alphafly" | "navy" | "gecko" | "book">("gecko");

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
            <Move3d className="w-4 h-4" />
            <span>Interactive WebGL 3D Experience</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-400 to-pink-500">3D Product Showcase</span>
          </h1>

          <p className="max-w-2xl text-lg text-zinc-400 font-light">
            Explore 3D models with unrestricted mouse rotation. Drag up and down to inspect the top and bottom sole ("opra-nicha") from every angle.
          </p>

          {/* Model Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 bg-zinc-900/90 p-2 rounded-2xl border border-zinc-800 shadow-xl mt-4">
            <button
              onClick={() => setActiveTab("alphafly")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "alphafly"
                  ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>👟 Alphafly 3D (images.png)</span>
            </button>

            <button
              onClick={() => setActiveTab("navy")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "navy"
                  ? "bg-cyan-500 text-zinc-950 shadow-lg shadow-cyan-500/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Footprints className="w-4 h-4" />
              <span>👟 Navy Sneaker 3D</span>
            </button>

            <button
              onClick={() => setActiveTab("gecko")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "gecko"
                  ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>🦎 Leopard Gecko 3D Character</span>
            </button>

            <button
              onClick={() => setActiveTab("book")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === "book"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 3D Book Viewer</span>
            </button>
          </div>
        </div>

        {/* Active 3D Component */}
        <div className="w-full">
          {activeTab === "alphafly" && <Alphafly3DViewer />}
          {activeTab === "navy" && <Shoe3DViewer />}
          {activeTab === "gecko" && <GeckoCharacterViewer />}
          {activeTab === "book" && <Book3DViewer />}
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Full Opra-Nicha Mouse Orbit</h3>
            <p className="text-sm text-zinc-400">
              Drag mouse UP and DOWN to flip and view the bottom sole tread ("nicha") or look straight down from the top ("opra").
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Part Material Customizer</h3>
            <p className="text-sm text-zinc-400">
              Customize upper body color, ZoomX foam sole color, and gold swoosh metallic accents with instant WebGL shader rendering.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">1-Click Camera Presets</h3>
            <p className="text-sm text-zinc-400">
              Instant buttons for "Sole (Nicha)", "Top (Opra)", and "Reset" angles with smooth camera position interpolation.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
