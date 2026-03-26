import React from 'react';

export default function CareersPage() {
  return (
    <div className="fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: '#2c2420', marginBottom: '1rem', textAlign: 'center' }}>
        Careers at Zenvy
      </h1>
      <p style={{ color: '#6a5d55', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '3rem', textAlign: 'center' }}>
        Help us build the most intelligent delivery cohort network.
      </p>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {['Senior Backend Engineer', 'Frontend Architect', 'Operations Lead'].map(title => (
          <div key={title} style={{ padding: '2rem', background: '#fff', border: '1px solid rgba(44,36,32,0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#2c2420', fontWeight: 600 }}>{title}</h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#8a7d76', fontSize: '0.9rem' }}>Remote - Full Time</p>
            </div>
            <button style={{ background: '#2c2420', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
