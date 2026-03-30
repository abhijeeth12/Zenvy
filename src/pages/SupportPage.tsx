import React, { useState } from 'react';
import { Mail, MessageCircle, HelpCircle, Send, CheckCircle } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '6rem' }}>
      
      {/* Premium Header */}
      <div style={{ textAlign: 'center', padding: '6rem 2rem 4rem', background: 'linear-gradient(180deg, #f0ede6 0%, #f9f8f6 100%)', marginBottom: '4rem' }}>
        <HelpCircle size={48} color="#c96442" strokeWidth={1.5} style={{ marginBottom: '1.5rem' }} />
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', color: '#2c2420', margin: '0 0 1rem 0' }}>
          Welcome to Zenvy Support.
        </h1>
        <p style={{ color: '#8a7d76', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', fontWeight: 300 }}>
          How can we elevate your collective dining experience today?
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem' }}>
          
          {/* Main Form Area */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '3.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid rgba(44,36,32,0.04)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2c2420', marginBottom: '2rem', fontFamily: 'Playfair Display, serif' }}>Send a Message</h2>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8a7d76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ padding: '1.2rem 1.5rem', border: '1px solid rgba(44,36,32,0.1)', borderRadius: '12px', fontSize: '1rem', background: '#f9f8f6', outline: 'none', transition: 'border 0.2s, background 0.2s' }}
                      onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#c96442'; }}
                      onBlur={e => { e.target.style.background = '#f9f8f6'; e.target.style.borderColor = 'rgba(44,36,32,0.1)'; }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8a7d76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{ padding: '1.2rem 1.5rem', border: '1px solid rgba(44,36,32,0.1)', borderRadius: '12px', fontSize: '1rem', background: '#f9f8f6', outline: 'none', transition: 'border 0.2s, background 0.2s' }}
                    onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#c96442'; }}
                    onBlur={e => { e.target.style.background = '#f9f8f6'; e.target.style.borderColor = 'rgba(44,36,32,0.1)'; }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8a7d76', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</label>
                  <textarea
                    name="message"
                    placeholder="Describe your issue or feedback..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    style={{ padding: '1.2rem 1.5rem', border: '1px solid rgba(44,36,32,0.1)', borderRadius: '12px', fontSize: '1rem', background: '#f9f8f6', resize: 'vertical', outline: 'none', transition: 'border 0.2s, background 0.2s', fontFamily: 'Inter, sans-serif' }}
                    onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#c96442'; }}
                    onBlur={e => { e.target.style.background = '#f9f8f6'; e.target.style.borderColor = 'rgba(44,36,32,0.1)'; }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#2c2420',
                    color: '#fff',
                    border: 'none',
                    padding: '1.2rem 2.5rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    justifyContent: 'center',
                    transition: 'background 0.2s, transform 0.2s',
                    marginTop: '1rem'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#40352f'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#2c2420'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <Send size={18} />
                  Send to Concierge
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.8rem', color: '#2c2420', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>Message Received</h3>
                <p style={{ color: '#6a5d55', fontSize: '1.1rem', lineHeight: 1.6 }}>Our luxury concierge team has received your request and will respond within 1 hour.</p>
              </div>
            )}
          </div>

          {/* Quick Help Sidecar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2c2420', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>Alternative Channels</h2>
              <p style={{ color: '#8a7d76', fontSize: '1rem', marginBottom: '2rem' }}>Need immediate assistance?</p>
            </div>
            
            <a href="mailto:concierge@zenvy.com" style={{
              background: '#fff',
              border: '1px solid rgba(44,36,32,0.08)',
              padding: '2rem',
              borderRadius: '16px',
              textDecoration: 'none',
              color: '#2c2420',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              transition: 'transform 0.2s, boxShadow 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)'; }}
            >
              <div style={{ background: '#f9f8f6', padding: '1rem', borderRadius: '50%' }}>
                <Mail size={24} color="#c96442" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>Email Direct</h4>
                <p style={{ margin: 0, color: '#8a7d76', fontSize: '0.95rem' }}>concierge@zenvy.com</p>
              </div>
            </a>

            <a href="https://discord.gg/zenvy" target="_blank" rel="noopener noreferrer" style={{
              background: '#fff',
              border: '1px solid rgba(44,36,32,0.08)',
              padding: '2rem',
              borderRadius: '16px',
              textDecoration: 'none',
              color: '#2c2420',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
              transition: 'transform 0.2s, boxShadow 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)'; }}
            >
              <div style={{ background: 'rgba(114, 137, 218, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <MessageCircle size={24} color="#7289da" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>Community Discord</h4>
                <p style={{ margin: 0, color: '#8a7d76', fontSize: '0.95rem' }}>Real-time chat & feedback.</p>
              </div>
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}
