"use client"; // Requerido para usar hooks en Next.js
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Importa el contexto del carrito
import "bootstrap-icons/font/bootstrap-icons.min.css"; // Para los íconos de beneficios
import styles from "@/styles/Home.module.css"; // Importa los estilos modulares

export default function Home() {
  const [products, setProducts] = useState([]); // Estado para los productos destacados
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const { addToCart } = useCart(); // Usa el contexto del carrito

  // Fetch de productos destacados (primeros 3 productos de la API)
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener los productos");
        return response.json();
      })
      .then((data) => setProducts(data.slice(0, 3))) // Solo los primeros 3 productos
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <Container>
          <img
            src="/images/logo.jpeg"
            alt="Logo de la Tienda"
            className={styles.heroLogo}
          />
          <h1 className={styles.heroTitle}>¡Bienvenidos a Tu Tienda Online!</h1>
          <p className={styles.heroText}>
            Encuentra los mejores productos con precios increíbles y un servicio excepcional.
          </p>
          <Link href="/products">
            <Button className={styles.heroButton} size="lg">
              Explorar Productos
            </Button>
          </Link>
        </Container>
      </section>

      {/* Sección de Productos Destacados */}
      <section className={styles.featuredSection}>
        <Container>
          <h2 className={styles.featuredTitle}>Productos Destacados</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div style={{ textAlign: "center" }}>
              <Spinner animation="border" />
            </div>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product.id} md={4} className="mb-5">
                  <Card className={styles.featuredCard}>
                    <Card.Img
                      variant="top"
                      src={product.image}
                      className={styles.featuredCardImg}
                    />
                    <Card.Body className={styles.featuredCardBody}>
                      <Card.Title className={styles.featuredCardTitle}>
                        {product.title.length > 50
                          ? `${product.title.substring(0, 50)}...`
                          : product.title}
                      </Card.Title>
                      <Card.Text className={styles.featuredCardPrice}>
                        <strong>${product.price}</strong>
                      </Card.Text>
                      <Button
                        className={styles.featuredCardButton}
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
      </section>

      {/* Sección de Llamada a la Acción */}
      <section className={styles.ctaSection}>
        <Container>
          <h2 className={styles.ctaTitle}>¿Listo para Comprar?</h2>
          <p className={styles.ctaText}>
            Explora nuestra amplia gama de productos o contáctanos para más información. ¡Estamos aquí para ayudarte!
          </p>
          <div>
            <Link href="/products">
              <Button className={styles.ctaButtonPrimary} size="lg">
                Ver Todos los Productos
              </Button>
            </Link>
            <Link href="/contact">
              <Button className={styles.ctaButtonSecondary} size="lg">
                Contáctanos
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Sección de Beneficios */}
      <section className={styles.benefitsSection}>
        <Container>
          <h2 className={styles.benefitsTitle}>Por Qué Elegirnos</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className={styles.benefitsCard}>
                <i className={`bi bi-truck ${styles.benefitsIcon}`}></i>
                <h3 className={styles.benefitsCardTitle}>Envío Gratis</h3>
                <p className={styles.benefitsCardText}>
                  En pedidos superiores a $50.
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className={styles.benefitsCard}>
                <i className={`bi bi-chat-dots ${styles.benefitsIcon}`}></i>
                <h3 className={styles.benefitsCardTitle}>Soporte 24/7</h3>
                <p className={styles.benefitsCardText}>
                  Siempre estamos aquí para ayudarte.
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className={styles.benefitsCard}>
                <i className={`bi bi-lock ${styles.benefitsIcon}`}></i>
                <h3 className={styles.benefitsCardTitle}>Pago Seguro</h3>
                <p className={styles.benefitsCardText}>
                  Tus datos están protegidos.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}