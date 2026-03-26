import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

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
        color: '#c96442',
        marginBottom: '1rem',
        fontWeight: 400
      }}>
        404
      </div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#8a7d76', maxWidth: '500px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button
          onClick={() => navigate(-1)}
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
          <ArrowLeft size={16} />
          Go Back
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

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Try searching</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f9f8f6',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          gap: '0.75rem'
        }}>
          <Search size={18} color="#8a7d76" />
          <input 
            type="text" 
            placeholder="Search restaurants, cuisines, or batches..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2c2420',
              fontSize: '0.95rem',
              outline: 'none',
              flex: 1
            }}
          />
        </div>
      </div>
    </div>
  );
}
