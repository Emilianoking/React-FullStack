"use client" // Requerido para usar los hooks en Next.js

import { createContext, useState, useContext } from "react"

// Crear el contexto de productos
const CartContext = createContext();


// Proveedor de productos - contexto
export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);

    // Funcion para agregar productos al carrito
    const addToCart = (product) => {
        setCartItems((prevCart)=> [...prevCart, product]);
    };

    return (
        <CartContext.Provider value={{cartItems, addToCart}}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el contexto de productos
export const useCart = () => useContext(CartContext);















