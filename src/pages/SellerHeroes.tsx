import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, LogIn, Car } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Skeleton from "@/components/ui/Skeleton";

export default function SellerHeroes() {
  const { user, isAuthenticated } = useAuth();
  const [heroes, setHeroes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .heroes()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        const all = Array.isArray(raw) ? raw : [];
        setHeroes(all.filter((h: any) => h.user?.id === user?.id || h.seller_id === user?.id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

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
                <div key={hero.id} className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-12 rounded-sm bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {hero.image ? (
                      <img src={hero.image} alt={hero.title || ""} className="w-full h-full object-cover" />
                    ) : (
                      <Layout className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-gray-900 truncate">{hero.title || "Untitled"}</p>
                    {Array.isArray(hero.subtitle) && hero.subtitle.length > 0 && (
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">
                        {hero.subtitle.map((s: any) => s.label || s.name || s).join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{hero.type || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
