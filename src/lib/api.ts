import type { SavedListing, Inquiry, Offer, Conversation, Message, Order } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : "/api/v1";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data: T }> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    redirect: 'manual',
  });

  if (response.type === 'opaqueredirect' || response.status === 0) {
    throw new Error('Unauthorized');
  }

  const text = await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    let message = text;
    try {
      const parsed = JSON.parse(text);
      message = parsed.message || message;
      if (parsed.errors) {
        const details = Object.values(parsed.errors).flat().join('; ');
        if (details) message += `: ${details}`;
      }
    } catch {
      /* text is not JSON */
    }
    throw new Error(message);
  }

  if (!text) return { data: null } as any;
  try {
    const json = JSON.parse(text);
    return { data: json };
  } catch {
    throw new Error('Invalid JSON response');
  }
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/upload`, { method: "POST", headers, body: formData });
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { const p = JSON.parse(text); msg = p.message || msg; } catch {}
    throw new Error(msg);
  }
  try { const j = JSON.parse(text); return j.url || j.path || j.data?.url || text; } catch { return text; }
}

export const api = {
  me: () =>
    request<{
      id: string;
      full_name: string;
      email: string;
      phone: string | null;
      avatar_url: string | null;
      location: string | null;
      is_dealer: boolean;
      dealer_name: string | null;
      role: string;
      roles: string[];
    }>("/auth/me"),
  login: (email: string, password: string) =>
    request<{
      token: string;
      token_type: string;
      expires_in: number;
      user: {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        avatar_url: string | null;
        location: string | null;
        is_dealer: boolean;
        dealer_name: string | null;
        role: string;
        roles: string[];
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (data: {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) =>
    request<{
      token: string;
      user: {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        avatar_url: string | null;
        location: string | null;
        is_dealer: boolean;
        dealer_name: string | null;
        role: string;
        roles: string[];
      };
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProfile: (data: {
    full_name?: string;
    phone?: string | null;
    location?: string | null;
    avatar_url?: string | null;
  }) =>
    request<{
      id: string;
      full_name: string;
      email: string;
      phone: string | null;
      avatar_url: string | null;
      location: string | null;
      is_dealer: boolean;
      dealer_name: string | null;
      role: string;
      roles: { id: string; name: string; guard_name: string }[];
    }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  changePassword: (data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) =>
    request<void>("/auth/password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  logout: () =>
    request<void>("/auth/logout", {
      method: "POST",
    }),
  savedListings: () => request<SavedListing[]>("/saved-listings"),
  saveListing: (listingId: string) =>
    request<{ id: string }>("/saved-listings", {
      method: "POST",
      body: JSON.stringify({ listing_id: listingId }),
    }),
  unsaveListing: (listingId: string) =>
    request<void>(`/saved-listings/${listingId}`, {
      method: "DELETE",
    }),
  inquiries: () => request<Inquiry[]>("/inquiries"),
  offers: () => request<Offer[]>("/offers"),
  conversations: () => request<Conversation[]>("/conversations"),
  conversationMessages: (id: string) =>
    request<Message[]>(`/conversations/${id}/messages`),
  sendMessage: (data: {
    receiver_id: string;
    listing_id?: string;
    content: string;
  }) =>
    request<Message>("/messages/send", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  replyConversation: (id: string, data: { content: string }) =>
    request<Message>(`/conversations/${id}/reply`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  markConversationRead: (id: string) =>
    request<void>(`/conversations/${id}/read`, { method: "POST" }),
  editMessage: (id: string, data: { content: string }) =>
    request<Message>(`/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteMessage: (id: string) =>
    request<void>(`/messages/${id}`, { method: "DELETE" }),
  listings: (
    params: Record<string, string | number | undefined | null | boolean>,
  ) => {
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
      )
      .join("&");
    return request<any>(`/listings?${query}`);
  },
  listing: (id: string) => request<any>(`/listings/${id}`),
  makes: () => request<any[]>("/makes"),
  models: (makeId: string) => request<any[]>(`/makes/${makeId}/models`),
  sendInquiry: (data: {
    listing_id: string;
    message: string;
    phone_number?: string;
  }) =>
    request<any>("/inquiries", { method: "POST", body: JSON.stringify(data) }),
  makeOffer: (data: {
    listing_id: string;
    offered_price: number;
    payment_method: "finance" | "cash";
    down_payment?: number;
    loan_term?: number;
    accessories?: { id: string; name: string; price: number }[];
  }) => request<any>("/offers", { method: "POST", body: JSON.stringify(data) }),
  orders: (
    params?: Record<string, string | number | undefined | null | boolean>,
  ) => {
    const query = params
      ? "?" +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
          )
          .join("&")
      : "";
    return request<any>(`/orders${query}`);
  },
  order: (id: string) => request<any>(`/orders/${id}`),
  orderInstallments: (
    orderId: string,
    params?: Record<string, string | number | undefined | null | boolean>,
  ) => {
    const query = params
      ? "?" +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
          )
          .join("&")
      : "";
    return request<any>(`/orders/${orderId}/installments${query}`);
  },
  createOrder: (data: {
    listing_id: string;
    price: number;
    payment_method: "finance" | "cash";
    down_payment?: number;
    loan_term?: number;
    accessories?: { id: string; name: string; price: number }[];
    message?: string;
  }) => request<any>("/orders", { method: "POST", body: JSON.stringify(data) }),
  myListings: (
    params?: Record<string, string | number | undefined | null | boolean>,
  ) => {
    const query = params
      ? "?" +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
          )
          .join("&")
      : "";
    return request<any>(`/cars${query}`);
  },
  myListing: (id: string) => request<any>(`/cars/${id}`),
  createListing: (data: any) =>
    request<any>("/cars", { method: "POST", body: JSON.stringify(data) }),
  updateListing: (id: string, data: any) =>
    request<any>(`/cars/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteListing: (id: string) =>
    request<void>(`/cars/${id}`, { method: "DELETE" }),
  listingFormData: () => request<any>("/cars/create"),
  updateOrderStatus: (orderId: string, status: string) =>
    request<any>(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  payInstallment: (
    orderId: string,
    data: { month_number: number; transaction_id: string },
  ) =>
    request<any>(`/orders/${orderId}/pay-installment`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  users: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/users${query}`);
  },
  upload: (file: File) => uploadFile(file),
  heroes: () => request<any[]>("/heroes"),
  sliders: () => request<any[]>("/web/sliders"),
  boxTrips: () => request<any[]>("/web/boxTrips"),
  boxOne: () => request<any[]>("/web/boxOne"),
  boxRight: () => request<any[]>("/web/boxRight"),
  boxLeft: () => request<any[]>("/web/boxLeft"),
  boxTen: () => request<any[]>("/web/boxTen"),
  boxOneButtom: () => request<any[]>("/web/boxOneButtom"),
  brand: (slug: string) => request<any>(`/web/brand/${slug}`),
  sellerSales: () => request<any>("/seller/sales"),
  sellerOrders: (params?: Record<string, string | number | undefined | null | boolean>) => {
    const query = params
      ? "?" +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
          )
          .join("&")
      : "";
    return request<any>(`/seller/orders${query}`);
  },
  sellerOrder: (id: string) => request<any>(`/seller/orders/${id}`),
  updateSellerOrder: (id: string, status: string) =>
    request<any>(`/seller/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  updateInstallment: (orderId: string, installmentId: string, status: string, paidAt?: string) =>
    request<any>(`/seller/orders/${orderId}/installments/${installmentId}`, {
      method: "PUT",
      body: JSON.stringify({ status, paid_at: paidAt }),
    }),
  web: () => request<any>("/web"),
  webItem: (id: string) => request<any>(`/web/${id}`),
};
