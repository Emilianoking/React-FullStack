"use client";
import { useState, useEffect } from "react";
import { Container, ListGroup, Form, Spinner, Alert, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data;
        if (user.role !== "admin") {
          setError("Acceso denegado. Solo para administradores.");
          router.push("/");
          return;
        }

        const usersResponse = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [router]);

  useEffect(() => {
    const results = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(results);
  }, [search, users]);

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => router.push("/")} variant="primary">
          Volver al Inicio
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>Lista de Usuarios</h1>
      <Form.Control
        type="text"
        placeholder="Buscar usuario"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <ListGroup>
        {filteredUsers.map((user) => (
          <ListGroup.Item key={user._id}>
            <strong>{user.name}</strong> - 📧 {user.email}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}