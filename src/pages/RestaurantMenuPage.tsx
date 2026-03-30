import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Utensils } from 'lucide-react';
import { apiClient } from '../api';

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // We should fetch the restaurant. If it fails, we fall back.
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        // We will call GET /restaurants/:id or POST /restaurants/ensure 
        // to get the menu if it exists.
        // Actually, we can fetch by id, but wait, if it's mock, we might need ensure.
        const res = await apiClient.get(`/restaurants/${id}`);
        setRestaurant(res.data || res);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMenu();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        Loading menu...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p>Restaurant not found.</p>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '0.8rem 1.5rem', background: '#2c2420', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '1rem', cursor: 'pointer' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingBottom: '5rem' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#8a7d76', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem', transition: 'color 0.2s' }}
      >
        <ArrowLeft size={16} /> BACK
      </button>

      {/* Hero */}
      <div style={{ height: '300px', borderRadius: '16px', overflow: 'hidden', position: 'relative', marginBottom: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
        <img 
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000'} 
          alt={restaurant.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', margin: '0 0 0.5rem 0' }}>{restaurant.name}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 500, opacity: 0.9 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Utensils size={14} /> {restaurant.cuisine}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {restaurant.address || 'Address not listed'}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.8rem', color: '#2c2420', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Our Menu</h2>

        {!restaurant.menuItems || restaurant.menuItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8a7d76', border: '1px dashed #dedede', borderRadius: '12px' }}>
            No menu items available at the moment.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem' }}>
            {restaurant.menuItems.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', alignItems: 'center', transition: 'box-shadow 0.2s', cursor: 'default' }}
                   onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'}
                   onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                
                {item.imageUrl && (
                  <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.4rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', color: '#2c2420', fontWeight: 700 }}>{item.name}</h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#8a7d76', fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '600px' }}>
                    {item.description || 'A delicious and premium offering from our kitchen, prepared with the finest ingredients.'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c96442' }}>
                      ₹{item.batchPrice || item.price}
                    </span>
                    {item.batchPrice && item.batchPrice < item.price && (
                      <span style={{ fontSize: '0.9rem', color: '#a39b95', textDecoration: 'line-through' }}>
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("To order items, please create or join an active batch from the dashboard.");
                  }}
                  style={{
                    background: '#f4f1ec',
                    color: '#2c2420',
                    border: 'none',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    fontSize: '1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e6e2db')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f4f1ec')}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
