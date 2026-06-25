import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Users, Eye, Target, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="py-5 mt-5">
      <Container className="my-4">
        {/* Header Block */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold glow-text">About AI-Solutions</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Empowering the workforce of tomorrow with next-generation digital experience engineering.
          </p>
        </div>

        {/* History / Background Section */}
        <Row className="gy-4 align-items-center mb-5">
          <Col lg={6}>
            <h2 className="text-white mb-4">Our Roots in Sunderland, UK</h2>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              Founded in Sunderland, Tyne and Wear, AI-Solutions emerged from a collaboration of software engineers and human experience design researchers. We observed a common challenge: as remote and hybrid workflows expanded, employee performance was constantly dragged down by silent software crashes, network bottlenecks, and sluggish legacy systems.
            </p>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              We set out to create an automated, non-intrusive diagnostic suite that proactively detects workstation lag and resolves faults. Coupled with our rapid prototyping division, we now democratize AI development by delivering fully operational MVPs to startups and local authorities in the North East and across the globe.
            </p>
          </Col>
          <Col lg={6}>
            <div className="premium-card p-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)' }}>
              <Award className="text-info mb-3" size={48} />
              <h4 className="text-white mb-3">Award-Winning Tech Innovation</h4>
              <p className="text-muted small">Recognized in the UK North-East Tech Awards for Excellence in Workplace Automation Research.</p>
            </div>
          </Col>
        </Row>

        {/* Vision, Mission, Values */}
        <Row className="gy-4 mb-5">
          <Col md={4}>
            <div className="premium-card text-center">
              <Eye className="text-info mx-auto mb-3" size={32} />
              <h4 className="text-white mb-2">Our Vision</h4>
              <p className="text-muted small" style={{ lineHeight: '1.6' }}>
                To create a seamless, friction-free digital-first workplace where technology is an invisible accelerator of human innovation rather than a roadblock.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="premium-card text-center">
              <Target className="text-info mx-auto mb-3" size={32} />
              <h4 className="text-white mb-2">Our Mission</h4>
              <p className="text-muted small" style={{ lineHeight: '1.6' }}>
                To build high-performance telemetry software that proactively identifies technical lags, and to deliver affordable, production-ready AI prototyping concepts.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="premium-card text-center">
              <Users className="text-info mx-auto mb-3" size={32} />
              <h4 className="text-white mb-2">Core Values</h4>
              <p className="text-muted small" style={{ lineHeight: '1.6' }}>
                Unwavering proactivity, code isolation, strict accessibility standards, and a dedication to boosting the local Sunderland tech economy.
              </p>
            </div>
          </Col>
        </Row>

        {/* Leadership Team Profiles */}
        <div className="my-5">
          <h2 className="text-center text-white mb-5">Our Sunderland Leadership</h2>
          <Row className="gy-4 justify-content-center">
            <Col md={4}>
              <div className="premium-card text-center">
                <div className="bg-dark rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', border: '2px solid var(--primary)' }}>
                  <span className="text-white fw-bold h4 mb-0">SJ</span>
                </div>
                <h5 className="text-white mb-1">Sarah Jenkins</h5>
                <p className="text-info small mb-3">Managing Director</p>
                <p className="text-muted small">Former Director of North East Digital Enterprise, driving regional technology outreach and company strategy.</p>
              </div>
            </Col>

            <Col md={4}>
              <div className="premium-card text-center">
                <div className="bg-dark rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', border: '2px solid var(--secondary)' }}>
                  <span className="text-white fw-bold h4 mb-0">MV</span>
                </div>
                <h5 className="text-white mb-1">Dr. Marcus Vance</h5>
                <p className="text-info small mb-3">Chief Science Officer</p>
                <p className="text-muted small">Specializes in neural network heuristics. Marcus oversees telemetry model diagnostic design and cloud integration.</p>
              </div>
            </Col>

            <Col md={4}>
              <div className="premium-card text-center">
                <div className="bg-dark rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', border: '2px solid var(--primary)' }}>
                  <span className="text-white fw-bold h4 mb-0">LH</span>
                </div>
                <h5 className="text-white mb-1">Liam Henderson</h5>
                <p className="text-info small mb-3">Lead Prototyping Architect</p>
                <p className="text-muted small">A full-stack wizard who orchestrates the rapid-prototyping team to spin up scalable web pilots under 120 hours.</p>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
