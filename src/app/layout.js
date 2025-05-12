import React from 'react'
import "../styles/Navbar.module.css"
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}




