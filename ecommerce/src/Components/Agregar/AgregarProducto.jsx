import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "../css/App.css";

function AgregarProductos({ isAuthenticated }) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [url, setUrl] = useState("");
  const [categoria, setCategoria] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/user/${userId}`);
        setUsuario(response.data);
      } catch (error) {
        console.error("Error al obtener información del usuario:", error);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  const handleAgregar = async () => {
    if (!isAuthenticated) {
      console.log("Debes estar autenticado para agregar productos.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8800/agregarProductos", {
        nombre,
        marca,
        descripcion,
        precio,
        stock,
        categoria,
        imagen_url: url,
        user: userId, 
      });

      console.log(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };


  return (
    <div className="agregar-container">
      <h2>Agregar productos</h2>
      <Form>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre del producto:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="marca">
          <Form.Label>Marca del producto:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Marca del producto"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="descripcion">
          <Form.Label>Descripción del producto:</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Descripción del producto"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="precio">
          <Form.Label>Precio del producto:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Precio del producto"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="stock">
          <Form.Label>Stock:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="url">
          <Form.Label>URL de la imagen:</Form.Label>
          <Form.Control
            type="url"
            placeholder="URL de la imagen"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="categoria">
          <Form.Label>categoria:</Form.Label>
          <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option>---</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="indumentaria">Vestimenta</option>
            <option value="libros">Libros</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" onClick={handleAgregar} className="button-link-container">Agregar producto</Button>
      </Form>
    </div>
  );
}

export default AgregarProductos;