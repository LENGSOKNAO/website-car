import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { formatPrice, formatDate, imageUrl, getStatusColor, cn } from "@/lib/utils";
import { ChevronRight, DollarSign, Loader2, AlertCircle, Package } from "lucide-react";

type Tab = "orders" | "pre-orders";

export default function SellerSales() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [preOrders, setPreOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    api
      .sellerOrders({ tab })
      .then((res: any) => {
        const d = res?.data?.data ?? res?.data;
        setOrders(Array.isArray(d?.orders?.data) ? d.orders.data : Array.isArray(d?.orders) ? d.orders : []);
        setPreOrders(Array.isArray(d?.preOrders?.data) ? d.preOrders.data : Array.isArray(d?.preOrders) ? d.preOrders : []);
      })
      .catch((err: any) => {
        setError(err.message || "Failed to load sales");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, tab]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center py-12 px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sign in to view sales</h2>
          <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const items = tab === "orders" ? orders : preOrders;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Sales</h1>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "orders"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setTab("pre-orders")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "pre-orders"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Pre-Orders ({preOrders.length})
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center gap-2 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!error && items.length === 0 ? (
        <div className="text-center py-16">
          {tab === "orders" ? (
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          ) : (
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          )}
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {tab === "orders" ? "No orders yet" : "No pre-orders yet"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {tab === "orders"
              ? "You haven't received any orders yet."
              : "No customers have pre-ordered vehicles from you."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm divide-y divide-gray-100">
          {items.map((item: any) => {
            if (tab === "orders") {
              const listing = item.items?.[0]?.listing;
              const primaryImage = listing?.primary_image?.image_url || listing?.images?.[0]?.image_url;
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                  <div className="w-14 h-11 rounded-sm bg-gray-100 shrink-0 overflow-hidden">
                    {primaryImage ? (
                      <img src={imageUrl(primaryImage)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">#{item.order_number}</p>
                    {listing && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{listing.year} {listing.make?.name} {listing.model?.name}</p>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                    <span className={cn("px-2 py-0.5 rounded-full capitalize", getStatusColor(item.status))}>{item.status.replace("_", " ")}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDate(item.placed_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-gray-900">{formatPrice(item.total)}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              );
            }

            const poListing = item.listing;
            const poImage = poListing?.primary_image?.image_url || poListing?.images?.[0]?.image_url;
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                <div className="w-14 h-11 rounded-sm bg-gray-100 shrink-0 overflow-hidden">
                  {poImage ? (
                    <img src={imageUrl(poImage)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.customer_name}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{item.customer_email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                  <span className={cn("px-2 py-0.5 rounded-full capitalize", getStatusColor(item.status))}>{item.status.replace("_", " ")}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatDate(item.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {item.total_price && <span className="font-semibold text-gray-900">{formatPrice(item.total_price)}</span>}
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
