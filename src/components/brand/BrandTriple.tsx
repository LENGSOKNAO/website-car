import type { BrandData, BrandSection } from "@/lib/constants";
import ButtonWhite from "../ui/ButtonWhite";
import { useEffect, useState, useRef } from "react";
import { imageUrl } from "@/lib/utils";
import { api } from "@/lib/api";

interface BoxTripItem {
  badge: string;
  title: string;
  description: string;
  image: string;
  to?: boolean;
  button_text?: string;
  button_url?: string;
  button_text_2?: string;
  button_url_2?: string;
}

function mapBoxTripItems(items: BrandSection[]): BoxTripItem[] {
  return items.map((item) => ({
    badge: item.name,
    title: item.tagline,
    description: item.description,
    image: item.image,
    to: item.to,
    button_text: item.button?.text,
    button_url: item.button?.url,
    button_text_2: item.button_2?.text,
    button_url_2: item.button_2?.url,
  }));
}

export default function BrandTriple({ data }: { data: BrandData }) {
  if (!data) return null;
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [items, setItems] = useState<BoxTripItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const boxTripsData = (data as any).boxTrips || (data as any).box_trips;
    if (boxTripsData?.length) {
      setItems(mapBoxTripItems(boxTripsData).slice(0, 3));
      setLoading(false);
    } else {
      api.boxTrips().then((res: any) => {
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
          setItems(mapBoxTripItems(loose).slice(0, 3));
        } else {
          setItems(mapBoxTripItems(filtered).slice(0, 3));
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

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:px-8 lg:px-16 xl:px-24">
        <div className="col-span-full h-[740px] flex items-center justify-center bg-white" />
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div
      className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:px-8 lg:px-16 xl:px-24 ${isInView ? "animate-slideUp" : ""}`}
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
      {items.map((e, index) => (
        <div key={index} className="group">
          <section className="relative h-[740px] w-full overflow-hidden rounded-sm">
            <img
              src={imageUrl(e.image)}
              alt={e.badge}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="relative w-full h-full px-6 py-8">
              <div className="absolute bottom-5 left-5 right-0 p-6">
                <p className="text-xs font-semibold uppercase text-white tracking-[0.1em] mb-2">
                  {e.badge}
                </p>
                <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                  {e.title}
                </h2>
                <p className="text-base text-white/90 mb-6 line-clamp-3">
                  {e.description}
                </p>
                <div className="flex flex-col gap-3">
                  {e.button_text && (
                    <ButtonBlue
                      to={`${e.button_url}`}
                      children={e.button_text}
                    />
                  )}
                  {e.button_text_2 && (
                    <ButtonWhite
                      to={`${e.button_url_2}`}
                      children={e.button_text_2}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}
