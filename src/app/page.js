"use client"; // Requerido para usar hooks en Next.js
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import styles from "@/styles/Home.module.css";
import { getProducts } from "@/services/api"; // Importa la función de Axios
import PromoBanner from "@/app/components/PromoBanner"; // Importamos el componente

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data.slice(0, 3)); // Primeros 3 productos
      } catch (err) {
        setError(err.message || "Error al obtener los productos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    
    <div>
      <a
        href="https://wa.me/+573132263927"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappButton}
      >
        <i className="bi bi-whatsapp"></i>
      </a>
      {/* Banner Promocional debajo del Navbar */}
      <PromoBanner />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <Container>
          <img src="/images/logo.jpeg" alt="Logo de la Tienda" className={styles.heroLogo} />
          <h1 className={styles.heroTitle}>¡Bienvenidos a Tu Tienda Online!</h1>
          <p className={styles.heroText}>Encuentra los mejores productos con precios increíbles y un servicio excepcional.</p>
          <Link href="/products">
            <Button className={styles.heroButton} size="lg">Explorar Productos</Button>
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
                <Col key={product._id} md={4} className="mb-5">
                  <Card className={styles.featuredCard}>
                    <Card.Img variant="top" src={product.imageUrl} className={styles.featuredCardImg} />
                    <Card.Body className={styles.featuredCardBody}>
                      <Card.Title className={styles.featuredCardTitle}>
                        {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                      </Card.Title>
                      <Card.Text className={styles.featuredCardPrice}>
                        <strong>${product.price}</strong>
                      </Card.Text>
                      <Button className={styles.featuredCardButton} onClick={() => addToCart(product)}>
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

      {/* Sección de Testimonios */}
      <section className={styles.blogSection}>
        <Container>
          <h2 className={styles.blogTitle}>Lo que dicen nuestros clientes</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className={styles.testimonialCard}>
                <p className={styles.testimonialText}>
                  "¡Gran experiencia de compra! Los productos llegaron rápido y en perfectas condiciones."
                </p>
                <p className={styles.testimonialAuthor}>- Juan Pérez</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className={styles.testimonialCard}>
                <p className={styles.testimonialText}>
                  "Me encantó la variedad de productos, y el servicio al cliente fue excepcional."
                </p>
                <p className={styles.testimonialAuthor}>- María Gómez</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className={styles.testimonialCard}>
                <p className={styles.testimonialText}>
                  "Todo llegó a tiempo y los precios son muy competitivos. ¡Recomendado!"
                </p>
                <p className={styles.testimonialAuthor}>- Carlos López</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección de Llamada a la Acción */}
      <section className={styles.ctaSection}>
        <Container>
          <h2 className={styles.ctaTitle}>¿Listo para Comprar?</h2>
          <p className={styles.ctaText}>Explora nuestra amplia gama de productos o contáctanos para más información. ¡Estamos aquí para ayudarte!</p>
          <div>
            <Link href="/products">
              <Button className={styles.ctaButtonPrimary} size="lg">Ver Todos los Productos</Button>
            </Link>
            <Link href="/contact">
              <Button className={styles.ctaButtonSecondary} size="lg">Contáctanos</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Sección de Beneficios (Por Qué Elegirnos) */}
      <section className={styles.benefitsSection}>
        <Container>
          <h2 className={styles.benefitsTitle}>Por Qué Elegirnos</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className={styles.benefitsCard}>
                <i className={`bi bi-truck ${styles.benefitsIcon}`}></i>
                <h3 className={styles.benefitsCardTitle}>Envío Gratis</h3>
                <p className={styles.benefitsCardText}>En pedidos superiores a $50.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className={styles.benefitsCard}>
                <i className={`bi bi-chat-dots ${styles.benefitsIcon}`}></i>
                <h3 className={styles.benefitsCardTitle}>Soporte 24/7</h3>
                <p className={styles.benefitsCardText}>Siempre estamos aquí para ayudarte.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className={styles.benefitsCard}>
                <i className={`bi bi-lock ${styles.benefitsIcon}`}></i>
                <h3 className={styles.benefitsCardTitle}>Pago Seguro</h3>
                <p className={styles.benefitsCardText}>Tus datos están protegidos.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}