import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Edit, Trash2, ChevronLeft, ChevronRight, Search, X, Save, Car, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { CarListing, ListingStatus } from "@/lib/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

const PER_PAGE = 50;

const STATUS_OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "coming_soon", label: "Coming Soon" },
];

const CONDITIONS = ["New", "Excellent", "Good", "Fair", "Poor"];
const FUEL_TYPES = ["Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT", "Dual-Clutch"];
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
  const [saving, setSaving] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ListingStatus | "all">("all");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

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

  const handleEdit = (listing: CarListing) => {
    setEditingId(listing.id);
    setMenuOpenId(null);
    setEditForm({
      make_id: listing.make_id,
      model_id: listing.model_id,
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
  };

  const handleSave = async (listingId: string) => {
    setSaving(listingId);
    try {
      const listing = listings.find(l => l.id === listingId);
      await api.updateListing(listingId, {
        ...editForm,
        make_id: editForm.make_id || listing?.make_id,
        model_id: editForm.model_id || listing?.model_id,
      });
      setEditingId(null);
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
                        <tr
                          key={listing.id}
                          className={`transition-colors ${
                            isEditing ? "bg-blue-50/30" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={listing.image_url || listing.primary_image?.image_url || "/placeholder-car.jpg"}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <AnimatePresence>
                {editingId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 overflow-hidden"
                  >
                    <div className="px-3 py-3 bg-gray-50/80">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider">Edit Listing</h3>
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <Input
                          label="Year"
                          type="number"
                          value={editForm.year || ""}
                          onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                        />
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
                          label="Mileage"
                          type="number"
                          value={editForm.mileage || ""}
                          onChange={(e) => setEditForm({ ...editForm, mileage: parseInt(e.target.value) || null })}
                        />
                        <Select
                          label="Fuel Type"
                          value={editForm.fuel_type || ""}
                          onChange={(e) => setEditForm({ ...editForm, fuel_type: e.target.value })}
                          options={FUEL_TYPES.map(f => ({ value: f, label: f }))}
                        />
                        <Select
                          label="Transmission"
                          value={editForm.transmission || ""}
                          onChange={(e) => setEditForm({ ...editForm, transmission: e.target.value })}
                          options={TRANSMISSIONS.map(t => ({ value: t, label: t }))}
                        />
                        <Input
                          label="Engine"
                          value={editForm.engine_size || ""}
                          onChange={(e) => setEditForm({ ...editForm, engine_size: e.target.value })}
                        />
                        <Select
                          label="Color"
                          value={editForm.color || ""}
                          onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                          options={COLORS.map(c => ({ value: c, label: c }))}
                        />
                        <Input
                          label="Interior"
                          value={editForm.interior_color || ""}
                          onChange={(e) => setEditForm({ ...editForm, interior_color: e.target.value })}
                        />
                        <Select
                          label="Condition"
                          value={editForm.condition || ""}
                          onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                          options={CONDITIONS.map(c => ({ value: c, label: c }))}
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
                        <Select
                          label="Status"
                          value={editForm.status || ""}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          options={STATUS_OPTIONS}
                        />
                        <div className="col-span-full">
                          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Description</label>
                          <textarea
                            rows={2}
                            value={editForm.description || ""}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="block w-full rounded-sm border border-gray-200 bg-white px-2 py-1.5 text-[11px] text-gray-800 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-gray-400 hover:border-gray-300 resize-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-200">
                        <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                        <Button size="sm" onClick={() => handleSave(editingId)} loading={saving === editingId}>
                          <Save className="w-3 h-3" /> Save
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
