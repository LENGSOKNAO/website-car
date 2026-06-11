import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowLeft, CreditCard } from "lucide-react";
import { cart, type CartItem } from "@/lib/cart";
import { formatPrice, imageUrl } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(cart.getItems());
  }, []);

  const total = items.reduce((sum, i) => sum + i.price, 0);

  function handleRemove(listingId: string) {
    cart.removeItem(listingId);
    setItems(cart.getItems());
  }

  function handleClear() {
    cart.clear();
    setItems([]);
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-6">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">Add cars to your cart to get started.</p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          Cart ({items.length})
        </h1>
        <button
          onClick={handleClear}
          className="text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.listing_id}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4"
          >
            <Link
              to={`/listings/${item.listing_id}`}
              className="shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={imageUrl(item.image_url)}
                alt={`${item.make} ${item.model}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                to={`/listings/${item.listing_id}`}
                className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {item.make} {item.model}
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">{item.year}</p>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/listings/${item.listing_id}`}
                className="px-4 py-2 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 inline mr-1" />
                Buy Now
              </Link>
              <button
                onClick={() => handleRemove(item.listing_id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Total ({items.length} items)</span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(total)}</span>
        </div>
        <Link
          to="/listings"
          className="block w-full mt-3 py-2.5 text-sm font-medium text-center text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
