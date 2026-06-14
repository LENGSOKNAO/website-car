import { useParams } from "react-router-dom";
import BrandBox from "@/components/brand/BrandBox";
import BrandOne from "@/components/brand/BrandOne";
import BrandSlider from "@/components/brand/BrandSlider";
import BrandTenSlider from "@/components/brand/BrandTenSlider";
import BrandTriple from "@/components/brand/BrandTriple";
import BrandOneLeft from "@/components/brand/BrandOneLeft";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { BrandData } from "@/lib/constants";

export default function BrandPage() {
  const { name } = useParams<{ name: string }>();
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    api
      .brand(name)
      .then((res: any) => {
        const data = res?.data?.data ?? res?.data ?? res ?? null;
        if (data) {
          setBrandData({
            ...data,
            name: data.name || data.full_name || name,
            slug: data.slug || name,
          } as BrandData);
          setLoading(false);
        } else {
          throw new Error("No data");
        }
      })
      .catch(() => {
        api
          .users()
          .then((res: any) => {
            const raw = res?.data?.data ?? res?.data ?? res ?? [];
            const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
            const filtered = list.filter((u: any) => {
              const roleName = (u.role || u.type || "").toLowerCase();
              const hasRole = u.roles?.some(
                (r: any) =>
                  (typeof r === "string" ? r : r.name || "").toLowerCase() === "seller",
              );
              return roleName === "seller" || roleName === "dealer" || u.is_dealer || hasRole;
            });
            const found = filtered.find(
              (s: { full_name: string }) => s.full_name.toLowerCase() === name.toLowerCase(),
            );
            if (found) {
              setBrandData({
                ...found,
                name: found.full_name,
                slug: name,
                slider: [],
                box: [],
                boxTrips: [],
                boxone: [],
                boxTen: [],
                boxLeft: [],
                boxRight: [],
                heroBg: "",
                heroFrom: "",
                heroVia: "",
                heroTo: "",
                stats: [],
                models: [],
                accentColor: "",
                route: "",
              } as BrandData);
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      });
  }, [name]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-[85vh] bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!brandData) return null;

  return (
    <div className="space-y-8">
      <BrandSlider data={brandData} />
      <BrandTriple data={brandData} />
      <BrandOne data={brandData} />
      <BrandBox data={brandData} />
      <BrandOne data={brandData} />
      <BrandOneLeft data={brandData} />
      <BrandTenSlider data={brandData} />
    </div>
  );
}
