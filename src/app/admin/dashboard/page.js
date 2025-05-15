"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Modal, Form, Tabs, Tab } from "react-bootstrap";
import { useRouter } from "next/navigation";
import styles from "@/styles/DashboardAdmin.module.css";
import api from "@/services/api";

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchProducts, setSearchProducts] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", imageUrl: "", stock: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token. Por favor, inicia sesión nuevamente.");
          return;
        }

        const userResponse = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = userResponse.data;
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

        const productsResponse = await api.get("/products");
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const userResults = users.filter((user) =>
      user.name.toLowerCase().includes(searchUsers.toLowerCase())
    );
    setFilteredUsers(userResults);

    const productResults = products.filter((product) =>
      product.name.toLowerCase().includes(searchProducts.toLowerCase())
    );
    setFilteredProducts(productResults);
  }, [searchUsers, users, searchProducts, products]);

  const handleDeleteUser = async (id) => {
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

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSaveUserUpdate = async (e) => {
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
      setShowUserModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar usuario");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProducts(products.filter((product) => product._id !== id));
        setFilteredProducts(filteredProducts.filter((product) => product._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Error al eliminar producto");
      }
    }
  };

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProductUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        name: selectedProduct.name,
        price: selectedProduct.price,
        description: selectedProduct.description,
        imageUrl: selectedProduct.imageUrl,
        stock: selectedProduct.stock,
      };
      await api.put(`/products/${selectedProduct._id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(
        products.map((p) => (p._id === selectedProduct._id ? { ...p, ...updatedProduct } : p))
      );
      setFilteredProducts(
        filteredProducts.map((p) =>
          p._id === selectedProduct._id ? { ...p, ...updatedProduct } : p
        )
      );
      setShowProductModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar producto");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/products", newProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts([...products, response.data]);
      setFilteredProducts([...filteredProducts, response.data]);
      setShowCreateProductModal(false);
      setNewProduct({ name: "", price: "", description: "", imageUrl: "", stock: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear producto");
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
            <Tabs defaultActiveKey="users" id="admin-tabs" className="mb-3">
              <Tab eventKey="users" title="Usuarios">
                <Form.Control
                  type="text"
                  placeholder="Buscar usuario"
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  className="mb-4"
                />
                <Table striped bordered hover>
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
                            onClick={() => handleUpdateUser(user)}
                            className="me-2"
                          >
                            Actualizar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
              <Tab eventKey="products" title="Productos">
                <Button
                  variant="success"
                  className="mb-4"
                  onClick={() => setShowCreateProductModal(true)}
                >
                  Crear Producto
                </Button>
                <Form.Control
                  type="text"
                  placeholder="Buscar producto"
                  value={searchProducts}
                  onChange={(e) => setSearchProducts(e.target.value)}
                  className="mb-4"
                />
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.stock}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleUpdateProduct(product)}
                            className="me-2"
                          >
                            Actualizar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>

            {/* Modal para actualizar usuario */}
            <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Actualizar Usuario</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSaveUserUpdate}>
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

            {/* Modal para actualizar producto */}
            <Modal show={showProductModal} onHide={() => setShowProductModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Actualizar Producto</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSaveProductUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedProduct?.name || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={selectedProduct?.price || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={selectedProduct?.description || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Imagen (URL)</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedProduct?.imageUrl || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, imageUrl: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedProduct?.stock || ""}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Guardar
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>

            {/* Modal para crear producto */}
            <Modal show={showCreateProductModal} onHide={() => setShowCreateProductModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Crear Producto</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleCreateProduct}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Imagen (URL)</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Button variant="success" type="submit">
                    Crear
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