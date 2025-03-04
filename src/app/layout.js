import React from 'react'
import "../styles/Navbar.module.css"
import Navbar from './components/Navbar'
import '../styles/globals.css';

import "bootstrap/dist/css/bootstrap.min.css";

//TODO: Importar el CartProvider de productos 


export default function RootLayout({children}) {
  return (

    <html lang='es'>
      <body>

        //TODO: Agregar el CartProvider de productos



        <header>
           {/* Importar el Navbar */}
           <Navbar></Navbar>
        </header>
        <main>{children}</main>

        {/* Footer */}
        <footer>
          <p>© 2025 - Todos los derechos reservados</p>
        </footer>

      </body>


    </html>
    
  );
}




