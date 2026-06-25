import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Layers, Briefcase, Award, TrendingUp } from 'lucide-react';

export default function Portfolio() {
  const caseStudies = [
    {
      title: "Regional Telemetry Integration",
      client: "Tyne-Wear Manufacturing Group",
      description: "Deployed our proactive workstation telemetric diagnostics suite across 320 high-performance engineering workstations to identify GPU thread locks and resolve desktop lags.",
      tech: "Node.js, C++ Telemetry Agent, React, MongoDB",
      results: "35% reduction in IT tickets, 18% improvement in design workstation rendering speeds."
    },
    {
      title: "Municipal Citizen Response Assistant",
      client: "Sunderland City Council Partner",
      description: "Designed a secure, multi-language conversational virtual assistant linked to local policy records, helping citizens resolve municipal questions and report community issues.",
      tech: "React, Express API, OpenAI Assistant SDK, local SQLite db",
      results: "Over 14,000 inquiries resolved within month 1, reducing operator phone queue lines by 40%."
    },
    {
      title: "Secure FinTech Transaction Prototype",
      client: "North-East Venture Capital Group",
      description: "Engineered a secure, compliant React dashboard prototype featuring multi-factor login and parameterized data dashboards to validate customer transaction logging flows.",
      tech: "Vite, Tailwind, Express.js, JWT, MongoDB Atlas",
      results: "Delivered in 4 business days. Enabled client to raise seed round capital of £750K."
    }
  ];

  return (
    <div className="py-5 mt-5">
      <Container className="my-4">
        {/* Header Block */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold glow-text">Portfolio & Case Studies</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Explore how AI-Solutions has accelerated development cycles and optimized workspaces for local UK enterprises.
          </p>
        </div>

        <Row className="gy-5">
          {caseStudies.map((cs, idx) => (
            <Col lg={4} md={6} key={idx}>
              <div className="premium-card d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-3 text-info small fw-bold">
                    <Briefcase size={16} />
                    <span>{cs.client}</span>
                  </div>
                  
                  <h3 className="text-white h5 mb-3">{cs.title}</h3>
                  <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
                    {cs.description}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="p-3 bg-dark bg-opacity-40 rounded-3 mb-3 border border-secondary border-opacity-10 small">
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <TrendingUp size={16} className="text-success mt-0.5" />
                      <span className="text-white fw-bold">{cs.results}</span>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center border-top border-secondary border-opacity-10 pt-3">
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Stack: {cs.tech}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
