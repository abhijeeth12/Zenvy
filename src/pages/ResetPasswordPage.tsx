import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { apiClient } from '../api';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Extract token from URL like ?token=abcdef
    const params = new URLSearchParams(location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9f8f6',
      color: '#2c2420',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        background: '#fff', 
        padding: '3rem 2.5rem', 
        borderRadius: '16px', 
        boxShadow: '0 12px 40px rgba(44,36,32,0.08)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: '#2c2420' }}>Zenvy.</div>
          <p style={{ color: '#8a7d76', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
            Create a new, secure password for your account.
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>
              Password reset successful! Redirecting to login...
            </div>
            <Link to="/login" style={{ display: 'inline-block', color: '#c96442', fontWeight: 600, textDecoration: 'none' }}>
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {!token && (
              <div style={{ background: '#fff3cd', color: '#856404', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                No reset token provided in the URL. If you received this link in an email, ensure you copied the full URL.
              </div>
            )}

            {error && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6a5d55' }}>New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  background: '#f9f8f6',
                  border: '1.5px solid rgba(44, 36, 32, 0.1)',
                  color: '#2c2420',
                  padding: '0.9rem 1.1rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1.5px solid #c96442'}
                onBlur={e => e.target.style.border = '1.5px solid rgba(44, 36, 32, 0.1)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6a5d55' }}>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  background: '#f9f8f6',
                  border: '1.5px solid rgba(44, 36, 32, 0.1)',
                  color: '#2c2420',
                  padding: '0.9rem 1.1rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.border = '1.5px solid #c96442'}
                onBlur={e => e.target.style.border = '1.5px solid rgba(44, 36, 32, 0.1)'}
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !token}
              style={{
                background: '#2c2420',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: (loading || !token) ? 'not-allowed' : 'pointer',
                opacity: (loading || !token) ? 0.7 : 1,
                transition: 'transform 0.2s',
                boxShadow: '0 8px 20px rgba(44,36,32,0.15)',
                marginTop: '0.5rem'
              }}
              onMouseEnter={e => (!loading && token) && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (!loading && token) && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
