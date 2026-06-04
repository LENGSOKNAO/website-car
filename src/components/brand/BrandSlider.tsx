import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ButtonBlue from "../ui/ButtonBlue";
import ButtonWhite from "../ui/ButtonWhite";
import type { BrandData } from "@/lib/constants";

export default function BrandSlider({ data }: { data: BrandData }) {
 
  const [current, setCurrent] = useState(0);

   const prev = () => setCurrent((p) => (p - 1 + data.slider.length) % data.slider.length);
   const next = () => setCurrent((p) => (p + 1) % data.slider.length);
   
    const ref = useRef();
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
     if (ref.current) {
       observer.observe(ref.current);
     }
     return () => observer.disconnect();
   }, []);

  return (
     <section className={`relative min-h-[85vh] flex items-center overflow-hidden ${isInView ? 'animate-slideUp' : ''}`} ref={ref}>
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
       {/* Backgrounds for all slides */}
       {data.slider.map((e, i) => (
         <div
           key={i}
           className={cn(
             "absolute inset-0 transition-all duration-700",
             i === current ? "opacity-100 scale-100" : "opacity-0 scale-105",
           )}
         >
           <img src={e.image} alt="" className="w-full h-full object-cover" />
           <div
             className="absolute inset-0"
             style={{
               background: `linear-gradient(70deg, black 0%, black 10%, transparent 80%)`,
             }}
           />
           <div className="absolute inset-0 bg-dark-975/30" />
         </div>
       ))}
       {/* Content and navigation for the current slide only */}
       {data.slider[current] && (
         <div className="relative w-full">
           <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
             <div className="max-w-2xl">
               <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5 }}
               >
                 <div className="w-12 h-1 rounded-full mb-6 bg-white" />
               </motion.div>
               <motion.p
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5, delay: 0.05 }}
                 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-white"
               >
                 {data.slider[current].name}
               </motion.p>
               <motion.h1
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5, delay: 0.1 }}
                 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight"
               >
                 {data.slider[current].tagline}
               </motion.h1>
               <motion.p
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5, delay: 0.15 }}
                 className="mt-6 text-base md:text-lg text-dark-300/80 max-w-xl leading-relaxed"
               >
                 {data.slider[current].description}
               </motion.p>
               <motion.div
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
                 className="mt-10 flex items-start gap-4"
               >
                 <ButtonBlue
                   to={`/listings?make=${data.slider[current].name}`}
                   children="Explore Models"
                 />
                 <ButtonWhite
                   to={`/listings?make=${data.slider[current].name}&condition=used`}
                   children="Certified Offers"
                 />
               </motion.div>
             </div>
           </div>

           {/* Navigation buttons - show only if there is more than one slide in the slider */}
           {data.slider.length > 1 && (
             <>
               <button
                 onClick={prev}
                 className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 cursor-pointer flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-10"
               >
                 <ChevronLeft className="w-5 h-5 text-white" />
               </button>
               <button
                 onClick={next}
                 className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 cursor-pointer flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-10"
               >
                 <ChevronRight className="w-5 h-5 text-white" />
               </button>
             </>
           )}
         </div>
       )}
     </section>
  );
}
