import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { Image as ImageIcon, Calendar, Layers } from 'lucide-react';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/content/gallery');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Compute categories list
  const categories = ['All', ...new Set(items.map(item => item.category))];

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="py-5 mt-5">
      <Container className="my-4">
        {/* Header Block */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold glow-text">Events & Office Gallery</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Photographic logs of hackathons, client workshops, office expansions, and tech summits in Sunderland.
          </p>
        </div>

        {/* Category Filters */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`btn btn-sm py-1.5 px-3 ${activeCategory === cat ? 'btn-primary-custom text-white' : 'btn-secondary-custom'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid List */}
        {filteredItems.length === 0 ? (
          <p className="text-muted text-center">Loading gallery pictures...</p>
        ) : (
          <Row className="gy-4">
            {filteredItems.map((item, idx) => (
              <Col lg={3} md={4} sm={6} key={idx}>
                <div
                  className="premium-card p-2 h-100 position-relative overflow-hidden group"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setLightboxImg(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="img-fluid rounded-3 mb-2"
                    style={{ height: '180px', objectFit: 'cover', width: '100%', transition: 'all 0.3s ease' }}
                  />
                  <div className="p-2">
                    <h5 className="text-white small mb-1">{item.title}</h5>
                    <div className="d-flex justify-content-between align-items-center mt-2 small text-muted" style={{ fontSize: '0.75rem' }}>
                      <span className="badge bg-secondary bg-opacity-10 text-info">{item.category}</span>
                      <span className="d-flex align-items-center gap-1">
                        <Calendar size={10} />
                        {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* Lightbox Modal */}
        {lightboxImg && (
          <Modal
            show={!!lightboxImg}
            onHide={() => setLightboxImg(null)}
            size="lg"
            centered
            contentClassName="bg-dark border border-secondary border-opacity-25"
          >
            <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-10">
              <Modal.Title className="text-white h5">{lightboxImg.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center p-2">
              <img
                src={lightboxImg.imageUrl}
                alt={lightboxImg.title}
                className="img-fluid rounded-3"
                style={{ maxHeight: '75vh', width: '100%', objectFit: 'contain' }}
              />
              <div className="py-3 text-muted small">
                Category: <span className="text-info">{lightboxImg.category}</span> | Captured {new Date(lightboxImg.date).toLocaleDateString()}
              </div>
            </Modal.Body>
          </Modal>
        )}
      </Container>
    </div>
  );
}
