import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Car, Trash2, Loader } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { SavedListing } from "@/lib/types";
import { formatPrice, imageUrl } from "@/lib/utils";
import ImageWithLoading from "@/components/ui/ImageWithLoading";

export default function Wishlist() {
  const { isAuthenticated } = useAuth();
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    api.savedListings()
      .then((res) => {
        const raw = res?.data;
        const d = Array.isArray(raw) ? raw : raw?.data ?? [];
        setSavedListings(Array.isArray(d) ? d : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  async function handleRemove(listingId: string) {
    setRemoving(listingId);
    try {
      await api.unsaveListing(listingId);
      setSavedListings((prev) => prev.filter((s) => s.listing_id !== listingId));
    } catch {}
    setRemoving(null);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view your wishlist</h2>
          <p className="text-sm text-gray-500 mb-6">Save your favorite vehicles and come back to them anytime.</p>
          <Link to="/login" className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm mb-1">
            <Link to="/" className="text-gray-400 hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Wishlist</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">My Wishlist</h1>
          {savedListings.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">{savedListings.length} saved vehicle{savedListings.length !== 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-100 animate-pulse h-72" />
            ))}
          </div>
        ) : savedListings.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Your wishlist is empty</h3>
            <p className="text-sm text-gray-500 mb-6">Start saving vehicles you love and they'll appear here.</p>
            <Link to="/listings" className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors">Browse Vehicles</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((saved, i) => {
              const listing = saved.listing;
              const img = listing.primary_image || listing.images?.[0];
              return (
                <motion.div
                  key={saved.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/listings/${listing.id}`} className="block">
<div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                       {img ? (
                         <ImageWithLoading src={imageUrl(img.image_url)} alt="" fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {listing.make?.name} {listing.model?.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{listing.year} &middot; {listing.mileage ? `${listing.mileage.toLocaleString()} mi` : "N/A"}</p>
                      <p className="text-sm font-bold text-gray-900 mt-2">{formatPrice(listing.price)}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(saved.listing_id)}
                    disabled={removing === saved.listing_id}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
                  >
                    {removing === saved.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
