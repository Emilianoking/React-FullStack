"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Image } from "react-bootstrap";
import styles from "@/styles/Navbar.module.css";
import { useCart } from "@/context/CartContext";
import api from "@/services/api";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import cartModalStyles from "@/styles/CartModal.module.css";

export default function Navbar() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token en localStorage:", token);
        if (token) {
          const response = await api.get("/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserRole(response.data.role);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
  };

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

  if (loading) return null;

  const profileLink = userRole === "admin" ? "/admin/dashboard" : "/profile";

  return (
    <>
      <nav className={styles.navbar}>
        <ul>
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/products">Productos</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link href={profileLink}>Perfil</Link></li>
              <li>
                <Button variant="link" onClick={handleLogout} className={styles.logoutButton}>
                  Cerrar Sesión
                </Button>
              </li>
            </>
          ) : (
            <li><Link href="/auth">Iniciar Sesión</Link></li>
          )}
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
                        <div className={cartModalStyles.quantityControls}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => decreaseQuantity(item.id || item._id)}
                          >
                            −
                          </Button>
                          <span className={cartModalStyles.quantity}>{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => increaseQuantity(item.id || item._id)}
                          >
                            +
                          </Button>
                        </div>
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
            <>
              <Button
                className={cartModalStyles.checkoutButton}
                onClick={() => setShowModal(false)}
              >
                Proceder al Pago
              </Button>
              <Link href="/pasarelas" passHref>
                <Button
                  variant="primary"
                  onClick={() => setShowModal(false)}
                  className={cartModalStyles.checkoutButton}
                >
                  Ir a Pasarelas
                </Button>
              </Link>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}