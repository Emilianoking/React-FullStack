"use client";
import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import styles from "@/styles/Auth.module.css";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/api";

export default function AdminLoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await loginUser(loginData);
      const { role } = response.data.user;
      if (role !== "admin") {
        setError("Acceso denegado. Solo para administradores.");
        return;
      }
      const token = response.data.token; // Asegúrate de que el backend devuelva un campo "token"
      localStorage.setItem("token", token); // Guardar el token
      router.push("/admin/dashboard"); // Redirigir al dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <section className={styles.authSection}>
      <Container>
        <h1 className={styles.authTitle}>Inicio de Sesión - Admin</h1>
        <Form className={styles.authForm} onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-4">
            <Form.Label className={styles.formLabel}>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo"
              className={styles.formInput}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className={styles.formLabel}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              className={styles.formInput}
              required
            />
          </Form.Group>
          <Button type="submit" className={styles.authButton}>
            Iniciar Sesión
          </Button>
        </Form>
      </Container>
    </section>
  );
}