import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Layout, Terminal, Bot, Settings, Code, Zap } from 'lucide-react';

export default function Services() {
  const serviceList = [
    {
      icon: <Settings size={28} className="text-info" />,
      title: "Proactive Desktop Diagnostics",
      description: "Our background telemetric monitor runs non-intrusively on work terminals, mapping cpu limits, memory leak loops, and network dropouts to supply automatic self-healing patches.",
      bullets: ["Zero-friction execution", "Self-healing IT actions", "Network telemetry dashboard"]
    },
    {
      icon: <Zap size={28} className="text-info" />,
      title: "AI Prototyping (MVPs)",
      description: "Turn ideas into fully testable, cloud-connected products rapidly. We build React/Node applications integrated with AI algorithms for a flat, transparent cost.",
      bullets: ["Delivery under 5 days", "Included seed databases", "Clean, modular code handoff"]
    },
    {
      icon: <Bot size={28} className="text-info" />,
      title: "Knowledge-Based AI Chatbots",
      description: "Deploy contextual customer support chatbots integrated into your company website or internal chat systems. Includes local failover and semantic matching layers.",
      bullets: ["Secure local knowledge files", "OpenAI / LLM API connectors", "Interactive suggestions & chips"]
    },
    {
      icon: <Code size={28} className="text-info" />,
      title: "Design & Engineering Accelerators",
      description: "Equip your development teams with internal AI toolsets. We create customized code generation templates and developer portals to standardise UI components.",
      bullets: ["Custom code boilerplate", "Figma-to-Code mapping scripts", "Component library integration"]
    }
  ];

  return (
    <div className="py-5 mt-5">
      <Container className="my-4">
        {/* Header Block */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold glow-text">Our AI & Software Solutions</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '750px' }}>
            From monitoring terminal health to engineering next-gen digital prototypes, we provide the tech layers to power innovation.
          </p>
        </div>

        <Row className="gy-4">
          {serviceList.map((srv, idx) => (
            <Col md={6} key={idx}>
              <div className="premium-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="kpi-icon-wrapper bg-dark text-info border border-secondary border-opacity-10">
                    {srv.icon}
                  </div>
                  <h3 className="text-white h5 mb-0">{srv.title}</h3>
                </div>
                
                <p className="text-muted small mb-4" style={{ lineHeight: '1.6', flexGrow: 1 }}>
                  {srv.description}
                </p>

                <div className="border-top border-secondary border-opacity-10 pt-3">
                  <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
                    {srv.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="badge bg-secondary bg-opacity-10 text-muted px-2.5 py-1.5 small" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                        ✓ {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Rapid Prototyping highlight */}
        <div className="premium-card mt-5 p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%)' }}>
          <h2 className="text-white h3 mb-3">Need a Rapid Prototype for Your Business?</h2>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
            Submit your project specs to our Sunderland development team. We will deliver a fully functional React + Node.js pilot dashboard within a working week.
          </p>
          <a href="/contact" className="btn btn-primary-custom">Get a Flat-Rate Quote</a>
        </div>
      </Container>
    </div>
  );
}
