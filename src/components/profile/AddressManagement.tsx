import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { apiClient } from '../../api';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ label: '', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Address[]>('/addresses');
      setAddresses(data || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/addresses', formData);
      setShowForm(false);
      setFormData({ label: '', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false });
      fetchAddresses();
    } catch (err) {
      console.error('Failed to create address:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      await apiClient.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const setDefault = async (id: string, currentIsDefault: boolean) => {
    if (currentIsDefault) return;
    try {
      await apiClient.patch(`/addresses/${id}`, { isDefault: true });
      fetchAddresses();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading && addresses.length === 0) {
    return <div style={{ color: '#8a7d76', fontSize: '0.9rem' }}>Loading addresses...</div>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, margin: 0, color: '#2c2420' }}>My Addresses</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#2c2420', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Add New</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#f9f8f6', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(44,36,32,0.1)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#6a5d55', marginBottom: '0.3rem' }}>Label (e.g., Home, Work)</label>
            <input required type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(44,36,32,0.1)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#6a5d55', marginBottom: '0.3rem' }}>Street Address</label>
            <input required type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(44,36,32,0.1)' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#6a5d55', marginBottom: '0.3rem' }}>City</label>
              <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(44,36,32,0.1)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#6a5d55', marginBottom: '0.3rem' }}>State</label>
              <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(44,36,32,0.1)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#6a5d55', marginBottom: '0.3rem' }}>Zip</label>
              <input required type="text" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(44,36,32,0.1)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input type="checkbox" id="defaultAddr" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
            <label htmlFor="defaultAddr" style={{ fontSize: '0.85rem', color: '#2c2420', fontWeight: 500 }}>Set as default address</label>
          </div>
          <button type="submit" style={{ background: '#2c2420', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>Save Address</button>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: '#fff', border: '1px dashed rgba(44,36,32,0.2)', borderRadius: '12px' }}>
          <MapPin size={24} color="#d1ceca" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#8a7d76', fontSize: '0.9rem', margin: 0 }}>No addresses saved yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {addresses.map(addr => (
            <div key={addr.id} style={{ border: addr.isDefault ? '2px solid #c96442' : '1px solid rgba(44,36,32,0.1)', background: '#fff', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: '#2c2420', fontSize: '1rem', fontWeight: 700 }}>{addr.label}</h4>
                  {addr.isDefault && <span style={{ background: '#fff5f2', color: '#c96442', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>DEFAULT</span>}
                </div>
                <div style={{ color: '#6a5d55', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {addr.street}<br/>
                  {addr.city}, {addr.state} {addr.zipCode}<br/>
                  {addr.country}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr.id, addr.isDefault)} title="Set Default" style={{ background: 'transparent', border: 'none', color: '#6a5d55', cursor: 'pointer' }}><Check size={18} /></button>
                )}
                <button onClick={() => handleDelete(addr.id)} title="Delete" style={{ background: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer' }}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
