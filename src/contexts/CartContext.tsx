import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  menuItemId: string;
  batchId: string;
  quantity: number;
  menuItem: {
    id: string;
    name: string;
    price: number;
  };
  batch: {
    id: string;
    restaurant: { name: string };
  };
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  isDrawerOpen: boolean;
  activeBatchId: string | null;
  paymentMethod: 'WALLET' | 'COD' | null;
  setActiveBatchId: (id: string | null) => void;
  setPaymentMethod: (method: 'WALLET' | 'COD' | null) => void;
  toggleDrawer: () => void;
  addToCart: (menuItemId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [_activeBatchId, _setActiveBatchId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'COD' | null>(null);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await apiClient.get<Cart>('/cart');
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Clear batch context when user changes
  useEffect(() => {
    if (!user) {
      _setActiveBatchId(null);
      setPaymentMethod(null);
    }
  }, [user]);

  const setActiveBatchId = async (id: string | null) => {
    // If switching to a different batch and we have items, clear the cart
    if (_activeBatchId && id !== null && _activeBatchId !== id) {
      if (cart && cart.items.length > 0) {
        setLoading(true);
        try {
          await apiClient.delete('/cart');
          setCart({ ...cart, items: [] });
        } catch (err) {
          console.error('Failed to clear previous batch cart:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    _setActiveBatchId(id);
  };


  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const addToCart = async (menuItemId: string, quantity: number = 1) => {
    if (!user) return;

    if (!_activeBatchId) {
      alert('Please select a batch first before adding items to your cart.');
      return;
    }

    setLoading(true);
    try {
      const updatedCart = await apiClient.post<Cart>('/cart/items', {
        menuItemId,
        quantity,
        batchId: _activeBatchId,
      });
      setCart(updatedCart);
      setIsDrawerOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    setLoading(true);
    try {
      const updatedCart = await apiClient.patch<Cart>(`/cart/items/${itemId}`, { quantity });
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await apiClient.delete('/cart');
      if (cart) {
        setCart({ ...cart, items: [] });
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart?.items.reduce((total, item) => total + (item.quantity * item.menuItem.price), 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      isDrawerOpen,
      activeBatchId: _activeBatchId,
      paymentMethod,
      setActiveBatchId,
      setPaymentMethod,
      toggleDrawer,
      addToCart,
      updateItemQuantity,
      clearCart,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
