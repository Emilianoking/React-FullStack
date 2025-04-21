"use client";
import Link from 'next/link'
import React from 'react'
// Importar el css
import styles from "@/styles/Navbar.module.css"

import { useCart } from "@/context/CartContext";
import "bootstrap-icons/font/bootstrap-icons.min.css";


export default function Navbar() {

  const { cartItems } = useCart();//obtener los items del carrito




  return (
    // Etiqueta Nav
    <nav className={styles.navbar}>
        <ul>
            <li><Link href='/'>Inicio</Link></li>
            <li><Link href='/products'>productos</Link></li>
            <li><Link href='/Users'>Usuarios</Link></li>
            <li><Link href='/contact'>Contacto</Link></li>


            {/* styles for cards */}
            <li className='styles.cartContainer'> 
              <Link href='/cart' className={styles.cartLink}>
              <i className='bi bi-cart3'> </i> {/* Icono del carrito */}
              {cartItems.length > 0 && (
                <span className={styles.cartBadge}>{cartItems.length}</span>
              )}

              </Link>
            </li>
        </ul>
    </nav>
  )
}




