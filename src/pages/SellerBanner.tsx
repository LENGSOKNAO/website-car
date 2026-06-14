import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, LogIn, Plus, Film, LayoutGrid, PanelRight, PanelLeft, Grid3X3, Columns } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Skeleton from "@/components/ui/Skeleton";

const SECTIONS = [
  { key: "sliders" as const, label: "Sliders", icon: Film, desc: "Homepage hero slides" },
  { key: "boxTrips" as const, label: "Banner Trips", icon: LayoutGrid, desc: "Trip boxes" },
  { key: "boxOne" as const, label: "Banner One", icon: PanelRight, desc: "Single box" },
  { key: "boxOneButtom" as const, label: "Banner One Buttom", icon: PanelRight, desc: "Single box" },
  { key: "boxRight" as const, label: "Banner Right", icon: PanelRight, desc: "Right side box" },
  { key: "boxLeft" as const, label: "Banner Left", icon: PanelLeft, desc: "Left side box" },
  { key: "boxTen" as const, label: "Banner Ten", icon: Grid3X3, desc: "Ten-box grid" },
];

const fetchers: Record<string, () => Promise<{ data: any }>> = {
  sliders: () => api.sliders(),
  boxTrips: () => api.boxTrips(),
  boxOne: () => api.boxOne(),
  boxRight: () => api.boxRight(),
  boxLeft: () => api.boxLeft(),
  boxTen: () => api.boxTen(),
  boxOneButtom: () => api.boxOneButtom(),
};

export default function SellerBanner() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("sliders");

  useEffect(() => {
    setLoading(true);
    const entries = SECTIONS.map(async ({ key }) => {
      try {
        const res = await fetchers[key]();
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        const all = Array.isArray(raw) ? raw : [];
        const filtered = all.filter((item: any) => item.user?.id === user?.id || item.seller_id === user?.id);
        return { key, items: filtered };
      } catch {
        return { key, items: [] };
      }
    });
    Promise.all(entries).then((results) => {
      const map: Record<string, any[]> = {};
      for (const r of results) map[r.key] = r.items;
      setData(map);
      setLoading(false);
    });
  }, [user?.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to manage banners</h2>
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

  const activeItems = data[activeSection] || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">Banners</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {activeItems.length} item{activeItems.length !== 1 ? "s" : ""} in {SECTIONS.find(s => s.key === activeSection)?.label}
            </p>
          </div>
          <Link
            to={`/seller/banner/new?type=${activeSection}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-colors"
          >
            <Plus className="w-3 h-3" /> New Banner
          </Link>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {SECTIONS.map(({ key, label, icon: Icon, desc }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[11px] font-medium transition-colors ${
                activeSection === key
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
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
          ) : activeItems.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-sm bg-gray-100 flex items-center justify-center">
                <Image className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">No items</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">No {SECTIONS.find(s => s.key === activeSection)?.label.toLowerCase()} found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activeItems.map((item: any, idx: number) => (
                <div key={item.id ?? idx} className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-12 rounded-sm bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image?.startsWith("http") ? item.image : item.image}
                        alt={item.title || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-gray-900 truncate">{item.title || item.name || "Untitled"}</p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.badge || item.description || item.subtitle || "—"}</p>
                  </div>
                  {item.order !== undefined && (
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">#{item.order}</span>
                  )}
                  {item.link && (
                    <span className="text-[10px] text-gray-400 truncate max-w-[120px] hidden sm:block">{item.link}</span>
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
