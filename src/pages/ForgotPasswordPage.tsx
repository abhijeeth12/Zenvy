import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      setSuccess(true);
      // For development UX, we log the token or show it since no real emails are sent!
      if (response.devToken) {
        setDevToken(response.devToken);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
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
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>
              Check your email for reset instructions.
            </div>
            
            {devToken && (
               <div style={{ background: '#f5f5f5', border: '1px dashed #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', wordBreak: 'break-all', fontSize: '0.85rem' }}>
                 <strong>DEV MODE:</strong> Use this token to reset: <br/> <Link to={`/reset-password?token=${devToken}`}>{devToken}</Link>
               </div>
            )}

            <Link to="/login" style={{ display: 'inline-block', color: '#c96442', fontWeight: 600, textDecoration: 'none' }}>
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6a5d55' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
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
              disabled={loading}
              style={{
                background: '#2c2420',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'transform 0.2s',
                boxShadow: '0 8px 20px rgba(44,36,32,0.15)',
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ fontSize: '0.9rem', color: '#8a7d76', textDecoration: 'none', fontWeight: 500 }}>
                Return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
