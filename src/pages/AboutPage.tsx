import React from 'react';

export default function AboutPage() {
  return (
    <div className="fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: '#2c2420', marginBottom: '1rem' }}>
        About Zenvy
      </h1>
      <p style={{ color: '#6a5d55', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '2rem' }}>
        Zenvy accelerates culinary discovery. We empower individuals to coordinate collective food deliveries from premium restaurants, maximizing delivery efficiency, unlocking wholesale pricing, and creating community through shared experiences.
      </p>
      <div style={{ background: '#fcf6f4', borderRadius: '16px', padding: '3rem', marginTop: '3rem' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', color: '#2c2420', marginBottom: '1rem' }}>
          Our Mission
        </h2>
        <p style={{ color: '#6a5d55', fontSize: '1rem', lineHeight: 1.6 }}>
          By merging intelligent routing with human coordination, we're building the future of sustainable, premium food delivery. Join us in reshaping the city grid.
        </p>
      </div>
    </div>
  );
}
