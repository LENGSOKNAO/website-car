import type { BrandData } from "@/lib/constants";
import ButtonBlue from "../ui/ButtonBlue";
import { useEffect, useState, useRef } from "react";

export default function BrandOne({ data }: { data: BrandData }) {
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
    <section className={`relative h-[60vh] sm:h-[70vh]  md:h-[80vh] lg:h-[90vh] flex items-end overflow-hidden ${isInView ? 'animate-slideUp' : ''}`} ref={ref}>
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
      {data.boxone.map((banner, index) => (
        <div className={index > 0 ? "pb-5" : ""} key={index}>
          <div className="absolute inset-0">
            <img
              src={banner.image}
              alt={banner.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(70deg, black 0%, black 10%, transparent 80%)`,
              }}
            />
            <div className="absolute inset-0 bg-dark-975/30" />
          </div>

          <div className="relative w-full max-w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 pb-10 sm:pb-14 md:pb-20 lg:pb-24">
            <div className="max-w-2xl">
              <p className="text-[10px] sm:text-xs font-semibold uppercase text-white tracking-[0.2em] mb-2 sm:mb-3">
                {banner.name}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                The Future of Driving
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-dark-300 max-w-lg leading-relaxed">
                {banner.description}
              </p>
              <div className="mt-5 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <ButtonBlue
                  to={`/listings?make=${banner.name}`}
                  children="Order Now"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
