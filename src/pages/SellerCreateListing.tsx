import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, X, Star, CheckCircle, Car, ArrowLeft, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { COLORS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Combobox from "@/components/ui/Combobox";
import ImageWithLoading from "@/components/ui/ImageWithLoading";

interface ImagePreview {
  file: File;
  preview: string;
}

export default function SellerCreateListing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [makes, setMakes] = useState<{ id: string; name: string }[]>([]);
  const [allModels, setAllModels] = useState<{ id: string; name: string; make_id: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: string; name: string }[]>([]);
  const [conditionOptions, setConditionOptions] = useState<{ id: string; name: string }[]>([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState<{ id: string; name: string }[]>([]);
  const [transmissionOptions, setTransmissionOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [makeId, setMakeId] = useState("");
  const [modelId, setModelId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState("");
  const [vin, setVin] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [total, setTotal] = useState("1");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [color, setColor] = useState("");
  const [interiorColor, setInteriorColor] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("in_stock");
  const [prevTotal, setPrevTotal] = useState("1");

  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    Promise.all([
      api.makes(),
      api.models(),
      api.categories(),
      api.conditions(),
      api.fuelTypes(),
      api.transmissions(),
    ])
      .then(([makesRes, modelsRes, categoriesRes, conditionsRes, fuelTypesRes, transmissionsRes]) => {
        const m = makesRes?.data?.data;
        setMakes(Array.isArray(m) ? m : []);
        const md = modelsRes?.data?.data;
        setAllModels(Array.isArray(md) ? md : []);
        const cat = categoriesRes?.data?.data;
        setCategoryOptions(Array.isArray(cat) ? cat : []);
        const c = conditionsRes?.data?.data;
        setConditionOptions(Array.isArray(c) ? c : []);
        const f = fuelTypesRes?.data?.data;
        setFuelTypeOptions(Array.isArray(f) ? f : []);
        const t = transmissionsRes?.data?.data;
        setTransmissionOptions(Array.isArray(t) ? t : []);
      })
      .catch(() => {
        setMakes([]);
        setAllModels([]);
        setCategoryOptions([]);
        setConditionOptions([]);
        setFuelTypeOptions([]);
        setTransmissionOptions([]);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const models = makeId ? allModels.filter((m) => m.make_id === makeId) : [];

  useEffect(() => {
    setModelId("");
  }, [makeId]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index].preview);
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    if (primaryIndex >= updated.length) {
      setPrimaryIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!year || !makeId || !modelId) {
      setError("Year, Make, and Model are required");
      return;
    }
    if (!price) {
      setError("Price is required");
      return;
    }
    if (!condition) {
      setError("Condition is required");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("make_id", makeId);
      formData.append("model_id", modelId);
      formData.append("year", year);
      formData.append("price", price);
      if (originalPrice) formData.append("original_price", originalPrice);
      formData.append("total", total || "1");
      if (categoryId) formData.append("category_id", categoryId);
      if (mileage) formData.append("mileage", mileage);
      if (fuelType) formData.append("fuel_type", fuelType);
      if (transmission) formData.append("transmission", transmission);
      if (engineSize) formData.append("engine_size", engineSize);
      if (color) formData.append("color", color);
      if (interiorColor) formData.append("interior_color", interiorColor);
      if (condition) formData.append("condition", condition);
      if (vin) formData.append("vin", vin);
      if (description) formData.append("description", description);
      if (location) formData.append("location", location);
      formData.append("status", status);
      formData.append("primary_index", primaryIndex.toString());

      previews.forEach((img) => {
        formData.append("images[]", img.file);
      });

      await api.createListingFormData(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-14 md:pt-16">
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="bg-white shadow-sm rounded-xl p-10">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Listing Submitted!</h1>
            <p className="text-sm text-gray-500 mb-8">Your vehicle has been submitted and will be reviewed shortly.</p>
            <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => navigate("/seller/listings")}>
              View Listings
            </Button>
            <Button onClick={() => window.location.reload()}>List Another Car</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-14 md:pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <button
          onClick={() => navigate("/seller/listings")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 mb-5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Listings
        </button>

        <div className="bg-white shadow-sm border border-gray-200/80 rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-7 pb-5 border-b border-gray-100">
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Create Listing</h1>
              <p className="text-sm text-gray-500">Fill in the details of your vehicle</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-0.5 h-4 bg-gray-900 rounded-full" />
                <h2 className="text-sm font-semibold text-gray-900">Vehicle Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Year *"
                  type="number"
                  placeholder="2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
                <Combobox
                  label="Make *"
                  value={makeId}
                  onChange={(v) => setMakeId(v)}
                  options={makes.map((m) => ({ value: m.id, label: m.name }))}
                  placeholder="Select make"
                />
                <Combobox
                  label="Model *"
                  value={modelId}
                  onChange={(v) => setModelId(v)}
                  options={models.map((m) => ({ value: m.id, label: m.name }))}
                  disabled={!makeId}
                  placeholder={makeId ? "Select model" : "Choose make first"}
                />
                <Input
                  label="Mileage"
                  type="number"
                  placeholder="25000"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                />
                <Combobox
                  label="Condition"
                  value={condition}
                  onChange={(v) => setCondition(v)}
                  options={conditionOptions.map((c) => ({ value: c.name, label: c.name }))}
                  placeholder="Select condition"
                />
                <Combobox
                  label="Category"
                  value={categoryId}
                  onChange={(v) => setCategoryId(v)}
                  options={categoryOptions.map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="Select category"
                />
                <Input label="VIN" placeholder="1HGCM82633A004352" value={vin} onChange={(e) => setVin(e.target.value)} />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-0.5 h-4 bg-gray-900 rounded-full" />
                <h2 className="text-sm font-semibold text-gray-900">Pricing &amp; Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Price ($) *"
                  type="number"
                  placeholder="25000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                  label="Original Price ($)"
                  type="number"
                  placeholder="30000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
                <Input
                  label="Total (Inventory)"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
                <Combobox
                  label="Fuel Type"
                  value={fuelType}
                  onChange={(v) => setFuelType(v)}
                  options={fuelTypeOptions.map((f) => ({ value: f.name, label: f.name }))}
                  placeholder="Select fuel type"
                />
                <Combobox
                  label="Transmission"
                  value={transmission}
                  onChange={(v) => setTransmission(v)}
                  options={transmissionOptions.map((t) => ({ value: t.name, label: t.name }))}
                  placeholder="Select transmission"
                />
                <Input
                  label="Engine Size"
                  placeholder="e.g. 2.5L I4"
                  value={engineSize}
                  onChange={(e) => setEngineSize(e.target.value)}
                />
                <Combobox
                  label="Color"
                  value={color}
                  onChange={(v) => setColor(v)}
                  options={COLORS.map((c) => ({ value: c, label: c }))}
                  placeholder="Select color"
                />
                <Input
                  label="Interior Color"
                  placeholder="Black"
                  value={interiorColor}
                  onChange={(e) => setInteriorColor(e.target.value)}
                />
                <Input
                  label="Location"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Combobox
                  label="Status"
                  value={status}
                  onChange={(v) => {
                    if (v === "out_of_stock" || v === "coming_soon") {
                      setPrevTotal(total || "1");
                      setTotal("0");
                    } else if (v === "in_stock" && total === "0") {
                      setTotal(prevTotal || "1");
                    }
                    setStatus(v);
                  }}
                  options={["in_stock", "out_of_stock", "coming_soon"].map((s) => ({ value: s, label: s.replace("_", " ") }))}
                  placeholder="Select status"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your vehicle's condition, features, and history..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-400 resize-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-0.5 h-4 bg-gray-900 rounded-full" />
                <h2 className="text-sm font-semibold text-gray-900">Photos</h2>
              </div>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-sm p-6 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-500/30"
              >
                {previews.length === 0 ? (
                  <>
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 10MB each</p>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                       {previews.slice(0, 4).map((img, i) => (
                        <div key={i} className="group relative w-28 h-28 rounded-sm overflow-hidden border border-gray-200 shadow-sm">
                          <ImageWithLoading src={img.preview} alt={`Photo ${i + 1}`} fill className="size-full object-cover" />
                          <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1 transition-colors group-hover:bg-black/40">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setPrimaryIndex(i); }}
                              className={`p-1 rounded-sm ${primaryIndex === i ? "text-yellow-400" : "text-white/60"} hover:text-yellow-400 transition-colors`}
                            >
                              <Star className={`size-3.5 ${primaryIndex === i ? "fill-yellow-400" : ""}`} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                              className="p-1 rounded-sm text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                          {primaryIndex === i && (
                            <span className="absolute bottom-1 left-1 rounded-sm bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                      {previews.length > 4 && (
                        <div className="w-28 h-28 rounded-sm border border-gray-200 bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-500">+{previews.length - 4}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{previews.length} photo{previews.length !== 1 ? "s" : ""} selected — click to add more</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <Button type="button" variant="outline" className="rounded-sm px-6 py-2.5" onClick={() => navigate("/seller/listings")}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="rounded-sm px-6 py-2.5">
                {submitting ? (
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
