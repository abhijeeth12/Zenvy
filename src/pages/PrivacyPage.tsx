import React from 'react';

export default function PrivacyPage() {
  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px' }}>
      <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#2c2420' }}>
        Privacy Policy
      </h1>
      <p style={{ color: '#8a7d76', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        <strong>Effective:</strong> October 15, 2024
      </p>

      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>1. Information We Collect</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            <strong>Account Information:</strong> Email, display name, password (hashed).
          </p>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            <strong>Order Data:</strong> Items ordered, delivery addresses, payment details (via Stripe).
          </p>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            <strong>Usage Data:</strong> Batches joined, chat messages (anonymous), app interactions.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>2. How We Use Your Information</h2>
          <ul style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem', paddingLeft: '1.5rem' }}>
            <li>Process and fulfill batch orders</li>
            <li>Send notifications about batches/orders</li>
            <li>Improve routing intelligence and recommendations</li>
            <li>Prevent fraud and abuse</li>
            <li>Customer support</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>3. Information Sharing</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            <strong>We never sell your data.</strong> Shared only with:
          </p>
          <ul style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem', paddingLeft: '1.5rem' }}>
            <li>Restaurants for order fulfillment (no chat data)</li>
            <li>Payment processors (Stripe)</li>
            <li>Law enforcement (legal requirement only)</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>4. Chat Anonymity</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            Batch chat uses anonymous aliases. No personal information is visible to other participants. Messages stored for 30 days for moderation.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>5. Your Rights</h2>
          <ul style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem', paddingLeft: '1.5rem' }}>
            <li><strong>Access:</strong> Download your data anytime</li>
            <li><strong>Delete:</strong> Permanently delete account/orders</li>
            <li><strong>Opt-out:</strong> Stop marketing notifications</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>6. Security</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            Passwords hashed with bcrypt. JWT tokens short-lived. Data encrypted in transit (TLS 1.3). Regular security audits.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>7. Cookies</h2>
          <p style={{ color: '#6a5d55', lineHeight: 1.6, fontSize: '1rem' }}>
            Essential cookies for authentication and functionality. No tracking cookies. Review our <a href="/cookie-policy" style={{ color: '#c96442' }}>Cookie Policy</a>.
          </p>
        </section>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ color: '#8a7d76', fontSize: '0.95rem' }}>
          Questions about privacy? <a href="/support" style={{ color: '#c96442', textDecoration: 'none', fontWeight: 600 }}>Contact us</a>
        </p>
      </div>
    </div>
  );
}
