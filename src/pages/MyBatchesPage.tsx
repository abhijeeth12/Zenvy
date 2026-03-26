import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowRight, MapPin, Search } from 'lucide-react';
import { apiClient } from '../api';

export default function MyBatchesPage() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBatches = async () => {
      try {
        const data = await apiClient.get('/batches/my');
        setBatches(data || []);
      } catch (err) {
        console.error('Failed to fetch batches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBatches();
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', margin: 0, fontWeight: 600, color: '#2c2420' }}>
            My Batches
          </h1>
          <p style={{ color: '#8a7d76', fontSize: '1rem', marginTop: '0.5rem' }}>
            Track and manage your active and past collective orders.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(44, 36, 32, 0.1)', gap: '0.5rem', width: '300px' }}>
          <Search size={16} color="#8a7d76" />
          <input type="text" placeholder="Search your batches..." style={{ background: 'transparent', border: 'none', color: '#2c2420', fontSize: '0.9rem', outline: 'none', width: '100%' }} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ color: '#8a7d76' }}>Loading your batches...</div>
        </div>
      ) : batches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '16px', border: '1px dashed rgba(44,36,32,0.2)' }}>
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', color: '#2c2420', marginBottom: '0.5rem' }}>No Active Batches</h3>
          <p style={{ color: '#8a7d76', marginBottom: '2rem' }}>You haven't joined any collective orders yet.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ background: '#2c2420', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Discover Batches
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {batches.map(batch => (
            <div 
              key={batch.id} 
              onClick={() => navigate(`/batch/${batch.id}`)}
              style={{
                background: '#fff', border: '1px solid rgba(44, 36, 32, 0.08)', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: '0', color: '#2c2420', fontWeight: 700 }}>{batch.restaurant?.name || 'Restaurant'}</h3>
                  <span style={{ background: batch.status === 'OPEN' ? '#e8f5e9' : '#f5f5f5', color: batch.status === 'OPEN' ? '#2e7d32' : '#8a7d76', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {batch.status}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6a5d55', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>
                  {batch.restaurant?.cuisine || 'Food'} <span style={{ color: '#d1ceca' }}>•</span> <Clock size={14} /> Closes: {new Date(batch.closesAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                <div style={{ padding: '1rem', background: '#f9f8f6', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2c2420', fontWeight: 600, fontSize: '0.9rem' }}>
                    <Users size={16} color="#8a7d76" /> {batch._count?.participants || 1}/{batch.maxParticipants} Joined
                  </div>
                  <div style={{ color: '#c96442', fontWeight: 600, fontSize: '0.9rem' }}>
                    Solo Fee: ${batch.soloDeliveryFee}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ color: '#2c2420', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    VIEW DETAILS <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
