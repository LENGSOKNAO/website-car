import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Order, OrderStatus, Conversation, Message } from "@/lib/types";
import {
  formatPrice,
  formatDate,
  getStatusColor,
  imageUrl,
  cn,
} from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  CreditCard,
  User,
  Clock,
  AlertCircle,
  ExternalLink,
  Loader2,
  Check,
  ChevronDown,
  MessageSquare,
  Send,
  Loader,
} from "lucide-react";

type View = "list" | "detail";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
];

export default function Orders() {
  const { isAuthenticated, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  const canManageOrders =
    user?.is_dealer ||
    user?.role === "admin" ||
    user?.roles?.some((r: any) => r.name === "admin");

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const view: View = orderId || selectedOrder ? "detail" : "list";

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    api
      .orders()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        setOrders(Array.isArray(raw) ? raw : []);
      })
      .catch((err: any) => {
        setError(err.message || "Failed to load orders");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const found = orders.find((o) => o.id === orderId);
      if (found) setSelectedOrder(found);
    }
  }, [orderId, orders]);

  function backToList() {
    setSearchParams({});
    setSelectedOrder(null);
  }

  function selectOrder(order: Order) {
    setSelectedOrder(order);
    setSearchParams({ id: order.id });
  }

  function handleStatusChange(orderId: string, newStatus: string) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    setSelectedOrder((prev) =>
      prev?.id === orderId ? { ...prev, status: newStatus } : prev,
    );
  }

  function handleInstallmentStatusChange(
    orderId: string,
    installmentId: string,
    newStatus: string,
  ) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              installments: o.installments.map((inst) =>
                inst.id === installmentId
                  ? {
                      ...inst,
                      status:
                        newStatus as Order["installments"][number]["status"],
                    }
                  : inst,
              ),
            }
          : o,
      ),
    );
    setSelectedOrder((prev) =>
      prev?.id === orderId
        ? {
            ...prev,
            installments: prev.installments.map((inst) =>
              inst.id === installmentId
                ? {
                    ...inst,
                    status:
                      newStatus as Order["installments"][number]["status"],
                  }
                : inst,
            ),
          }
        : prev,
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center py-12 px-4">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Sign in to view orders
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            You need to be signed in to see your order history.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
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

  if (view === "detail" && selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={backToList}
        onStatusChange={handleStatusChange}
        onInstallmentStatusChange={handleInstallmentStatusChange}
        canManageOrders={canManageOrders}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center gap-2 text-sm rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!error && orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSelect={() => selectOrder(order)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onSelect,
}: {
  order: Order;
  onSelect: () => void;
}) {
  const listing = order.items?.[0]?.listing;
  const primaryImage =
    listing?.primary_image?.image_url || listing?.images?.[0]?.image_url;

  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        <div className="w-24 h-20 shrink-0 rounded-md overflow-hidden bg-gray-100">
          {primaryImage ? (
            <img
              src={imageUrl(primaryImage)}
              alt={
                listing
                  ? `${listing.year} ${listing.make?.name} ${listing.model?.name}`
                  : "Vehicle"
              }
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                #{order.order_number}
              </p>
              {listing && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {listing.year} {listing.make?.name} {listing.model?.name}
                </p>
              )}
            </div>
            <span
              className={cn(
                "shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full capitalize",
                getStatusColor(order.status),
              )}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(order.placed_at)}
            </span>
            <span className="flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              {order.payment_method === "finance" ? "Finance" : "Cash"}
            </span>
            <span className="font-medium text-gray-900">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 self-center shrink-0" />
      </div>
    </button>
  );
}

