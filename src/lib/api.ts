import type { SavedListing, Inquiry, Offer, Conversation } from "./types";

const API_BASE = "https://admin-car-beta.vercel.app/api/v1";

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
  });

  const text = await response.text();

  if (!response.ok) {
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
  updateProfile: (data: { full_name?: string; phone?: string | null; location?: string | null; avatar_url?: string | null }) =>
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
  changePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) =>
    request<void>("/auth/password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  logout: () =>
    request<void>("/auth/logout", {
      method: "POST",
    }),
  savedListings: () =>
    request<SavedListing[]>("/saved-listings"),
  saveListing: (listingId: string) =>
    request<{ id: string }>("/saved-listings", {
      method: "POST",
      body: JSON.stringify({ listing_id: listingId }),
    }),
  unsaveListing: (id: string) =>
    request<void>(`/saved-listings/${id}`, {
      method: "DELETE",
    }),
  inquiries: () =>
    request<Inquiry[]>("/inquiries"),
  offers: () =>
    request<Offer[]>("/offers"),
  conversations: () =>
    request<Conversation[]>("/conversations"),
  listings: (params: Record<string, string | number | undefined | null | boolean>) => {
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
    return request<any>(`/listings?${query}`)
  },
  listing: (id: string) => request<any>(`/listings/${id}`),
  makes: () => request<any[]>('/makes'),
  models: (makeId: string) => request<any[]>(`/makes/${makeId}/models`),
  sendInquiry: (data: { listing_id: string; message: string; phone_number?: string }) =>
    request<any>('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  makeOffer: (data: { listing_id: string; offered_price: number }) =>
    request<any>('/offers', { method: 'POST', body: JSON.stringify(data) }),
  users: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<any>(`/users${query}`)
  },
  upload: (file: File) => uploadFile(file),
};
