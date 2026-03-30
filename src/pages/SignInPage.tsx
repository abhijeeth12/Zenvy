import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import foodieImg from '../assets/omakase.png';
import { apiClient } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { loginState } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      loginState(response.accessToken, response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => setGoogleReady(true);
    document.body.appendChild(script);
  }, []);

  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!googleReady || !(window as any).google || !googleButtonRef.current) return;

    (window as any).google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        setLoading(true);
        try {
          const res = await apiClient.post('/auth/google', { credential: response.credential });
          loginState(res.accessToken, res.user);
          navigate('/dashboard');
        } catch (err: any) {
          setError(err.message || 'Google sign in failed');
        } finally {
          setLoading(false);
        }
      },
    });

    (window as any).google.accounts.id.renderButton(
      googleButtonRef.current,
      { theme: 'outline', size: 'large', type: 'standard', text: 'continue_with' }
    );
  }, [googleReady, loginState, navigate]);

  return (
    <div className="fade-in" style={{ 
      height: '100vh', 
      display: 'flex',
      background: '#f9f8f6',
      color: '#2c2420',
      overflow: 'hidden'
    }}>
      {/* Left side: Premium Culinary Image */}
      <div style={{ width: '45%', flexShrink: 0, position: 'relative', display: 'flex' }}>
        <img 
          src={foodieImg} 
          alt="Premium Culinary Experience" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} 
        />
        {/* Dark overlay for legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20, 16, 14, 0.92) 20%, rgba(20, 16, 14, 0.3))' }} />
        
        {/* Quote at bottom-left */}
        <div style={{ position: 'absolute', bottom: '8%', left: '8%', color: 'white', maxWidth: '80%' }}>
          <div style={{ width: '35px', height: '3px', background: '#c96442', marginBottom: '1rem', borderRadius: '2px' }} />
          <blockquote style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', margin: '0 0 1rem 0', lineHeight: 1.3, fontWeight: 500 }}>
            "The finest tables are shared ones."
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Zenvy — Collective Dining, Elevated.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div style={{ 
        flex: 1,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderLeft: '1px solid rgba(44,36,32,0.08)',
        background: '#ffffff',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '360px', padding: '2rem' }}>
          
          {/* Logo */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: '#2c2420', letterSpacing: '0.02em' }}>Zenvy.</div>
            <p style={{ color: '#8a7d76', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 400 }}>Welcome back. Sign in to continue.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {error && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6a5d55', letterSpacing: '0.02em' }}>Email Address</label>
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
                  transition: 'border 0.2s',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={e => e.target.style.border = '1.5px solid #c96442'}
                onBlur={e => e.target.style.border = '1.5px solid rgba(44, 36, 32, 0.1)'}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6a5d55', letterSpacing: '0.02em' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#c96442', textDecoration: 'none', fontWeight: 500 }}>Forgot?</Link>
              </div>
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
                  transition: 'border 0.2s',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={e => e.target.style.border = '1.5px solid #c96442'}
                onBlur={e => e.target.style.border = '1.5px solid rgba(44, 36, 32, 0.1)'}
              />
            </div>

            {/* Submit */}
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
                letterSpacing: '0.02em',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                boxShadow: '0 8px 20px rgba(44,36,32,0.15)',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(44,36,32,0.08)' }} />
            <span style={{ fontSize: '0.85rem', color: '#8a7d76', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(44,36,32,0.08)' }} />
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div ref={googleButtonRef}></div>
          </div>

          <button 
            onClick={() => navigate('/signup')}
            style={{ 
              width: '100%', 
              marginTop: '1.5rem', 
              background: 'transparent', 
              border: '1.5px solid rgba(44, 36, 32, 0.1)', 
              color: '#2c2420', 
              padding: '0.9rem',
              borderRadius: '8px', 
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9f8f6'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Create an Account
          </button>

        </div>
      </div>
    </div>
  );
}
