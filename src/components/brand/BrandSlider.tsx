import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { cn, imageUrl } from "@/lib/utils";
import { api } from "@/lib/api";
import type { BrandData, BrandSection } from "@/lib/constants";
import ButtonBlue from "../ui/ButtonBlue";
import ButtonWhite from "../ui/ButtonWhite";

interface SlideItem {
  id: string;
  image: string;
  badge: string;
  title: string;
  description: string;
  button_text?: string;
  button_url?: string;
  button_text_2?: string;
  button_url_2?: string;
}

function mapSliderItems(items: any[]): SlideItem[] {
  return items.map((item, index) => ({
    id: item.id || item.name + index,
    image: item.image,
    badge: item.badge || item.user?.name || item.name,
    title: item.title || item.tagline,
    description: item.description,
    button_text: (item.button?.text ?? item.button_text) || "Order Now",
    button_url: (item.button?.url ?? item.button_url) || `/listings?make=${(item.badge || item.user?.name || item.name).toLowerCase()}`,
    button_text_2: (item.button_2?.text ?? item.button_text_2) || "Learn More",
    button_url_2: (item.button_2?.url ?? item.button_url_2) || `/brand/${(item.badge || item.user?.name || item.name).toLowerCase()}`,
  }));
}

export default function BrandSlider({ data }: { data: BrandData }) {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState<string | null>(null);

  if (!data) return null;

  useEffect(() => {
    setLoading(true);
    api.sliders().then((res: any) => {
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
        setSlides(mapSliderItems(loose));
      } else {
        setSlides(mapSliderItems(filtered));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [data]);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.1 },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  if (slides.length === 0 && !loading) return null;

  const handleImageLoad = (src: string) => {
    setImageLoading(prev => prev === src ? null : prev);
  };

  return (
    <section
      className={`relative min-h-[85vh] flex items-center overflow-hidden ${isInView ? "animate-slideUp" : ""}`}
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
      {slides.map((e, i) => (
        <div
          key={e.id}
          className={cn(
            "absolute inset-0 transition-all duration-700",
            i === current ? "opacity-100 scale-100" : "opacity-0 scale-105",
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <img
              src={imageUrl(e.image)}
              alt=""
              className="w-full h-full object-cover"
              onLoad={() => handleImageLoad(e.image)}
              style={{ opacity: imageLoading === e.image ? 0 : 1, transition: 'opacity 0.3s' }}
            />
            {imageLoading === e.image && (
              <Loader className="w-10 h-10 text-gray-300 animate-spin absolute" />
            )}
          </div>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(70deg, black 0%, black 10%, transparent 80%)`,
            }}
          />
          <div className="absolute inset-0 bg-dark-975/30" />
        </div>
      ))}
      {slides[current] && (
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
                {slides[current].badge}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight"
              >
                {slides[current].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-6 text-base md:text-lg text-dark-300/80 max-w-xl leading-relaxed"
              >
                {slides[current].description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 flex items-start gap-4"
              >
                {slides[current].button_text && (
                  <ButtonBlue
                    to={`${slides[current].button_url}`}
                    children={slides[current].button_text}
                  />
                )}
                {slides[current].button_text_2 && (
                  <ButtonWhite
                    to={`${slides[current].button_url_2}`}
                    children={slides[current].button_text_2}
                  />
                )}
              </motion.div>
            </div>
          </div>

          {slides.length > 1 && (
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
