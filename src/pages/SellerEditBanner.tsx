import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Image, LogIn, X, Loader2, Upload, Film, LayoutGrid, PanelRight, PanelLeft, Grid3X3 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SellerEditBanner() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [buttonText2, setButtonText2] = useState("");
  const [buttonUrl2, setButtonUrl2] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [bannerType, setBannerType] = useState("");
  const [isActive, setIsActive] = useState(true);

  const TYPE_LABELS: Record<string, { label: string; icon: any }> = {
    slider: { label: "Slider", icon: Film },
    boxTrips: { label: "Banner Trips", icon: LayoutGrid },
    boxone: { label: "Banner One", icon: PanelRight },
    boxonebuttom: { label: "Banner One Buttom", icon: PanelRight },
    boxRight: { label: "Banner Right", icon: PanelRight },
    boxLeft: { label: "Banner Left", icon: PanelLeft },
    boxTen: { label: "Banner Ten", icon: Grid3X3 },
  };

  const SECTIONS = [
    { key: "slider", label: "Slider", icon: Film },
    { key: "boxTrips", label: "Banner Trips", icon: LayoutGrid },
    { key: "boxone", label: "Banner One", icon: PanelRight },
    { key: "boxonebuttom", label: "Banner One Buttom", icon: PanelRight },
    { key: "boxRight", label: "Banner Right", icon: PanelRight },
    { key: "boxLeft", label: "Banner Left", icon: PanelLeft },
    { key: "boxTen", label: "Banner Ten", icon: Grid3X3 },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!id) return;

    api.webItem(id)
      .then((res) => {
        const item = res?.data?.data ?? res?.data ?? res;
        if (!item) {
          navigate("/seller/banner");
          return;
        }
        setTitle(item.title || "");
        setSubtitle(item.subtitle || "");
        setTagline(item.tagline || "");
        setDescription(item.description || "");
        setImageUrl(item.image_url || item.image || "");
        setButtonText(item.button_text || "");
        setButtonUrl(item.button_url || "");
        setButtonText2(item.button_text_2 || "");
        setButtonUrl2(item.button_url_2 || "");
        setBadgeText(item.badge_text || item.badge || "");
        setLinkUrl(item.link_url || "");
        setBannerType(item.type || "");
        setIsActive(item.is_active ?? true);
      })
      .catch(() => navigate("/seller/banner"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate, id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to edit banners</h2>
          <Link to="/login" className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors">
            <LogIn className="w-4 h-4 mr-2" /> Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await api.upload(imageFile);
      }

      const payload: Record<string, any> = {
        title,
        subtitle,
        tagline,
        description,
        image_url: finalImageUrl,
        button_text: buttonText,
        button_url: buttonUrl,
        button_text_2: buttonText2,
        button_url_2: buttonUrl2,
        badge_text: badgeText,
        link_url: linkUrl,
        is_active: isActive,
        type: bannerType,
      };

      Object.keys(payload).forEach((k) => {
        if (!payload[k]) delete payload[k];
      });

      await api.updateBanner(id, payload);
      navigate("/seller/banner");
    } catch (err: any) {
      alert(err.message || "Failed to update banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <Loader2 className="w-10 h-10 mx-auto mb-4 text-gray-300 animate-spin" />
          <h2 className="text-base font-semibold text-gray-900">Loading banner...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">Edit Banner</h1>
            <Link to="/seller/banner" className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <div className="flex gap-2 flex-wrap">
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBannerType(key)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[11px] font-medium transition-colors ${
                      bannerType === key
                        ? "bg-gray-900 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-xs font-medium text-gray-700 mb-1">Subtitle</label>
              <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>

            <div>
              <label htmlFor="tagline" className="block text-xs font-medium text-gray-700 mb-1">Tagline</label>
              <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Short tagline" />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-sm border border-gray-200 px-3 py-2 text-xs text-gray-900 bg-white placeholder-gray-400 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative flex cursor-pointer flex-col items-center gap-2 rounded-sm border-2 border-dashed border-gray-200 p-6 transition-colors hover:border-gray-400"
              >
                {(imagePreview || imageUrl) ? (
                  <img src={imagePreview ?? imageUrl} alt="Preview" className="max-h-32 object-contain rounded-sm" />
                ) : (
                  <>
                    <Upload className="size-6 text-gray-300" />
                    <p className="text-xs text-gray-400">Click to upload image</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              {imageUrl && !imageFile && (
                <p className="text-[10px] text-gray-400 mt-1">Leave empty to keep current image</p>
              )}
            </div>

            <div>
              <label htmlFor="badgeText" className="block text-xs font-medium text-gray-700 mb-1">Badge Text</label>
              <Input id="badgeText" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} placeholder="Trusted by 10K+" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="buttonText" className="block text-xs font-medium text-gray-700 mb-1">Button 1 Text</label>
                <Input id="buttonText" value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Learn More" />
              </div>
              <div>
                <label htmlFor="buttonUrl" className="block text-xs font-medium text-gray-700 mb-1">Button 1 URL</label>
                <Input id="buttonUrl" value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="buttonText2" className="block text-xs font-medium text-gray-700 mb-1">Button 2 Text</label>
                <Input id="buttonText2" value={buttonText2} onChange={(e) => setButtonText2(e.target.value)} placeholder="Browse Models" />
              </div>
              <div>
                <label htmlFor="buttonUrl2" className="block text-xs font-medium text-gray-700 mb-1">Button 2 URL</label>
                <Input id="buttonUrl2" value={buttonUrl2} onChange={(e) => setButtonUrl2(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div>
              <label htmlFor="linkUrl" className="block text-xs font-medium text-gray-700 mb-1">Link URL</label>
              <Input id="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="isActive" className="text-xs font-medium text-gray-700">Active</label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => navigate("/seller/banner")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
