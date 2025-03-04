import Link from 'next/link'
import React from 'react'
// Importar el css
import styles from "@/styles/Navbar.module.css"




export default function Navbar() {
  return (
    // Etiqueta Nav
    <nav className={styles.navbar}>
        <ul>
            <li><Link href='/'>Inicio</Link></li>
            <li><Link href='/about'>Sobre Nosotros</Link></li>
            <li><Link href='/contact'>Contacto</Link></li>
        </ul>
    </nav>
  )
}




