import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";

const Registro = ({ setIsAuthenticated, setUsuario }) => {
  const { setAuthenticatedUserId } = useAuth();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/registro", {
        nombre: nombre,
        apellido: apellido,
        correo_electronico: correoElectronico,
        contrasena: contrasena,
      });
      if (res.status === 200) {
        setIsAuthenticated(true);
        const userData = res.data.usuario;
        setUsuario(userData);
        const userId = userData._id;
        setAuthenticatedUserId(userId);
        navigate(`/user/${userId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de usuario</h2>
      <Form onSubmit={handleRegistro}>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre:</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="apellido">
          <Form.Label>Apellido:</Form.Label>
          <Form.Control
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="correoElectronico">
          <Form.Label>Correo Electrónico:</Form.Label>
          <Form.Control
            type="email"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="contrasena">
          <Form.Label>Contraseña:</Form.Label>
          <Form.Control
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </Form.Group>
        <div className="button-link-container">
          <Button variant="primary" type="submit">
            Registro
          </Button>
          <Link to="/login">Login</Link>
        </div>
      </Form>
    </div>
  );
};

export default Registro;