"use client";
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // Aseguramos que siempre sea un array

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const productId = String(product.id || product._id);
      const existingItem = prevItems.find((item) => String(item.id || item._id) === productId);

      if (existingItem) {
        return prevItems.map((item) =>
          String(item.id || item._id) === productId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item.id || item._id) === String(productId)
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((item) => String(item.id || item._id) === String(productId));
      if (item.quantity <= 1) {
        return prevItems.filter((item) => String(item.id || item._id) !== String(productId));
      }
      return prevItems.map((item) =>
        String(item.id || item._id) === String(productId)
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => String(item.id || item._id) !== String(productId)));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}