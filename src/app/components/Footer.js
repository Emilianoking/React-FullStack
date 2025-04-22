import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Enlaces Útiles */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Enlaces Útiles</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/products">Productos</Link></li>
            <li><Link href="/users">Usuarios</Link></li>
            <li><Link href="/contact">Contacto</Link></li>
          </ul>
        </div>

        {/* Información de Contacto */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Contacto</h3>
          <ul className={styles.footerContact}>
            <li>
              <a href="mailto:info@tuempresa.com">info@tuempresa.com</a>
            </li>
            <li>
              <a href="tel:+571234567890">+57 123 456 7890</a>
            </li>
            <li>Calle Ficticia 123, Meta, Colombia</li>
          </ul>
        </div>
      </div>

      {/* Derechos de Autor */}
      <div className={styles.footerBottom}>
        <p>© 2025 Tu Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}