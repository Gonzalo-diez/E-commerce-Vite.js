import React, { useEffect } from "react";
import axios from "axios";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function User({ isAuthenticated, usuario, setUsuario }) {
    const { userId } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/user/${userId}`);
                setUsuario(res.data);
                console.log(res.data)
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, [userId]);

    return (
        <section>
            {isAuthenticated ? (
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>User Information</Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>
                            <strong>Productos creados:</strong>
                            <ul>
                                {usuario.productosCreados &&
                                    usuario.productosCreados.map(producto => (
                                        <li key={producto._id}>{producto.nombre}</li>
                                    ))}
                            </ul>
                        </ListGroupItem>
                        <ListGroupItem>
                            <strong>Productos comprados:</strong>
                            <ul>
                                {usuario.productosComprados &&
                                    usuario.productosComprados.map(producto => (
                                        <li key={producto._id}>{producto.nombre}</li>
                                    ))}
                            </ul>
                        </ListGroupItem>
                        <ListGroupItem>
                            <strong>Productos vendidos:</strong>
                            <ul>
                                {usuario.productosVendidos &&
                                    usuario.productosVendidos.map(producto => (
                                        <li key={producto._id}>{producto.nombre}</li>
                                    ))}
                            </ul>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            ) : (
                <p>No esta registrado o logueado.</p>
            )}
        </section>
    );
}

export default User;