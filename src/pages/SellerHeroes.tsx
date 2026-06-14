import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, LogIn, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Skeleton from "@/components/ui/Skeleton";

export default function SellerHeroes() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [heroes, setHeroes] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      api.heroes(),
      api.myListings({ per_page: 200 }),
    ])
      .then(([heroesRes, listingsRes]) => {
        const rawHeroes = heroesRes?.data?.data ?? heroesRes?.data ?? heroesRes ?? [];
        const allHeroes = Array.isArray(rawHeroes) ? rawHeroes : [];
        setHeroes(allHeroes.filter((h: any) => h.seller_id === user?.id));

        const rawListings = listingsRes?.data?.data?.data ?? listingsRes?.data?.data ?? listingsRes?.data ?? listingsRes ?? [];
        setListings(Array.isArray(rawListings) ? rawListings : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleDelete = (hero: any) => {
    if (!confirm(`Delete hero "${hero.title}"?`)) return;
    api
      .deleteHero(hero.id)
      .then(() => fetchData())
      .catch((err: any) => alert(err.message || "Failed to delete hero"));
  };

  const getListing = (id: string) => listings.find((l: any) => l.id === id);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <Layout className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to manage heroes</h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" /> Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">Heroes</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">{heroes.length} hero{heroes.length !== 1 ? "es" : ""}</p>
          </div>
          <Link
            to="/seller/heroes/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Hero
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-3">
                  <Skeleton className="w-16 h-12 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : heroes.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-sm bg-gray-100 flex items-center justify-center">
                <Layout className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">No heroes</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">No heroes available.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {heroes.map((hero: any) => (
                <div key={hero.id} className="px-3 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-sm bg-gray-100 flex items-center justify-center shrink-0">
                      <Layout className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-gray-900 truncate">{hero.title || "Untitled"}</p>
                      {Array.isArray(hero.subtitle) && hero.subtitle.length > 0 && (
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">
                          {hero.subtitle.map((s: any) => s.text ?? s).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${hero.is_active ? "bg-green-400" : "bg-gray-300"}`} />
                      <span className="text-[10px] text-gray-400">{hero.is_active ? "Active" : "Inactive"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/seller/heroes/${hero.id}/edit`)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-sm hover:bg-gray-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(hero)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-sm hover:bg-gray-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {Array.isArray(hero.subtitle) && hero.subtitle.some((s: any) => s.product_id) && (
                    <div className="mt-2 ml-15 flex flex-wrap gap-1.5">
                      {hero.subtitle.filter((s: any) => s.product_id).map((s: any, i: number) => {
                        const listing = getListing(s.product_id);
                        return (
                          <Link
                            key={i}
                            to={`/listings/${s.product_id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-100 rounded-sm hover:bg-blue-50 hover:border-blue-100 transition-colors group"
                          >
                            {listing?.primary_image?.image_url || listing?.image_url ? (
                              <img
                                src={listing.primary_image?.image_url || listing.image_url}
                                alt=""
                                className="w-5 h-4 object-cover rounded-[2px]"
                              />
                            ) : null}
                            <span className="text-[10px] text-gray-600 group-hover:text-blue-600 truncate max-w-[120px]">
                              {listing
                                ? `${listing.make?.name ?? listing.make ?? ""} ${listing.model?.name ?? listing.model ?? ""} ${listing.year ?? ""}`.trim() || listing.title || s.text
                                : s.text}
                            </span>
                            <ExternalLink className="w-2.5 h-2.5 text-gray-300 group-hover:text-blue-400 shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
