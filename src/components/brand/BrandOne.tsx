import type { BrandData, BrandSection } from "@/lib/constants";
import ButtonBlue from "../ui/ButtonBlue";
import { useEffect, useState, useRef } from "react";
import { imageUrl } from "@/lib/utils";
import { Loader } from "lucide-react";
import { api } from "@/lib/api";

interface BoxOneItem {
  badge: string;
  description: string;
  image: string;
}

function mapBoxOneItems(items: BrandSection[]): BoxOneItem[] {
  return items.map((item) => ({
    badge: item.name,
    description: item.description,
    image: item.image,
  }));
}

export default function BrandOne({ data }: { data: BrandData }) {
  if (!data) return null;
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [items, setItems] = useState<BoxOneItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const boxOneData = (data as any).boxone || (data as any).box_one;
    if (boxOneData?.length) {
      setItems(mapBoxOneItems(boxOneData));
      setLoading(false);
    } else {
      api.boxOne().then((res: any) => {
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
          setItems(mapBoxOneItems(loose));
        } else {
          setItems(mapBoxOneItems(filtered));
        }
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  if (items.length === 0 && !loading) return null;

  return (
    <section
      className={`relative h-[60vh] sm:h-[70vh]  md:h-[80vh] lg:h-[90vh] flex items-end overflow-hidden ${isInView ? "animate-slideUp" : ""}`}
      ref={ref}
    >
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
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-975">
          <Loader className="w-10 h-10 text-gray-300 animate-spin" />
        </div>
      )}
      {items.map((banner, index) => (
        <div className={index > 0 ? "pb-5" : ""} key={index}>
          <div className="absolute inset-0">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <img
                src={imageUrl(banner.image)}
                alt={banner.badge}
                className="w-full h-full object-cover"
              />
              <Loader className="w-10 h-10 text-gray-300 animate-spin" />
            </div>
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
                {banner.badge}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                The Future of Driving
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-dark-300 max-w-lg leading-relaxed">
                {banner.description}
              </p>
              <div className="mt-5 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <ButtonBlue
                  to={`/listings?make=${banner.badge}`}
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
