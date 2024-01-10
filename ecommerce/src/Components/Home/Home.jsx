import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { IoPencil, IoTrash } from "react-icons/io5";
import axios from "axios";
import "../css/App.css";

function Home({ isAuthenticated }) {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:8800/");
        setProductos(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProductos();
  }, []);

  const handleAgregarProducto = () => {
    navigate('/agregarProductos');
  };

  return (
    <section>
      <main className="home-container">
        <Container>
          <Row>
            <Col>
              <section>
                <h2>Bienvenido a este proyecto E-commerce</h2>
                <p>Aqui encontraras las mejores ofertas del mercado</p>
              </section>
            </Col>
          </Row>
          <Row>
            {isAuthenticated ? (
              <Button variant="primary" onClick={handleAgregarProducto} >Agregar producto</Button>
            ) : (
              <Col>
                <h3>
                  Si quiere probar las funciones de agregar y borrar productos,
                  creese una cuenta.
                </h3>
                <div className="cta-buttons">
                  <Link to="/login" className="btn btn-primary">
                    Login
                  </Link>
                  <Link to="/registro" className="btn btn-outline-primary">
                    Registro
                  </Link>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </main>

      <section>
        <Row>
          {productos.map((producto) => (
            <Col key={producto._id} md={4}>
              <Card className="mb-3 card-inicio">
                <Card.Img variant="top" src={producto.imagen_url} alt={producto.nombre} className="img-fluid card-image" />
                <Card.Body>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Text>marca: {producto.marca}</Card.Text>
                  <Card.Text>tipo: {producto.tipo}</Card.Text>
                  <Card.Text>$<strong>{producto.precio}</strong></Card.Text>
                  <Card.Text>Cantidad: {producto.stock}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="primary" onClick={() => navigate(`/productos/detalle/${producto._id}`)}>Ver más</Button>
                    {isAuthenticated && (
                      <div className="inicio-link-container">
                        <Button variant="warning" onClick={() => navigate(`/productos/editarProducto/${producto._id}`)}><IoPencil /></Button>
                        <Button variant="danger" onClick={() => handleEliminarProducto(producto._id)}><IoTrash /></Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </section>
  );
}

export default Home;
