import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { KeyRound, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        // Express-validator validation returns errors array, or direct fail response
        if (data.errors) {
          setError(data.errors.map(err => err.msg).join(', '));
        } else {
          setError(data.msg || 'Invalid username or password.');
        }
        return;
      }

      // Save token & user
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', data.admin.username);

      // Redirect to dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setLoading(false);
      setError('Could not connect to backend server. Make sure API is running.');
    }
  };

  return (
    <div className="py-5 mt-5 d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <Container style={{ maxWidth: '420px' }}>
        <div className="premium-card text-center p-4">
          <div className="kpi-icon-wrapper bg-primary bg-opacity-10 text-primary mx-auto mb-3">
            <KeyRound size={26} className="text-info" />
          </div>
          <h2 className="text-white h4 mb-2">Admin Control Portal</h2>
          <p className="text-muted small mb-4">Authorized administrative access only.</p>

          {error && (
            <Alert variant="danger" className="py-2.5 small d-flex align-items-center gap-2 text-start border-0" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171' }}>
              <ShieldAlert size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="d-flex flex-column gap-3 text-start">
            <div>
              <label className="form-label text-muted small mb-1">Username</label>
              <input
                type="text"
                className="form-control form-control-custom"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="e.g. admin"
              />
            </div>

            <div>
              <label className="form-label text-muted small mb-1">Password</label>
              <input
                type="password"
                className="form-control form-control-custom"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 mt-2 py-2.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Verifying...
                </>
              ) : (
                'Secure Authentication'
              )}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
