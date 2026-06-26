import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Star, MessageSquare } from 'lucide-react';

export default function Testimonials() {
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    rating: 5,
    feedback: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/content/testimonials');
      const data = await response.json();
      setList(data);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!formData.name || !formData.feedback) {
      setError('Name and feedback are required.');
      return;
    }

    try {
      const res = await fetch('/api/content/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Submission failed');

      setSuccess('Thank you! Your testimonial has been posted instantly.');
      setFormData({ name: '', company: '', rating: 5, feedback: '' });
      fetchTestimonials(); // Reload
    } catch (err) {
      setError('Could not submit. Please check database connection.');
    }
  };

  return (
    <div className="py-5 mt-5">
      <Container className="my-4">
        {/* Header Block */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold glow-text">Customer Testimonials</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Hear how our technical expertise drives workstation efficiency and rapid development.
          </p>
        </div>

        <Row className="gy-5">
          {/* Testimonial list */}
          <Col lg={8}>
            <Row className="gy-4">
              {list.length === 0 ? (
                <Col>
                  <p className="text-muted text-center">Loading client reviews...</p>
                </Col>
              ) : (
                list.map((item, idx) => (
                  <Col md={6} key={idx}>
                    <div className="premium-card">
                      <div className="d-flex align-items-center gap-1 text-warning mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < item.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <p className="text-muted small mb-4" style={{ fontStyle: 'italic', lineHeight: '1.6' }}>
                        "{item.feedback}"
                      </p>
                      <div className="border-top border-secondary border-opacity-10 pt-3">
                        <h6 className="text-white mb-0 small">{item.name}</h6>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{item.company || 'Partner'}</span>
                      </div>
                    </div>
                  </Col>
                ))
              )}
            </Row>
          </Col>

          {/* Testimonial submission form */}
          <Col lg={4}>
            <div className="premium-card sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <h4 className="text-white h5 mb-3 d-flex align-items-center gap-2">
                <MessageSquare size={18} className="text-info" />
                Submit Testimonial
              </h4>
              <p className="text-muted small mb-4">Are you a current customer? We would love to hear your feedback.</p>

              {success && <Alert variant="success" className="py-2 small">{success}</Alert>}
              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label text-muted small mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-custom form-control-sm"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="form-label text-muted small mb-1">Company / Organization</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control form-control-custom form-control-sm"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label text-muted small mb-1">Rating</label>
                  <select
                    name="rating"
                    className="form-select form-control-custom form-control-sm"
                    value={formData.rating}
                    onChange={handleChange}
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Very Good)</option>
                    <option value="3">3 Stars (Good)</option>
                    <option value="2">2 Stars (Fair)</option>
                    <option value="1">1 Star (Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-muted small mb-1">Feedback</label>
                  <textarea
                    name="feedback"
                    rows="3"
                    className="form-control form-control-custom form-control-sm"
                    value={formData.feedback}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-sm btn-primary-custom mt-2">
                  Publish Review
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
