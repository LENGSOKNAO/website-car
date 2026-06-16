import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout, LogIn, Plus, X, Loader2, Trash2, Save } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface SubtitleEntry {
  text: string;
  product_id: string | null;
  link?: string;
}

interface ListingOption {
  id: string;
  title?: string;
  make?: string;
  model?: string;
  year?: number;
}

export default function SellerEditHero() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState<SubtitleEntry[]>([
    { text: "", product_id: null, link: "" },
  ]);
  const [isActive, setIsActive] = useState(true);
  const [listings, setListings] = useState<ListingOption[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!id) return;

    Promise.all([api.hero(id), api.myListings({ per_page: 200 })])
      .then(([heroRes, listingsRes]) => {
        const hero = heroRes?.data?.data ?? heroRes?.data ?? heroRes;
        const listingsData =
          listingsRes?.data?.data?.data ??
          listingsRes?.data?.data ??
          listingsRes?.data ??
          listingsRes ??
          [];
        setListings(Array.isArray(listingsData) ? listingsData : []);

        if (hero) {
          setTitle(hero.title || "");
          setSubtitle(
            Array.isArray(hero.subtitle) && hero.subtitle.length > 0
              ? hero.subtitle.map((s: any) => ({
                  text: s.text ?? "",
                  product_id: s.product_id ?? null,
                  link:
                    s.link || (s.product_id ? `/listings/${s.product_id}` : ""),
                }))
              : [{ text: "", product_id: null, link: "" }],
          );
          setIsActive(hero.is_active ?? true);
        }
      })
      .catch(() => navigate("/seller/heroes"))
      .finally(() => {
        setLoading(false);
        setFetching(false);
      });
  }, [isAuthenticated, navigate, id]);

  const updateSubtitleText = (idx: number, text: string) => {
    setSubtitle((prev) => prev.map((s, i) => (i === idx ? { ...s, text } : s)));
  };

  const updateSubtitleProduct = (idx: number, productId: string) => {
    setSubtitle((prev) =>
      prev.map((s, i) =>
        i === idx
          ? {
              ...s,
              product_id: productId || null,
              link: productId ? `/listings/${productId}` : "",
            }
          : s,
      ),
    );
  };

  const addSubtitleLine = () => {
    setSubtitle((prev) => [...prev, { text: "", product_id: null, link: "" }]);
  };

  const removeSubtitleLine = (idx: number) => {
    setSubtitle((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    try {
      const filteredSubtitle = subtitle
        .filter((s) => s.text.trim() || s.link?.trim() || s.product_id)
        .map((s) => {
          const entry: SubtitleEntry = {
            text: s.text.trim(),
            product_id: s.product_id,
          };
          if (s.link?.trim()) {
            entry.link = s.link.trim();
          }
          return entry;
        });

      const payload = {
        title,
        subtitle: filteredSubtitle.length > 0 ? filteredSubtitle : null,
        is_active: isActive,
      };

      await api.updateHero(id, payload);
      navigate("/seller/heroes");
    } catch (err: any) {
      alert(err.message || "Failed to update hero");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <Layout className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">
              Edit Hero
            </h1>
            <Link
              to="/seller/heroes"
              className="text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.preventDefault();
                navigate("/seller/heroes");
              }}
            >
              <X className="w-5 h-5" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vehicles, Energy, Charging"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Subtitle Lines
              </label>
              <div className="space-y-3">
                {subtitle.map((entry, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-sm p-4 space-y-4 bg-white"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <div className="size-1.5 rounded-full bg-gray-900" />
                      <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-widest">
                        Line {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSubtitleLine(idx)}
                        className="ml-auto p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-600">
                        Text
                      </label>
                      <Input
                        value={entry.text}
                        onChange={(e) =>
                          updateSubtitleText(idx, e.target.value)
                        }
                        placeholder="e.g. Model, Powerwall, Supercharging"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-gray-600">
                        Product
                      </label>
                      <select
                        value={entry.product_id ?? ""}
                        onChange={(e) =>
                          updateSubtitleProduct(idx, e.target.value)
                        }
                        className="w-full rounded-sm border border-gray-300 px-4 py-2.5 text-sm text-gray-800 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none"
                      >
                        <option value="">—</option>
                        {listings.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.title ||
                              `${l.make ?? ""} ${l.model ?? ""} ${l.year ?? ""}`.trim() ||
                              l.id}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSubtitleLine}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Line
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label
                htmlFor="isActive"
                className="text-xs font-medium text-gray-700"
              >
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" className="rounded-sm px-6 py-2.5" onClick={() => navigate("/seller/heroes")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-sm px-6 py-2.5">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4.5 h-4.5 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
