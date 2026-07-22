"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-black/40 backdrop-blur-lg text-zinc-400 border-t border-white/10 relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Column 1: Logo & About */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/conLogowithtext.png"
                alt="BookLibrary Logo"
                width={180}
                height={50}
                className="object-contain brightness-95 hover:brightness-100 transition-all duration-200 drop-shadow-md"
              />
            </Link>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-sm drop-shadow-sm">
              Discover and catalog your next literary adventures. BookLibrary offers a premium digital shelf experience for bibliophiles, featuring live searching, interactive video highlights, and catalog curated lists.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-white/20 text-zinc-300 hover:border-indigo-400 hover:text-indigo-300 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-white/20 text-zinc-300 hover:border-indigo-400 hover:text-indigo-300 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-white/20 text-zinc-300 hover:border-indigo-400 hover:text-indigo-300 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-100 drop-shadow-sm">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-100 drop-shadow-sm">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <span>Dhaka, Mohakhali</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <span>+8801926360430</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <a href="mailto:rmdkayesur@gmail.com" className="hover:text-white hover:underline transition-colors">
                  rmdkayesur@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-zinc-400">
            &copy; {new Date().getFullYear()} BookLibrary. All rights reserved.
          </p>
          <div className="flex gap-6 text-zinc-400">
            <Link href="/" className="hover:text-zinc-300 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-zinc-300 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
