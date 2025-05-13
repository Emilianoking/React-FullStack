"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Modal, Button, ListGroup, Image } from "react-bootstrap";
import styles from "@/styles/Navbar.module.css";
import { useCart } from "@/context/CartContext";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import cartModalStyles from "@/styles/CartModal.module.css";

export default function Navbar() {
  const { cartItems, removeFromCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const groupedItems = cartItems.reduce((acc, item) => {
    const itemId = String(item.id || item._id);
    const existingItem = acc.find((i) => String(i.id || i._id) === itemId);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
      existingItem.subtotal = (existingItem.price || 0) * existingItem.quantity;
      return acc;
    }

    return [...acc, { ...item, quantity: item.quantity || 1, subtotal: (item.price || 0) * (item.quantity || 1) }];
  }, []);

  const total = groupedItems.length > 0
    ? groupedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0).toFixed(2)
    : "0.00";

  const totalItems = groupedItems.length > 0
    ? groupedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  return (
    <>
      <nav className={styles.navbar}>
        <ul>
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/products">Productos</Link></li>
          <li><Link href="/users">Usuarios</Link></li>
          <li><Link href="/auth">Iniciar Sesión</Link></li>
          <li><Link href="/pasarelas" className="btn btn-primary">Ir a Pasarelas</Link></li>
          <li><Link href="/contact">Contacto</Link></li>
          <li className={styles.cartContainer}>
            <div className={styles.cartLink} onClick={() => setShowModal(true)}>
              <i className={`bi bi-cart3 ${styles.cartIcon}`}></i>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </div>
          </li>
        </ul>
      </nav>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={cartModalStyles.modalHeader}>
          <Modal.Title>Tu Carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body className={cartModalStyles.modalBody}>
          {groupedItems.length === 0 ? (
            <p className={cartModalStyles.emptyCart}>Tu carrito está vacío.</p>
          ) : (
            <>
              <ListGroup variant="flush">
                {groupedItems.map((item) => (
                  <ListGroup.Item key={item.id || item._id} className={cartModalStyles.cartItem}>
                    <div className={cartModalStyles.cartItemContent}>
                      <Image
                        src={item.image || item.imageUrl}
                        alt={item.title || item.name}
                        className={cartModalStyles.cartItemImage}
                      />
                      <div className={cartModalStyles.cartItemDetails}>
                        <h6>{item.title || item.name}</h6>
                        <p>
                          Precio: ${(item.price || 0).toFixed(2)} x {item.quantity || 1} = $
                          {item.subtotal.toFixed(2)}
                        </p>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id || item._id)}
                          className={cartModalStyles.removeButton}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className={cartModalStyles.total}>
                <h5>Total: ${total}</h5>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className={cartModalStyles.modalFooter}>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            className={cartModalStyles.closeButton}
          >
            Cerrar
          </Button>
          {groupedItems.length > 0 && (
            <Button
              className={cartModalStyles.checkoutButton}
              onClick={() => setShowModal(false)}
            >
              Proceder al Pago
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}