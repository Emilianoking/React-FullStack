"use client"
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react"
import { Card, Container, Row, Spinner } from "react-bootstrap";



export default function ProductosPage() {
    // Estado para almacenar los productos
    const [products, setProducts] = useState([]);
    // Estado de carga
    const [loading, setLoading] = useState(true);
    // Estado de error
    const [error, setError] = useState(null);
    // Usar el contexto del carrito
    const {addToCart} = useCart();


    // 📌 useEffect para obtener productos de la API
    useEffect(() =>{
        // fetch
        fetch("https://fakestoreapi.com/products") // API
            .then((response)=>{
                if (!response.ok) throw Error("Error al obtener los productos");
                return response.json();
                
            })
            .then((data) =>setProducts(data))
            .catch((err)=>setError(err.message))
            .finally(() => setLoading(false));
            
        }, []); // Se ejecuta solo una vez al montar el componente    

    return (
        <Container className="mt-4">
            <h1>Lista de productos</h1>

            {/* Mostrar spinner mientrar carga */}
            {loading ? (
                <Spinner animation="border"/>
            ) : (
                <Row>
                    {products.map((product) =>(
                        <Col key={product.id} md={4} className="mb-4">
                            <Card>
                                <Card.Img 
                                    variant="top"
                                    src={product.image}  ></Card.Img>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

        </Container>





    );
}














