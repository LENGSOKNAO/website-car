import type { BrandData } from "@/lib/constants";
import ButtonBlue from "../ui/ButtonBlue";
import ButtonWhite from "../ui/ButtonWhite";
import { useEffect, useState, useRef } from "react";

export default function BrandBox({ data }: { data: BrandData }) {
  const ref = useRef<HTMLElement | null>(null);
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
    <section className={`relative overflow-hidden ${isInView ? 'animate-slideUp' : ''}`} ref={ref}>
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
      {data.boxRight.map((e, i) => (
        <div key={i} className={i > 0 ? "pt-8" : ""}>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] blur-[150px] pointer-events-none" />
          <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 max-w-full">
            <div className="flex flex-col lg:flex-row items-stretch overflow-hidden min-h-[500px] lg:min-h-[650px]">
              <div className="flex-[1] p-10 md:p-14 lg:p-20 flex flex-col justify-center relative z-10">
                <div className="w-14 h-1 mb-8" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                  {e.name}
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                  {e.name}
                </h2>
                <p className="mt-6 text-base md:text-lg text-black leading-relaxed max-w-lg">
                  {e.description}
                </p>
                <div className="mt-10 flex gap-4">
                  <ButtonBlue to="" children="Order Now" />
                  <ButtonWhite to="" children="Learn More" />
                </div>
              </div>
              <div className="flex-[1.5] min-h-[350px] rounded-sm lg:min-h-full relative overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={e.image}
                    alt={e.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(70deg, black 0%, black 10%, transparent 80%)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-dark-975/30" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-dark-900/60" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
