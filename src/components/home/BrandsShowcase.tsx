import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BRANDS, BRAND_PAGES } from "@/lib/constants";

export default function BrandsShowcase() {
  return (
    <section className="py-20 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs text-dark-400 uppercase tracking-widest mb-2">
              Explore Brands
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              World-Class Manufacturers
            </h2>
          </div>
          <Link
            to="/listings"
            className="hidden sm:flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
          >
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {BRANDS.map((brand, i) => {
            const pageData = BRAND_PAGES.find((p) => p.slug === brand.slug);
            const image = pageData?.slider?.images?.[0];

            return (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={pageData?.route ?? `/${brand.slug}`}
                  className="group relative block aspect-[4/5] rounded-sm overflow-hidden bg-dark-900 border border-dark-800"
                >
                  {image && (
                    <img
                      src={image}
                      alt={brand.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <div
                      className="w-8 h-[2px] rounded-full mb-2.5 transition-all duration-500 group-hover:w-12"
                      style={{ backgroundColor: brand.color }}
                    />
                    <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
                      {brand.name}
                    </h3>
                    {pageData && (
                      <p className="text-xs text-white/50 mt-1 leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-white/70">
                        {pageData.slider.tagline}
                      </p>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
