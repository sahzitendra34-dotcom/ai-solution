import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import Contact from './pages/Contact';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

function AppContent() {
  const location = useLocation();
  const hideNavbarAndFooter = location.pathname.startsWith('/admin');

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      {!hideNavbarAndFooter && <AppNavbar />}
      
      {/* Main Content Area */}
      <main className="flex-grow-1" style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        
        {/* Persistent Chatbot */}
        <Chatbot />
        
        {!hideNavbarAndFooter && <Footer />}
      </div>
    );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}
