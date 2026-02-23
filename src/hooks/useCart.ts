import { useState, useCallback } from 'react';

interface CartItem {
  id: number;
  name: string;
  cost: number;
  quantity: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setSnackbarMessage(`Товар "${item.name}" добавлен в корзину`);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCartMessage = useCallback(() => {
    setSnackbarMessage('');
  }, []);

  return {
    cart,
    snackbarMessage,
    addToCart,
    removeFromCart,
    clearCartMessage,
  };
};