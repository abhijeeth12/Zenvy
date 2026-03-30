import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowRight, Zap, MapPin, Star, Truck, ChevronRight, Flame, X } from 'lucide-react';
import { apiClient } from '../api';
import './DashboardPage.css';

// Local assets — updated with premium generated imagery
import heroBg from '../assets/hero_moody.png';

// ============================================
// Image Mapping — maps cuisines/restaurants to available assets
// ============================================

const CUISINE_IMAGES: Record<string, string> = {
  'Japanese': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop',
  'Thai': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1000&auto=format&fit=crop',
  'Italian': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1000&auto=format&fit=crop',
  'American': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
  'Hawaiian': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
  'Mexican': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop',
  'Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000&auto=format&fit=crop',
  'Mediterranean': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop',
  'Healthy': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
  'Steakhouse': 'https://images.unsplash.com/photo-1544025162-835ab03fa85f?q=80&w=1000&auto=format&fit=crop',
};

const RESTAURANT_IMAGES: Record<string, string> = {
  'Matsuhisa Omakase': 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop',
  'Cut by Wolfgang Puck': 'https://images.unsplash.com/photo-1544025162-835ab03fa85f?q=80&w=1000&auto=format&fit=crop',
  'Sweetgreen Artisan': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
  'Nobu Kitchen': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop',
  'Eataly Express': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1000&auto=format&fit=crop',
  'Shake Shack Premium': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
  'Pad Thai Palace': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1000&auto=format&fit=crop',
  'Poke Paradise': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
};

