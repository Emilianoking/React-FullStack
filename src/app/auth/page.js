"use client";
import { useState } from "react";
import { Container, Form, Button, Alert, Tabs, Tab } from "react-bootstrap";
import styles from "@/styles/Auth.module.css";
import { useRouter } from "next/navigation";
import { createUser, loginUser } from "@/services/api"; // Ajustaremos api.js

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await loginUser(loginData);
      const token = response.data.token;
      localStorage.setItem("token", token); // Guardar token
      router.push("/products"); // Redirigir a productos tras login
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await createUser({ ...registerData, role: "user" }); // Forzar role: "user"
      const token = response.data.token;
      localStorage.setItem("token", token); // Guardar token
      router.push("/products"); // Redirigir a productos tras registro
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <section className={styles.authSection}>
      <Container>
        <h1 className={styles.authTitle}>Accede a Tu Cuenta</h1>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className={styles.authTabs} justify>
          <Tab eventKey="login" title="Iniciar Sesión">
            <Form className={styles.authForm} onSubmit={handleLoginSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group className="mb-4">
                <Form.Label className={styles.formLabel}>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
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
                  onChange={handleLoginChange}
                  placeholder="Ingresa tu contraseña"
                  className={styles.formInput}
                  required
                />
              </Form.Group>
              <Button type="submit" className={styles.authButton}>
                Iniciar Sesión
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="register" title="Registrarse">
            <Form className={styles.authForm} onSubmit={handleRegisterSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group className="mb-4">
                <Form.Label className={styles.formLabel}>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  placeholder="Ingresa tu nombre"
                  className={styles.formInput}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className={styles.formLabel}>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
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
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Crea una contraseña"
                  className={styles.formInput}
                  required
                />
              </Form.Group>
              <Button type="submit" className={styles.authButton}>
                Registrarse
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </Container>
    </section>
  );
}