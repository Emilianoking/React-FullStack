"use client";
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // Aseguramos que siempre sea un array

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Convertimos los IDs a string para evitar problemas de comparación
      const productId = String(product.id);
      const existingItem = prevItems.find((item) => String(item.id) === productId);

      if (existingItem) {
        return prevItems.map((item) =>
          String(item.id) === productId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => String(item.id) !== String(productId)));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}