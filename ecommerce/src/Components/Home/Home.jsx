import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ViteLogo from "../logos/vite.svg";
import ReactLogo from "../logos/react.svg";
import BootstrapLogo from "../logos/bootstrap.svg";
import MongoDBLogo from "../logos/mongo.svg";
import "../css/App.css";

function Home() {
  return (
    <main className="home-container">
      <Container>
        <Row>
          <Col>
            <section>
              <h2>Bienvenido a este proyecto E-commerce</h2>
              <p>Las tecnologías usadas en este proyecto son:</p>
              <div className="logos-container">
                <img src={ViteLogo} className="logos" />
                <img src={ReactLogo} className="logos" />
                <img src={BootstrapLogo} className="logos" />
                <img src={MongoDBLogo} className="logos" />
              </div>
            </section>
          </Col>
        </Row>
        <Row>
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
        </Row>
      </Container>
    </main>
  );
}

export default Home;