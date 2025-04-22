"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/Products.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6); 

  const { addToCart } = useCart();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los productos");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3); 
  };

  return (
    <Container className={styles.productsContainer}>
      <h1 className={styles.productsTitle}>Lista de Productos</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row>
            {products.slice(0, visibleCount).map((product) => (
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

          {visibleCount < products.length && (
            <div className={styles.loadMoreContainer}>
              <Button
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
              >
                Ver más
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
