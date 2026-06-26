import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { ShieldCheck, Zap, Bot, ArrowRight, Activity, Users } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-wrapper text-center text-lg-start">
        <Container>
          <Row className="align-items-center gy-5">
            <Col lg={7}>
              <div className="badge bg-indigo-glow px-3 py-2 text-info mb-3 small fw-bold" style={{ background: 'rgba(99, 102, 241, 0.12)', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                Based in Sunderland, Tyne & Wear
              </div>
              <h1 className="display-4 text-white fw-extrabold mb-4" style={{ lineHeight: '1.2' }}>
                Proactively Optimizing the <br />
                <span className="glow-text">Digital Employee Experience</span>
              </h1>
              <p className="lead text-white mb-5" style={{ maxWidth: '600px', lineHeight: '1.7' }}>
                AI-Solutions delivers intelligent, proactive telemetry diagnostics and rapid prototyping to eliminate technology friction, accelerate design, and drive enterprise innovation.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <Link to="/contact" className="btn btn-primary-custom d-flex align-items-center gap-2">
                  Initiate Project Inquiry <ArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn btn-secondary-custom">
                  Explore Solutions
                </Link>
              </div>
            </Col>
            
            <Col lg={5} className="d-flex justify-content-center">
              {/* Graphic Mock Card */}
              <div className="premium-card text-start p-4" style={{ maxWidth: '400px', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Activity className="text-info" size={24} />
                  <span className="text-white small fw-bold">Live Diagnostics Heuristics</span>
                </div>
                <h5 className="text-white mb-2">Automated Desktop Audits</h5>
                <p className="text-muted small mb-4">Monitoring background performance bottlenecks across employee nodes to patch issues instantly.</p>
                <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-10 d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between small"><span className="text-muted">CPU Lag Threshold</span><span className="text-success">Nominal (12%)</span></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Memory Isolation</span><span className="text-success">Secured (99.8%)</span></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Active Node Sync</span><span className="text-info">Active</span></div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Corporate Metrics */}
      <section className="py-5" style={{ background: '#090d16' }}>
        <Container>
          <Row className="gy-4 text-center">
            <Col md={4}>
              <h2 className="display-5 text-white fw-bold glow-text mb-2">99.9%</h2>
              <p className="text-muted small uppercase">Diagnostics Telemetry Uptime</p>
            </Col>
            <Col md={4}>
              <h2 className="display-5 text-white fw-bold glow-text mb-2">£999</h2>
              <p className="text-muted small uppercase">Prototyping Starting Cost</p>
            </Col>
            <Col md={4}>
              <h2 className="display-5 text-white fw-bold glow-text mb-2">&lt; 5 Days</h2>
              <p className="text-muted small uppercase">Average Pilot Prototype Delivery</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Core Offerings */}
      <section className="py-5">
        <Container className="my-5">
          <div className="text-center mb-5">
            <h2 className="text-white display-6 mb-3">Engineered Solutions for Modern Enterprises</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              How we help startups and mature organizations transition into high-performance digital workspaces.
            </p>
          </div>

          <Row className="gy-4">
            <Col md={4}>
              <div className="premium-card">
                <div className="kpi-icon-wrapper bg-primary bg-opacity-10 mb-4 text-primary">
                  <ShieldCheck size={24} className="text-info" />
                </div>
                <h4 className="text-white mb-3">Proactive IT Diagnostics</h4>
                <p className="text-muted small" style={{ lineHeight: '1.6' }}>
                  Our proprietary AI models monitor workstation nodes in the background, identifying latency bottlenecks and resolution patches before your staff notices.
                </p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="premium-card">
                <div className="kpi-icon-wrapper bg-info bg-opacity-10 mb-4 text-info">
                  <Zap size={24} className="text-info" />
                </div>
                <h4 className="text-white mb-3">Accelerated AI Prototyping</h4>
                <p className="text-muted small" style={{ lineHeight: '1.6' }}>
                  Avoid massive engineering costs. We design and deliver full-stack, AI-integrated software prototypes to prove your concepts in record speeds.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="premium-card">
                <div className="kpi-icon-wrapper bg-purple bg-opacity-10 mb-4 text-purple">
                  <Bot size={24} className="text-info" />
                </div>
                <h4 className="text-white mb-3">Virtual Assistant Deployment</h4>
                <p className="text-muted small" style={{ lineHeight: '1.6' }}>
                  Deploy custom knowledge-based LLM assistants to automate customer operations and technical troubleshooting, ensuring standard support.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
