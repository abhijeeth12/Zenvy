import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, Package, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api';
import AddressManagement from '../components/profile/AddressManagement';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logoutState } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiClient.get('/orders/my');
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      logoutState();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: '#8a7d76', fontSize: '1rem', fontWeight: 500 }}>
        Loading your account...
      </div>
    );
  }

  const displayProfile = user || {
    displayName: 'Guest User',
    email: 'hello@example.com',
    role: 'USER'
  };

  return (
    <div className="fade-in" style={{ display: 'flex', gap: '4rem', maxWidth: '1100px', margin: '0 auto', alignItems: 'flex-start' }}>
      
      {/* Left Column: Account Details */}
      <div style={{ width: '320px', flexShrink: 0, position: 'sticky', top: '100px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', margin: '0 0 2rem 0', fontWeight: 600, color: '#2c2420' }}>Account</h2>
        
        <div style={{ background: '#fff', border: '1px solid rgba(44,36,32,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f9f8f6', borderBottom: '1px solid rgba(44,36,32,0.05)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#c96442', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600, marginBottom: '1rem', boxShadow: '0 4px 15px rgba(201, 100, 66, 0.3)' }}>
              {displayProfile.displayName.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#2c2420', fontWeight: 700 }}>{displayProfile.displayName}</h3>
            <div style={{ background: 'rgba(44,36,32,0.05)', color: '#6a5d55', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem', letterSpacing: '0.05em' }}>
              {displayProfile.role}
            </div>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6a5d55', marginBottom: '1rem' }}>
              <Mail size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{displayProfile.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6a5d55', marginBottom: '2rem' }}>
              <User size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Registered via API</span>
            </div>

            <button 
              onClick={handleLogout}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#fbfafa', border: '1px solid rgba(201, 100, 66, 0.3)', color: '#c96442', padding: '0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff5f2';
                e.currentTarget.style.borderColor = '#c96442';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fbfafa';
                e.currentTarget.style.borderColor = 'rgba(201, 100, 66, 0.3)';
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
        
        {/* Address Management Component placed below Account details */}
        <AddressManagement />
      </div>

      {/* Right Column: Order History */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', margin: 0, fontWeight: 600, color: '#2c2420' }}>Order History</h2>
          <div style={{ color: '#8a7d76', fontSize: '0.9rem', fontWeight: 500 }}>{orders.length} Total Orders</div>
        </div>

        {orders.length === 0 ? (
          <div style={{ background: '#fff', border: '1px dashed rgba(44,36,32,0.2)', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center' }}>
            <Package size={32} color="#d1ceca" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#2c2420', margin: '0 0 0.5rem 0' }}>No Orders Yet</h3>
            <p style={{ color: '#8a7d76', fontSize: '0.95rem', marginBottom: '2rem' }}>Looks like you haven't placed any orders with a collective batch recently.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{ background: '#2c2420', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div 
                key={order.id} 
                onClick={() => navigate(`/order/${order.id}`)}
                style={{ background: '#fff', border: '1px solid rgba(44,36,32,0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#2c2420', fontWeight: 700 }}>{order.batch?.restaurant?.name || 'Restaurant Order'}</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', padding: '0.25rem 0.6rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px' }}>
                      PAID
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', color: '#6a5d55', fontSize: '0.85rem', fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>Order #{order.id.slice(-6).toUpperCase()}</span>
                    <span>{order._count?.items || 0} Items</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2c2420' }}>${order.totalAmount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#8a7d76' }}>Total Amount</div>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f9f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6a5d55' }}>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
