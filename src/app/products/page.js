"use client"; // Requerido para usar hooks en Next.js
import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useCart } from "@/context/CartContext"; // Importa el contexto del carrito
import styles from "@/styles/Products.module.css"; // Importa los estilos modulares

export default function ProductsPage() {
  const [products, setProducts] = useState([]); // Estado para los productos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const { addToCart } = useCart(); // Usa el contexto del carrito

  // 📌 useEffect para obtener productos de la API
  useEffect(() => {
    fetch("https://fakestoreapi.com/products") // API de prueba
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener los productos");
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <Container className={styles.productsContainer}>
      <h1 className={styles.productsTitle}>Lista de Productos</h1>

      {/* Mostrar error si ocurre */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Mostrar spinner mientras carga */}
      {loading ? (
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card className={styles.productCard}>
                <Card.Img
                  variant="top"
                  src={product.image}
                  className={styles.productCardImg}
                />
                <Card.Body className={styles.productCardBody}>
                  <Card.Title className={styles.productCardTitle}>
                    {product.title}
                  </Card.Title>
                  <Card.Text className={styles.productCardPrice}>
                    <strong>${product.price}</strong>
                  </Card.Text>
                  <Button
                    className={styles.productCardButton}
                    onClick={() => addToCart(product)}
                  >
                    🛒 Agregar al Carrito
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}