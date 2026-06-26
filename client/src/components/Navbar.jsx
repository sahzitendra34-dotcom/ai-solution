import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Cpu, LayoutDashboard, LogOut } from 'lucide-react';

export default function AppNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <Navbar expand="lg" variant="dark" fixed="top" className="glass-nav py-3">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2 fw-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          <Cpu className="text-info" size={26} />
          <span style={{ letterSpacing: '-0.5px' }}>AI-Solutions</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/about">About Us</Nav.Link>
            <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
            <Nav.Link as={NavLink} to="/portfolio">Portfolio</Nav.Link>
            <Nav.Link as={NavLink} to="/testimonials">Testimonials</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/gallery">Gallery</Nav.Link>
            <Nav.Link as={NavLink} to="/events">Events</Nav.Link>
            <Nav.Link as={NavLink} to="/contact" className="pe-3">Contact Us</Nav.Link>
            
            {token ? (
              <div className="d-flex align-items-center gap-2 border-start ps-3 mt-3 mt-lg-0">
                <Nav.Link as={NavLink} to="/admin/dashboard" className="d-flex align-items-center gap-1 active text-info">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Nav.Link>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 ms-2 py-1 px-2" style={{ borderRadius: '6px' }}>
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <Nav.Link as={NavLink} to="/admin/login" className="btn btn-sm btn-secondary-custom py-1.5 px-3 ms-lg-2 mt-3 mt-lg-0">
                
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
