"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";

import { DUMMY_BOOKS } from "@/lib/data/books.data";

export function PopularBooks() {
  const router = useRouter();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const [transforms, setTransforms] = React.useState<Array<{ scale: number, opacity: number, translateY: number, blur: number, brightness: number }>>([]);
  const [activeIndex, setActiveIndex] = React.useState(1);

  const scrollItems = [...DUMMY_BOOKS, ...DUMMY_BOOKS, ...DUMMY_BOOKS];

  const handleScroll = React.useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let minDistance = Infinity;
    let centerIndex = 0;

    const children = Array.from(container.children) as HTMLElement[];
    const newTransforms = children.map((child, index) => {
      const childRect = child.getBoundingClientRect();
      const childCenter = childRect.left + childRect.width / 2;
      
      const distance = Math.abs(containerCenter - childCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        centerIndex = index;
      }
      
      const maxDistance = containerRect.width / 2 || 500;
      const normalized = Math.min(distance / maxDistance, 1);
      
      return {
        scale: 1 - normalized * 0.25,
        opacity: 1 - normalized * 0.5,
        translateY: Math.pow(normalized, 1.5) * 60,
        blur: normalized * 4,
        brightness: 1 - normalized * 0.4,
      };
    });
    
    setTransforms(newTransforms);
    setActiveIndex(centerIndex);
  }, []);

  React.useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    
    // Initial center on load
    if (scrollRef.current) {
      const targetIndex = DUMMY_BOOKS.length + Math.floor(DUMMY_BOOKS.length / 2);
      const child = scrollRef.current.children[targetIndex] as HTMLElement;
      if (child) {
        scrollRef.current.scrollTo({
          left: child.offsetLeft - scrollRef.current.offsetWidth / 2 + child.offsetWidth / 2,
        });
      }
    }
    
    const timeout = setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timeout);
    };
  }, [handleScroll]);

  const activeBook = scrollItems[activeIndex] || scrollItems[0];

  // Vertical scroll animation logic
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"] // 0 to 1 over exactly 2.5x the viewport height
  });
  
  // The sticky container un-sticks at exactly 0.6 progress (150vh / 250vh).
  // ALL animations must finish before 0.6 to avoid getting cut off!
  
  // 1. Text fades out early so it doesn't get huge
  const textOpacity = useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 1, 0]);

  // 2. The slider zooms in massively
  const zoomScale = useTransform(scrollYProgress, [0, 0.15, 0.45], [1, 1, 60]);
  
  // 3. AFTER it has zoomed, it vanishes completely (must finish before 0.6)
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.45, 0.55], [1, 1, 0]);
  
  const isPointerActive = useTransform(scrollYProgress, (v) => v > 0.1 ? "none" : "auto");

  return (
    <section ref={sectionRef} className="w-full relative h-[250vh]">
      <div className="sticky top-0 h-[100vh] min-h-[700px] w-full flex flex-col items-center justify-center overflow-hidden z-40">
        <motion.div 
          className="w-full flex flex-col items-center justify-center origin-center py-8 md:py-16"
          style={{ 
            scale: zoomScale,
            opacity: sectionOpacity,
            pointerEvents: isPointerActive as any
          }}
        >
          <motion.div 
            className="mx-auto px-6 md:px-12 mb-6 text-center"
            style={{ opacity: textOpacity }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white drop-shadow-md">
              Popular Books
            </h2>
            <p className="text-sm text-zinc-500 mt-2">Scroll horizontally to explore</p>
          </motion.div>

          <div className="relative w-full flex items-center justify-center overflow-hidden h-[360px]">
            {/* Horizontal Scroll Track */}
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex w-full h-full overflow-x-auto gap-4 px-[calc(50%-100px)] pt-10 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-start scroll-smooth"
            >
              {scrollItems.map((book, index) => {
                const t = transforms[index] || { scale: 1, opacity: 1, translateY: 0, blur: 0, brightness: 1 };
                const isCenter = index === activeIndex; 

                return (
                  <div 
                    key={`${book.id}-${index}`} 
                    className="flex flex-col items-center flex-shrink-0 group snap-center"
                    style={{ 
                      width: '200px',
                      transform: `scale(${t.scale}) translateY(${t.translateY}px)`,
                      opacity: t.opacity,
                      filter: `blur(${t.blur}px) brightness(${t.brightness})`,
                      transition: 'transform 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out',
                      zIndex: Math.round(t.scale * 100),
                    }}
                    onClick={() => {
                      if (!isCenter) {
                        const container = scrollRef.current;
                        if (container) {
                          const child = container.children[index] as HTMLElement;
                          container.scrollTo({
                            left: child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2,
                            behavior: 'smooth'
                          });
                        }
                      }
                    }}
                  >
                    {/* Book Cover Artwork Container */}
                    <div 
                      className="relative w-[200px] h-[290px] rounded-t-lg rounded-br-lg border border-zinc-200/20 shadow-2xl overflow-hidden flex flex-col justify-between cursor-pointer"
                      style={{ backgroundColor: book.color }}
                    >
                      <img src={book.cover} alt={book.title} className="absolute inset-0 w-full h-full object-cover z-10" />

                      <div className="absolute left-1.5 top-0 bottom-0 w-[1px] bg-white/20 dark:bg-black/20 z-20" />
                      <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-gradient-to-r from-black/40 to-transparent z-20" />
                      
                      <div className="absolute bottom-0 left-0 right-0 h-3 bg-stone-200 border-t border-zinc-400/50 flex flex-col justify-center px-1 z-20">
                        <div className="w-full h-[1px] bg-stone-300" />
                        <div className="w-full h-[1px] bg-stone-300 mt-[2px]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Book Details Panel Below Slider */}
          {activeBook && (
            <motion.div 
              style={{ opacity: textOpacity }} 
              className="w-full max-w-2xl px-6 flex flex-col items-center text-center transition-all duration-300 transform min-h-[180px] mt-2"
            >
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 tracking-tight">
                {activeBook.title}
              </h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center justify-center gap-3">
                <span>{activeBook.author}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span>{activeBook.genre}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="flex items-center text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  {activeBook.rating}
                </span>
              </p>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-xl leading-relaxed mb-6">
                {activeBook.description}
              </p>
              
              <Button 
                className="rounded-full px-8 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-lg font-semibold"
                onClick={() => router.push(`/books/${slugify(activeBook.title)}`)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Read Full Details
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
