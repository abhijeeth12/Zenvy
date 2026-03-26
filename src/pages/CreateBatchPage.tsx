import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, MapPin, ArrowRight, Utensils } from 'lucide-react';
import { apiClient } from '../api';

export default function CreateBatchPage() {
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [waitMinutes, setWaitMinutes] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await apiClient.get('/restaurants');
        setRestaurants(res?.data || res || []);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleCreateBatch = async () => {
    try {
      setLoading(true);
      const batch = await apiClient.post('/batches', {
        restaurantId,
        closureMinutes: waitMinutes,
        maxParticipants: 10,
        soloDeliveryFee: 15
      });
      navigate(`/batch/${batch.id}`);
    } catch (err) {
      console.error('Failed to create batch:', err);
      setLoading(false);
    }
  };

  // Intelligence Mock based on wait time and restaurant
  const expectedParticipants = waitMinutes > 40 ? '8-12' : '4-6';
  const expectedSavings = waitMinutes > 40 ? '₹110-₹150' : '₹40-₹60';
  const optimalTime = waitMinutes > 40 ? 'Perfect timing for peak lunch rush.' : 'Increase to 45m for 2x savings.';

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '700px' }}>
        
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#2c2420', letterSpacing: '-0.02em' }}>Initiate a Collective</h1>
          <p style={{ color: '#6a5d55', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 400 }}>Define the culinary destination and wait threshold. Our engine will dynamically route participants to maximize wholesale delivery savings.</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid rgba(44, 36, 32, 0.08)', borderRadius: '16px', padding: '3rem', marginBottom: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          
          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Restaurant Input */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8a7d76', marginBottom: '1rem', fontWeight: 600 }}>
                <MapPin size={16} /> Destination Restaurant
              </label>
              <div style={{ position: 'relative' }}>
                <Utensils size={24} color="#d1ceca" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <select 
                  value={restaurantId}
                  onChange={e => setRestaurantId(e.target.value)}
                  style={{
                    width: '100%', background: '#f9f8f6', border: '2px solid transparent',
                    color: '#2c2420', padding: '1rem 1rem 1rem 3.5rem', fontSize: '1.25rem', outline: 'none', fontFamily: 'Inter, sans-serif',
                    borderRadius: '8px', fontWeight: 600, transition: 'border 0.2s', appearance: 'none'
                  }}
                  onFocus={e => e.target.style.border = '2px solid rgba(44,36,32,0.2)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                >
                  <option value="" disabled>Select a Restaurant</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name} - {r.cuisine}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Wait Time Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8a7d76', fontWeight: 600 }}>
                  <Clock size={16} /> Order Closure Window
                </label>
                <span style={{ fontSize: '1.25rem', color: '#2c2420', fontWeight: 700, background: '#f9f8f6', padding: '0.4rem 1rem', borderRadius: '8px' }}>{waitMinutes} mins</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="90" 
                step="5"
                value={waitMinutes}
                onChange={e => setWaitMinutes(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#c96442', cursor: 'pointer', height: '6px', borderRadius: '4px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8a7d76', fontSize: '0.8rem', marginTop: '1rem', fontWeight: 500 }}>
                <span>Fast (15m)</span>
                <span>Optimal (45m)</span>
                <span>Max Savings (90m)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Intelligence UI Block */}
        <div style={{ 
          background: '#fcf6f4', 
          border: '1px solid rgba(201, 100, 66, 0.2)', 
          borderRadius: '16px', 
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, color: '#c96442' }}><Sparkles size={120} /></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c96442', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            <Sparkles size={16} /> Routing Intelligence
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div style={{ color: '#8a7d76', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Expected Participants</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#2c2420', letterSpacing: '-0.02em' }}>{expectedParticipants}</div>
            </div>
            <div>
              <div style={{ color: '#8a7d76', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Estimated Savings</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#c96442', letterSpacing: '-0.02em' }}>{expectedSavings}</div>
            </div>
          </div>
          
          <div style={{ color: '#c96442', fontSize: '0.9rem', fontWeight: 500, backgroundColor: 'rgba(201,100,66,0.1)', padding: '0.8rem 1rem', borderRadius: '8px' }}>
            {optimalTime}
          </div>
        </div>

        {/* Action */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            disabled={!restaurantId || loading}
            onClick={handleCreateBatch}
            style={{
              background: restaurantId ? '#2c2420' : '#e4e1dd',
              color: restaurantId ? '#fff' : '#a39b95',
              padding: '1.25rem 3rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: restaurantId ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s',
              boxShadow: restaurantId ? '0 10px 20px rgba(44,36,32,0.15)' : 'none'
            }}
            onMouseEnter={e => restaurantId && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => restaurantId && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'BROADCASTING...' : <>BROADCAST BATCH <ArrowRight size={20} /></>}
          </button>
        </div>

      </div>
    </div>
  );
}
