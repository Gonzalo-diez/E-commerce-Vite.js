import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/App.css";

function Footer() {
  return (
    <footer className="footer-container">
      <Container>
        <Row>
          <Col md={6} lg={4}>
            <p>Proyecto e-commerce</p>
          </Col>
          <Col md={6} lg={8}>
            <ul className="footer-links">
              <li>
                <a href="https://github.com/tuusuario" target="_blank">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/tuusuario" target="_blank">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://tuportfolio.com" target="_blank">
                  Portfolio
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
