import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Fuel,
  Gauge,
  Calendar,
  Settings,
  HardDrive,
  Users,
  Heart,
  DollarSign,
  CheckCircle,
  Car,
  Phone,
  Mail,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import CarGallery from "@/components/car/CarGallery";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { formatPrice, cn } from "@/lib/utils";
import type { CarListing } from "@/lib/types";

interface Accessory {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
}

const offerAccessories: Accessory[] = [
  {
    id: "warranty_2yr",
    name: "2-Year Extended Warranty",
    price: 1995,
    category: "Protection",
    description: "Bumper-to-bumper coverage",
  },
  {
    id: "warranty_3yr",
    name: "3-Year Extended Warranty",
    price: 2895,
    category: "Protection",
    description: "Bumper-to-bumper coverage",
  },
  {
    id: "warranty_5yr",
    name: "5-Year Extended Warranty",
    price: 4495,
    category: "Protection",
    description: "Bumper-to-bumper coverage",
  },
  {
    id: "service_pkg",
    name: "Service Package",
    price: 1295,
    category: "Maintenance",
    description: "3 oil changes + tire rotation",
  },
  {
    id: "paint_protection",
    name: "Paint Protection Film",
    price: 2495,
    category: "Protection",
    description: "Full front PPF",
  },
  {
    id: "interior_protection",
    name: "Interior Protection",
    price: 895,
    category: "Protection",
    description: "Fabric & leather sealant",
  },
  {
    id: "wheel_tire",
    name: "Wheel & Tire Protection",
    price: 1495,
    category: "Protection",
    description: "Includes road hazard",
  },
  {
    id: "gap_insurance",
    name: "GAP Insurance",
    price: 795,
    category: "Insurance",
    description: "Loan/lease payoff coverage",
  },
  {
    id: "key_replacement",
    name: "Key Replacement Coverage",
    price: 395,
    category: "Insurance",
    description: "Up to $500 per claim",
  },
  {
    id: "detailing_pkg",
    name: "Premium Detailing Package",
    price: 595,
    category: "Maintenance",
    description: "Full interior & exterior detail",
  },
  {
    id: "ceramic_coating",
    name: "Ceramic Coating",
    price: 1795,
    category: "Protection",
    description: "5-year nano ceramic coat",
  },
  {
    id: "window_tint",
    name: "Window Tint",
    price: 499,
    category: "Accessories",
    description: "Premium ceramic tint, all windows",
  },
  {
    id: "floor_mats",
    name: "All-Weather Floor Mats",
    price: 249,
    category: "Accessories",
    description: "Custom fit front & rear",
  },
  {
    id: "cargo_liner",
    name: "Cargo Liner",
    price: 199,
    category: "Accessories",
    description: "Waterproof rear cargo tray",
  },
];

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<CarListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOffer, setShowOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [loanTerm, setLoanTerm] = useState(60);
  const [downPayment, setDownPayment] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"finance" | "cash">(
    "finance",
  );
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .listing(id)
      .then((res) => setListing(res.data?.data || res.data))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (listing?.price && !offerPrice) {
      setOfferPrice(String(listing.price));
    }
  }, [listing?.price, offerPrice]);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .savedListings()
        .then((res) => {
          const data = res.data || [];
          const found = (Array.isArray(data) ? data : []).find(
            (s: any) => s.listing_id === id,
          );
          if (found) {
            setSaved(true);
            setSavedId(found.id);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, id]);

  const accessoryTotal = useMemo(
    () =>
      selectedAccessories.reduce(
        (sum, id) =>
          sum + (offerAccessories.find((a) => a.id === id)?.price || 0),
        0,
      ),
    [selectedAccessories],
  );

  const offerNumeric = Number(offerPrice) || 0;

  const totalFinanced = useMemo(() => {
    const base = offerNumeric + accessoryTotal;
    if (paymentMethod === "cash") return 0;
    return base - downPayment;
  }, [offerNumeric, accessoryTotal, paymentMethod, downPayment]);

  const monthlyPayment = useMemo(() => {
    if (totalFinanced <= 0 || loanTerm <= 0) return 0;
    const r = 6.9 / 100 / 12;
    const n = loanTerm;
    return (
      (totalFinanced * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
    );
  }, [totalFinanced, loanTerm]);

  const firstPayment = useMemo(() => {
    if (paymentMethod !== "finance" || totalFinanced <= 0) return 0;
    return downPayment;
  }, [paymentMethod, totalFinanced, downPayment]);

  const remainingMonths = useMemo(() => {
    if (paymentMethod !== "finance" || totalFinanced <= 0) return 0;
    return loanTerm;
  }, [paymentMethod, totalFinanced, loanTerm]);

  if (loading) {
    return (
      <div className="min-h-screen lg:h-screen bg-white flex flex-col lg:flex-row">
        <div className="min-h-[60vh] lg:flex-1 lg:min-h-0 bg-gray-100 animate-pulse shrink-0" />
        <div className="lg:w-[440px] p-4 sm:p-6 lg:p-8 space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen lg:h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-medium text-gray-900 mb-1">
            Listing Not Found
          </h2>
          <p className="text-sm text-gray-500">
            This vehicle may have been sold or removed.
          </p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 mt-6 text-sm text-gray-900 font-medium border-b border-gray-900 hover:text-gray-500 hover:border-gray-500 transition-colors"
          >
            Browse All Cars
          </Link>
        </div>
      </div>
    );
  }

  const d = listing;
  const images = d.images || [];
  const priceFormatted = formatPrice(d.price);
  const originalPriceFormatted = d.original_price
    ? formatPrice(d.original_price)
    : null;
  const discount = d.original_price
    ? Math.round((1 - d.price / d.original_price) * 100)
    : 0;
  const isNew = d.condition?.toLowerCase() === "new";
  const isCertified = d.condition?.toLowerCase() === "certified pre-owned";

  async function toggleSave() {
    if (!isAuthenticated) return;
    try {
      if (saved && savedId) {
        await api.unsaveListing(savedId);
        setSaved(false);
        setSavedId(null);
      } else {
        const res = await api.saveListing(d.id);
        setSaved(true);
        setSavedId(res.data?.id);
      }
    } catch {}
  }

  async function handleOffer(e: React.FormEvent) {
    e.preventDefault();
    const selectedAccessoryObjects = selectedAccessories
      .map((id) => {
        const acc = offerAccessories.find((a) => a.id === id);
        return acc ? { id: acc.id, name: acc.name, price: acc.price } : null;
      })
      .filter(
        (x): x is { id: string; name: string; price: number } => x !== null,
      );
    const orderData: Record<string, unknown> = {
      listing_id: d.id,
      price: offerNumeric,
      payment_method: paymentMethod,
    };
    if (paymentMethod === "finance") {
      orderData.down_payment = downPayment;
      orderData.loan_term = loanTerm;
    }
    if (selectedAccessoryObjects.length > 0) {
      orderData.accessories = selectedAccessoryObjects;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.createOrder(orderData as any);
      setSuccess("Order placed! Redirecting...");
      setOfferPrice("");
      setShowOffer(false);
      setSelectedAccessories([]);
      setDownPayment(0);
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleAccessory(id: string) {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }

  const specs = [
    { label: "Year", value: d.year },
    {
      label: "Mileage",
      value: d.mileage ? `${d.mileage.toLocaleString()} mi` : "N/A",
    },
    { label: "Fuel Type", value: d.fuel_type || "N/A" },
    { label: "Transmission", value: d.transmission || "N/A" },
    { label: "Engine", value: d.engine_size || "N/A" },
    { label: "Color", value: d.color || "N/A" },
    {
      label: "Owners",
      value: d.owners_count !== null ? String(d.owners_count) : "N/A",
    },
    {
      label: "Condition",
      value: d.condition
        ? d.condition.charAt(0).toUpperCase() + d.condition.slice(1)
        : "N/A",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen flex flex-col lg:h-screen"
    >
      {/* Thin top bar */}
      <div className="h-12 border-b border-gray-100 flex items-center px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <Link
            to="/listings"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            Vehicles
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900 truncate max-w-[180px] font-medium">
            {d.year} {d.make?.name} {d.model?.name}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="absolute top-12 left-0 right-0 z-50 flex justify-center mt-4 px-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 flex items-center gap-2 text-sm rounded-sm shadow-sm">
            <CheckCircle className="w-4 h-4 shrink-0" /> {success}
          </div>
        </div>
      )}
      {error && (
        <div className="absolute top-12 left-0 right-0 z-50 flex justify-center mt-4 px-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 flex items-center gap-2 text-sm rounded-sm shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        </div>
      )}

      {/* Main: Full-screen image + Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left: Full-screen image */}
        <div className="min-h-[60vh] lg:flex-1 lg:min-h-0 shrink-0">
          <CarGallery
            images={images}
            title={`${d.year} ${d.make?.name} ${d.model?.name}`}
            variant="hero"
          />
        </div>

        {/* Right: Scrollable sidebar */}
        <div className="lg:w-[440px] lg:border-l border-gray-100 lg:overflow-y-auto bg-white">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-medium text-gray-900 tracking-tight">
                    {d.year} {d.make?.name} {d.model?.name}
                  </h1>
                  {d.location && (
                    <p className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5" /> {d.location}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 shrink-0">
                  {isNew && <Badge variant="info">New</Badge>}
                  {isCertified && <Badge variant="success">Certified</Badge>}
                  {d.condition === "used" && (
                    <Badge variant="default">Used</Badge>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-medium text-gray-900">
                    {priceFormatted}
                  </span>
                  {originalPriceFormatted && (
                    <>
                      <span className="text-base text-gray-400 line-through">
                        {originalPriceFormatted}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          {discount}% off
                        </span>
                      )}
                    </>
                  )}
                </div>
                {d.vin && (
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" /> VIN: {d.vin}
                  </p>
                )}
              </div>

              {/* Description */}
              {d.description && (
                <>
                  <hr className="border-gray-100" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                      Description
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {d.description}
                    </p>
                  </div>
                </>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Specs */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-4">
                Specifications
              </p>
              <div className="space-y-0">
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={cn(
                      "flex items-center justify-between py-2.5",
                      i < specs.length - 1 && "border-b border-gray-50",
                    )}
                  >
                    <span className="text-sm text-gray-500">{spec.label}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Actions */}
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Actions
              </p>
              {isAuthenticated ? (
                <div className="space-y-2.5">
                  <Button
                    onClick={toggleSave}
                    variant={saved ? "default" : "outline"}
                    className={cn(
                      "w-full justify-center gap-2 rounded-sm",
                      saved ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : "",
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-colors",
                        saved ? "fill-red-500 text-red-500" : "text-gray-400",
                      )}
                    />
                    {saved ? "Saved" : "Save"}
                  </Button>
                  <Button
                    onClick={() => setShowOffer(!showOffer)}
                    className="w-full justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800 rounded-sm"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Buy Now</span>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-5 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Sign in to save vehicles or place orders
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {showOffer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-5 overflow-hidden"
                >
                  <hr className="border-gray-100" />

                  {/* Financing */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                      Financing
                    </p>
                    <div className="flex bg-gray-100 rounded">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={cn(
                          "flex-1 py-2.5 px-4 text-sm font-medium rounded-sm transition-colors text-center",
                          paymentMethod === "cash"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700",
                        )}
                      >
                        Pay Full
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("finance")}
                        className={cn(
                          "flex-1 py-2.5 px-4 text-sm font-medium rounded-sm transition-colors text-center",
                          paymentMethod === "finance"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700",
                        )}
                      >
                        Finance
                      </button>
                    </div>
                    <div className="mt-2 text-sm">
                      {paymentMethod === "cash" ? (
                        <p className="text-gray-500">
                          Pay full amount:{" "}
                          <span className="text-gray-900 font-medium">
                            {formatPrice(offerNumeric + accessoryTotal)}
                          </span>
                        </p>
                      ) : (
                        <p className="text-gray-500">
                          Est. monthly:{" "}
                          <span className="text-gray-900 font-medium">
                            {totalFinanced > 0
                              ? formatPrice(Math.round(monthlyPayment)) + "/mo"
                              : formatPrice(offerNumeric + accessoryTotal)}
                          </span>
                        </p>
                      )}
                    </div>
                    {paymentMethod === "finance" && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">
                            Down Payment
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                              $
                            </span>
                            <input
                              type="number"
                              value={downPayment}
                              onChange={(e) =>
                                setDownPayment(
                                  Math.min(
                                    Number(e.target.value) || 0,
                                    offerNumeric + accessoryTotal,
                                  ),
                                )
                              }
                              placeholder="0"
                              className="w-full border border-gray-200 pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 text-gray-900 placeholder-gray-300 rounded-sm"
                              max={offerNumeric + accessoryTotal}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Amount financed:{" "}
                            <span className="text-gray-900 font-medium">
                              {formatPrice(totalFinanced)}
                            </span>
                          </p>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
                            Loan Term
                          </p>
                          <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                            {[
                              {
                                value: 24,
                                label: "24 months",
                                desc: "Higher payment, less interest",
                              },
                              {
                                value: 36,
                                label: "36 months",
                                desc: "Shorter term, save on interest",
                              },
                              {
                                value: 48,
                                label: "48 months",
                                desc: "Balanced payment and term",
                              },
                              {
                                value: 60,
                                label: "60 months",
                                desc: "Popular choice, lower payment",
                              },
                              {
                                value: 72,
                                label: "72 months",
                                desc: "Lower monthly payment",
                              },
                              {
                                value: 84,
                                label: "84 months",
                                desc: "Lowest payment, more interest",
                              },
                            ].map((term) => (
                              <button
                                key={term.value}
                                type="button"
                                onClick={() => setLoanTerm(term.value)}
                                className={cn(
                                  "w-full flex items-center justify-between px-3 py-2.5 text-sm border transition-colors text-left rounded-sm",
                                  loanTerm === term.value
                                    ? "border-gray-900 bg-gray-50"
                                    : "border-gray-200 hover:border-gray-200",
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span
                                    className={cn(
                                      "w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center transition-colors",
                                      loanTerm === term.value
                                        ? "bg-gray-900 border-gray-900 text-white"
                                        : "border-gray-200",
                                    )}
                                  >
                                    {loanTerm === term.value && (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                  </span>
                                  <div className="min-w-0">
                                    <span className="text-gray-900 block truncate">
                                      {term.label}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {term.desc}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right ml-2 shrink-0">
                                  <div className="text-sm font-medium text-gray-900">
                                    {(() => {
                                      const r = 6.9 / 100 / 12;
                                      const n = term.value;
                                      const monthly =
                                        (totalFinanced *
                                          (r * Math.pow(1 + r, n))) /
                                        (Math.pow(1 + r, n) - 1);
                                      return (
                                        formatPrice(Math.round(monthly)) + "/mo"
                                      );
                                    })()}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Total:{" "}
                                    {(() => {
                                      const r = 6.9 / 100 / 12;
                                      const n = term.value;
                                      const monthly =
                                        (totalFinanced *
                                          (r * Math.pow(1 + r, n))) /
                                        (Math.pow(1 + r, n) - 1);
                                      return formatPrice(
                                        Math.round(monthly * n),
                                      );
                                    })()}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accessories */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                      Add Accessories
                    </p>
                    <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
                      {offerAccessories.map((acc) => {
                        const selected = selectedAccessories.includes(acc.id);
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => toggleAccessory(acc.id)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2.5 text-sm border transition-colors text-left rounded-sm",
                              selected
                                ? "border-gray-900 bg-gray-50"
                                : "border-gray-200 hover:border-gray-200",
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={cn(
                                  "w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center transition-colors",
                                  selected
                                    ? "bg-gray-900 border-gray-900 text-white"
                                    : "border-gray-300",
                                )}
                              >
                                {selected && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </span>
                              <div className="min-w-0">
                                <span className="text-gray-900 block truncate">
                                  {acc.name}
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-900 font-medium shrink-0 ml-2">
                              {formatPrice(acc.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                      Order Summary
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vehicle Price</span>
                        <span className="text-gray-900">
                          {formatPrice(offerNumeric || d.price)}
                        </span>
                      </div>
                      {selectedAccessories.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Accessories ({selectedAccessories.length})
                          </span>
                          <span className="text-gray-900">
                            {formatPrice(accessoryTotal)}
                          </span>
                        </div>
                      )}
                      <hr className="border-gray-200" />
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">
                          {formatPrice(offerNumeric + accessoryTotal)}
                        </span>
                      </div>
                      {paymentMethod === "finance" && totalFinanced > 0 && (
                        <>
                          <hr className="border-gray-200" />
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Amount Financed
                            </span>
                            <span className="text-gray-900 font-medium">
                              {formatPrice(totalFinanced)}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-gray-500">
                              Est. Monthly Payment
                            </span>
                            <span className="text-lg font-medium text-gray-900">
                              {formatPrice(Math.round(monthlyPayment))}
                              <span className="text-sm text-gray-400 font-normal">
                                /mo
                              </span>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleOffer}
                    loading={submitting}
                    disabled={!offerNumeric}
                    className="w-full justify-center !bg-gray-900 !text-white hover:!bg-gray-800 rounded-sm"
                  >
                    {paymentMethod === "cash"
                      ? `Pay in Full — ${formatPrice(offerNumeric + accessoryTotal)}`
                      : `Finance — ${formatPrice(Math.round(monthlyPayment))}/mo`}
                  </Button>
                </motion.div>
              )}
            </div>

           
            {/* Features */}
            {d.features && d.features.length > 0 && (
              <>
                <hr className="border-gray-100" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-4">
                    Features & Options
                  </p>
                  <div className="space-y-2.5">
                    {d.features.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center gap-2.5 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        {f.name}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Seller */}
            {d.seller && (
              <>
                <hr className="border-gray-100" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-4">
                    Seller Information
                  </p>
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={d.seller.full_name}
                      src={d.seller.avatar_url}
                      size="lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {d.seller.dealer_name || d.seller.full_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {d.seller.location && (
                          <span className="text-sm text-gray-500">
                            {d.seller.location}
                          </span>
                        )}
                        {d.seller.is_dealer && (
                          <span className="text-xs text-blue-600 font-medium">
                            Verified Dealer
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Back link */}
            <div>
              <Link
                to="/listings"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to all vehicles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
