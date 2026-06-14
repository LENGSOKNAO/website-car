import type { BrandData, BrandSection } from "@/lib/constants";
import ButtonBlue from "../ui/ButtonBlue";
import ButtonWhite from "../ui/ButtonWhite";
import { useEffect, useState, useRef } from "react";
import { imageUrl } from "@/lib/utils";
import { Loader } from "lucide-react";
import { api } from "@/lib/api";

interface BoxLeftItem {
  badge: string;
  image: string;
  button_text?: string;
  button_url?: string;
  button_text_2?: string;
  button_url_2?: string;
}

function mapBoxLeftItems(items: (BrandSection | any)[]): BoxLeftItem[] {
  return items.map((item) => ({
    badge: item.name,
    image: item.image,
    button_text: item.button?.text ?? item.button_text,
    button_url: item.button?.url ?? item.button_url,
    button_text_2: item.button_2?.text ?? item.button_text_2,
    button_url_2: item.button_2?.url ?? item.button_url_2,
  }));
}

export default function BrandOneLeft({ data }: { data: BrandData }) {
  if (!data) return null;
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [items, setItems] = useState<BoxLeftItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const boxLeftData = (data as any).boxLeft || (data as any).box_left;
    if (boxLeftData?.length) {
      setItems(mapBoxLeftItems(boxLeftData));
      setLoading(false);
    } else {
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
          setItems(mapBoxLeftItems(loose));
        } else {
          setItems(mapBoxLeftItems(filtered));
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
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  if (items.length === 0 && !loading) return null;

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
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-975">
          <Loader className="w-10 h-10 text-gray-300 animate-spin" />
        </div>
      )}
      {items.map((banner, index) => (
        <div className={index > 0 ? "tb-8" : ""} key={index}>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] blur-[150px] pointer-events-none " />
          <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 max-w-full">
            <div className="flex flex-col lg:flex-row items-stretch overflow-hidden min-h-[500px] lg:min-h-[650px]">
              <div className="flex-[1.5] min-h-[350px] lg:min-h-full rounded-sm relative overflow-hidden">
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
                  {banner.button_text && (
                    <ButtonBlue
                      to={`${banner.button_url}`}
                      children={banner.button_text}
                    />
                  )}
                  {banner.button_text_2 && (
                    <ButtonWhite
                      to={`${banner.button_url_2}`}
                      children={banner.button_text_2}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
