import { atom, selector } from 'recoil';

type ShoppingCartState = {
  isOpen: boolean;
  items: any[];
};

export const shoppingCartState = atom<ShoppingCartState>({
  key: 'shoppingCartState',
  default: {
    isOpen: false,
    items: [],
  },
});

// Selectors for computed values
export const cartTotalItemsSelector = selector({
  key: 'cartTotalItemsSelector',
  get: ({ get }) => {
    const cart = get(shoppingCartState);
    return cart.items.reduce((total: number, item: any) => total + (item.cantidad || 0), 0);
  },
});

export const cartIsOpenSelector = selector({
  key: 'cartIsOpenSelector',
  get: ({ get }) => {
    const cart = get(shoppingCartState);
    return cart.isOpen;
  },
});
