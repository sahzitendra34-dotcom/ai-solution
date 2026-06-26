import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Cpu, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-5 mt-auto" style={{ background: '#090d16', borderTop: '1px solid var(--border-color)' }}>
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Cpu className="text-info" size={24} />
              <h5 className="mb-0 text-white fw-bold">AI-Solutions</h5>
            </div>
            <p className="text-muted small" style={{ lineHeight: '1.6' }}>
              We leverage Artificial Intelligence to optimize the digital employee experience. Headquartered in Sunderland, UK, we provide proactive IT diagnostics and cost-effective prototyping services.
            </p>
          </Col>
          
          <Col lg={3} md={6}>
            <h6 className="text-white fw-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/about" className="text-muted text-decoration-none hover-white">About Us</Link></li>
              <li><Link to="/services" className="text-muted text-decoration-none hover-white">AI Services</Link></li>
              <li><Link to="/portfolio" className="text-muted text-decoration-none hover-white">Case Studies</Link></li>
              <li><Link to="/blog" className="text-muted text-decoration-none hover-white">Resource Center</Link></li>
              <li><Link to="/testimonials" className="text-muted text-decoration-none hover-white">Client Reviews</Link></li>
            </ul>
          </Col>
          
          <Col lg={5} md={12}>
            <h6 className="text-white fw-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Get In Touch</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small text-muted">
              <li className="d-flex align-items-center gap-2">
                <MapPin size={18} className="text-info flex-shrink-0" />
                <span>The Software Centre, Sunderland, SR1 1PB, United Kingdom</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={18} className="text-info flex-shrink-0" />
                <a href="mailto:contact@ai-solutions.co.uk" className="text-muted text-decoration-none">contact@ai-solutions.co.uk</a>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={18} className="text-info flex-shrink-0" />
                <span>+44 191 555 0192</span>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
        
        <Row className="align-items-center justify-content-between">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <span className="text-muted small">© {new Date().getFullYear()} AI-Solutions Ltd. Registered in England & Wales.</span>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <span className="text-muted small">Designed for Sunderland Innovation Project</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
