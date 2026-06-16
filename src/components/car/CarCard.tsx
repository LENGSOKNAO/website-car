import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, ChevronDown } from "lucide-react";
import type { CarListing } from "@/lib/types";
import { formatPrice, imageUrl } from "@/lib/utils";
import ImageWithLoading from "@/components/ui/ImageWithLoading";

interface CarCardProps {
  listing: CarListing;
  index?: number;
}

export default function CarCard({ listing, index = 0 }: CarCardProps) {
  const img = listing.primary_image || listing.images?.[0];
  const price = Number(listing.price);
  const origPrice = listing.original_price
    ? Number(listing.original_price)
    : null;

  const delay = index * 0.04;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="relative h-screen w-full bg-white"
    >
      <Link to={`/listings/${listing.id}`} className="block h-full">
        {img ? (
          <ImageWithLoading
            src={imageUrl(img.image_url)}
            alt=""
            fill
            priority={index === 0}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Car className="w-20 h-20 text-gray-300" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent pb-16 pt-32">
          <div className="flex flex-col items-center text-center px-8">
            <h2 className="text-2xl md:text-4xl font-medium text-gray-00">
              {listing.model?.name}
            </h2>

            <button className="mt-6 px-20 py-3 rounded-sm bg-blue-500 text-white text-sm font-medium hover:bg-blue-400 cursor-pointer transition-colors">
              Order Now
            </button>
          </div>
        </div>
      </Link>

      {index === 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </div>
      )}
    </motion.div>
  );
}
