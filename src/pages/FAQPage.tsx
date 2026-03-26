import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do batch orders work?',
    answer: 'Create or join a time-limited group order from one restaurant. When the batch closes, all orders are placed together, splitting delivery fees and unlocking batch pricing.'
  },
  {
    question: 'What are the savings?',
    answer: 'Typical savings are 30-60% on delivery fees. Solo delivery might cost $15, but with 6 participants, each pays ~$2.50. Plus batch menu pricing discounts.'
  },
  {
    question: 'Can I cancel my order?',
    answer: 'Yes, before the batch closes. After closure, orders are final but restaurants typically allow modifications within their policy window.'
  },
  {
    question: 'Is chat anonymous?',
    answer: 'Yes! You join batches with an anonymous alias (e.g. "Anon_42"). Real names/emails are never shared with other participants.'
  },
  {
    question: 'What happens if minimum participants aren&apos;t met?',
    answer: 'No minimum required. Even solo orders benefit from batch pricing. Delivery fees scale inversely with participant count.'
  },
  {
    question: 'Supported payment methods?',
    answer: 'Credit/debit cards, Apple Pay, Google Pay. All processed securely via Stripe. No Zenvy accounts needed.'
  },
  {
    question: 'How accurate are delivery ETAs?',
    answer: 'Our routing intelligence uses historical data + real-time restaurant response times. 85% within ±10 minutes.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <HelpCircle size={64} color="#c96442" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2.25rem', fontWeight: 700, margin: 0, color: '#2c2420' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: '#8a7d76', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Find answers to common questions about Zenvy batches and collective ordering.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{
            borderBottom: '1px solid rgba(44,36,32,0.04)'
          }}>
            <button
              onClick={() => toggleFAQ(index)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '1.5rem 2rem',
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#2c2420',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
            >
              <span>{faq.question}</span>
              {openIndex === index ? <ChevronUp size={24} color="#c96442" /> : <ChevronDown size={24} color="#8a7d76" />}
            </button>
            {openIndex === index && (
              <div style={{
                padding: '0 2rem 1.5rem 2rem',
                color: '#6a5d55',
                fontSize: '1rem',
                lineHeight: 1.6,
                background: '#f9f8f6'
              }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: '#f9f8f6', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#2c2420' }}>
          Still have questions?
        </h3>
        <a href="/support" style={{
          background: '#2c2420',
          color: '#fff',
          padding: '1rem 2.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          Contact Support
        </a>
      </div>
    </div>
  );
}
