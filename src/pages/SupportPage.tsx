import React, { useState } from 'react';
import { Mail, MessageCircle, Headphones, HelpCircle, Send } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to /api/support
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <HelpCircle size={64} color="#c96442" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2rem', fontWeight: 700, margin: 0, color: '#2c2420' }}>
          Support Center
        </h1>
        <p style={{ color: '#8a7d76', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          We&apos;re here to help with batches, orders, or anything else.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2c2420', marginBottom: '1.5rem' }}>Contact Us</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                padding: '1rem 1.25rem',
                border: '1px solid rgba(44,36,32,0.1)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: '#fff'
              }}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                padding: '1rem 1.25rem',
                border: '1px solid rgba(44,36,32,0.1)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: '#fff'
              }}
            />
            <textarea
              name="message"
              placeholder="Tell us what&apos;s happening..."
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
              style={{
                padding: '1rem 1.25rem',
                border: '1px solid rgba(44,36,32,0.1)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: '#fff',
                resize: 'vertical',
                fontFamily: 'Inter, sans-serif'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#2c2420',
                color: '#fff',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#40352f'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2c2420'}
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>

        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2c2420', marginBottom: '1.5rem' }}>Quick Help</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              padding: '1.5rem',
              background: '#f9f8f6',
              borderRadius: '12px',
              borderLeft: '4px solid #c96442'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#2c2420', marginBottom: '0.5rem' }}>Batch Issues?</div>
              <p style={{ color: '#6a5d55', fontSize: '0.95rem', margin: 0 }}>Check <a href="/faq" style={{ color: '#c96442', textDecoration: 'none' }}>FAQ</a> or contact support.</p>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <a href="mailto:hello@zenvy.com" style={{
                flex: 1,
                background: '#fff',
                border: '1px solid rgba(44,36,32,0.1)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#2c2420',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <Mail size={20} />
                Email Support
              </a>
              <a href="https://discord.gg/zenvy" target="_blank" rel="noopener noreferrer" style={{
                flex: 1,
                background: '#7289da',
                color: '#fff',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <MessageCircle size={20} />
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>

      {submitted && (
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid #4caf50',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center',
          color: '#2c2420'
        }}>
          <CheckCircle size={24} color="#4caf50" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Thank you!</div>
          <p style={{ margin: '0.5rem 0 0 0', color: '#6a5d55' }}>Your message has been sent. We&apos;ll get back to you within 24 hours.</p>
        </div>
      )}
    </div>
  );
}
