import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { formatPrice, formatDate, imageUrl, getStatusColor, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, DollarSign, Loader2, AlertCircle, Package, User, Calendar, CreditCard, ExternalLink, Clock, MessageSquare, Send, Check, ChevronDown } from "lucide-react";

type Tab = "orders" | "pre-orders";

export default function SellerSales() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [preOrders, setPreOrders] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
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

  if (selectedItem) {
    return (
      <OrderDetailView
        item={selectedItem}
        tab={tab}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

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
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
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
                </button>
              );
            }

            const poListing = item.listing;
            const poImage = poListing?.primary_image?.image_url || poListing?.images?.[0]?.image_url;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
              >
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
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "completed", "cancelled"];

const PRE_ORDER_STATUSES = ["pending", "confirmed", "cancelled"];

const INSTALLMENT_STATUSES = ["pending", "paid", "overdue"] as const;

const INSTALLMENT_COLORS: Record<string, string> = {
  pending: "text-yellow-700",
  paid: "text-green-700",
  overdue: "text-red-700",
};

const INSTALLMENT_BG_COLORS: Record<string, string> = {
  pending: "bg-yellow-100",
  paid: "bg-green-100",
  overdue: "bg-red-100",
};

function InstallmentStatusCheckboxes({
  current,
  onChange,
  disabled,
}: {
  current: string;
  onChange: (status: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      {INSTALLMENT_STATUSES.map((status) => {
        const isSelected = current === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            disabled={disabled}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full transition-all capitalize",
              isSelected
                ? `${INSTALLMENT_BG_COLORS[status] || "bg-gray-100"} ${INSTALLMENT_COLORS[status] || "text-gray-600"} shadow-sm`
                : "bg-white text-gray-400 border border-gray-200 hover:border-gray-300 hover:text-gray-500",
            )}
          >
            <Check className="w-3 h-3" />
            {status}
          </button>
        );
      })}
    </div>
  );
}

