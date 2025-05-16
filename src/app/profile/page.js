"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Image, Modal, Alert } from "react-bootstrap";
import styles from "@/styles/Profile.module.css";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null); // Solo manejar la imagen
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token. Por favor, inicia sesión nuevamente.");
          return;
        }
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setShowEditModal(true);
  };

const handleSave = async (e) => {
  e.preventDefault();
  console.log("Token usado:", localStorage.getItem("token")); // Agregar log
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (newProfileImage) {
      formData.append("profileImage", newProfileImage);
    } else {
      setError("Por favor, selecciona una imagen.");
      return;
    }
    const response = await api.put("/users/me", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    setUser(response.data);
    setShowEditModal(false);
    setNewProfileImage(null);
  } catch (err) {
    setError(err.response?.data?.message || "Error al actualizar la foto de perfil");
  }
};
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
    }
  };

  if (error) {
    return (
      <Container className={styles.errorContainer}>
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => router.push("/auth")} variant="primary">
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <Container className={styles.profileContainer}>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className={styles.profileCard}>
            <Card.Body>
              <div className={styles.profileImageContainer}>
                <Image
                  src={user.profileImage || "/default-profile.png"}
                  alt="Foto de perfil"
                  roundedCircle
                  className={styles.profileImage}
                />
              </div>
              <Card.Title className={styles.profileTitle}>Perfil de Usuario</Card.Title>
              <Card.Text>
                <strong>Nombre:</strong> {user.name}
              </Card.Text>
              <Card.Text>
                <strong>Email:</strong> {user.email}
              </Card.Text>
              <Button variant="primary" onClick={handleEdit} className={styles.editButton}>
                Cambiar Foto de Perfil
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Foto de Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nueva Foto de Perfil</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Foto
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}