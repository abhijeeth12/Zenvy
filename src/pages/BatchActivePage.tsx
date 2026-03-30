import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Clock, Send, ShoppingBag, LogOut, Zap, AlertCircle } from 'lucide-react';
import sushiImg from '../assets/sushi.png';
import { apiClient } from '../api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function BatchActivePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleDrawer, setActiveBatchId, cart } = useCart();
  const { user } = useAuth();
  
  const [batch, setBatch] = useState<any>(null);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Join/Leave state
  const [hasJoined, setHasJoined] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (id) setActiveBatchId(id);
  }, [id, setActiveBatchId]);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const data = await apiClient.get(`/batches/${id}`);
        setBatch(data);
        
        if (user && data.participants) {
          const userJoined = data.participants.some((p: any) => p.userId === user.id);
          setHasJoined(userJoined);
        }
      } catch (err) {
        console.error('Failed to fetch batch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatchDetails();
  }, [id, user]);

  const handleLeaveBatch = async () => {
    if (!id) return;
    setIsLeaving(true);
    setActionError(null);
    try {
      await apiClient.post(`/batches/${id}/leave`, {});
      setHasJoined(false);
      setBatch((prev: any) => ({
        ...prev,
        _count: {
          ...prev._count,
          participants: Math.max(0, (prev._count?.participants || 1) - 1)
        }
      }));
    } catch (err: any) {
      setActionError(err.message || 'Failed to leave batch');
    } finally {
      setIsLeaving(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'You', text: chatMsg, isMe: true, time: 'Now' }]);
    setChatMsg('');
  };

  const getEstimatedRange = () => {
    if (!batch?.restaurant?.menuItems || batch.restaurant.menuItems.length === 0) return null;
    const prices = batch.restaurant.menuItems.map((i: any) => i.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#8a7d76' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #f0ede6', borderTopColor: '#c96442', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
        Loading batch details...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!batch) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: '#2c2420', marginBottom: '0.5rem' }}>Batch Not Found</h2>
        <p style={{ color: '#8a7d76', marginBottom: '2rem' }}>This batch may have expired or been cancelled.</p>
        <button onClick={() => navigate('/dashboard')} style={{ background: '#2c2420', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const priceRange = getEstimatedRange();
  const participantCount = batch._count?.participants || 0;
  
  // Disable leaving if within 5 mins of closing
  const msUntilClose = new Date(batch.closesAt).getTime() - Date.now();
  const canLeave = msUntilClose > 5 * 60 * 1000;

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', height: 'calc(100vh - 100px)' }}>
      {/* Left: Menu & Resto Info */}
      <div style={{ paddingRight: '1rem', overflowY: 'auto', paddingBottom: '4rem' }}>
        
        {/* Header Hero */}
        <div style={{ height: '260px', borderRadius: '16px', overflow: 'hidden', position: 'relative', marginBottom: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
          <img src={sushiImg} alt={batch.restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,16,14,0.95), rgba(20,16,14,0.1))' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2.25rem', margin: '0 0 0.75rem 0', color: '#fff', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {batch.restaurant.name}
            </h1>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', color: '#fff', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.45rem 0.85rem', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                <Users size={14} /> {participantCount} JOINED
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#c96442', padding: '0.45rem 0.85rem', borderRadius: '20px' }}>
                <Clock size={14} /> CLOSES {new Date(batch.closesAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {priceRange && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.45rem 0.85rem', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                  <Zap size={14} /> ${priceRange.min.toFixed(0)} – ${priceRange.max.toFixed(0)} per item
                </span>
              )}
            </div>
          </div>
        </div>

        {actionError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c62828', background: '#ffebee', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 500 }}>
            <AlertCircle size={16} /> {actionError}
          </div>
        )}

        {/* Menu Section — immediately visible and enabled */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.35rem', color: '#2c2420', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
              Menu Selection
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {batch.restaurant.menuItems.map((item: any) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid #f0f0f0',
                  alignItems: 'center',
                  transition: 'box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                {item.imageUrl && (
                  <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.4rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#2c2420', fontWeight: 700 }}>{item.name}</h3>
                  <p style={{ margin: '0 0 0.75rem 0', color: '#8a7d76', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {item.description || 'Premium selection.'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: '#c96442', fontWeight: 700, fontSize: '1.1rem' }}>₹{item.price}</span>
                    {item.batchPrice && item.batchPrice < item.price && (
                      <span style={{ color: '#a39b95', fontSize: '0.9rem', textDecoration: 'line-through' }}>₹{item.price}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); addToCart(item.id, 1); }}
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
        </div>
      </div>

      {/* Right: Chat & Actions */}
      <div style={{ background: '#fff', border: '1px solid rgba(44,36,32,0.06)', display: 'flex', flexDirection: 'column', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(44,36,32,0.06)', background: '#faf9f8' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#2c2420', fontWeight: 700, letterSpacing: '-0.01em' }}>Live Coordination</h3>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#8a7d76' }}>Chat with your batch cohort.</p>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#a39b95', fontSize: '0.85rem', marginTop: '2rem', fontWeight: 500 }}>
              No messages yet. Say hello! 👋
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} style={{ alignSelf: msg.isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              {!msg.isMe && <div style={{ fontSize: '0.7rem', color: '#8a7d76', marginBottom: '0.3rem', fontWeight: 500 }}>{msg.user} • {msg.time}</div>}
              <div style={{ 
                background: msg.isMe ? '#2c2420' : '#f0ede6', 
                color: msg.isMe ? '#fff' : '#2c2420', 
                padding: '0.75rem 1rem', 
                borderRadius: '12px',
                borderBottomRightRadius: msg.isMe ? '4px' : '12px',
                borderBottomLeftRadius: !msg.isMe ? '4px' : '12px',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                fontWeight: 500,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(44,36,32,0.06)', background: '#fff' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              placeholder="Message cohort..."
              style={{ flex: 1, background: '#f9f8f6', border: '1px solid rgba(44,36,32,0.08)', color: '#2c2420', padding: '0.7rem 1rem', borderRadius: '24px', outline: 'none', fontSize: '0.9rem', fontWeight: 500 }}
              disabled={!hasJoined}
              title={!hasJoined ? "You must join to chat" : ""}
            />
            <button type="submit" disabled={!hasJoined} style={{ background: hasJoined ? '#2c2420' : '#e4e1dd', color: '#fff', border: 'none', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: hasJoined ? 'pointer' : 'not-allowed', flexShrink: 0 }}>
              <Send size={16} />
            </button>
          </form>
        </div>

        <div style={{ padding: '1rem', background: '#faf9f8', borderTop: '1px solid rgba(44,36,32,0.06)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Cart Button */}
          <button 
            onClick={toggleDrawer}
            className="fade-in"
            style={{
              width: '100%',
              background: '#c96442',
              color: '#fff',
              padding: '1rem',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 6px 20px rgba(201,100,66,0.25)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <ShoppingBag size={18} /> VIEW CART {cart && cart.items.length > 0 && `(${cart.items.reduce((acc, item) => acc + item.quantity, 0)})`}
          </button>
          
          {/* Cancel/Leave if Joined */}
          {hasJoined && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
              <button 
                onClick={handleLeaveBatch}
                disabled={isLeaving || !canLeave}
                title={!canLeave ? "Too close to lock time to cancel" : ""}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: canLeave ? '#d32f2f' : '#a39b95',
                  padding: '0.75rem',
                  border: '1px solid',
                  borderColor: canLeave ? 'rgba(211,47,47,0.3)' : 'rgba(44,36,32,0.1)',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: canLeave && !isLeaving ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => canLeave && !isLeaving && (e.currentTarget.style.background = '#ffebee')}
                onMouseLeave={(e) => canLeave && !isLeaving && (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut size={16} /> {isLeaving ? 'Canceling...' : 'Cancel Order & Leave Batch'}
              </button>
              <div style={{ fontSize: '0.7rem', color: '#8a7d76', textAlign: 'center', fontWeight: 500 }}>
                {canLeave 
                  ? `Cancellation locks 5 mins before batch close` 
                  : 'Cancellation window has closed (≤ 5 mins remaining)'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