function StatusDropdown({
  current,
  statuses,
  onChange,
  disabled,
}: {
  current: string;
  statuses: string[];
  onChange: (status: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full capitalize transition-colors",
          getStatusColor(current),
        )}
      >
        {current.replace("_", " ")}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => {
                onChange(status);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors",
                status === current && "bg-gray-50 font-semibold",
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  getStatusColor(status).split(" ")[0] || "bg-gray-300",
                )}
              />
              <span className="capitalize">{status.replace("_", " ")}</span>
              {status === current && (
                <Check className="w-3 h-3 ml-auto text-gray-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderDetailView({
  item,
  tab,
  onBack,
}: {
  item: any;
  tab: Tab;
  onBack: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [currentStatus, setCurrentStatus] = useState(item.status);
  const [installments, setInstallments] = useState<any[]>(item.installments || []);
  const [pendingCascade, setPendingCascade] = useState<{
    message: string;
    updated: any[];
  } | null>(null);
  const [installmentUpdating, setInstallmentUpdating] = useState<Set<string>>(new Set());
  const statuses = tab === "orders" ? ORDER_STATUSES : PRE_ORDER_STATUSES;

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus || updating) return;
    setUpdating(true);
    setUpdateError("");
    const prevStatus = currentStatus;
    setCurrentStatus(newStatus);
    try {
      await api.updateSellerOrder(item.id, newStatus);
    } catch (err: any) {
      setCurrentStatus(prevStatus);
      setUpdateError(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  async function persistInstallments(updated: any[]) {
    const ids = new Set(updated.map((i: any) => i.id));
    setInstallmentUpdating((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    try {
      await Promise.all(
        updated.map((inst: any) =>
          api.updateInstallment(item.id, inst.id, inst.status),
        ),
      );
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update installment");
      setInstallments(item.installments || []);
    } finally {
      setInstallmentUpdating(new Set());
    }
  }

  function handleInstallmentChange(installmentId: string, newStatus: string) {
    setInstallments((prev) => {
      const target = prev.find((i: any) => i.id === installmentId);
      if (!target) return prev;

      const sorted = [...prev].sort((a: any, b: any) => a.month_number - b.month_number);
      const targetIdx = sorted.findIndex((i: any) => i.id === installmentId);

      // Cascade upward: mark earlier installments with same status
      if (newStatus === "paid" || newStatus === "overdue") {
        const earlier = sorted.filter((i: any) => {
          const idx = sorted.findIndex((x: any) => x.id === i.id);
          return idx < targetIdx && i.status !== newStatus;
        });
        if (earlier.length > 0) {
          const updated = prev.map((inst: any) => {
            const idx = sorted.findIndex((i: any) => i.id === inst.id);
            if (idx < targetIdx && inst.status !== newStatus) {
              return { ...inst, status: newStatus as "paid" | "overdue" };
            }
            if (inst.id === installmentId) {
              return { ...inst, status: newStatus };
            }
            return inst;
          });
          setPendingCascade({
            message: `${earlier.length} earlier installment(s) will also be marked as ${newStatus}`,
            updated,
          });
          return prev;
        }
        const single = prev.map((inst: any) =>
          inst.id === installmentId ? { ...inst, status: newStatus } : inst,
        );
        persistInstallments(single);
        return single;
      }

      // Cascade downward: reset later paid installments to pending
      const later = sorted.filter((i: any) => {
        const idx = sorted.findIndex((x: any) => x.id === i.id);
        return idx > targetIdx && i.status === "paid";
      });
      if (later.length > 0) {
        const updated = prev.map((inst: any) => {
          const idx = sorted.findIndex((i: any) => i.id === inst.id);
          if (idx > targetIdx && inst.status === "paid") {
            return { ...inst, status: "pending" as const };
          }
          if (inst.id === installmentId) {
            return { ...inst, status: newStatus };
          }
          return inst;
        });
        setPendingCascade({
          message: `${later.length} later installment(s) will be reset to pending`,
          updated,
        });
        return prev;
      }
      const single = prev.map((inst: any) =>
        inst.id === installmentId ? { ...inst, status: newStatus } : inst,
      );
      persistInstallments(single);
      return single;
    });
  }

  function applyCascade() {
    if (!pendingCascade) return;
    setInstallments(pendingCascade.updated);
    setPendingCascade(null);
    persistInstallments(pendingCascade.updated);
  }

  function cancelCascade() {
    setPendingCascade(null);
  }

  if (tab === "orders") {
    const listing = item.items?.[0]?.listing;
    const primaryImage = listing?.primary_image?.image_url || listing?.images?.[0]?.image_url;

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pt-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Sales
        </button>

        {updateError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center gap-2 text-sm rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" /> {updateError}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Order #{item.order_number}</h1>
                <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(item.placed_at)}</p>
              </div>
              <StatusDropdown
                current={currentStatus}
                statuses={statuses}
                onChange={handleStatusChange}
                disabled={updating}
              />
            </div>
          </div>

          {/* Vehicle */}
          {listing && (
            <div className="border-b border-gray-100 w-full">
              <div className="w-full h-full flex flex-col gap-6">
                <div className="w-full h-[500px] shrink-0 overflow-hidden bg-gray-100">
                  {primaryImage ? (
                    <img
                      src={imageUrl(primaryImage)}
                      alt={`${listing.year} ${listing.make?.name} ${listing.model?.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 px-6 pb-6">
                  <Link
                    to={`/listings/${listing.id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm md:text-base"
                  >
                    {listing.year} {listing.make?.name} {listing.model?.name}
                  </Link>
                  {listing.mileage && (
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">{listing.mileage.toLocaleString()} mi</p>
                  )}
                  {listing.vin && (
                    <p className="text-xs md:text-sm text-gray-400 mt-0.5">VIN: {listing.vin}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Buyer */}
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Buyer</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                {item.buyer?.avatar_url ? (
                  <img src={imageUrl(item.buyer.avatar_url)} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.buyer?.dealer_name || item.buyer?.full_name || item.buyer?.name || "Unknown"}
                </p>
                {item.buyer?.location && <p className="text-xs text-gray-500">{item.buyer.location}</p>}
              </div>
              {item.buyer?.is_dealer && (
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-auto">Dealer</span>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium capitalize text-gray-900">{item.payment_method || "N/A"}</span>
              </div>
              {item.payment_method === "finance" && (
                <>
                  {item.down_payment != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Down Payment</span>
                      <span className="font-medium text-gray-900">{formatPrice(item.down_payment)}</span>
                    </div>
                  )}
                  {item.loan_term != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Loan Term</span>
                      <span className="font-medium text-gray-900">{item.loan_term} months</span>
                    </div>
                  )}
                  {item.monthly_payment != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Payment</span>
                      <span className="font-medium text-gray-900">{formatPrice(item.monthly_payment)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Invoice */}
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Invoice</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatPrice(item.subtotal)}</span>
              </div>
              {item.accessories && item.accessories.length > 0 && (
                <div className="pl-4 space-y-1">
                  {item.accessories.map((acc: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs text-gray-500">
                      <span>{acc.name}</span>
                      <span>{formatPrice(acc.price)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">{formatPrice(item.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fees</span>
                <span className="text-gray-900">{formatPrice(item.fees)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(item.total)}</span>
              </div>
            </div>
          </div>

          {/* Installments */}
          {installments.length > 0 && (
            <div className="border-b border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Installments ({installments.length})</h2>
              {pendingCascade && (
                <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 text-xs rounded-sm flex items-center gap-3">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="flex-1">{pendingCascade.message}</span>
                  <button
                    onClick={applyCascade}
                    className="px-2 py-1 bg-amber-600 text-white rounded font-medium hover:bg-amber-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={cancelCascade}
                    className="px-2 py-1 text-amber-700 hover:bg-amber-100 rounded font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                      <th className="text-left py-2 pr-3 font-medium">#</th>
                      <th className="text-left py-2 pr-3 font-medium">Due Date</th>
                      <th className="text-right py-2 pr-3 font-medium">Amount</th>
                      <th className="text-right py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((inst: any) => (
                      <tr key={inst.id} className="border-b border-gray-50">
                        <td className="py-2.5 pr-3 text-gray-600">{inst.month_number}</td>
                        <td className="py-2.5 pr-3 text-gray-600">{formatDate(inst.due_at)}</td>
                        <td className="py-2.5 pr-3 text-right font-medium text-gray-900">{formatPrice(inst.amount)}</td>
                        <td className="py-2.5 text-right">
                          <InstallmentStatusCheckboxes
                            current={inst.status}
                            onChange={(s) => handleInstallmentChange(inst.id, s)}
                            disabled={installmentUpdating.has(inst.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    {INSTALLMENT_STATUSES.map((s) => {
                      const count = installments.filter((i: any) => i.status === s).length;
                      if (count === 0) return null;
                      return (
                        <span
                          key={s}
                          className={cn(
                            "font-medium px-1.5 py-0.5 rounded-full capitalize",
                            INSTALLMENT_BG_COLORS[s],
                            INSTALLMENT_COLORS[s],
                          )}
                        >
                          {s}: {count}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">
                      Total: <strong className="text-gray-900">{formatPrice(installments.reduce((sum: number, i: any) => sum + Number(i.amount), 0))}</strong>
                    </span>
                    <span className="text-green-700">
                      Paid: <strong>{formatPrice(installments.reduce((sum: number, i: any) => sum + (i.status === "paid" ? Number(i.amount) : 0), 0))}</strong>
                    </span>
                    <span className="text-red-700">
                      Remaining: <strong>{formatPrice(
                        installments.reduce((sum: number, i: any) => sum + Number(i.amount), 0) -
                        installments.reduce((sum: number, i: any) => sum + (i.status === "paid" ? Number(i.amount) : 0), 0),
                      )}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="border-b border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Notes</h2>
              <p className="text-sm text-gray-600">{item.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 bg-gray-50 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              {item.completed_at && <span>Completed: {formatDate(item.completed_at)}</span>}
            </div>
            {item.items?.[0]?.listing_id && (
              <Link
                to={`/listings/${item.items[0].listing_id}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View
              </Link>
            )}
          </div>
        </div>

        {/* Next Payment Due */}
        {item.next_payment_due_at && (
          <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 flex items-center gap-2 text-sm rounded-sm">
            <Clock className="w-4 h-4 shrink-0" />
            Next payment due: {formatDate(item.next_payment_due_at)}
          </div>
        )}
      </div>
    );
  }

  const poListing = item.listing;
  const poImage = poListing?.primary_image?.image_url || poListing?.images?.[0]?.image_url;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pt-20">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Sales
      </button>

      {updateError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center gap-2 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" /> {updateError}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pre-Order</h1>
              <p className="text-sm text-gray-500 mt-1">Created on {formatDate(item.created_at)}</p>
            </div>
            <StatusDropdown
              current={currentStatus}
              statuses={statuses}
              onChange={handleStatusChange}
              disabled={updating}
            />
          </div>
        </div>

        {/* Vehicle */}
        {poListing && (
          <div className="border-b border-gray-100 w-full">
            <div className="w-full h-full flex flex-col gap-6">
              <div className="w-full h-[500px] shrink-0 overflow-hidden bg-gray-100">
                {poImage ? (
                  <img
                    src={imageUrl(poImage)}
                    alt={`${poListing.year} ${poListing.make?.name} ${poListing.model?.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Package className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 px-6 pb-6">
                <p className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm md:text-base">
                  {poListing.year} {poListing.make?.name} {poListing.model?.name}
                </p>
                {poListing.price && <p className="text-xs md:text-sm text-gray-500 mt-0.5">{formatPrice(poListing.price)}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Customer */}
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Customer</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{item.customer_name}</p>
              <p className="text-xs text-gray-500">{item.customer_email}</p>
              {item.customer_phone && <p className="text-xs text-gray-500">{item.customer_phone}</p>}
            </div>
          </div>
        </div>

        {/* Details */}
        {item.total_price && (
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-semibold text-gray-900">{formatPrice(item.total_price)}</span>
              </div>
              {item.message && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-gray-500 text-xs block mb-1">Message</span>
                  <p className="text-sm text-gray-600">{item.message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
