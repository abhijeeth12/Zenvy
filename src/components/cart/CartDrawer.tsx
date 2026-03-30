import React from 'react';
import { X, Minus, Plus, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isDrawerOpen, toggleDrawer, updateItemQuantity, clearCart, cartTotal, activeBatchId } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={toggleDrawer}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(20, 16, 14, 0.4)',
          zIndex: 999, transition: 'opacity 0.3s'
        }} 
      />
      
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', maxWidth: '100vw',
        backgroundColor: '#fff', zIndex: 1000, boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.3s ease-out forwards',
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(44,36,32,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#2c2420', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="#c96442" />
            Your Order
          </h2>
          <button onClick={toggleDrawer} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6a5d55', padding: '0.25rem' }}>
            <X size={24} />
          </button>
        </div>

        {/* No batch warning */}
        {!activeBatchId && (
          <div style={{ padding: '1rem 1.5rem', background: '#fff8f5', borderBottom: '1px solid rgba(201,100,66,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c96442', fontSize: '0.85rem', fontWeight: 500 }}>
            <AlertCircle size={16} />
            Join a batch to start ordering
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {!cart || cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#8a7d76', marginTop: '3rem' }}>
              <ShoppingBag size={48} color="#e0dedc" style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: 500 }}>Your cart is empty.</p>
              <button onClick={toggleDrawer} style={{ background: '#2c2420', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', marginTop: '1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                Browse Menu
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  {item.menuItem.imageUrl && (
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.menuItem.imageUrl} alt={item.menuItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: '#2c2420', marginBottom: '0.1rem' }}>{item.menuItem.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8a7d76', marginBottom: '0.4rem' }}>
                      {item.batch?.restaurant?.name || 'Restaurant'}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#c96442', fontWeight: 700 }}>₹{item.menuItem.price}</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#f9f8f6', padding: '0.35rem', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                    <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} style={{ background: '#fff', border: '1px solid #e8e6e3', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#2c2420', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#f4f1ec'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2c2420', minWidth: '18px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} style={{ background: '#fff', border: '1px solid #e8e6e3', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#2c2420', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#f4f1ec'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(44,36,32,0.08)', background: '#fcfcfb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700, color: '#2c2420' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={clearCart} style={{ flex: 1, padding: '0.85rem', background: 'transparent', border: '1px solid rgba(44,36,32,0.15)', borderRadius: '8px', color: '#6a5d55', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                Clear
              </button>
              <button 
                onClick={() => { 
                  if (!activeBatchId) {
                    alert('Please join a batch first to checkout.');
                    return;
                  }
                  toggleDrawer(); 
                  navigate(`/checkout?batchId=${activeBatchId}`); 
                }}
                style={{ flex: 2, padding: '0.85rem', background: '#c96442', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(201,100,66,0.3)', fontSize: '0.9rem', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </>
  );
}
