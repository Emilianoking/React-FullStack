import React from 'react'
import "../styles/Navbar.module.css"
import Navbar from './components/Navbar'
import '../styles/globals.css';

import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from '@/context/CartContext';



export default function RootLayout({ children }) {
  return (

    <html lang='es'>
      <body>

        <CartProvider>
          <header>
            <Navbar/>
          </header>

          {/* Main */}
          <main className='mainContet'>{children}</main>

          {/* Footer */}
          <footer>
            <p>© 2025 - Todos los derechos reservados</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}




