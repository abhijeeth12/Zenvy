import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Wallet, Banknote, Users } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { apiClient } from '../api';
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const batchId = query.get('batchId');

  const { cart, cartTotal, clearCart, paymentMethod: ctxPaymentMethod } = useCart();
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchInfo, setBatchInfo] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<'WALLET' | 'COD' | 'RAZORPAY'>((ctxPaymentMethod as any) === 'RAZORPAY' || ctxPaymentMethod === 'COD' ? (ctxPaymentMethod as any) : 'WALLET');
  
  // 1 = Select Payment & Join, 2 = Confirm Order
  const [step, setStep] = useState(1);
  const [hasJoined, setHasJoined] = useState(false);

  const driverTip = 8;

  useEffect(() => {
    if (!batchId) {
      navigate('/dashboard');
      return;
    }
    apiClient.get(`/batches/${batchId}`)
      .then(data => setBatchInfo(data))
      .catch(console.error);
  }, [batchId, navigate]);

  // Real delivery-fee calculation based on participant count
  const participantCount = batchInfo?._count?.participants || 1;
  const soloFee = batchInfo?.soloDeliveryFee || 15;
  const deliveryShare = Math.round((soloFee / participantCount) * 100) / 100;
  const savings = soloFee - deliveryShare;
  const total = cartTotal + deliveryShare + driverTip;

  const handleJoinBatch = async () => {
    if (!batchId) return;
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/batches/${batchId}/join`, {});
      setHasJoined(true);
      // Optimistically update participant count so the delivery fee updates
      setBatchInfo((prev: any) => ({
        ...prev,
        _count: {
          ...prev._count,
          participants: (prev._count?.participants || 0) + 1
        }
      }));
      setStep(2);
    } catch (err: any) {
      if (err.status === 409 || err.data?.code === 'ALREADY_JOINED') {
        setHasJoined(true);
        setStep(2);
      } else {
        setError(err.message || 'Failed to join batch. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!batchId || !cart || cart.items.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const items = cart.items.map(item => ({ menuItemId: item.menuItemId, quantity: item.quantity }));
      const response: any = await apiClient.post('/orders', {
        batchId,
        items,
        driverTip,
        paymentMethod: selectedPayment,
      });

      if (selectedPayment === 'RAZORPAY' && response.razorpayOrderId) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setError('Failed to load Razorpay SDK');
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_123',
          amount: Math.round(total * 100).toString(),
          currency: 'INR',
          name: 'Zenvy',
          description: 'Order Payment',
          order_id: response.razorpayOrderId,
          handler: async function (paymentRes: any) {
            try {
              await apiClient.post('/payments/verify', {
                razorpay_order_id: paymentRes.razorpay_order_id,
                razorpay_payment_id: paymentRes.razorpay_payment_id,
                razorpay_signature: paymentRes.razorpay_signature,
              });
              await clearCart();
              setComplete(true);
            } catch (err) {
              setError('Payment verification failed.');
            }
          },
          theme: { color: '#c96442' }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on('payment.failed', function () {
          setError('Payment failed or cancelled.');
        });
        paymentObject.open();
      } else {
        await clearCart();
        setComplete(true);
      }
    } catch (err: any) {
      setError(err.message || 'Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (complete) {
    return (
      <div className="fade-in" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(201,100,66,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <CheckCircle2 size={44} color="#c96442" />
        </div>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2rem', margin: '0 0 0.75rem 0', color: '#2c2420', fontWeight: 700, letterSpacing: '-0.02em' }}>Order Confirmed</h1>
        <p style={{ color: '#6a5d55', fontSize: '1rem', maxWidth: '380px', lineHeight: 1.6, marginBottom: '0.5rem', fontWeight: 500 }}>
          Your order at <strong>{batchInfo?.restaurant?.name || 'the restaurant'}</strong> has been placed successfully.
        </p>
        <p style={{ color: '#8a7d76', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
          Payment: {selectedPayment === 'WALLET' ? 'Wallet (Auto-deduction at batch close)' : 'Cash on Delivery'}
        </p>
        <button 
          onClick={() => navigate('/orders')}
          style={{ background: '#2c2420', color: '#fff', padding: '0.9rem 2.5rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 6px 20px rgba(44,36,32,0.15)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          VIEW MY ORDERS
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2rem', marginBottom: '0.5rem', color: '#2c2420', textAlign: 'center', fontWeight: 700, letterSpacing: '-0.02em' }}>
          {step === 1 ? 'Join Batch' : 'Review Order'}
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step >= 1 ? '#c96442' : '#e4e1dd' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step >= 2 ? '#c96442' : '#e4e1dd' }} />
        </div>

        <div style={{ background: '#fff', border: '1px solid rgba(44,36,32,0.06)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '2rem' }}>
          
          {error && (
            <div style={{ color: '#c62828', background: '#ffebee', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <p style={{ color: '#6a5d55', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5, textAlign: 'center' }}>
                You're about to join the <strong>{batchInfo?.restaurant?.name || 'restaurant'}</strong> batch. Choose your preferred payment method to join. 
                <br /><br />
                <span style={{ fontSize: '0.85rem', color: '#8a7d76' }}>Your wallet is only deducted when the batch officially closes.</span>
              </p>

              {/* Payment method */}
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a7d76', marginBottom: '0.6rem' }}>Select Option</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '2rem' }}>
                <button
                  onClick={() => setSelectedPayment('WALLET')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    padding: '0.85rem',
                    background: selectedPayment === 'WALLET' ? '#2c2420' : '#f9f8f6',
                    color: selectedPayment === 'WALLET' ? '#fff' : '#2c2420',
                    border: selectedPayment === 'WALLET' ? '1px solid #2c2420' : '1px solid rgba(44,36,32,0.08)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <Wallet size={18} /> Wallet
                </button>
                <button
                  onClick={() => setSelectedPayment('COD')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    padding: '0.85rem',
                    background: selectedPayment === 'COD' ? '#2c2420' : '#f9f8f6',
                    color: selectedPayment === 'COD' ? '#fff' : '#2c2420',
                    border: selectedPayment === 'COD' ? '1px solid #2c2420' : '1px solid rgba(44,36,32,0.08)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <Banknote size={18} /> COD
                </button>
                <button
                  onClick={() => setSelectedPayment('RAZORPAY')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    padding: '0.85rem',
                    background: selectedPayment === 'RAZORPAY' ? '#2c2420' : '#f9f8f6',
                    color: selectedPayment === 'RAZORPAY' ? '#fff' : '#2c2420',
                    border: selectedPayment === 'RAZORPAY' ? '1px solid #2c2420' : '1px solid rgba(44,36,32,0.08)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <ShieldCheck size={18} /> Card (Razorpay)
                </button>
              </div>

              <button 
                onClick={handleJoinBatch}
                disabled={loading}
                style={{
                  width: '100%', background: '#2c2420', color: '#fff', padding: '1rem', border: 'none', borderRadius: '8px',
                  fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(44,36,32,0.15)', opacity: loading ? 0.6 : 1, transition: 'transform 0.2s'
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {loading ? 'JOINING...' : <><Users size={18} /> CONFIRM PAYMENT METHOD & JOIN BATCH</>}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2e7d32', background: '#e8f5e9', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> Successfully joined the batch cohort!
              </div>

              {/* Order summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(44,36,32,0.06)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2c2420' }}>
                    {cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0} Items
                  </div>
                  {batchInfo?.restaurant?.name && (
                    <div style={{ fontSize: '0.8rem', color: '#8a7d76', marginTop: '0.2rem' }}>from {batchInfo.restaurant.name}</div>
                  )}
                </div>
                <div style={{ fontSize: '1.15rem', color: '#2c2420', fontWeight: 700 }}>${cartTotal.toFixed(2)}</div>
              </div>

              {/* Price breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#6a5d55', fontSize: '0.9rem', fontWeight: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a39b95', textDecoration: 'line-through' }}>
                  <span>Solo Delivery</span>
                  <span>${soloFee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c96442', fontWeight: 700, background: 'rgba(201,100,66,0.06)', padding: '0.5rem 0.6rem', borderRadius: '6px', margin: '0 -0.6rem' }}>
                  <span>Live Batch Split (1/{participantCount})</span>
                  <span>${deliveryShare.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Driver Gratuity</span>
                  <span>${driverTip.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div style={{ borderTop: '2px dashed rgba(44,36,32,0.08)', margin: '1.5rem 0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#8a7d76', marginBottom: '0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimated Total</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2c2420', lineHeight: 1, letterSpacing: '-0.02em' }}>${total.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#8a7d76', marginBottom: '0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>You Save</div>
                  <div style={{ color: '#c96442', fontWeight: 800, fontSize: '1.15rem' }}>${savings.toFixed(2)}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#8a7d76', textAlign: 'center', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                * Final execution price may drop further as more people join before the lock time!
              </p>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading || !cart || cart.items.length === 0}
                style={{
                  width: '100%', background: '#c96442', color: '#fff', padding: '1rem', border: 'none', borderRadius: '8px',
                  fontSize: '0.95rem', fontWeight: 700, cursor: (loading || !cart || cart.items.length === 0) ? 'not-allowed' : 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(201,100,66,0.25)', opacity: (loading || !cart || cart.items.length === 0) ? 0.6 : 1, transition: 'transform 0.2s'
                }}
                onMouseEnter={e => !loading && cart && cart.items.length > 0 && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => !loading && cart && cart.items.length > 0 && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {loading ? 'PROCESSING...' : <>PLACE ORDER <ArrowRight size={18} /></>}
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', color: '#a39b95', fontSize: '0.75rem', fontWeight: 600 }}>
                <ShieldCheck size={14} /> Encrypted & Secure
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