function getImageForCuisine(cuisine: string): string {
  for (const [key, val] of Object.entries(CUISINE_IMAGES)) {
    if (cuisine.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop';
}

function getImageForRestaurant(name: string, cuisine: string): string {
  return RESTAURANT_IMAGES[name] || getImageForCuisine(cuisine);
}

const MOCK_BATCHES = [
  {
    id: 'batch-001',
    restaurant: { id: 'r1', name: 'Matsuhisa Omakase', cuisine: 'Japanese', imageUrl: null, slug: 'matsuhisa-omakase' },
    status: 'OPEN',
    participantCount: 7,
    maxParticipants: 10,
    timeRemaining: '12:30',
    closesAt: new Date(Date.now() + 12 * 60000).toISOString(),
    estimatedSavings: '₹85',
    soloDeliveryFee: 120,
  },
  {
    id: 'batch-002',
    restaurant: { id: 'r2', name: 'Eataly Express', cuisine: 'Italian', imageUrl: null, slug: 'eataly-express' },
    status: 'OPEN',
    participantCount: 4,
    maxParticipants: 8,
    timeRemaining: '24:15',
    closesAt: new Date(Date.now() + 24 * 60000).toISOString(),
    estimatedSavings: '₹60',
    soloDeliveryFee: 99,
  },
  {
    id: 'batch-003',
    restaurant: { id: 'r3', name: 'Pad Thai Palace', cuisine: 'Thai', imageUrl: null, slug: 'pad-thai-palace' },
    status: 'OPEN',
    participantCount: 5,
    maxParticipants: 6,
    timeRemaining: '04:50',
    closesAt: new Date(Date.now() + 5 * 60000).toISOString(),
    estimatedSavings: '₹95',
    soloDeliveryFee: 110,
  },
  {
    id: 'batch-004',
    restaurant: { id: 'r4', name: 'Shake Shack Premium', cuisine: 'American', imageUrl: null, slug: 'shake-shack-premium' },
    status: 'OPEN',
    participantCount: 2,
    maxParticipants: 5,
    timeRemaining: '38:00',
    closesAt: new Date(Date.now() + 38 * 60000).toISOString(),
    estimatedSavings: '₹50',
    soloDeliveryFee: 80,
  },
];

const MOCK_RESTAURANTS = [
  { id: 'r1', name: 'Matsuhisa Omakase', cuisine: 'Japanese • Sushi', rating: 4.8, deliveryTime: '25-35 min', deliveryFee: '₹40', activeBatchCount: 3 },
  { id: 'r2', name: 'Cut by Wolfgang Puck', cuisine: 'Steakhouse • Premium', rating: 4.9, deliveryTime: '30-40 min', deliveryFee: '₹60', activeBatchCount: 1 },
  { id: 'r3', name: 'Sweetgreen Artisan', cuisine: 'Healthy • Salads', rating: 4.6, deliveryTime: '15-25 min', deliveryFee: '₹30', activeBatchCount: 4 },
  { id: 'r5', name: 'Eataly Express', cuisine: 'Italian • Pasta', rating: 4.7, deliveryTime: '20-30 min', deliveryFee: '₹45', activeBatchCount: 2 },
  { id: 'r6', name: 'Shake Shack Premium', cuisine: 'American • Burgers', rating: 4.5, deliveryTime: '15-20 min', deliveryFee: '₹35', activeBatchCount: 2 },
  { id: 'r7', name: 'Poke Paradise', cuisine: 'Hawaiian • Bowls', rating: 4.7, deliveryTime: '20-30 min', deliveryFee: '₹38', activeBatchCount: 1 },
];

// ============================================
// Skeleton Loader components
// ============================================

function BatchCardSkeleton() {
  return (
    <div className="dash-skeleton-card">
      <div className="dash-skeleton-img" />
      <div className="dash-skeleton-body">
        <div className="dash-skeleton-line medium" />
        <div className="dash-skeleton-line short" />
        <div style={{ height: '0.5rem' }} />
        <div className="dash-skeleton-line full" style={{ height: '50px', borderRadius: '10px' }} />
        <div style={{ height: '0.5rem' }} />
        <div className="dash-skeleton-line medium" />
      </div>
    </div>
  );
}

function RestaurantCardSkeleton() {
  return (
    <div className="dash-skeleton-card">
      <div className="dash-skeleton-img" style={{ height: '190px' }} />
      <div className="dash-skeleton-body">
        <div className="dash-skeleton-line medium" />
        <div className="dash-skeleton-line short" />
        <div style={{ height: '0.5rem' }} />
        <div className="dash-skeleton-line full" />
        <div style={{ height: '0.5rem' }} />
        <div className="dash-skeleton-line full" style={{ height: '40px', borderRadius: '10px' }} />
      </div>
    </div>
  );
}

// ============================================
// Helper: get greeting based on time of day
// ============================================
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// Helper: get batch status badge
function getBatchStatusInfo(participantCount: number, maxParticipants: number, closesAt: string) {
  const minsLeft = Math.max(0, Math.floor((new Date(closesAt).getTime() - Date.now()) / 60000));
  const fillPercent = (participantCount / maxParticipants) * 100;

  if (minsLeft <= 5) return { label: 'Closing Soon', className: 'closing' };
  if (fillPercent >= 75) return { label: 'Filling Fast', className: 'filling' };
  return { label: 'Open', className: 'open' };
}

// ============================================
// Main Component
// ============================================

export default function DashboardPage() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [selectedMenuRestaurant, setSelectedMenuRestaurant] = useState<any>(null);
  const [loadingMenu, setLoadingMenu] = useState(false);

  // Fetch batches — backend first, mock fallback
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await apiClient.get('/batches');
        const data = res?.data || res || [];
        setBatches(data.length > 0 ? data : MOCK_BATCHES);
      } catch {
        setBatches(MOCK_BATCHES);
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  // Fetch restaurants — backend first, mock fallback
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await apiClient.get('/restaurants');
        const data = res?.data || res || [];
        setRestaurants(data.length > 0 ? data : MOCK_RESTAURANTS);
      } catch {
        setRestaurants(MOCK_RESTAURANTS);
      } finally {
        setLoadingRestaurants(false);
      }
    };
    fetchRestaurants();
  }, []);

  const activeBatchCount = batches.length;

  return (
    <div className="fade-in">

      {/* ========== Hero Welcome Banner ========== */}
      <div className="dash-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="dash-hero-content">
          <h1 className="dash-greeting">{getGreeting()}.</h1>
          <p className="dash-greeting-sub">
            There are currently <strong>{activeBatchCount} active batches</strong> forming in your vicinity.
            Join a collective order to reduce delivery fees and enjoy curated cuisines together.
          </p>
          <div className="dash-hero-stats">
            <div className="dash-hero-stat">
              <span className="dash-hero-stat-value">{activeBatchCount}</span>
              <span className="dash-hero-stat-label">Live Batches</span>
            </div>
            <div className="dash-hero-stat">
              <span className="dash-hero-stat-value">{restaurants.length}</span>
              <span className="dash-hero-stat-label">Restaurants</span>
            </div>
            <div className="dash-hero-stat">
              <span className="dash-hero-stat-value">₹85</span>
              <span className="dash-hero-stat-label">Avg. Savings</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Active Batches Section ========== */}
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Active Batches</h2>
          <p className="dash-section-subtitle">Join an open batch to split delivery fees</p>
        </div>
        <button className="dash-section-action" onClick={() => navigate('/create-batch')}>
          Create New Batch <ChevronRight size={16} />
        </button>
      </div>

      {loadingBatches ? (
        <div className="dash-batches-grid">
          {[...Array(4)].map((_, i) => <BatchCardSkeleton key={i} />)}
        </div>
      ) : batches.length === 0 ? (
        <div className="dash-empty-state">
          <Flame size={32} color="#c96442" />
          <p>No active batches found in your area right now.<br />Be the first to start a new collective order!</p>
        </div>
      ) : (
        <div className="dash-batches-grid">
          {batches.slice(0, 4).map((batch) => {
            const closesAt = batch.closesAt;
            const minsLeft = Math.max(0, Math.floor((new Date(closesAt).getTime() - Date.now()) / 60000));
            const hoursLeft = Math.floor(minsLeft / 60);
            const displayTime = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft % 60}m` : `${minsLeft}m`;
            const fillPercent = ((batch.participantCount || batch._count?.participants || 1) / batch.maxParticipants) * 100;
            const statusInfo = getBatchStatusInfo(batch.participantCount || batch._count?.participants || 1, batch.maxParticipants, closesAt);
            const restaurant = batch.restaurant;
            const imgSrc = restaurant?.imageUrl || getImageForCuisine(restaurant?.cuisine || '');

            return (
              <div
                key={batch.id}
                className="dash-batch-card"
                onClick={() => navigate(`/batch/${batch.id}`)}
              >
                {/* Card Image */}
                <div className="dash-batch-img-wrap">
                  <img src={imgSrc} alt={restaurant?.name} />
                  <div className="dash-batch-badge">
                    <Clock size={13} /> {displayTime}
                  </div>
                  <div className={`dash-batch-status-badge ${statusInfo.className}`}>
                    {statusInfo.label}
                  </div>
                </div>

                {/* Card Body */}
                <div className="dash-batch-body">
                  <h3 className="dash-batch-name">{restaurant?.name}</h3>
                  <div className="dash-batch-meta">
                    {restaurant?.cuisine} <span className="dot">•</span> <MapPin size={13} /> 1.2 mi
                  </div>

                  {/* Progress */}
                  <div className="dash-batch-progress-block">
                    <div className="dash-batch-progress-info">
                      <span className="participants">
                        <Users size={14} color="#8a7d76" />
                        {batch.participantCount || batch._count?.participants || 1}/{batch.maxParticipants} Joined
                      </span>
                      <span className="savings">
                        <Zap size={14} /> Save {batch.estimatedSavings || `₹${Math.round(batch.soloDeliveryFee * 0.7)}`}
                      </span>
                    </div>
                    <div className="dash-batch-progress-bar">
                      <div className="dash-batch-progress-fill" style={{ width: `${fillPercent}%` }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="dash-batch-footer">
                    <span className="dash-batch-fee">Delivery fee split</span>
                    <button
                      className="dash-batch-join-btn"
                      onClick={(e) => { e.stopPropagation(); navigate(`/batch/${batch.id}`); }}
                    >
                      JOIN <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========== Restaurants Section ========== */}
      <div className="dash-section-header" style={{ marginTop: '1rem' }}>
        <div>
          <h2 className="dash-section-title">Popular Restaurants</h2>
          <p className="dash-section-subtitle">Browse curated restaurants and start a batch</p>
        </div>
        <button className="dash-section-action">
          View All <ChevronRight size={16} />
        </button>
      </div>

      {loadingRestaurants ? (
        <div className="dash-restaurants-grid">
          {[...Array(6)].map((_, i) => <RestaurantCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="dash-restaurants-grid">
          {restaurants.slice(0, 6).map((rest) => {
            const imgSrc = rest.imageUrl || getImageForRestaurant(rest.name, rest.cuisine?.split('•')[0]?.trim() || '');
            return (
              <div key={rest.id} className="dash-restaurant-card">
                {/* Restaurant Image */}
                <div className="dash-restaurant-img-wrap">
                  <img src={imgSrc} alt={rest.name} />
                  <div className="dash-restaurant-rating">
                    <Star size={13} fill="#f59e0b" color="#f59e0b" /> {rest.rating || '4.5'}
                  </div>
                  {(rest.activeBatchCount || 0) > 0 && (
                    <div className="dash-restaurant-batch-overlay">
                      <Flame size={12} /> {rest.activeBatchCount} active batch{rest.activeBatchCount > 1 ? 'es' : ''}
                    </div>
                  )}
                </div>

                {/* Restaurant Body */}
                <div className="dash-restaurant-body">
                  <h3 className="dash-restaurant-name">{rest.name}</h3>
                  <p className="dash-restaurant-cuisine">{rest.cuisine}</p>

                  <div className="dash-restaurant-info-row">
                    <div className="dash-restaurant-info-item">
                      <Clock size={14} color="#8a7d76" /> {rest.deliveryTime || '20-30 min'}
                    </div>
                    <div className="dash-restaurant-info-item">
                      <Truck size={14} color="#8a7d76" /> {rest.deliveryFee || '₹40'}
                    </div>
                  </div>

                  <button
                    className="dash-restaurant-menu-btn"
                    disabled={loadingMenu && selectedMenuRestaurant?.id === rest.id}
                    onClick={async () => {
                      setLoadingMenu(true);
                      setSelectedMenuRestaurant({ ...rest }); // optimistic show
                      try {
                        const res = await apiClient.post('/restaurants/ensure', {
                          id: rest.id,
                          name: rest.name,
                          cuisine: rest.cuisine,
                          imageUrl: rest.imageUrl || imgSrc
                        });
                        setSelectedMenuRestaurant(res.data || res);
                      } catch (err) {
                        console.error('Failed to fetch menu:', err);
                      } finally {
                        setLoadingMenu(false);
                      }
                    }}
                  >
                    {loadingMenu && selectedMenuRestaurant?.id === rest.id ? 'Loading...' : 'View Menu'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========== Sliding Menu Drawer ========== */}
      <div 
        className={`dash-menu-drawer-backdrop ${selectedMenuRestaurant ? 'open' : ''}`} 
        onClick={() => setSelectedMenuRestaurant(null)} 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          opacity: selectedMenuRestaurant ? 1 : 0,
          pointerEvents: selectedMenuRestaurant ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      >
        <div 
          className={`dash-menu-drawer ${selectedMenuRestaurant ? 'open' : ''}`} 
          onClick={e => e.stopPropagation()} 
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: '500px',
            backgroundColor: '#fcfaf8', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
            transform: selectedMenuRestaurant ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}
        >
          {selectedMenuRestaurant && (
            <>
              <div style={{ height: '240px', position: 'relative', flexShrink: 0 }}>
                <img 
                  src={selectedMenuRestaurant.imageUrl || getImageForRestaurant(selectedMenuRestaurant.name, selectedMenuRestaurant.cuisine)} 
                  alt={selectedMenuRestaurant.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />
                <button 
                  onClick={() => setSelectedMenuRestaurant(null)} 
                  style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                >
                  <X size={20} />
                </button>
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', color: '#fff' }}>
                  <h2 style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>{selectedMenuRestaurant.name}</h2>
                  <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>{selectedMenuRestaurant.cuisine} • Read-Only Menu</p>
                </div>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                {loadingMenu ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#8a7d76' }}>Loading specialized menu...</div>
                ) : !selectedMenuRestaurant.menuItems || selectedMenuRestaurant.menuItems.length === 0 ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#8a7d76' }}>No menu items available.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {selectedMenuRestaurant.menuItems.map((item: any) => (
                      <div key={item.id || item.name} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#2c2420', fontWeight: 600 }}>{item.name}</h4>
                          <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#6a5d55', lineHeight: '1.5' }}>{item.description || 'Premium seasonal ingredients crafted to perfection for a delightful culinary experience.'}</p>
                          <div style={{ fontSize: '1.05rem', fontWeight: '600', color: '#c96442' }}>₹{item.price} <span style={{ fontSize: '0.8rem', color: '#8a7d76', fontWeight: 'normal', textDecoration: 'line-through', marginLeft: '0.5rem' }}>₹{Math.round(item.price * 1.3)}</span></div>
                        </div>
                        {item.imageUrl && (
                          <div style={{ width: '110px', height: '110px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
