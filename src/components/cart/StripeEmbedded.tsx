import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface StripeEmbeddedProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export default function StripeEmbedded({ onSuccess, onError }: StripeEmbeddedProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Avoids a full page reload if 3D secure is not strictly needed
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`, // fallback if redirected
      },
    });

    if (error) {
      onError(error.message || 'An error occurred during payment.');
      setIsProcessing(false);
    } else {
      // Payment succeeded!
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1.5rem' }}>
        <PaymentElement />
      </div>
      <button 
        disabled={isProcessing || !stripe || !elements}
        type="submit"
        style={{
          width: '100%', background: '#2c2420', color: '#fff', padding: '1rem', border: 'none', borderRadius: '8px',
          fontSize: '0.95rem', fontWeight: 700, cursor: (isProcessing) ? 'not-allowed' : 'pointer',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 6px 20px rgba(44,36,32,0.15)', opacity: (isProcessing) ? 0.6 : 1, transition: 'transform 0.2s'
        }}
      >
        {isProcessing ? 'PROCESSING...' : <>PAY NOW</>}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', color: '#a39b95', fontSize: '0.75rem', fontWeight: 600 }}>
        <ShieldCheck size={14} /> Encrypted by Stripe
      </div>
    </form>
  );
}
