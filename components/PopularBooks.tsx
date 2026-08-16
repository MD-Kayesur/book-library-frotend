"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import { DUMMY_BOOKS } from "@/lib/data/books.data";

export function PopularBooks() {
  const router = useRouter();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const [transforms, setTransforms] = React.useState<Array<{ scale: number, opacity: number, translateY: number, blur: number, brightness: number }>>([]);
  const [activeIndex, setActiveIndex] = React.useState(1);

  const scrollItems = [...DUMMY_BOOKS, ...DUMMY_BOOKS, ...DUMMY_BOOKS];

  const isDown = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);
  const isDragging = React.useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    isDragging.current = false;
    if (!scrollRef.current) return;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.scrollBehavior = 'auto';
    scrollRef.current.style.scrollSnapType = 'none';
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = 'smooth';
      scrollRef.current.style.scrollSnapType = 'x mandatory';
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = 'smooth';
      scrollRef.current.style.scrollSnapType = 'x mandatory';
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    if (Math.abs(walk) > 5) {
      isDragging.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

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
  
  // Apply a spring to the scroll progress so mouse wheel scrolling is buttery smooth
  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });
  
  // The sticky container un-sticks at exactly 0.6 progress (150vh / 250vh).
  // ALL animations must finish before 0.6 to avoid getting cut off!
  
  // 1. Text fades out early so it doesn't get huge
  const textOpacity = useTransform(smoothScrollY, [0, 0.05, 0.15], [1, 1, 0]);

  // 2. The slider zooms in massively
  const zoomScale = useTransform(smoothScrollY, [0, 0.15, 0.45], [1, 1, 60]);
  
  // 3. AFTER it has zoomed, it vanishes completely (must finish before 0.6)
  const sectionOpacity = useTransform(smoothScrollY, [0, 0.45, 0.55], [1, 1, 0]);
  
  const isPointerActive = useTransform(smoothScrollY, (v) => v > 0.1 ? "none" : "auto");

  return (
    <>
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

          <div className="relative w-full flex items-center justify-center overflow-hidden h-[500px]">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="flex w-full h-full overflow-x-auto gap-4 px-[calc(50%-100px)] pt-10 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-start scroll-smooth cursor-grab active:cursor-grabbing"
            >
              {scrollItems.map((book, index) => {
                const t = transforms[index] || { scale: 1, opacity: 1, translateY: 0, blur: 0, brightness: 1 };
                const isCenter = index === activeIndex; 

                return (
                  <div 
                    key={`${book.id}-${index}`} 
                    className="flex flex-col items-center flex-shrink-0 group snap-center"
                    style={{ 
                      width: '260px',
                      transform: `scale(${t.scale}) translateY(${t.translateY}px)`,
                      opacity: t.opacity,
                      filter: `blur(${t.blur}px) brightness(${t.brightness})`,
                      transition: 'transform 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out',
                      zIndex: Math.round(t.scale * 100),
                    }}
                    onClick={() => {
                      if (isDragging.current) return;
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
                      className="relative w-[260px] h-[380px] rounded-t-lg rounded-br-lg border border-zinc-200/20 shadow-2xl overflow-hidden flex flex-col justify-between cursor-pointer"
                      style={{ backgroundColor: book.color }}
                    >
                      <img src={book.cover} alt={book.title} draggable={false} className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" />

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

        </motion.div>
      </div>
    </section>

    {/* Dynamic Book Details Section */}
      <section 
        className="w-full min-h-screen relative flex items-center py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-700"
        style={{ 
           backgroundColor: activeBook ? `${activeBook.color}15` : 'transparent' 
        }}
      >
        {activeBook && (
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left: Big Book Cover */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex justify-center md:justify-end"
            >
              <div 
                className="relative w-full max-w-[320px] md:max-w-[400px] aspect-[2/3] rounded-xl shadow-2xl overflow-hidden border border-white/10"
                style={{ boxShadow: `0 25px 50px -12px ${activeBook.color}66` }}
              >
                <img src={activeBook.cover} alt={activeBook.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 opacity-60 pointer-events-none" />
              </div>
            </motion.div>

            {/* Right: Details */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col space-y-6 text-left"
            >
              <div className="space-y-2">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 shadow-sm"
                  style={{ backgroundColor: `${activeBook.color}33`, color: activeBook.color }}
                >
                  {activeBook.genre}
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight drop-shadow-sm">
                  {activeBook.title}
                </h2>
                <p className="text-xl md:text-2xl font-medium text-zinc-500 dark:text-zinc-400">
                  By {activeBook.author}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500 px-3 py-1.5 rounded-lg font-bold">
                  <Star className="w-5 h-5 fill-current mr-2" />
                  <span className="text-lg">{activeBook.rating}</span>
                </div>
                <div className="text-sm font-medium text-zinc-500">
                  {activeBook.available_copies > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{activeBook.available_copies} Copies Available</span>
                  ) : (
                    <span className="text-rose-500 font-bold">Currently Unavailable</span>
                  )}
                </div>
              </div>

              <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                {activeBook.summary || activeBook.description}
              </p>

              <div className="pt-6 flex flex-wrap gap-4">
                <Button 
                  className="px-8 py-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all hover:brightness-110 hover:scale-105"
                  style={{ backgroundColor: activeBook.color }}
                  onClick={() => router.push(`/books/${slugify(activeBook.title)}`)}
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Read Book
                </Button>
                
                {activeBook.pdfUrl && (
                  <Button 
                    variant="outline"
                    className="px-8 py-6 rounded-xl font-bold text-lg border-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all hover:scale-105"
                    onClick={() => window.open(activeBook.pdfUrl, '_blank')}
                  >
                    Preview PDF
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Subtle background glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 pointer-events-none z-0"
          style={{ backgroundColor: activeBook?.color }}
        />
      </section>
    </>
  );
}
