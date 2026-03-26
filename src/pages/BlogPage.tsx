import React from 'react';

export default function BlogPage() {
  return (
    <div className="fade-in" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: '#2c2420', marginBottom: '1rem', textAlign: 'center' }}>
        Zenvy Journal
      </h1>
      <p style={{ color: '#6a5d55', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '4rem', textAlign: 'center' }}>
        Insights, culinary highlights, and platform updates.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {[
          { title: 'The Economics of Cohort Delivery', date: 'March 20, 2026' },
          { title: 'Partnership: Matsuhisa Omakase', date: 'March 15, 2026' },
          { title: 'Optimizing Route Intelligence', date: 'March 02, 2026' }
        ].map(post => (
          <div key={post.title} style={{ padding: '2rem', background: '#fff', border: '1px solid rgba(44,36,32,0.1)', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <p style={{ color: '#c96442', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{post.date}</p>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#2c2420', fontWeight: 600, fontFamily: 'Playfair Display, serif', lineHeight: 1.4 }}>{post.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
