import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Utensils, ChevronRight } from 'lucide-react';
import { apiClient } from '../api';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiClient.get('/orders/my');
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="fade-in" style={{ padding: '4rem', textAlign: 'center', color: '#8a7d76' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #f0ede6', borderTopColor: '#c96442', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
        Loading your orders...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: '#2c2420', marginBottom: '0.5rem' }}>Oops!</h2>
        <p style={{ color: '#8a7d76', marginBottom: '2rem' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2rem', color: '#2c2420', margin: '0 0 0.25rem 0', fontWeight: 700, letterSpacing: '-0.02em' }}>
          My Orders
        </h1>
        <p style={{ color: '#8a7d76', fontSize: '0.9rem', fontWeight: 500 }}>
          View and track all your active and past orders from batches.
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px', border: '1px dashed rgba(44,36,32,0.15)' }}>
          <Package size={48} color="#e0dedc" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c2420', fontWeight: 700 }}>No orders yet</h3>
          <p style={{ color: '#8a7d76', marginBottom: '1.5rem', fontSize: '0.9rem' }}>You haven't placed any orders. Join a batch to get started!</p>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '0.8rem 1.5rem', background: '#2c2420', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => {
            const itemCount = order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
            const restaurantName = order.batch?.restaurant?.name || 'Restaurant';
            const isSuccess = ['COMPLETED', 'CONFIRMED', 'DELIVERED', 'PREPARING'].includes(order.status);
            const statusColor = isSuccess ? '#2e7d32' 
                              : order.status === 'CANCELLED' ? '#c62828' 
                              : '#c96442';
            const statusBg = isSuccess ? '#e8f5e9' 
                           : order.status === 'CANCELLED' ? '#ffebee' 
                           : '#fff3e0';

            return (
              <div 
                key={order.id}
                onClick={() => navigate(`/order/${order.id}`)}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid rgba(44,36,32,0.08)',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)'; }}
              >
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#f9f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Utensils size={24} color="#a39b95" />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.1rem', color: '#2c2420', fontWeight: 700 }}>
                      {restaurantName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#6a5d55', fontWeight: 500 }}>
                      <span>{itemCount} item{itemCount !== 1 ? 's' : ''} • ${(order.totalAmount || order.total || 0).toFixed(2)}</span>
                      <span style={{ color: '#d1ceca' }}>|</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <span style={{ 
                      background: statusBg, color: statusColor, 
                      padding: '0.3rem 0.6rem', borderRadius: '6px', 
                      fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em' 
                    }}>
                      {order.status || 'PROCESSING'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#8a7d76', fontWeight: 600 }}>
                      Paid via {order.paymentMethod === 'COD' ? 'Cash' : 'Wallet'}
                    </span>
                  </div>
                  <ChevronRight size={20} color="#c96442" />
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
