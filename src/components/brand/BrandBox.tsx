import type { BrandData, BrandSection } from "@/lib/constants";
import ButtonBlue from "../ui/ButtonBlue";
import ButtonWhite from "../ui/ButtonWhite";
import { useEffect, useState, useRef } from "react";
import { imageUrl } from "@/lib/utils";
import { Loader } from "lucide-react";
import { api } from "@/lib/api";
import ImageWithLoading from "@/components/ui/ImageWithLoading";

interface BoxRightItem {
  badge: string;
  description: string;
  title: string;
  image: string;
  button_text?: string;
  button_url?: string;
  button_text_2?: string;
  button_url_2?: string;
}

function mapBoxRightItems(items: (BrandSection | any)[]): BoxRightItem[] {
  return items.map((item) => ({
    badge: item.name,
    description: item.description,
    title: item.title,
    image: item.image,
    button_text: item.button?.text ?? item.button_text,
    button_url: item.button?.url ?? item.button_url,
    button_text_2: item.button_2?.text ?? item.button_text_2,
    button_url_2: item.button_2?.url ?? item.button_url_2,
  }));
}

export default function BrandBox({ data }: { data: BrandData }) {
  if (!data) return null;
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [items, setItems] = useState<BoxRightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const boxRightData = (data as any).boxRight || (data as any).box_right;
    if (boxRightData?.length) {
      setItems(mapBoxRightItems(boxRightData));
      setLoading(false);
    } else {
      api
        .boxRight()
        .then((res: any) => {
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
            setItems(mapBoxRightItems(loose));
          } else {
            setItems(mapBoxRightItems(filtered));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
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
      className={`relative overflow-hidden ${isInView ? "animate-slideUp" : ""}`}
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
      {items.map((e, i) => (
        <div key={i} className={i > 0 ? "pt-8" : ""}>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] blur-[150px] pointer-events-none" />
          <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 max-w-full">
            <div className="flex flex-row items-stretch overflow-hidden min-h-[650px]">
              <div className="flex-[1] p-10 md:p-14 lg:p-20 flex flex-col justify-center relative z-10">
                <div className="w-14 h-1 mb-8" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                  {e.badge}
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                  {e.title}
                </h2>
                <p className="mt-6 text-base md:text-lg text-black leading-relaxed max-w-lg">
                  {e.description}
                </p>
                <div className="mt-10 flex gap-4">
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
              <div className="flex-[1.5] min-h-full rounded-sm relative overflow-hidden">
                <ImageWithLoading
                  src={imageUrl(e.image)}
                  alt={e.badge}
                  fill
                  priority
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(70deg, black 0%, black 10%, transparent 80%)`,
                  }}
                />
                <div className="absolute inset-0 bg-dark-975/30" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-dark-900/60" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
