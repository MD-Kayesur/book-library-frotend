import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScrolling } from "@/components/SmoothScrolling";

import { FluidCanvas } from "@/components/FluidCanvas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookLibrary",
  description: "A premium book library application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <SmoothScrolling>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            {/* Global WebGL Fluid Overlay */}
            <div className="fixed inset-0 z-50 pointer-events-none mix-blend-screen">
              <FluidCanvas />
            </div>
            <main className="flex-1 flex flex-col relative z-10">{children}</main>
            <Footer />
          </ThemeProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
