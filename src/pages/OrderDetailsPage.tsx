import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Clock, MapPin, Search } from 'lucide-react';
import { apiClient } from '../api';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiClient.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#8a7d76' }}>Loading order details...</div>;
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px' }}>
        <Search size={32} color="#d1ceca" style={{ marginBottom: '1rem' }} />
        <h3 style={{ margin: 0, color: '#2c2420' }}>Order Not Found</h3>
        <p style={{ color: '#8a7d76' }}>We couldn't find the order you're looking for.</p>
        <button onClick={() => navigate('/profile')} style={{ padding: '0.8rem 1.5rem', background: '#2c2420', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem', fontWeight: 600 }}>Back to Profile</button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/profile')}
        style={{ background: 'none', border: 'none', color: '#8a7d76', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: 0, marginBottom: '2rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> Back to Profile
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2.5rem', color: '#2c2420', margin: '0 0 0.5rem 0', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Order #{order.id.slice(-6).toUpperCase()}
          </h1>
          {order.batch?.restaurant?.name && (
            <h2 style={{ fontSize: '1.2rem', color: '#6a5d55', margin: '0 0 0.5rem 0', fontWeight: 600 }}>
              from {order.batch.restaurant.name}
            </h2>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6a5d55', fontSize: '0.9rem', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {new Date(order.createdAt).toLocaleString()}</span>
            <span>•</span>
            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.05em', fontSize: '0.75rem' }}>{order.status}</span>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(44,36,32,0.08)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(44,36,32,0.05)', background: '#f9f8f6' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2c2420', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} color="#c96442" /> Items Ordered
          </h3>
        </div>
        
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {order.items.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ background: '#f0ede6', color: '#2c2420', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                <span style={{ color: '#2c2420', fontWeight: 600 }}>{item.menuItem?.name || 'Item'}</span>
              </div>
              <div style={{ color: '#6a5d55', fontWeight: 600 }}>
                ${((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fcfcfb', padding: '1.5rem', borderTop: '1px solid rgba(44,36,32,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2c2420', fontSize: '1.15rem', fontWeight: 700 }}>
            <span>Total Paid</span>
            <span>${(order.total || order.totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {order.address && (
        <div style={{ marginTop: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid rgba(44,36,32,0.08)', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#f9f8f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={20} color="#c96442" />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', color: '#2c2420', fontSize: '1rem', fontWeight: 700 }}>Delivery Address</h4>
            <div style={{ color: '#6a5d55', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {order.address.street}<br/>
              {order.address.city}, {order.address.state} {order.address.zipCode}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