function StatusDropdown({
  current,
  onChange,
}: {
  current: string;
  onChange: (status: string) => void;
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
          {ORDER_STATUSES.map((status) => (
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

const INSTALLMENT_STATUSES = ["pending", "paid", "overdue"] as const;

function InstallmentStatusDropdown({
  current,
  onChange,
}: {
  current: string;
  onChange: (status: string) => void;
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
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "text-[11px] font-medium px-2 py-0.5 rounded-full capitalize transition-colors",
          getStatusColor(current),
        )}
      >
        {current}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {INSTALLMENT_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => {
                onChange(status);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-gray-50 transition-colors capitalize",
                status === current && "bg-gray-50 font-semibold",
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  getStatusColor(status).split(" ")[0] || "bg-gray-300",
                )}
              />
              {status}
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

function OrderDetail({
  order,
  onBack,
  onStatusChange,
  onInstallmentStatusChange,
}: {
  order: Order;
  onBack: () => void;
  onStatusChange: (orderId: string, status: string) => void;
  onInstallmentStatusChange: (
    orderId: string,
    installmentId: string,
    status: string,
  ) => void;
  canManageOrders: boolean;
}) {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgLoading, setMsgLoading] = useState(true);
  const [msgError, setMsgError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const listing = order.items?.[0]?.listing;
  const primaryImage =
    listing?.primary_image?.image_url || listing?.images?.[0]?.image_url;

  async function handleStatusChange(newStatus: string) {
    if (newStatus === order.status || updating) return;
    setUpdating(true);
    setUpdateError("");
    const prevStatus = order.status;
    onStatusChange(order.id, newStatus);
    try {
      await api.updateOrderStatus(order.id, newStatus);
    } catch (err: any) {
      onStatusChange(order.id, prevStatus);
      setUpdateError(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  function handleInstallmentChange(installmentId: string, newStatus: string) {
    onInstallmentStatusChange(order.id, installmentId, newStatus);
  }

  useEffect(() => {
    if (!user || !listing) return;
    setMsgLoading(true);
    api
      .conversations()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        const convs = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
        const conv = convs.find(
          (c: Conversation) =>
            c.listing_id === listing.id &&
            ((c.sender_id === user.id && c.receiver_id === order.seller_id) ||
              (c.receiver_id === user.id && c.sender_id === order.seller_id)),
        );
        if (conv) {
          setConversation(conv);
          return api.conversationMessages(conv.id);
        }
        return { data: [] };
      })
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        const msgs = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
        setMessages(msgs);
      })
      .catch((err) => setMsgError(err.message || "Failed to load messages"))
      .finally(() => setMsgLoading(false));
  }, [listing?.id, order.seller_id, user?.id]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!msgInput.trim() || sendingMsg || !conversation) return;
    setSendingMsg(true);
    try {
      const res = await api.replyConversation(conversation.id, {
        content: msgInput.trim(),
      });
      const msg = res?.data?.data ?? res?.data ?? res;
      if (msg) setMessages((prev) => [...prev, msg]);
      setMsgInput("");
    } catch (err: any) {
      setMsgError(err.message || "Failed to send message");
    } finally {
      setSendingMsg(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Orders
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
              <h1 className="text-xl font-bold text-gray-900">
                Order #{order.order_number}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {formatDate(order.placed_at)}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full capitalize",
                getStatusColor(order.status),
              )}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Vehicle */}
        {listing && (
          <div className="border-b border-gray-100 w-full">
            <div className="w-full h-full flex flex-col gap-6">
              <div className="w-full h-[500px] shrink-0  overflow-hidden bg-gray-100">
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
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                    {listing.mileage.toLocaleString()} mi
                  </p>
                )}
                {listing.vin && (
                  <p className="text-xs md:text-sm text-gray-400 mt-0.5">
                    VIN: {listing.vin}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Seller */}
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Seller
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              {order.seller?.avatar_url ? (
                <img
                  src={imageUrl(order.seller.avatar_url)}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {order.seller?.dealer_name ||
                  order.seller?.full_name ||
                  "Unknown"}
              </p>
              {order.seller?.location && (
                <p className="text-xs text-gray-500">{order.seller.location}</p>
              )}
            </div>
            {order.seller?.is_dealer && (
              <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-auto">
                Dealer
              </span>
            )}
            <button
              onClick={() => setShowMessageModal(true)}
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium rounded-sm hover:text-gray-500 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Message Seller
            </button>
          </div>
        </div>

        {/* Messages */}
        {conversation && (
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Messages
            </h2>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Conversation with{" "}
                  {order.seller?.dealer_name ||
                    order.seller?.full_name ||
                    "Seller"}
                </span>
                <button
                  onClick={() =>
                    (window.location.href = `/messages?seller=${order.seller?.id}&listing=${listing?.id}`)
                  }
                  className="text-xs text-blue-600 hover:underline"
                >
                  Open full conversation
                </button>
              </div>
              <div className="h-80 overflow-y-auto p-4 space-y-3">
                {msgLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p className="text-sm">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2",
                        msg.sender_id === user?.id
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] px-3 py-2 text-sm rounded-2xl",
                          msg.sender_id === user?.id
                            ? "bg-gray-900 text-white rounded-tr-none"
                            : "bg-gray-100 text-gray-900 rounded-tl-none",
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            msg.sender_id === user?.id
                              ? "text-gray-400"
                              : "text-gray-500",
                          )}
                        >
                          {formatDate(msg.created_at)}
                          {msg.sender_id === user?.id && msg.read_at && (
                            <span className="ml-1.5 text-blue-500">✓✓</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-100 p-4 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  disabled={sendingMsg}
                />
                <button
                  type="submit"
                  disabled={!msgInput.trim() || sendingMsg}
                  className="shrink-0 w-9 h-9 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-40"
                >
                  {sendingMsg ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Payment */}
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Payment
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium capitalize text-gray-900">
                {order.payment_method || "N/A"}
              </span>
            </div>
            {order.payment_method === "finance" && (
              <>
                {order.down_payment != null && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Down Payment</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(order.down_payment)}
                    </span>
                  </div>
                )}
                {order.loan_term != null && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Loan Term</span>
                    <span className="font-medium text-gray-900">
                      {order.loan_term} months
                    </span>
                  </div>
                )}
                {order.monthly_payment != null && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Payment</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(order.monthly_payment)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Order Items / Pricing */}
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Invoice
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            {order.accessories && order.accessories.length > 0 && (
              <div className="pl-4 space-y-1">
                {order.accessories.map((acc, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs text-gray-500"
                  >
                    <span>{acc.name}</span>
                    <span>{formatPrice(acc.price)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-900">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fees</span>
              <span className="text-gray-900">{formatPrice(order.fees)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Installments */}
        {order.installments && order.installments.length > 0 && (
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Installments ({order.installments.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                    <th className="text-left py-2 pr-3 font-medium">#</th>
                    <th className="text-left py-2 pr-3 font-medium">
                      Due Date
                    </th>
                    <th className="text-right py-2 pr-3 font-medium">Amount</th>
                    <th className="text-right py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order.installments.map((inst) => (
                    <tr key={inst.id} className="border-b border-gray-50">
                      <td className="py-2.5 pr-3 text-gray-600">
                        {inst.month_number}
                      </td>
                      <td className="py-2.5 pr-3 text-gray-600">
                        {formatDate(inst.due_at)}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-medium text-gray-900">
                        {formatPrice(inst.amount)}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full capitalize",
                            getStatusColor(inst.status),
                          )}
                        >
                          {inst.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
              Notes
            </h2>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {order.completed_at && (
              <span className="ml-4">
                Completed: {formatDate(order.completed_at)}
              </span>
            )}
          </div>
          {order.items?.[0]?.listing_id && (
            <Link
              to={`/listings/${order.items[0].listing_id}`}
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View
            </Link>
          )}
        </div>
      </div>

      {/* Next Payment Due */}
      {order.next_payment_due_at && (
        <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 flex items-center justify-center gap-2 text-sm rounded-sm">
          <Clock className="w-4 h-4 shrink-0" />
          Next payment due: {formatDate(order.next_payment_due_at)}
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && conversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Message {order.seller?.dealer_name || order.seller?.full_name || "Seller"}
            </h2>
            <button
              onClick={() => setShowMessageModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {msgLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.sender_id === user?.id ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] px-4 py-2 text-sm rounded-2xl",
                      msg.sender_id === user?.id
                        ? "bg-gray-900 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-900 rounded-tl-none"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={cn("text-[10px] mt-1", msg.sender_id === user?.id ? "text-gray-400" : "text-gray-500")}>
                      {formatDate(msg.created_at)}
                      {msg.sender_id === user?.id && msg.read_at && (
                        <span className="ml-1.5 text-blue-500">✓✓</span>
                      )}
                    </p>
                  </div>
                </div>
                  ))}
                )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-4 flex items-center gap-2">
            <input
              type="text"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              disabled={sendingMsg}
            />
            <button
              type="submit"
              disabled={!msgInput.trim() || sendingMsg}
              className="shrink-0 w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {sendingMsg ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
  );
}
