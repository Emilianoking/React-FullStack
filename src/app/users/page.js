"use client"

import {useEffect, useState} from 'react'
import { Container, ListGroup, Form, Spinner, Alert } from 'react-bootstrap'

export default function UsersPage() {
    /* lista de usuarios */
    const[users, setUsers] = useState([]);
    /* lista filtrada */
    const[filteredUsers, setFilteredUsers] = useState([]);
    /* estado de carga */
    const[loading, setLoading] = useState(true);
    /* estado de error */
    const[error, setError] = useState(null);
    /* estado de busqueda */
    const[search, setSearch] = useState('');

    //useEffect para cargar los usuarios de la API
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            if(!response.ok) throw new Error('No se pudo cargar los usuarios');
            return response.json();
            })        
        .then((data) => {
            setUsers(data);
            setFilteredUsers(data);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const results = users.filter((user) => 
        user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(results);
    }, [search, users]);

return(
    <Container className="mt-4">
        <h1> Lista de Usuarios</h1>
        {/* Campo de busqueda */}
        <Form.Control
        type="text"
        placeholder="Buscar usuario"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
        />
        {/* Mostrar error si lo hay */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Mostrar spinner de carga */}
        {loading ? (
            <Spinner animation="border" />
        ) : (
            <ListGroup>
                {filteredUsers.map((user) => (
                    <ListGroup.Item key={user.id}>
                        <strong>{user.name}</strong>- 📧 {user.email}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        )}
    </Container>
        

)
}