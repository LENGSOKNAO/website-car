import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Edit, Trash2, ChevronLeft, ChevronRight, Search, X, Save, Car, LogIn, Plus, Upload, Star, LayoutGrid } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { imageUrl } from "@/lib/utils";
import type { CarListing, ListingImage, ListingStatus } from "@/lib/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Combobox from "@/components/ui/Combobox";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import ImageWithLoading from "@/components/ui/ImageWithLoading";

const PER_PAGE = 50;

const STATUS_OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "coming_soon", label: "Coming Soon" },
];

const COLORS = ["Black", "White", "Silver", "Gray", "Blue", "Red", "Green", "Brown", "Gold", "Other"];

function PageButton({ n, current, onClick }: { n: number; current: number; onClick: (n: number) => void }) {
  return (
    <button
      onClick={() => onClick(n)}
      className={`w-7 h-7 rounded-sm text-xs font-medium transition-colors ${
        n === current
          ? "bg-gray-900 text-white"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {n}
    </button>
  );
}

function ActionMenu({
  onEdit,
  onDelete,
  onClose,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-sm shadow-lg z-10 py-1">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 text-left"
      >
        <Edit className="w-3 h-3" /> Edit
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 text-left"
      >
        <Trash2 className="w-3 h-3" /> Delete
      </button>
    </div>
  );
}

export default function SellerListings() {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CarListing>>({});
  const [editPrevTotal, setEditPrevTotal] = useState<string>("1");
  const [saving, setSaving] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ListingStatus | "all">("all");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [existingImages, setExistingImages] = useState<ListingImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);
  const [primaryNewIndex, setPrimaryNewIndex] = useState(-1);

  const [makes, setMakes] = useState<{ id: string; name: string }[]>([]);
  const [allModels, setAllModels] = useState<{ id: string; name: string; make_id: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: string; name: string }[]>([]);
  const [conditionOptions, setConditionOptions] = useState<{ id: string; name: string }[]>([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState<{ id: string; name: string }[]>([]);
  const [transmissionOptions, setTransmissionOptions] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string | number | boolean | undefined> = { page, per_page: PER_PAGE };
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await api.myListings(params);
      const data = res.data?.data?.data || res.data?.data || [];
      const pagination = res.data?.data || {};
      setListings(Array.isArray(data) ? data : []);
      setTotalPages(pagination.last_page || pagination.total_pages || 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    Promise.all([
      api.makes(),
      api.models(),
      api.categories(),
      api.conditions(),
      api.fuelTypes(),
      api.transmissions(),
    ]).then(([makesRes, modelsRes, catRes, condRes, fuelRes, transRes]) => {
      const m = makesRes?.data?.data; setMakes(Array.isArray(m) ? m : []);
      const md = modelsRes?.data?.data; setAllModels(Array.isArray(md) ? md : []);
      const cat = catRes?.data?.data; setCategoryOptions(Array.isArray(cat) ? cat : []);
      const c = condRes?.data?.data; setConditionOptions(Array.isArray(c) ? c : []);
      const f = fuelRes?.data?.data; setFuelTypeOptions(Array.isArray(f) ? f : []);
      const t = transRes?.data?.data; setTransmissionOptions(Array.isArray(t) ? t : []);
    }).catch(() => {});
  }, []);

  const handleEdit = async (listing: CarListing) => {
    setEditingId(listing.id);
    setMenuOpenId(null);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setDeleteImageIds([]);
    setPrimaryNewIndex(-1);
    try {
      const res = await api.myListing(listing.id);
      const full = res.data?.data;
      if (full) {
        setExistingImages(full.images || []);
        setEditForm({
          make_id: full.make_id,
          model_id: full.model_id,
          category_id: full.category_id,
          year: full.year,
          price: full.price,
          original_price: full.original_price,
          mileage: full.mileage,
          fuel_type: full.fuel_type,
          transmission: full.transmission,
          engine_size: full.engine_size,
          color: full.color,
          interior_color: full.interior_color,
          condition: full.condition,
          vin: full.vin,
          description: full.description,
          location: full.location,
          status: full.status,
        });
      } else {
        setExistingImages(listing.images || []);
        setEditForm({
          make_id: listing.make_id,
          model_id: listing.model_id,
          category_id: listing.category_id,
          year: listing.year,
          price: listing.price,
          original_price: listing.original_price,
          mileage: listing.mileage,
          fuel_type: listing.fuel_type,
          transmission: listing.transmission,
          engine_size: listing.engine_size,
          color: listing.color,
          interior_color: listing.interior_color,
          condition: listing.condition,
          vin: listing.vin,
          description: listing.description,
          location: listing.location,
          status: listing.status,
        });
      }
    } catch {
      setExistingImages(listing.images || []);
      setEditForm({
        make_id: listing.make_id,
        model_id: listing.model_id,
        category_id: listing.category_id,
        year: listing.year,
        price: listing.price,
        original_price: listing.original_price,
        mileage: listing.mileage,
        fuel_type: listing.fuel_type,
        transmission: listing.transmission,
        engine_size: listing.engine_size,
        color: listing.color,
        interior_color: listing.interior_color,
        condition: listing.condition,
        vin: listing.vin,
        description: listing.description,
        location: listing.location,
        status: listing.status,
      });
    }
  };

  const handleSave = async (listingId: string) => {
    setSaving(listingId);
    try {
      const listing = listings.find(l => l.id === listingId);
      const fd = new FormData();
      Object.entries(editForm).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") fd.append(k, String(v));
      });
      fd.set("make_id", editForm.make_id || listing?.make_id || "");
      fd.set("model_id", editForm.model_id || listing?.model_id || "");
      if (editForm.original_price === null || editForm.original_price === undefined) fd.delete("original_price");
      deleteImageIds.forEach(id => fd.append("delete_image_ids[]", id));
      newImageFiles.forEach(file => fd.append("new_images[]", file));
      const primaryExisting = existingImages.findIndex(img => img.is_primary);
      if (primaryExisting >= 0) {
        fd.append("primary_image_id", existingImages[primaryExisting].id);
      }
      if (primaryNewIndex >= 0 && primaryNewIndex < newImageFiles.length) {
        fd.append("primary_new_index", primaryNewIndex.toString());
      }
      await api.updateListingFormData(listingId, fd);
      setEditingId(null);
      setExistingImages([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setDeleteImageIds([]);
      setPrimaryNewIndex(-1);
      fetchListings();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setDeleteImageIds([]);
    setPrimaryNewIndex(-1);
  };

  const handleEditFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setNewImageFiles(prev => [...prev, ...newFiles]);
    setNewImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
  };

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleEditFiles(e.dataTransfer.files);
  };

  const handleEditDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeEditImage = (id: string) => {
    const existing = existingImages.find(img => img.id === id);
    if (existing) {
      setDeleteImageIds(prev => [...prev, id]);
    } else {
      const newIdx = newImagePreviews.findIndex(p => p === id);
      if (newIdx >= 0) {
        URL.revokeObjectURL(newImagePreviews[newIdx]);
        setNewImageFiles(prev => prev.filter((_, j) => j !== newIdx));
        setNewImagePreviews(prev => prev.filter((_, j) => j !== newIdx));
        if (primaryNewIndex === newIdx) setPrimaryNewIndex(-1);
        if (primaryNewIndex > newIdx) setPrimaryNewIndex(primaryNewIndex - 1);
      }
    }
  };
  const handleDelete = async (listingId: string) => {
    setMenuOpenId(null);
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.deleteListing(listingId);
      fetchListings();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge variant="success" size="sm">In Stock</Badge>;
      case "out_of_stock":
        return <Badge variant="error" size="sm">Out of Stock</Badge>;
      case "coming_soon":
        return <Badge variant="info" size="sm">Coming Soon</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const pageNumbers: number[] = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sign in to view your listings
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">Listings</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">{listings.length} vehicle{listings.length !== 1 ? "s" : ""}</p>
          </div>
          <Link
            to="/seller/listings/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Listing
          </Link>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
               className="mb-3 bg-red-50 border border-red-200 text-red-600 text-[11px] px-3 py-2 rounded-sm flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-sm bg-red-400 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="px-3 py-2 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col items-center sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                <input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-sm border border-gray-200 bg-white pl-7 pr-2.5 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-gray-400 hover:border-gray-300"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ListingStatus | "all")}
                options={[
                  { value: "all", label: "All Status" },
                  ...STATUS_OPTIONS,
                ]}
                className="w-full p-0 sm:w-36 rounded-sm text-xs "
              />
            </div>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2">
                  <Skeleton className="w-12 h-9 shrink-0" />
                  <Skeleton className="h-2.5 w-24 shrink-0" />
                  <Skeleton className="h-2.5 w-14 shrink-0" />
                  <Skeleton className="h-2.5 w-12 shrink-0" />
                  <Skeleton className="h-2.5 w-10 shrink-0" />
                  <Skeleton className="h-2.5 w-14 shrink-0 hidden md:inline-block" />
                  <Skeleton className="h-2.5 w-10 shrink-0 hidden lg:inline-block" />
                  <Skeleton className="h-4 w-12 shrink-0" />
                  <Skeleton className="h-2.5 w-16 shrink-0 hidden md:inline-block" />
                  <Skeleton className="h-2.5 w-14 shrink-0 hidden xl:inline-block" />
                  <Skeleton className="h-5 w-5 shrink-0" />
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-sm bg-gray-100 flex items-center justify-center">
                <Car className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">No listings</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {search || statusFilter !== "all" ? "Try adjusting your search or filter." : "No listings created yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Vehicle</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Price</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mileage</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Fuel</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Trans.</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Color</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Created</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">Location</th>
                      <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {listings.map((listing) => {
                      const isEditing = editingId === listing.id;
                      return (
                        <>
                        <tr
                          key={listing.id}
                          className={`transition-colors ${
                            isEditing ? "bg-blue-50/30" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={imageUrl(listing.image_url || listing.primary_image?.image_url || "/placeholder-car.jpg")}
                                alt={listing.make?.name + " " + listing.model?.name}
                                className="w-12 h-9 object-cover rounded-sm border border-gray-100 bg-gray-50 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-[11px] font-medium text-gray-900 truncate leading-snug">
                                  {listing.year} {listing.make?.name} {listing.model?.name}
                                </p>
                                <p className="text-[10px] text-gray-500 capitalize leading-snug">{listing.condition}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <p className="text-[11px] font-medium text-gray-900">{formatPrice(listing.price)}</p>
                            {listing.original_price && listing.original_price > listing.price && (
                              <p className="text-[9px] text-gray-400 line-through">{formatPrice(listing.original_price)}</p>
                            )}
                          </td>
                          <td className="px-3 py-2 text-[11px] text-gray-600 whitespace-nowrap">
                            {listing.mileage ? listing.mileage.toLocaleString() + " mi" : "—"}
                          </td>
                          <td className="px-3 py-2 text-[11px] text-gray-600 whitespace-nowrap">
                            {listing.fuel_type || "—"}
                          </td>
                          <td className="px-3 py-2 text-[11px] text-gray-600 whitespace-nowrap hidden md:table-cell">
                            {listing.transmission || "—"}
                          </td>
                          <td className="px-3 py-2 text-[11px] text-gray-600 whitespace-nowrap hidden lg:table-cell">
                            {listing.color || "—"}
                          </td>
                          <td className="px-3 py-2">{getStatusBadge(listing.status)}</td>
                          <td className="px-3 py-2 text-[11px] text-gray-500 whitespace-nowrap hidden md:table-cell">
                            {formatDate(listing.created_at)}
                          </td>
                          <td className="px-3 py-2 text-[11px] text-gray-500 whitespace-nowrap hidden xl:table-cell">
                            {listing.location || "—"}
                          </td>
                          <td className="px-3 py-2 text-right relative">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={handleCancel}>
                                  Cancel
                                </Button>
                                <Button size="sm" loading={saving === listing.id} onClick={() => handleSave(listing.id)}>
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="relative inline-flex">
                                <button
                                  onClick={() => setMenuOpenId(menuOpenId === listing.id ? null : listing.id)}
                                  className="w-5 h-5 rounded-sm flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <MoreVertical className="w-3 h-3" />
                                </button>
                                {menuOpenId === listing.id && (
                                  <ActionMenu
                                    onEdit={() => handleEdit(listing)}
                                    onDelete={() => handleDelete(listing.id)}
                                    onClose={() => setMenuOpenId(null)}
                                  />
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                        {isEditing && (
                          <tr key={`${listing.id}-edit`}>
                            <td colSpan={10} className="p-0 border-b border-gray-200">
                              <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 sm:p-6">
                                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-sm">
                                        <Car className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-semibold text-gray-900">Edit Listing</h3>
                                        <p className="text-[11px] text-gray-500">Update your vehicle details</p>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-0.5 h-4 bg-gray-900 rounded-full" />
                                        <h4 className="text-xs font-semibold text-gray-900">Vehicle Information</h4>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <Input
                                          label="Year"
                                          type="number"
                                          value={editForm.year || ""}
                                          onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                                        />
                                        <Input
                                          label="Mileage"
                                          type="number"
                                          value={editForm.mileage || ""}
                                          onChange={(e) => setEditForm({ ...editForm, mileage: parseInt(e.target.value) || null })}
                                        />
                                        <Combobox
                                          label="Condition"
                                          value={editForm.condition || ""}
                                          onChange={(v) => setEditForm({ ...editForm, condition: v })}
                                          options={conditionOptions.map(c => ({ value: c.name, label: c.name }))}
                                          placeholder="Select condition"
                                        />
                                        <Combobox
                                          label="Category"
                                          value={editForm.category_id || ""}
                                          onChange={(v) => setEditForm({ ...editForm, category_id: v })}
                                          options={categoryOptions.map(c => ({ value: c.id, label: c.name }))}
                                          placeholder="Select category"
                                        />
                                        <Input
                                          label="VIN"
                                          value={editForm.vin || ""}
                                          onChange={(e) => setEditForm({ ...editForm, vin: e.target.value })}
                                        />
                                        <Input
                                          label="Location"
                                          value={editForm.location || ""}
                                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-0.5 h-4 bg-gray-900 rounded-full" />
                                        <h4 className="text-xs font-semibold text-gray-900">Pricing &amp; Details</h4>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <Input
                                          label="Price ($)"
                                          type="number"
                                          value={editForm.price || ""}
                                          onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) })}
                                        />
                                        <Input
                                          label="Original Price ($)"
                                          type="number"
                                          value={editForm.original_price || ""}
                                          onChange={(e) => setEditForm({ ...editForm, original_price: parseInt(e.target.value) || null })}
                                        />
                                        <Input
                                          label="Total (Inventory)"
                                          type="number"
                                          min="1"
                                          value={editForm.total || "1"}
                                          onChange={(e) => setEditForm({ ...editForm, total: parseInt(e.target.value) || 1 })}
                                        />
                                        <Combobox
                                          label="Fuel Type"
                                          value={editForm.fuel_type || ""}
                                          onChange={(v) => setEditForm({ ...editForm, fuel_type: v })}
                                          options={fuelTypeOptions.map(f => ({ value: f.name, label: f.name }))}
                                          placeholder="Select fuel type"
                                        />
                                        <Combobox
                                          label="Transmission"
                                          value={editForm.transmission || ""}
                                          onChange={(v) => setEditForm({ ...editForm, transmission: v })}
                                          options={transmissionOptions.map(t => ({ value: t.name, label: t.name }))}
                                          placeholder="Select transmission"
                                        />
                                        <Input
                                          label="Engine Size"
                                          value={editForm.engine_size || ""}
                                          onChange={(e) => setEditForm({ ...editForm, engine_size: e.target.value })}
                                        />
                                        <Combobox
                                          label="Color"
                                          value={editForm.color || ""}
                                          onChange={(v) => setEditForm({ ...editForm, color: v })}
                                          options={COLORS.map(c => ({ value: c, label: c }))}
                                          placeholder="Select color"
                                        />
                                        <Input
                                          label="Interior Color"
                                          value={editForm.interior_color || ""}
                                          onChange={(e) => setEditForm({ ...editForm, interior_color: e.target.value })}
                                        />
                                        <Combobox
                                          label="Status"
                                          value={editForm.status || ""}
                                          onChange={(v) => {
                                            const currentTotal = editForm.total?.toString() || "1";
                                            if (v === "out_of_stock" || v === "coming_soon") {
                                              setEditPrevTotal(currentTotal);
                                              setEditForm({ ...editForm, status: v as ListingStatus, total: 0 });
                                            } else if (v === "in_stock" && currentTotal === "0") {
                                              setEditForm({ ...editForm, status: v as ListingStatus, total: parseInt(editPrevTotal || "1") });
                                            } else {
                                              setEditForm({ ...editForm, status: v as ListingStatus });
                                            }
                                          }}
                                          options={STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }))}
                                          placeholder="Select status"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                          rows={3}
                                          value={editForm.description || ""}
                                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                          className="block w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-gray-400 resize-none transition-all duration-200"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-0.5 h-4 bg-gray-900 rounded-full" />
                                        <h4 className="text-xs font-semibold text-gray-900">Photos</h4>
                                      </div>
                                      <div
                                        onDrop={handleEditDrop}
                                        onDragOver={handleEditDragOver}
                                        onClick={() => document.getElementById("edit-photo-input")?.click()}
                                        className="border-2 border-dashed border-gray-200 rounded-sm p-6 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-500/30"
                                      >
                                        {existingImages.filter(img => !deleteImageIds.includes(img.id)).length + newImageFiles.length === 0 ? (
                                          <>
                                            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 10MB each</p>
                                          </>
                                        ) : (
                                          <div className="space-y-4">
                                            <div className="flex flex-wrap gap-3 justify-center">
{existingImages.filter(img => !deleteImageIds.includes(img.id)).map((img, idx) => (
                                                <div key={img.id} className="group relative w-28 h-28 rounded-sm overflow-hidden border border-gray-200 shadow-sm">
<ImageWithLoading src={imageUrl(img.image_url)} alt="" fill className="size-full object-cover" />
                                                  <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1 transition-colors group-hover:bg-black/40">
                                                    <button
                                                      type="button"
                                                      onClick={(e) => { e.stopPropagation(); setExistingImages(prev => prev.map(i => ({ ...i, is_primary: i.id === img.id }))); }}
                                                      className={`p-1 rounded-sm ${img.is_primary ? "text-yellow-400" : "text-white/60"} hover:text-yellow-400 transition-colors`}
                                                    >
                                                      <Star className={`size-3.5 ${img.is_primary ? "fill-yellow-400" : ""}`} />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={(e) => { e.stopPropagation(); removeEditImage(img.id); }}
                                                      className="p-1 rounded-sm text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                      <X className="size-3.5" />
                                                    </button>
                                                  </div>
                                                  {img.is_primary && (
                                                    <span className="absolute bottom-1 left-1 rounded-sm bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                                                      Primary
                                                    </span>
                                                  )}
                                                </div>
                                              ))}
{newImagePreviews.slice(0, 4).map((preview, i) => (
                                                <div key={preview} className="group relative w-28 h-28 rounded-sm overflow-hidden border border-gray-200 shadow-sm">
<ImageWithLoading src={preview} alt="" fill className="size-full object-cover" />
                                                  <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1 transition-colors group-hover:bg-black/40">
                                                    <button
                                                      type="button"
                                                      onClick={(e) => { e.stopPropagation(); setExistingImages(prev => prev.map(img => ({ ...img, is_primary: false }))); setPrimaryNewIndex(primaryNewIndex === i ? -1 : i); }}
                                                      className={`p-1 rounded-sm ${primaryNewIndex === i ? "text-yellow-400" : "text-white/60"} hover:text-yellow-400 transition-colors`}
                                                    >
                                                      <Star className={`size-3.5 ${primaryNewIndex === i ? "fill-yellow-400" : ""}`} />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={(e) => { e.stopPropagation(); removeEditImage(preview); }}
                                                      className="p-1 rounded-sm text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                      <X className="size-3.5" />
                                                    </button>
                                                  </div>
                                                  {primaryNewIndex === i && (
                                                    <span className="absolute bottom-1 left-1 rounded-sm bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                                                      Primary
                                                    </span>
                                                  )}
                                                </div>
                                              ))}
                                              {existingImages.filter(img => !deleteImageIds.includes(img.id)).length + newImageFiles.length > 4 && (
                                                <div className="w-28 h-28 rounded-sm border border-gray-200 bg-gray-100 flex items-center justify-center">
                                                  <span className="text-sm font-medium text-gray-500">+{existingImages.filter(img => !deleteImageIds.includes(img.id)).length + newImageFiles.length - 4}</span>
                                                </div>
                                              )}
                                            </div>
                                            <p className="text-xs text-gray-500">{existingImages.filter(img => !deleteImageIds.includes(img.id)).length + newImageFiles.length} photo{(existingImages.filter(img => !deleteImageIds.includes(img.id)).length + newImageFiles.length) !== 1 ? "s" : ""} selected — click to add more</p>
                                          </div>
                                        )}
                                        <input
                                          id="edit-photo-input"
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          className="hidden"
                                          onChange={(e) => { handleEditFiles(e.target.files); e.target.value = ""; }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200">
                                    <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                                    <Button size="sm" onClick={() => handleSave(editingId)} loading={saving === editingId}>
                                      <Save className="w-3.5 h-3.5" /> Save Changes
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                              </AnimatePresence>
                            </td>
                          </tr>
                        )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-3 py-2 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
                <p className="text-[11px] text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-0.5">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  {pageNumbers.map(n => (
                    <PageButton key={n} n={n} current={page} onClick={setPage} />
                  ))}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="w-7 h-7 rounded-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
