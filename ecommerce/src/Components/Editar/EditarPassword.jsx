import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

const EditarPassword = () => {
    const { userId } = useAuth();
    const [contrasenaActual, setContrasenaActual] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    const handleGuardarCambios = async () => {
        try {
            const response = await axios.put(`/user/cambiarContrasena/${userId}`, {
                contrasenaActual,
                nuevaContrasena,
                confirmarContrasena,
            });

            console.log('Respuesta del servidor:', response.data);

        } catch (error) {
            console.error('Error al guardar cambios de contraseña:', error.message);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mt-3 mb-4">Cambiar Contraseña</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="formContrasenaActual">
                            <Form.Label>Contraseña Actual</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu contraseña actual"
                                value={contrasenaActual}
                                onChange={(e) => setContrasenaActual(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNuevaContrasena">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={nuevaContrasena}
                                onChange={(e) => setNuevaContrasena(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formConfirmarContrasena">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirma tu nueva contraseña"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleGuardarCambios}>
                            Guardar Cambios
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditarPassword;
