import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/App.css";

function Footer() {
  return (
    <footer className="footer-container">
      <Container>
        <Row>
          <Col md={6} lg={8} className="d-flex justify-content-center">
            <ul className="footer-links">  
              <li className="mx-4">
                <a href="https://github.com/tuusuario" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li className="mx-4">
                <a href="https://linkedin.com/in/tuusuario" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li className="mx-4">
                <a href="https://tuportfolio.com" target="_blank" rel="noopener noreferrer">
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
