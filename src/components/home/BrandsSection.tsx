import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { api } from "@/lib/api";
import { imageUrl } from "@/lib/utils";

export default function BrandsSection() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    api
      .sliders()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        const list = Array.isArray(raw) ? raw : [];
        const map = new Map<string, any>();
        for (const s of list) {
          const u = s.user;
          if (u?.id && !map.has(u.id)) {
            map.set(u.id, {
              ...u,
              full_name: u.full_name ?? u.name,
              avatar_url: u.avatar_url ?? u.avatar ?? u.image,
            });
          }
        }
        if (map.size > 0) {
          setSellers(Array.from(map.values()));
          return;
        }
      })
      .catch(() => {});
  }, []);

  if (sellers.length === 0) return null;

  const doubled = [...sellers, ...sellers];

  return (
    <section className="py-20 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
            Our Network
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Trusted Sellers
          </h2>
        </motion.div>
      </div>
      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex gap-14 md:gap-20 items-center"
          animate={paused ? { x: 0 } : { x: ["0%", "-50%"] }}
          transition={
            paused ? {} : { duration: 50, ease: "linear", repeat: Infinity }
          }
        >
          {doubled.map((seller, i) => {
            const name =
              seller.dealer_name || seller.full_name || seller.name || "Seller";
          return (
            <Link
              key={`${seller.id}-${i}`}
              to={`/${encodeURIComponent(seller.full_name.toLowerCase())}`}
              className="flex flex-col items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
            >
              <div className="relative">
                {seller.avatar_url ? (
                  <img
                    src={imageUrl(seller.avatar_url)}
                    alt={name}
                    className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-blue-400/50 transition-all duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] group-hover:border-gray-200 group-hover:-translate-y-0.5 group-hover:scale-105 flex flex-col items-center justify-center gap-1 transition-all duration-300">
                    <Store className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                    <span className="text-[10px] md:text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors text-center px-1">
                      {seller.full_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Optional: Add name below for better UX */}
              {/* <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
      {seller.full_name}
    </span> */}
            </Link>
          );
          })}
        </motion.div>
      </div>
    </section>
  );
}
