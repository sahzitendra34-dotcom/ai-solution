import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Alert } from 'react-bootstrap';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [bookingEvent, setBookingEvent] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '' });
  const [bookingSuccess, setBookingSuccess] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/content/events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) return;

    setBookingSuccess(`Success! A booking confirmation ticket for "${bookingEvent.title}" has been emailed to ${bookingForm.email}.`);
    setBookingForm({ name: '', email: '' });
    setTimeout(() => {
      setBookingSuccess('');
      setBookingEvent(null);
    }, 4000);
  };

  return (
    <div className="py-5 mt-5">
      <Container className="my-4">
        {/* Header Block */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold glow-text">Upcoming Technology Events</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Join our tech forums, developer hackathons, and design webinars. Book your seat instantly.
          </p>
        </div>

        {events.length === 0 ? (
          <p className="text-muted text-center">Loading upcoming events...</p>
        ) : (
          <Row className="gy-4">
            {events.map((ev) => (
              <Col lg={6} key={ev._id || ev.id}>
                <div className="premium-card d-flex flex-column flex-md-row gap-4 h-100 align-items-center">
                  {ev.image && (
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="img-fluid rounded-3"
                      style={{ width: '100%', maxWidth: '180px', height: '180px', objectFit: 'cover' }}
                    />
                  )}
                  
                  <div className="d-flex flex-column justify-content-between h-100 flex-grow-1">
                    <div>
                      <h3 className="text-white h5 mb-2">{ev.title}</h3>
                      <p className="text-muted small mb-3">{ev.description}</p>
                    </div>

                    <div className="d-flex flex-column gap-2 border-top border-secondary border-opacity-10 pt-3 mt-auto small text-muted">
                      <span className="d-flex align-items-center gap-2">
                        <Calendar size={14} className="text-info" />
                        {new Date(ev.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="d-flex align-items-center gap-2">
                        <MapPin size={14} className="text-info" />
                        {ev.location}
                      </span>
                      <span className="d-flex align-items-center gap-2">
                        <Users size={14} className="text-info" />
                        Capacity: {ev.capacity} Seats
                      </span>
                    </div>

                    <button
                      className="btn btn-sm btn-primary-custom mt-3 w-100"
                      onClick={() => setBookingEvent(ev)}
                    >
                      Book Free Ticket
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* Booking Modal */}
        {bookingEvent && (
          <Modal
            show={!!bookingEvent}
            onHide={() => setBookingEvent(null)}
            centered
            contentClassName="bg-dark border border-secondary border-opacity-25 text-white"
          >
            <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-10">
              <Modal.Title className="text-white h5">Book Ticket: {bookingEvent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
              {bookingSuccess ? (
                <Alert variant="success" className="py-2.5 small">{bookingSuccess}</Alert>
              ) : (
                <form onSubmit={handleBookingSubmit} className="d-flex flex-column gap-3">
                  <div className="bg-dark bg-opacity-40 p-3 rounded border border-secondary border-opacity-10 mb-2 small text-muted">
                    <strong>Event:</strong> {bookingEvent.title}<br />
                    <strong>Location:</strong> {bookingEvent.location}
                  </div>

                  <div>
                    <label className="form-label text-muted small mb-1">Your Full Name</label>
                    <input
                      type="text"
                      className="form-control form-control-custom form-control-sm"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label text-muted small mb-1">Your Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-custom form-control-sm"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-sm btn-primary-custom mt-2">
                    <Ticket size={16} className="me-1" />
                    Confirm Booking
                  </button>
                </form>
              )}
            </Modal.Body>
          </Modal>
        )}
      </Container>
    </div>
  );
}
