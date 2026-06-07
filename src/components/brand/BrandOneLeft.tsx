import type { BrandData } from "@/lib/constants";
import ButtonBlue from "../ui/ButtonBlue";
import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";

interface BoxLeftItem {
  badge: string;
  image: string;
}

export default function BrandOneLeft({ data }: { data: BrandData }) {
  const ref = useRef();
  const [isInView, setIsInView] = useState(false);
  const [items, setItems] = useState<BoxLeftItem[]>([]);

  useEffect(() => {
    api.boxLeft().then((res: any) => {
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
        setItems(loose);
      } else {
        setItems(filtered);
      }
    }).catch(() => {});
  }, [data.name]);

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

  if (items.length === 0) return null;

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
      {items.map((banner, index) => (
        <div className={index > 0 ? "tb-8" : ""} key={index}>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] blur-[150px] pointer-events-none " />
          <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 max-w-full">
            <div className="flex flex-col lg:flex-row items-stretch overflow-hidden min-h-[500px] lg:min-h-[650px]">
              <div className="flex-[1.5] min-h-[350px] lg:min-h-full rounded-sm relative overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={banner.image}
                    alt={banner.badge}
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
              <div className="flex-[1] p-10 md:p-14 lg:p-20 flex flex-col justify-center relative z-10">
                <div className="w-14 h-1 mb-8" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                  {banner.badge}
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                  Engineered to
                  <br />
                  <span>Inspire</span>
                </h2>
                <p className="mt-6 text-base md:text-lg text-black leading-relaxed max-w-lg">
                  Every {banner.badge} is a masterpiece of design and
                  engineering. From the roar of the engine to the curve of the
                  chassis — experience automotive excellence at its finest.
                </p>
                <div className="mt-10 flex gap-4">
                  <ButtonBlue
                    to={`/listings?make=${data.slug}`}
                    children="Order Now"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
