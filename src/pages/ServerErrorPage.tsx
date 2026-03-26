import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function ServerErrorPage() {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      backgroundColor: '#f9f8f6',
      color: '#2c2420',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center'
    }}>
      <div style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '4rem',
        color: '#d32f2f',
        marginBottom: '1rem',
        fontWeight: 400
      }}>
        500
      </div>
      <div style={{ color: '#d32f2f', marginBottom: '1rem' }}>
        <AlertTriangle size={48} />
      </div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
        Something Went Wrong
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#8a7d76', maxWidth: '500px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        We&apos;re experiencing technical difficulties. Our team has been notified and we&apos;re working to resolve this as quickly as possible.
      </p>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button
          onClick={handleRetry}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#2c2420',
            color: '#fff',
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#40352f'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2c2420'}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#f0ede6',
            color: '#2c2420',
            border: '1px solid rgba(44,36,32,0.1)',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2c2420';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f0ede6';
            e.currentTarget.style.color = '#2c2420';
          }}
        >
          <Home size={16} />
          Go Home
        </button>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Still having issues?</h3>
        <p style={{ fontSize: '0.95rem', color: '#8a7d76', lineHeight: 1.5 }}>
          Reach out to our support team at <strong>hello@zenvy.com</strong> or visit our <a href="/support" style={{ color: '#c96442', textDecoration: 'none', fontWeight: 600 }}>Support page</a>.
        </p>
      </div>
    </div>
  );
}
