"use client"; // Requerido para usar hooks en Next.js
import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useCart } from "@/context/CartContext"; // Importa el contexto del carrito

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
    <Container className="mt-4">
      <h1 className="mb-4">Lista de Productos</h1>

      {/* Mostrar error si ocurre */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Mostrar spinner mientras carga */}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={product.image}
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>
                    <strong>${product.price}</strong>
                  </Card.Text>
                  <Button variant="primary" onClick={() => addToCart(product)}>
                    🛒 Agregar al carrito
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




