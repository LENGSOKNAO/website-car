export interface CartItem {
  listing_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image_url: string | null;
  seller_id: string;
  added_at: string;
}

const STORAGE_KEY = 'cart_items';

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const cart = {
  getItems: (): CartItem[] => load(),

  addItem: (item: CartItem): void => {
    const items = load();
    if (!items.some((i) => i.listing_id === item.listing_id)) {
      items.push({ ...item, added_at: new Date().toISOString() });
      save(items);
    }
  },

  removeItem: (listingId: string): void => {
    save(load().filter((i) => i.listing_id !== listingId));
  },

  hasItem: (listingId: string): boolean =>
    load().some((i) => i.listing_id === listingId),

  clear: (): void => localStorage.removeItem(STORAGE_KEY),

  getCount: (): number => load().length,
};
