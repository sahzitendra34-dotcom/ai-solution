import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Modal, Button, Alert } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, Search, Globe, Trash2, Calendar, Award, Database, Terminal, User, LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const [stats, setStats] = useState({
    totalInquiries: 0,
    totalTestimonials: 0,
    totalEvents: 0,
    countryStats: [],
    monthlyStats: []
  });

  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [error, setError] = useState('');

  const contentTabs = ['testimonials', 'blogs', 'events', 'gallery'];
  const contentLabels = {
    testimonials: 'Testimonials',
    blogs: 'Blogs',
    events: 'Events',
    gallery: 'Gallery'
  };

  const emptyContentForms = {
    testimonials: { name: '', company: '', rating: 5, feedback: '', approved: true },
    blogs: { title: '', summary: '', author: 'Admin', image: '', content: '', tags: '' },
    events: { title: '', description: '', location: '', date: new Date().toISOString().slice(0, 10), image: '', capacity: 50 },
    gallery: { title: '', imageUrl: '', category: 'Corporate', date: new Date().toISOString().slice(0, 10) }
  };

  const [activeTab, setActiveTab] = useState('testimonials');
  const [contentItems, setContentItems] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(null);
  const [contentForm, setContentForm] = useState(emptyContentForms[activeTab]);
  const [contentDeleteConfirm, setContentDeleteConfirm] = useState(null);

  const adminName = localStorage.getItem('adminUser') || 'Administrator';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleAuthError = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const updateContentForm = (field, value) => {
    setContentForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetContentForm = (tab) => {
    setEditedContent(null);
    setContentForm(emptyContentForms[tab]);
  };

  const getAdminEndpoint = (tab) => {
    return `/api/content/admin/${tab}`;
  };

  const getContentEndpoint = (tab, id = '') => {
    return `/api/content/${tab}${id ? `/${id}` : ''}`;
  };

  // Protect route
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const loadDashboardData = async () => {
    if (!token) return;
    try {
      // Fetch stats
      const statsRes = await fetch('/api/content/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!statsRes.ok) {
        if (statsRes.status === 401 || statsRes.status === 403) return handleAuthError();
        throw new Error('Failed to fetch stats');
      }
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch inquiries
      let url = `/api/inquiries?search=${search}`;
      if (countryFilter) {
        url += `&country=${countryFilter}`;
      }

      const inqRes = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!inqRes.ok) {
        if (inqRes.status === 401 || inqRes.status === 403) return handleAuthError();
        throw new Error('Failed to fetch inquiries');
      }
      const inqData = await inqRes.json();
      setInquiries(inqData);
    } catch (err) {
      setError('Failed to sync data from server.');
    }
  };

  const loadContentItems = async (tab) => {
    if (!token) return;
    setContentLoading(true);
    setError('');

    try {
      const res = await fetch(getAdminEndpoint(tab), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return handleAuthError();
        throw new Error('Failed to load content items');
      }
      const data = await res.json();
      setContentItems(data);
    } catch (err) {
      setError('Unable to load admin content management data.');
      setContentItems([]);
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [search, countryFilter]);

  useEffect(() => {
    resetContentForm(activeTab);
    loadContentItems(activeTab);
  }, [activeTab]);

  const handleDeleteInquiry = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch(`/api/inquiries/${deleteConfirmId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return handleAuthError();
        throw new Error('Deletion failed');
      }
      
      setDeleteConfirmId(null);
      loadDashboardData(); // Reload stats and grids
    } catch (err) {
      setError('Could not delete inquiry.');
    }
  };

  const buildContentPayload = () => {
    if (activeTab === 'testimonials') {
      return {
        name: contentForm.name,
        company: contentForm.company,
        rating: Number(contentForm.rating),
        feedback: contentForm.feedback,
        approved: contentForm.approved
      };
    }

    if (activeTab === 'blogs') {
      return {
        title: contentForm.title,
        summary: contentForm.summary,
        content: contentForm.content,
        author: contentForm.author,
        image: contentForm.image,
        tags: contentForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      };
    }

    if (activeTab === 'events') {
      return {
        title: contentForm.title,
        description: contentForm.description,
        location: contentForm.location,
        date: contentForm.date,
        image: contentForm.image,
        capacity: Number(contentForm.capacity) || 0
      };
    }

    if (activeTab === 'gallery') {
      return {
        title: contentForm.title,
        imageUrl: contentForm.imageUrl,
        category: contentForm.category,
        date: contentForm.date
      };
    }

    return {};
  };

  const handleSaveContent = async () => {
    try {
      const payload = buildContentPayload();
      const id = editedContent ? editedContent._id || editedContent.id : '';
      const method = editedContent ? 'PUT' : 'POST';
      const endpoint = getContentEndpoint(activeTab, id);
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return handleAuthError();
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.msg || 'Failed to save content');
      }

      setContentModalOpen(false);
      resetContentForm(activeTab);
      loadContentItems(activeTab);
      loadDashboardData();
    } catch (err) {
      setError(err.message || 'Unable to save content.');
    }
  };

  const handleEditContent = (item) => {
    setEditedContent(item);
    const form = { ...emptyContentForms[activeTab] };

    if (activeTab === 'testimonials') {
      form.name = item.name || '';
      form.company = item.company || '';
      form.rating = item.rating || 5;
      form.feedback = item.feedback || '';
      form.approved = item.approved || false;
    }

    if (activeTab === 'blogs') {
      form.title = item.title || '';
      form.summary = item.summary || '';
      form.author = item.author || 'Admin';
      form.image = item.image || '';
      form.content = item.content || '';
      form.tags = Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '';
    }

    if (activeTab === 'events') {
      form.title = item.title || '';
      form.description = item.description || '';
      form.location = item.location || '';
      form.date = item.date ? item.date.slice(0, 10) : new Date().toISOString().slice(0, 10);
      form.image = item.image || '';
      form.capacity = item.capacity || 0;
    }

    if (activeTab === 'gallery') {
      form.title = item.title || '';
      form.imageUrl = item.imageUrl || '';
      form.category = item.category || 'Corporate';
      form.date = item.date ? item.date.slice(0, 10) : new Date().toISOString().slice(0, 10);
    }

    setContentForm(form);
    setContentModalOpen(true);
  };

  const handleCreateContent = () => {
    resetContentForm(activeTab);
    setContentModalOpen(true);
  };

  const handleDeleteContent = async () => {
    if (!contentDeleteConfirm) return;
    try {
      const res = await fetch(getContentEndpoint(activeTab, contentDeleteConfirm), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return handleAuthError();
        throw new Error('Failed to delete content item');
      }
      setContentDeleteConfirm(null);
      loadContentItems(activeTab);
      loadDashboardData();
    } catch (err) {
      setError('Unable to delete content item.');
    }
  };

  if (!token) return null;

  return (
    <div className="py-5 mt-5">
      <Container fluid className="px-lg-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" style={{ width: 56, height: 56 }}>
              <Database size={28} className="text-info" />
            </div>
            <div>
              <h2 className="text-white mb-1">AI-Solutions Admin</h2>
              <p className="text-muted small mb-0">Signed in as {adminName}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-2 px-3 py-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <Row className="gy-4">
          
          {/* Main Dashboard Stats cards */}
          <Col lg={4} md={6}>
            <div className="kpi-card">
              <div>
                <h3 className="text-white fw-bold display-6 mb-1">{stats.totalInquiries}</h3>
                <span className="text-muted small">Total Inquiries</span>
              </div>
              <div className="kpi-icon-wrapper bg-primary bg-opacity-10 text-primary">
                <Mail size={22} className="text-info" />
              </div>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="kpi-card">
              <div>
                <h3 className="text-white fw-bold display-6 mb-1">{stats.totalTestimonials}</h3>
                <span className="text-muted small">Active Testimonials</span>
              </div>
              <div className="kpi-icon-wrapper bg-success bg-opacity-10 text-success">
                <Award size={22} className="text-success" />
              </div>
            </div>
          </Col>

          <Col lg={4} md={12}>
            <div className="kpi-card">
              <div>
                <h3 className="text-white fw-bold display-6 mb-1">{stats.totalEvents}</h3>
                <span className="text-muted small">Upcoming Events</span>
              </div>
              <div className="kpi-icon-wrapper bg-info bg-opacity-10 text-info">
                <Calendar size={22} className="text-info" />
              </div>
            </div>
          </Col>

          {/* Error alerts */}
          {error && (
            <Col xs={12}>
              <Alert variant="danger" className="py-2 border-0">{error}</Alert>
            </Col>
          )}

          {/* Charts Section */}
          <Col lg={6}>
            <div className="premium-card p-4">
              <h4 className="text-white h5 mb-4">Monthly Inquiries Trend</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={stats.monthlyStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <div className="premium-card p-4">
              <h4 className="text-white h5 mb-4">Demographics (By Country)</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={stats.countryStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="country" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>

          {/* Inquiries Grid Section */}
          <Col xs={12}>
            <div className="premium-card p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <h4 className="text-white h5 mb-0">Incoming Customer Inquiries</h4>
                
                {/* Search & filters */}
                <div className="d-flex flex-wrap gap-2">
                  <div className="position-relative">
                    <Search className="position-absolute text-muted" size={16} style={{ left: '10px', top: '10px' }} />
                    <input
                      type="text"
                      className="form-control form-control-sm form-control-custom ps-5"
                      placeholder="Search inquiries..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="form-select form-select-sm form-control-custom"
                    style={{ width: '150px' }}
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                  >
                    <option value="">All Countries</option>
                    <option value="United Kingdom">UK</option>
                    <option value="United States">USA</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="India">India</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              {inquiries.length === 0 ? (
                <p className="text-muted text-center py-4">No customer inquiries found.</p>
              ) : (
                <div className="table-responsive">
                  <Table className="table-dark table-hover border border-secondary border-opacity-10 align-middle">
                    <thead>
                      <tr className="text-muted small border-bottom border-secondary border-opacity-20">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Country</th>
                        <th>Job Title</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.85rem' }}>
                      {inquiries.map((inq) => (
                        <tr key={inq._id || inq.id} className="border-bottom border-secondary border-opacity-10">
                          <td className="text-white fw-bold">{inq.fullName}</td>
                          <td>{inq.email}</td>
                          <td>{inq.companyName || '-'}</td>
                          <td>
                            <span className="badge bg-secondary bg-opacity-10 text-info px-2.5 py-1 fw-normal">
                              {inq.country}
                            </span>
                          </td>
                          <td>{inq.jobTitle || '-'}</td>
                          <td className="text-center">
                            <button
                              onClick={() => setSelectedInquiry(inq)}
                              className="btn btn-sm btn-outline-info me-2 py-1 px-2.5"
                              style={{ borderRadius: '6px' }}
                            >
                              Inspect
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(inq._id || inq.id)}
                              className="btn btn-sm btn-outline-danger py-1 px-2.5"
                              style={{ borderRadius: '6px' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </Col>

          <Col xs={12}>
            <div className="d-flex flex-column flex-lg-row gap-4">
              <aside className="premium-card p-4 flex-shrink-0" style={{ minWidth: 280 }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                    <Database size={22} className="text-info" />
                  </div>
                  <div>
                    <h5 className="text-white mb-1">Content Hub</h5>
                    <p className="text-muted small mb-0">Select an area to manage posts, events, testimonials, and gallery items.</p>
                  </div>
                </div>
                <div className="d-grid gap-2 mb-4">
                  {contentTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`btn btn-sm text-start ${activeTab === tab ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {contentLabels[tab]}
                    </button>
                  ))}
                </div>
                <div>
                  <h6 className="text-white small mb-3">Quick actions</h6>
                  <button type="button" className="btn btn-sm btn-outline-success w-100 mb-2" onClick={handleCreateContent}>
                    Add {contentLabels[activeTab].slice(0, -1)}
                  </button>
                  <div className="p-3 bg-white bg-opacity-5 rounded-3 border border-secondary border-opacity-10">
                    <p className="text-muted small mb-1">Active section</p>
                    <strong className="text-white">{contentLabels[activeTab]}</strong>
                    <p className="text-muted small mt-3 mb-0">Items loaded: {contentItems.length}</p>
                  </div>
                </div>
              </aside>

              <div className="premium-card p-4 flex-grow-1">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
                  <h4 className="text-white h5 mb-0">Content Management</h4>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary-custom"
                    onClick={handleCreateContent}
                  >
                    Add {contentLabels[activeTab].slice(0, -1)}
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-3 mb-4">
                  <span className="text-muted small">Manage {contentLabels[activeTab]} from the admin portal.</span>
                  {contentLoading && <span className="badge bg-info bg-opacity-10 text-info">Loading...</span>}
                </div>

              {contentItems.length === 0 ? (
                <p className="text-muted text-center py-4">No {contentLabels[activeTab].toLowerCase()} available.</p>
              ) : (
                <div className="table-responsive">
                  <Table className="table-dark table-hover border border-secondary border-opacity-10 align-middle">
                    <thead>
                      <tr className="text-muted small border-bottom border-secondary border-opacity-20">
                        {activeTab === 'testimonials' && (
                          <>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Rating</th>
                            <th>Status</th>
                          </>
                        )}
                        {activeTab === 'blogs' && (
                          <>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Published</th>
                          </>
                        )}
                        {activeTab === 'events' && (
                          <>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Location</th>
                          </>
                        )}
                        {activeTab === 'gallery' && (
                          <>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date</th>
                          </>
                        )}
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.85rem' }}>
                      {contentItems.map((item) => (
                        <tr key={item._id || item.id} className="border-bottom border-secondary border-opacity-10">
                          {activeTab === 'testimonials' && (
                            <>
                              <td className="text-white fw-bold">{item.name}</td>
                              <td>{item.company || '-'}</td>
                              <td>{item.rating || '-'}</td>
                              <td>{item.approved ? 'Approved' : 'Pending'}</td>
                            </>
                          )}
                          {activeTab === 'blogs' && (
                            <>
                              <td className="text-white fw-bold">{item.title}</td>
                              <td>{item.author || '-'}</td>
                              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            </>
                          )}
                          {activeTab === 'events' && (
                            <>
                              <td className="text-white fw-bold">{item.title}</td>
                              <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                              <td>{item.location || '-'}</td>
                            </>
                          )}
                          {activeTab === 'gallery' && (
                            <>
                              <td className="text-white fw-bold">{item.title}</td>
                              <td>{item.category || '-'}</td>
                              <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                            </>
                          )}
                          <td className="text-center">
                            <button
                              onClick={() => handleEditContent(item)}
                              className="btn btn-sm btn-outline-info me-2 py-1 px-2.5"
                              style={{ borderRadius: '6px' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setContentDeleteConfirm(item._id || item.id)}
                              className="btn btn-sm btn-outline-danger py-1 px-2.5"
                              style={{ borderRadius: '6px' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
          </Col>
        </Row>
      </Container>

      {/* Content Management Modal */}
      <Modal
        show={contentModalOpen}
        onHide={() => setContentModalOpen(false)}
        centered
        size="lg"
        contentClassName="bg-dark border border-secondary border-opacity-25 text-white"
      >
        <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-10">
          <Modal.Title className="text-white h5">{editedContent ? `Edit ${contentLabels[activeTab].slice(0, -1)}` : `Add ${contentLabels[activeTab].slice(0, -1)}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="d-flex flex-column gap-3">
            {activeTab === 'testimonials' && (
              <>
                <div>
                  <label className="form-label text-muted small mb-1">Name</label>
                  <input type="text" className="form-control form-control-custom" value={contentForm.name} onChange={(e) => updateContentForm('name', e.target.value)} />
                </div>
                <div>
                  <label className="form-label text-muted small mb-1">Company</label>
                  <input type="text" className="form-control form-control-custom" value={contentForm.company} onChange={(e) => updateContentForm('company', e.target.value)} />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label text-muted small mb-1">Rating</label>
                    <input type="number" min="1" max="5" className="form-control form-control-custom" value={contentForm.rating} onChange={(e) => updateContentForm('rating', e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-muted small mb-1">Approved</label>
                    <select className="form-select form-control-custom" value={contentForm.approved ? 'true' : 'false'} onChange={(e) => updateContentForm('approved', e.target.value === 'true')}>
                      <option value="true">Approved</option>
                      <option value="false">Pending</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label text-muted small mb-1">Feedback</label>
                  <textarea rows="4" className="form-control form-control-custom" value={contentForm.feedback} onChange={(e) => updateContentForm('feedback', e.target.value)} />
                </div>
              </>
            )}

            {activeTab === 'blogs' && (
              <>
                <div>
                  <label className="form-label text-muted small mb-1">Title</label>
                  <input type="text" className="form-control form-control-custom" value={contentForm.title} onChange={(e) => updateContentForm('title', e.target.value)} />
                </div>
                <div>
                  <label className="form-label text-muted small mb-1">Summary</label>
                  <textarea rows="2" className="form-control form-control-custom" value={contentForm.summary} onChange={(e) => updateContentForm('summary', e.target.value)} />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label text-muted small mb-1">Author</label>
                    <input type="text" className="form-control form-control-custom" value={contentForm.author} onChange={(e) => updateContentForm('author', e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-muted small mb-1">Image URL</label>
                    <input type="text" className="form-control form-control-custom" value={contentForm.image} onChange={(e) => updateContentForm('image', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="form-label text-muted small mb-1">Content</label>
                  <textarea rows="4" className="form-control form-control-custom" value={contentForm.content} onChange={(e) => updateContentForm('content', e.target.value)} />
                </div>
                <div>
                  <label className="form-label text-muted small mb-1">Tags (comma separated)</label>
                  <input type="text" className="form-control form-control-custom" value={contentForm.tags} onChange={(e) => updateContentForm('tags', e.target.value)} />
                </div>
              </>
            )}

            {activeTab === 'events' && (
              <>
                <div>
                  <label className="form-label text-muted small mb-1">Title</label>
                  <input type="text" className="form-control form-control-custom" value={contentForm.title} onChange={(e) => updateContentForm('title', e.target.value)} />
                </div>
                <div>
                  <label className="form-label text-muted small mb-1">Description</label>
                  <textarea rows="3" className="form-control form-control-custom" value={contentForm.description} onChange={(e) => updateContentForm('description', e.target.value)} />
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Location</label>
                    <input type="text" className="form-control form-control-custom" value={contentForm.location} onChange={(e) => updateContentForm('location', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Date</label>
                    <input type="date" className="form-control form-control-custom" value={contentForm.date} onChange={(e) => updateContentForm('date', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Capacity</label>
                    <input type="number" min="0" className="form-control form-control-custom" value={contentForm.capacity} onChange={(e) => updateContentForm('capacity', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="form-label text-muted small mb-1">Image URL</label>
                  <input type="text" className="form-control form-control-custom" value={contentForm.image} onChange={(e) => updateContentForm('image', e.target.value)} />
                </div>
              </>
            )}

            {activeTab === 'gallery' && (
              <>
                <div>
                  <label className="form-label text-muted small mb-1">Title</label>
                  <input type="text" className="form-control form-control-custom" value={contentForm.title} onChange={(e) => updateContentForm('title', e.target.value)} />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small mb-1">Image URL</label>
                    <input type="text" className="form-control form-control-custom" value={contentForm.imageUrl} onChange={(e) => updateContentForm('imageUrl', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-muted small mb-1">Category</label>
                    <input type="text" className="form-control form-control-custom" value={contentForm.category} onChange={(e) => updateContentForm('category', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-muted small mb-1">Date</label>
                    <input type="date" className="form-control form-control-custom" value={contentForm.date} onChange={(e) => updateContentForm('date', e.target.value)} />
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-secondary border-opacity-10">
          <Button variant="secondary" size="sm" onClick={() => setContentModalOpen(false)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSaveContent}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Content Delete Confirmation Modal */}
      {contentDeleteConfirm && (
        <Modal
          show={!!contentDeleteConfirm}
          onHide={() => setContentDeleteConfirm(null)}
          centered
          size="sm"
          contentClassName="bg-dark border border-danger border-opacity-25 text-white"
        >
          <Modal.Body className="text-center py-4">
            <h5 className="text-white mb-3">Delete {contentLabels[activeTab].slice(0, -1)}?</h5>
            <p className="text-muted small mb-4">This will permanently remove the selected item from the {contentLabels[activeTab].toLowerCase()} list.</p>
            <div className="d-flex justify-content-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setContentDeleteConfirm(null)}>Cancel</Button>
              <Button size="sm" variant="danger" onClick={handleDeleteContent}>Delete</Button>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <Modal
          show={!!selectedInquiry}
          onHide={() => setSelectedInquiry(null)}
          centered
          contentClassName="bg-dark border border-secondary border-opacity-25 text-white"
        >
          <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-10">
            <Modal.Title className="text-white h5">Inquiry Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4 small d-flex flex-column gap-3">
            <div>
              <span className="text-muted d-block">Full Name</span>
              <strong className="text-white h6">{selectedInquiry.fullName}</strong>
            </div>

            <Row className="gy-3">
              <Col xs={6}>
                <span className="text-muted d-block">Email</span>
                <a href={`mailto:${selectedInquiry.email}`} className="text-info">{selectedInquiry.email}</a>
              </Col>
              <Col xs={6}>
                <span className="text-muted d-block">Phone</span>
                <span className="text-white">{selectedInquiry.phone}</span>
              </Col>
              <Col xs={6}>
                <span className="text-muted d-block">Company</span>
                <span className="text-white">{selectedInquiry.companyName || '-'}</span>
              </Col>
              <Col xs={6}>
                <span className="text-muted d-block">Country</span>
                <span className="text-white">{selectedInquiry.country}</span>
              </Col>
              <Col xs={12}>
                <span className="text-muted d-block">Job Title</span>
                <span className="text-white">{selectedInquiry.jobTitle || '-'}</span>
              </Col>
            </Row>

            <div className="mt-2 border-top border-secondary border-opacity-10 pt-3">
              <span className="text-muted d-block mb-1">Project Details / Requirements</span>
              <div className="bg-dark bg-opacity-40 p-3 rounded border border-secondary border-opacity-10 text-muted" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {selectedInquiry.jobDetails}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-secondary border-opacity-10">
            <Button size="sm" variant="secondary" onClick={() => setSelectedInquiry(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          show={!!deleteConfirmId}
          onHide={() => setDeleteConfirmId(null)}
          centered
          size="sm"
          contentClassName="bg-dark border border-danger border-opacity-25 text-white"
        >
          <Modal.Body className="text-center py-4">
            <h5 className="text-white mb-3">Delete Inquiry?</h5>
            <p className="text-muted small mb-4">Are you sure you want to delete this customer inquiry? This action cannot be undone.</p>
            <div className="d-flex justify-content-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
              <Button size="sm" variant="danger" onClick={handleDeleteInquiry}>Confirm Delete</Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
