import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Badge } from 'react-bootstrap';
import { BookOpen, Search, User, Calendar } from 'lucide-react';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/content/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.tags && b.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="py-5 mt-5">
      <Container className="my-4">
        {/* Header Block */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold glow-text">AI-Solutions Insights</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Latest trends in Workplace IT automation, developer experience diagnostics, and rapid prototyping technologies.
          </p>
        </div>

        {/* Search bar */}
        <div className="d-flex justify-content-center mb-5">
          <div className="position-relative" style={{ width: '100%', maxWidth: '500px' }}>
            <Search className="position-absolute text-muted" size={18} style={{ left: '14px', top: '14px' }} />
            <input
              type="text"
              className="form-control form-control-custom ps-5"
              placeholder="Search articles by title, keywords or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Blog lists */}
        {filteredBlogs.length === 0 ? (
          <p className="text-muted text-center">No articles match your search criteria.</p>
        ) : (
          <Row className="gy-4">
            {filteredBlogs.map((b) => (
              <Col lg={4} md={6} key={b._id || b.id}>
                <div className="premium-card d-flex flex-column h-100">
                  {b.image && (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="img-fluid rounded-3 mb-3"
                      style={{ height: '180px', objectFit: 'cover', width: '100%' }}
                    />
                  )}
                  
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {b.tags && b.tags.map((t, idx) => (
                      <Badge key={idx} bg="secondary" className="bg-opacity-10 text-info fw-normal small">
                        #{t}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-white h5 mb-2 hover-glow" style={{ cursor: 'pointer' }} onClick={() => setSelectedBlog(b)}>
                    {b.title}
                  </h3>
                  
                  <p className="text-muted small mb-4" style={{ flexGrow: 1, lineHeight: '1.5' }}>
                    {b.summary}
                  </p>

                  <div className="border-top border-secondary border-opacity-10 pt-3 mt-auto d-flex justify-content-between align-items-center small text-muted">
                    <span className="d-flex align-items-center gap-1">
                      <User size={12} />
                      {b.author}
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <Calendar size={12} />
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <button onClick={() => setSelectedBlog(b)} className="btn btn-sm btn-outline-info mt-3 py-1.5 w-100" style={{ borderRadius: '8px' }}>
                    Read Full Article
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* Full Blog Article Modal */}
        {selectedBlog && (
          <Modal
            show={!!selectedBlog}
            onHide={() => setSelectedBlog(null)}
            size="lg"
            centered
            contentClassName="bg-dark border border-secondary border-opacity-20 text-light"
          >
            <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-10">
              <Modal.Title className="text-white h5">{selectedBlog.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
              {selectedBlog.image && (
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="img-fluid rounded-3 mb-4"
                  style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
                />
              )}

              <div className="d-flex justify-content-between mb-4 small text-muted pb-3 border-bottom border-secondary border-opacity-10">
                <span className="d-flex align-items-center gap-1"><User size={14} />By {selectedBlog.author}</span>
                <span className="d-flex align-items-center gap-1">
                  <Calendar size={14} />
                  Published {new Date(selectedBlog.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="text-muted" style={{ lineHeight: '1.8', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {selectedBlog.content}
              </div>
            </Modal.Body>
          </Modal>
        )}
      </Container>
    </div>
  );
}
