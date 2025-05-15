"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Modal, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";
import styles from "@/styles/DashboardAdmin.module.css";
import api from "@/services/api";

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token. Por favor, inicia sesión nuevamente.");
          return;
        }

        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data;
        if (user.role !== "admin") {
          setError("Acceso denegado. Solo para administradores.");
          return;
        }
        setAdminData(user);

        const usersResponse = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  useEffect(() => {
    const results = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(results);
  }, [search, users]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await api.delete(`/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(users.filter((user) => user._id !== id));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Error al eliminar usuario");
      }
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      };
      await api.put(`/users/${selectedUser._id}`, updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.map((u) => (u._id === selectedUser._id ? { ...u, ...updatedUser } : u)));
      setFilteredUsers(
        filteredUsers.map((u) => (u._id === selectedUser._id ? { ...u, ...updatedUser } : u))
      );
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar usuario");
    }
  };

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <Button onClick={() => router.push("/admin-login")} className={styles.errorButton}>
          Volver a Iniciar Sesión
        </Button>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <div className={styles.dashboardContainer} style={{ paddingTop: "80px" }}>
      <Row className="g-0">
        <Col md={3} className={styles.sidebar}>
          <Card className={styles.adminCard}>
            <Card.Body>
              <Card.Title className={styles.adminTitle}>Perfil del Administrador</Card.Title>
              <div className={styles.adminInfo}>
                <p><strong>Nombre:</strong> {adminData.name}</p>
                <p><strong>Email:</strong> {adminData.email}</p>
                <p><strong>Rol:</strong> {adminData.role}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9} className={styles.mainContent}>
          <Container>
            <h1 className={styles.mainTitle}>Panel de Administración</h1>
            <Form.Control
              type="text"
              placeholder="Buscar usuario"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
            <Table striped bordered hover className={styles.userTable}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleUpdate(user)}
                        className="me-2"
                      >
                        Actualizar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Actualizar Usuario</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSaveUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedUser?.name || ""}
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={selectedUser?.email || ""}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedUser?.role || "user"}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Guardar
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </Container>
        </Col>
      </Row>
    </div>
  );
}