import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditarPerfil = () => {
    const { id } = useParams();
    const { userId } = useAuth();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/user/detalle/${userId}`);
                const user = response.data;

                console.log('User data:', user);

                if (!user) {
                    console.error("Usuario no encontrado");
                    return;
                }

                setNombre(user.nombre);
                setApellido(user.apellido);
                setCorreoElectronico(user.correo_electronico);
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };
        fetchPerfil();
    }, [userId]);



    const handleGuardarCambios = async () => {
        try {
            const response = await axios.put(`/user/editarPerfil/${userId}`, {
                nombre,
                apellido,
                correoElectronico,
            });

            console.log('Respuesta del servidor:', response.data);

        } catch (error) {
            console.error('Error al guardar cambios:', error.message);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mt-3 mb-4">Editar Perfil</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formApellido">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Control
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={correoElectronico}
                            onChange={(e) => setCorreoElectronico(e.target.value)}
                        />

                        <Button variant="primary" onClick={handleGuardarCambios}>
                            Guardar Cambios
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditarPerfil;