import React, { useState } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Send, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    country: '',
    jobTitle: '',
    jobDetails: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState([]);

  const countriesList = [
    "United Kingdom", "United States", "Germany", "Japan", "India", "France", "Canada", "Australia", "Singapore", "Other"
  ];

  const validateForm = () => {
    const errs = [];
    if (!formData.fullName.trim()) errs.push('Full Name is required.');
    
    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errs.push('Please enter a valid email address.');
    }

    // Phone regex check (allows numbers, space, dash, parentheses, length 7-20)
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      errs.push('Please enter a valid phone number (minimum 7 digits, numbers and spaces/dashes only).');
    }

    if (!formData.country) errs.push('Please select your Country.');
    if (!formData.jobDetails.trim() || formData.jobDetails.trim().length < 10) {
      errs.push('Job Details / Project Requirements must be at least 10 characters long.');
    }

    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    // Run client side validations
    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrors(formErrors);
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        // Express-validator validation returns errors array
        if (data.errors) {
          setErrors(data.errors.map(err => err.msg));
        } else {
          setErrors(['Failed to submit. Server returned an error.']);
        }
        window.scrollTo({ top: 150, behavior: 'smooth' });
        return;
      }

      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        country: '',
        jobTitle: '',
        jobDetails: ''
      });
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } catch (err) {
      setLoading(false);
      setErrors(['Could not connect to the backend server. Please verify the API is running.']);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-5 mt-5">
      <Container className="my-4">
        {/* Header Block */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold glow-text">Start a Partnership</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Submit your business requirements or prototyping specs. Our engineering team will review and contact you.
          </p>
        </div>

        <Row className="gy-5">
          {/* Contacts info panel */}
          <Col lg={4}>
            <div className="premium-card d-flex flex-column gap-4 justify-content-between h-100">
              <div>
                <h4 className="text-white mb-4">Sunderland HQ</h4>
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex align-items-start gap-3">
                    <MapPin className="text-info flex-shrink-0" size={20} />
                    <div>
                      <div className="text-white small fw-bold">Address</div>
                      <span className="text-muted small">The Software Centre, Sunderland, Tyne & Wear, SR1 1PB, United Kingdom</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <Mail className="text-info flex-shrink-0" size={20} />
                    <div>
                      <div className="text-white small fw-bold">Email</div>
                      <span className="text-muted small">contact@ai-solutions.co.uk</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <Phone className="text-info flex-shrink-0" size={20} />
                    <div>
                      <div className="text-white small fw-bold">Phone Support</div>
                      <span className="text-muted small">+44 191 555 0192</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-dark bg-opacity-40 rounded-3 border border-secondary border-opacity-10 small">
                <span className="text-white fw-bold d-block mb-1">Response Time Guarantee</span>
                <span className="text-muted">Inquiries are analyzed by our local tech leads and answered within 24 business hours.</span>
              </div>
            </div>
          </Col>

          {/* Inquiry form panel */}
          <Col lg={8}>
            <div className="premium-card">
              <h3 className="text-white h5 mb-4">Project Scope Inquiry</h3>

              {success && (
                <Alert variant="success" className="d-flex align-items-center gap-3 p-3 mb-4 border-0" style={{ background: 'rgba(20, 184, 166, 0.12)', color: '#14b8a6' }}>
                  <CheckCircle size={24} className="flex-shrink-0" />
                  <div>
                    <strong className="d-block">Inquiry Received Successfully!</strong>
                    <span>Your request has been logged. Our developers will reach out to you shortly.</span>
                  </div>
                </Alert>
              )}

              {errors.length > 0 && (
                <Alert variant="danger" className="mb-4 small border-0" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171' }}>
                  <strong className="d-block mb-2">Please correct the following errors:</strong>
                  <ul className="mb-0 ps-3">
                    {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                  </ul>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="row g-3">
                <Col md={6}>
                  <label className="form-label text-muted small mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control form-control-custom"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Col>

                <Col md={6}>
                  <label className="form-label text-muted small mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-custom"
                    placeholder="j.doe@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Col>

                <Col md={6}>
                  <label className="form-label text-muted small mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control form-control-custom"
                    placeholder="+44 7700 900077"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Col>

                <Col md={6}>
                  <label className="form-label text-muted small mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className="form-control form-control-custom"
                    placeholder="Optional"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={6}>
                  <label className="form-label text-muted small mb-1">Country *</label>
                  <select
                    name="country"
                    className="form-select form-control-custom"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countriesList.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </Col>

                <Col md={6}>
                  <label className="form-label text-muted small mb-1">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    className="form-control form-control-custom"
                    placeholder="Optional (e.g. Director of IT)"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={12}>
                  <label className="form-label text-muted small mb-1">Job Details & Project Requirements *</label>
                  <textarea
                    name="jobDetails"
                    rows="5"
                    className="form-control form-control-custom"
                    placeholder="Please describe your technology requirements, number of workstations to monitor, or specific AI prototype specifications..."
                    value={formData.jobDetails}
                    onChange={handleChange}
                    required
                  />
                </Col>

                <Col md={12} className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Validating and Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Project Specifications
                      </>
                    )}
                  </button>
                </Col>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
