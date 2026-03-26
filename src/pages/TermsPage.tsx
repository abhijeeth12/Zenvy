import React from 'react';

export default function TermsPage() {
  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px' }}>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#2c2420' }}>
        Terms of Service
      </h1>
      <p style={{ color: '#8a7d76', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        <strong>Last updated:</strong> October 15, 2024
      </p>

      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>1. Acceptance of Terms</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            By accessing and using Zenvy, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>2. User Accounts</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            You must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>3. Batch Orders</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            Orders placed in batches are final once the batch closes. Zenvy acts as a facilitator between users and restaurants.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>4. Payments</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            All payments are processed securely via Stripe. You authorize Zenvy to charge your payment method for orders placed.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>5. Limitation of Liability</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            Zenvy is not responsible for restaurant performance, food quality, or delivery issues. Use at your own risk.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>6. Changes to Terms</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            We may update these terms at any time. Continued use constitutes acceptance of changes.
          </p>
        </section>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ color: '#8a7d76', fontSize: '0.95rem' }}>
          Questions? <a href="/support" style={{ color: '#c96442', textDecoration: 'none', fontWeight: 600 }}>Contact Support</a>
        </p>
      </div>
    </div>
  );
}
