import { useState, useEffect } from 'react';
import { apiClient } from '../api';
import { Wallet, Plus, ArrowDownRight, Coffee, CreditCard, Banknote, X } from 'lucide-react';

const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const QUICK_AMOUNTS = [10, 25, 50, 100];

export default function WalletPage() {
  const [addAmount, setAddAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWallet = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/wallet');
      setWallet(res);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount >= 5) {
      setIsProcessing(true);
      try {
        await apiClient.post('/wallet/add', { amount });
        await fetchWallet();
        setIsAdding(false);
        setAddAmount('');
      } catch (err) {
        console.error('Failed to add funds', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleQuickAdd = (amount: number) => {
    setAddAmount(String(amount));
  };

  if (isLoading) {
    return (
      <div className="fade-in" style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Skeleton balance card */}
        <div style={{ height: '240px', borderRadius: '16px', background: '#f0ede6', marginBottom: '2rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '20px', width: '140px', borderRadius: '6px', background: '#f0ede6', marginBottom: '1.5rem' }} />
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: '72px', borderRadius: '12px', background: '#f0ede6', marginBottom: '0.75rem', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in" style={{ maxWidth: '640px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: '#2c2420', marginBottom: '0.5rem' }}>Failed to load wallet</h2>
        <p style={{ color: '#8a7d76', marginBottom: '2rem' }}>Please check your connection and try again.</p>
        <button onClick={fetchWallet} style={{ background: '#2c2420', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 6rem', fontFamily: 'var(--font-primary)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#2c2420', letterSpacing: '-0.02em', margin: '0 0 0.25rem 0' }}>Wallet</h1>
        <p style={{ color: '#8a7d76', fontSize: '0.9rem', fontWeight: 500 }}>Manage your Zenvy balance</p>
      </div>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #2c2420 0%, #40352f 100%)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(44, 36, 32, 0.25)',
        color: '#fff',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(201, 100, 66, 0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(201, 100, 66, 0.08)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Wallet size={18} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)' }}>Available Balance</span>
          </div>

          <div style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '1.5rem' }}>
            {formatCurrency(wallet.walletBalance)}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500 }}>
              <CreditCard size={14} />
              <span>AutoPay Enabled</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(201,100,66,0.3)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
              <Banknote size={14} />
              <span>Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Funds Section */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: '#fff',
            border: '2px dashed rgba(44, 36, 32, 0.15)',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#2c2420',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '2.5rem',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c96442'; e.currentTarget.style.color = '#c96442'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(44,36,32,0.15)'; e.currentTarget.style.color = '#2c2420'; }}
        >
          <Plus size={18} />
          Add Funds
        </button>
      ) : (
        <div style={{
          background: '#fff',
          border: '1px solid rgba(44, 36, 32, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#2c2420', margin: 0 }}>Add Funds</h3>
            <button onClick={() => { setIsAdding(false); setAddAmount(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a7d76', padding: '0.25rem' }}>
              <X size={18} />
            </button>
          </div>

          {/* Quick amounts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
            {QUICK_AMOUNTS.map(amt => (
              <button
                key={amt}
                onClick={() => handleQuickAdd(amt)}
                style={{
                  background: addAmount === String(amt) ? '#2c2420' : '#f9f8f6',
                  color: addAmount === String(amt) ? '#fff' : '#2c2420',
                  border: addAmount === String(amt) ? '1px solid #2c2420' : '1px solid rgba(44,36,32,0.1)',
                  borderRadius: '8px',
                  padding: '0.6rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                ${amt}
              </button>
            ))}
          </div>

          <form onSubmit={handleAddFunds} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              placeholder="Custom amount (min $5)"
              min="5"
              step="0.01"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                background: '#f9f8f6',
                border: '1px solid rgba(44,36,32,0.1)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#2c2420',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(44,36,32,0.3)'}
              onBlur={e => e.target.style.borderColor = 'rgba(44,36,32,0.1)'}
            />
            <button
              type="submit"
              disabled={isProcessing || !addAmount || parseFloat(addAmount) < 5}
              style={{
                background: '#c96442',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: isProcessing ? 'wait' : 'pointer',
                opacity: isProcessing || !addAmount || parseFloat(addAmount) < 5 ? 0.5 : 1,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {isProcessing ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      )}

      {/* Transaction History */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8a7d76', margin: 0 }}>
            Recent Activity
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#a39b95', fontWeight: 500 }}>
            {wallet.transactions.length} transaction{wallet.transactions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {wallet.transactions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: '#fff',
            borderRadius: '16px',
            border: '1px dashed rgba(44,36,32,0.12)',
          }}>
            <Coffee size={32} color="#d1ceca" style={{ marginBottom: '0.75rem' }} />
            <p style={{ color: '#8a7d76', fontSize: '0.95rem', margin: 0 }}>No transactions yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {wallet.transactions.map((tx: any) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid rgba(44,36,32,0.05)',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: tx.type === 'CREDIT' ? 'rgba(201,100,66,0.1)' : '#f0ede6',
                    flexShrink: 0,
                  }}>
                    {tx.type === 'CREDIT'
                      ? <ArrowDownRight size={18} color="#c96442" />
                      : <Coffee size={18} color="#6a5d55" />
                    }
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#2c2420', marginBottom: '0.15rem' }}>
                      {tx.description || (tx.type === 'CREDIT' ? 'Added funds' : 'Order Payment')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#a39b95', fontWeight: 500 }}>
                      {formatDate(tx.createdAt)}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: tx.type === 'CREDIT' ? '#c96442' : '#2c2420',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {tx.type === 'CREDIT' ? '+' : '−'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
