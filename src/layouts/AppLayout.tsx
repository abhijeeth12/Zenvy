import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Bell, Search, PlusCircle, LogOut, List, ShoppingBag, Wallet } from 'lucide-react';
import CartDrawer from '../components/cart/CartDrawer';
import { useCart } from '../contexts/CartContext';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleDrawer, cart, clearCart, setActiveBatchId } = useCart();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Strictly clear cart when user navigates away from batch or checkout
  useEffect(() => {
    const isBatchOrCheckout = location.pathname.startsWith('/batch/') || location.pathname.startsWith('/checkout');
    if (!isBatchOrCheckout && cart && cart.items.length > 0) {
      clearCart().catch(console.error);
      setActiveBatchId(null);
    }
  }, [location.pathname, cart, clearCart, setActiveBatchId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('zenvy_token');
    navigate('/login');
  };

  const navItems = [
    { label: 'DISCOVERY', path: '/dashboard' },
    { label: 'MY BATCHES', path: '/batches' },
    { label: 'ORDERS', path: '/orders' },
    { label: 'WALLET', path: '/wallet' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f8f6', color: '#2c2420', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top App Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 4rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgba(44, 36, 32, 0.08)'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
          <div 
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer', color: '#2c2420' }}
            onClick={() => navigate('/dashboard')}
          >
            Zenvy.
          </div>
          
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {navItems.map(item => (
              <div 
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: location.pathname === item.path ? '#2c2420' : '#8a7d76',
                  transition: 'color 0.2s',
                  position: 'relative'
                }}
              >
                {item.label}
                {location.pathname === item.path && (
                  <div style={{ position: 'absolute', bottom: '-1.3rem', left: 0, right: 0, height: '3px', background: '#2c2420', borderRadius: '2px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: '#2c2420' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f0ede6', padding: '0.5rem 1rem', borderRadius: '6px', gap: '0.5rem', width: '250px' }}>
            <Search size={16} color="#8a7d76" />
            <input type="text" placeholder="Search restaurants or cuisines..." style={{ background: 'transparent', border: 'none', color: '#2c2420', fontSize: '0.85rem', outline: 'none', width: '100%' }} />
          </div>
          
          <button 
            onClick={() => navigate('/create-batch')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: '#2c2420', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px',
              fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.02em', cursor: 'pointer', transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#40352f'}
            onMouseLeave={e => e.currentTarget.style.background = '#2c2420'}
          >
            <PlusCircle size={16} /> NEW BATCH
          </button>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginLeft: '1rem', borderLeft: '1px solid rgba(44, 36, 32, 0.1)', paddingLeft: '2rem' }}>
            
            {/* Cart Toggle */}
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={toggleDrawer}>
              <ShoppingBag size={20} color="#6a5d55" />
              {cart && cart.items.length > 0 && (
                <div style={{ position: 'absolute', top: '-6px', right: '-8px', background: '#c96442', color: '#fff', fontSize: '0.65rem', fontWeight: 700, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                </div>
              )}
            </div>

            <Bell size={20} style={{ cursor: 'pointer', color: '#6a5d55' }} />
            
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <div 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#f9f8f6', borderRadius: '50%', color: '#c96442', fontWeight: 700 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User size={18} />
              </div>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '120%', right: 0, width: '220px', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid rgba(44,36,32,0.08)', overflow: 'hidden', zIndex: 200
                }}>
                  <div style={{ padding: '0.5rem 0' }}>
                    <div 
                      onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                      style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.9rem', color: '#2c2420', fontWeight: 500, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9f8f6'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={16} color="#c96442" /> Profile & Orders
                    </div>
                    
                    <div 
                      onClick={() => { navigate('/batches'); setDropdownOpen(false); }}
                      style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.9rem', color: '#2c2420', fontWeight: 500, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9f8f6'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <List size={16} color="#6a5d55" /> My Batches
                    </div>

                    <div 
                      onClick={() => { navigate('/wallet'); setDropdownOpen(false); }}
                      style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.9rem', color: '#2c2420', fontWeight: 500, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9f8f6'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Wallet size={16} color="#10b981" /> Wallet
                    </div>

                    <div style={{ height: '1px', background: 'rgba(44,36,32,0.06)', margin: '0.4rem 0' }} />

                    <div 
                      onClick={handleLogout}
                      style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.9rem', color: '#d32f2f', fontWeight: 600, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ffebee'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} /> Sign Out
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Render */}
      <main style={{ padding: '3rem 4rem' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2c2420',
        color: '#f0ede6',
        padding: '2.5rem 4rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem' }}>
          
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
              Zenvy.
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.8 }}>
              Collective culinary moments. Batch ordering that saves time, money, and the planet.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/dashboard" style={{ color: '#f0ede6', textDecoration: 'none', fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.9 }}>Discovery</Link></li>
              <li><Link to="/faq" style={{ color: '#f0ede6', textDecoration: 'none', fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.9 }}>FAQ</Link></li>
              <li><Link to="/support" style={{ color: '#f0ede6', textDecoration: 'none', fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.9 }}>Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/about" style={{ color: '#f0ede6', textDecoration: 'none', fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.9 }}>About</Link></li>
              <li><Link to="/careers" style={{ color: '#f0ede6', textDecoration: 'none', fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.9 }}>Careers</Link></li>
              <li><Link to="/blog" style={{ color: '#f0ede6', textDecoration: 'none', fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.9 }}>Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/privacy" style={{ color: '#f0ede6', textDecoration: 'none', fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.9 }}>Privacy</Link></li>
              <li><Link to="/terms" style={{ color: '#f0ede6', textDecoration: 'none', fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.9 }}>Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          maxWidth: '1400px', 
          margin: '2.5rem auto 0', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'rgba(240, 237, 230, 0.7)'
        }}>
          © 2024 Zenvy Inc. All rights reserved. Made with ❤️ for food lovers.
        </div>
      </footer>

      {/* Global Cart Drawer */}
      <CartDrawer />

    </div>
  );
}

