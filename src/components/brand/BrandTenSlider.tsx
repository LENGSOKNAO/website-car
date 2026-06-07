import { useState, useRef, useCallback, useEffect } from "react";
import ButtonBlue from "../ui/ButtonBlue";
import ButtonWhite from "../ui/ButtonWhite";
import type { BrandData } from "@/lib/constants";
import { api } from "@/lib/api";

interface BoxTenItem {
  badge: string;
  title: string;
  description: string;
  image: string;
}

const DRAG_MULTIPLIER = 2;

export default function BrandTenSlider({ data }: { data: BrandData }) {
   const { slider, name, slug, route } = data;
   const [boxTen, setBoxTen] = useState<BoxTenItem[]>([]);
   const originalCount = boxTen.length;
   const sliderImages: string[] = [];

   for (let i = 0; i < slider.length * 2; i++) {
     sliderImages.push(slider[i % slider.length].image);
   }

   useEffect(() => {
    api.boxTen().then((res: any) => {
      const raw = res?.data?.data ?? res?.data ?? res ?? [];
      const list = Array.isArray(raw) ? raw : [];
      const brandName = data.name.toLowerCase();
      const filtered = list.filter((s: any) => {
        const badge = (s.badge || "").toLowerCase();
        const un = (s.user?.name || "").toLowerCase();
        return (
          badge === brandName ||
          un === brandName ||
          un === data.slug.toLowerCase()
        );
      });
      if (filtered.length === 0) {
        const loose = list.filter((s: any) => {
          const badge = (s.badge || "").toLowerCase();
          const un = (s.user?.name || "").toLowerCase();
          return (
            badge.includes(brandName) ||
            brandName.includes(badge) ||
            un.includes(brandName) ||
            brandName.includes(un)
          );
        });
        setBoxTen(loose);
      } else {
        setBoxTen(filtered);
      }
    }).catch(() => {});
  }, [data.name]);

   const sliderRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        },
        { threshold: 0.1 }
      );
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => observer.disconnect();
    }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    startX.current = e.pageX - (sliderRef.current?.offsetLeft ?? 0);
    scrollLeft.current = sliderRef.current?.scrollLeft ?? 0;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft ?? 0);
    const walk = (x - startX.current) * DRAG_MULTIPLIER;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft.current - walk;
    }
  }, []);

   const handleMouseUp = useCallback(() => {
     isDragging.current = false;
   }, []);
   const handleMouseLeave = useCallback(() => {
     isDragging.current = false;
   }, []);

   const handleTouchStart = useCallback(
     (e: React.TouchEvent<HTMLDivElement>) => {
       isDragging.current = true;
       startX.current =
         e.touches[0].pageX - (sliderRef.current?.offsetLeft ?? 0);
       scrollLeft.current = sliderRef.current?.scrollLeft ?? 0;
     },
     [],
   );

   const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
     if (!isDragging.current) return;
     const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft ?? 0);
     const walk = (x - startX.current) * DRAG_MULTIPLIER;
     if (sliderRef.current) {
       sliderRef.current.scrollLeft = scrollLeft.current - walk;
     }
   }, []);

   const handleTouchEnd = useCallback(() => {
     isDragging.current = false;
   }, []);

   const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
     if (sliderRef.current) {
       sliderRef.current.scrollLeft += e.deltaY;
     }
   }, []);

   const getVisibleIndex = useCallback(() => {
     if (!sliderRef.current) return 0;
     
     // Get the flex container (first element child of sliderRef)
     let flexContainer = sliderRef.current.firstElementChild;
     while (flexContainer && flexContainer.nodeType !== Node.ELEMENT_NODE) {
       flexContainer = flexContainer.nextElementSibling;
     }
     if (!flexContainer) return 0;
     
     // Get the first slide element (first element child of flex container)
     let firstSlide = flexContainer.firstElementChild as HTMLElement;
     while (firstSlide && firstSlide.nodeType !== Node.ELEMENT_NODE) {
       firstSlide = firstSlide.nextElementSibling as HTMLElement;
     }
     if (!firstSlide) return 0;
     
     const itemWidth = firstSlide.offsetWidth;
     if (itemWidth === 0) return 0;
     return Math.round(sliderRef.current.scrollLeft / itemWidth);
   }, [sliderRef]);

   const handleScroll = useCallback(() => {
     if (sliderRef.current) {
       setCurrentIndex(getVisibleIndex());
     }
   }, [getVisibleIndex]);

     const scrollToIndex = useCallback((index: number) => {
       if (sliderRef.current) {
         // Get the flex container (first element child of sliderRef)
         let flexContainer = sliderRef.current.firstElementChild;
         while (flexContainer && flexContainer.nodeType !== Node.ELEMENT_NODE) {
           flexContainer = flexContainer.nextElementSibling;
         }
         if (!flexContainer) return;
         
         // Get the first slide element (first element child of flex container)
         let firstSlide = flexContainer.firstElementChild as HTMLElement;
         while (firstSlide && firstSlide.nodeType !== Node.ELEMENT_NODE) {
           firstSlide = firstSlide.nextElementSibling as HTMLElement;
         }
         if (!firstSlide) return;
         
         const itemWidth = firstSlide.offsetWidth || 300;
         sliderRef.current.scrollTo({
           left: index * itemWidth,
           behavior: "smooth",
         });
       }
     }, [sliderRef]);

   const handleKeyDown = useCallback(
     (e: React.KeyboardEvent<HTMLDivElement>) => {
       if (e.key === "ArrowLeft") {
         e.preventDefault();
         scrollToIndex(Math.max(0, currentIndex - 1));
       } else if (e.key === "ArrowRight") {
         e.preventDefault();
         scrollToIndex(Math.min(sliderImages.length - 1, currentIndex + 1));
       }
     },
     [currentIndex, scrollToIndex, sliderImages.length],
   );

    if (boxTen.length === 0) return null;

     return (
       <div className={`relative select-none bg-white overflow-hidden pb-10 ${isInView ? 'animate-slideUp' : ''}`} ref={containerRef}>
         <style>{`
           @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(100px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideUp {
            animation: slideUp 1s ease-out forwards;
          }
         `}</style>
       <div className="relative">
         <div className="relative">
           <div
             ref={sliderRef}
             role="region"
             aria-roledescription="carousel"
             aria-label={`${name} image gallery`}
             tabIndex={0}
             className="overflow-x-auto overflow-y-hidden scrollbar-none  cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseLeave}
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
             onWheel={handleWheel}
             onScroll={handleScroll}
             onKeyDown={handleKeyDown}
           >
             <div className="flex gap-3 md:gap-5">
               {boxTen.map((e, index) => (
                 <div
                   key={`${index}-${e}`}
                   role="group"
                   aria-roledescription="slide"
                   aria-label={`${(index % originalCount) + 1} of ${originalCount}`}
                   className="flex-shrink-0 w-[315.5px] md:w-[740px] lg:w-[880px] xl:w-[1000px]"
                 >
                   <div className="relative h-[520px]  lg:h-[620px] rounded-sm  overflow-hidden bg-white shadow-2xl shadow-black/10 ring-1 ring-black/[0.06] transition-shadow duration-500">
                     <img
                       src={e.image}
                       alt={`${name} ${(index % originalCount) + 1}`}
                       loading="lazy"
                       className="w-full h-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                     <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/30 via-transparent to-transparent" />

                     <span className="absolute top-5 right-5 text-white/20 text-sm font-mono tracking-widest z-10 select-none">
                       {String((index % originalCount) + 1).padStart(2, "0")}
                     </span>

                     <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
                       <div className="max-w-2xl">
                         <div className="flex items-center gap-3 mb-3">
                           <span className="w-10 h-[3px] bg-white rounded-full" />
                            <span className="text-white/70 text-[11px] font-semibold tracking-[0.25em] uppercase">
                              {e.badge}
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 tracking-tight leading-[1.1]">
                            {e.badge}
                          </h3>
                          <p className="text-sm md:text-base text-white/70 font-medium mb-1">
                            {e.title}
                          </p>
                         <p className="text-xs md:text-sm text-white/50 mb-6 line-clamp-2 max-w-xl leading-relaxed">
                           {e.description}
                         </p>
                         <div className="flex gap-3">
                           <ButtonBlue
                             to={`/listings?make=${slug}`}
                             children="Order Now"
                           />
                           <ButtonWhite to={route} children="Learn More" />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>


         </div>
       </div>
     </div>
   );
}