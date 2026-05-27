import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId: string) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items
            : [...state.items, productId],
        }));
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      toggleItem: (productId: string) => {
        if (get().items.includes(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      isInWishlist: (productId: string) => get().items.includes(productId),
    }),
    { name: 'makostech-wishlist' }
  )
);
