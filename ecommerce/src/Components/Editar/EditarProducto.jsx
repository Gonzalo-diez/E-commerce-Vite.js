import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "../css/App.css";

function EditarProducto({ isAuthenticated }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [marca, setMarca] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [categoria, setCategoria] = useState("");
    const [imagen, setImagen] = useState("");

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/productos/detalle/${id}`);
                const producto = response.data;

                if (!producto) {
                    console.error("Producto no encontrado");
                    return;
                }

                setNombre(producto.nombre);
                setMarca(producto.marca);
                setDescripcion(producto.descripcion);
                setPrecio(producto.precio);
                setStock(producto.stock);
                setCategoria(producto.categoria);
                setImagen(producto.imagen_url);
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            }
        };
        fetchProducto();
    }, [id]);


    const handleActualizar = async () => {
        if (!isAuthenticated) {
            console.log("Debes estar autenticado para editar tus productos.");
            navigate("/login");
            return;
        }
        try {
            console.log("Datos a enviar:", {
                nombre,
                marca,
                descripcion,
                precio,
                stock,
                categoria,
                imagen_url: imagen,
            });

            const response = await axios.put(`http://localhost:8800/productos/editarProducto/${id}`, {
                nombre,
                marca,
                descripcion,
                precio,
                stock,
                categoria,
                imagen_url: imagen,
            });

            console.log(response.data.message);
            navigate("/");
        } catch (error) {
            console.error("Error en la actualización:", error);
        }
    };


    return (
        <div className="agregar-container">
            <h2>Actualizar producto</h2>
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
                <Form.Group controlId="categoria">
                    <Form.Label>categoria:</Form.Label>
                    <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        <option value="celulares">Celulares</option>
                        <option value="indumentaria">Indumentaria</option>
                        <option value="computadoras">Computadoras</option>
                        <option value="consolas">Consolas</option>
                        <option value="libros">Libros</option>
                        <option value="autos">Autos</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="imagen">
                    <Form.Label>URL de la imagen:</Form.Label>
                    <Form.Control
                        type="url"
                        placeholder="URL de la imagen"
                        value={imagen}
                        onChange={(e) => setImagen(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleActualizar} className="button-link-container">Actualizar</Button>
            </Form>
        </div>
    );
}

export default EditarProducto;