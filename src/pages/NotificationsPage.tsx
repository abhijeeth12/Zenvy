import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Clock, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { apiClient } from '../api';

interface Notification {
  id: string;
  type: 'BATCH_CLOSING' | 'ORDER_CONFIRMED' | 'NEW_MESSAGE' | 'BATCH_JOINED';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await apiClient.get('/notifications');
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(nots => nots.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllRead = async () => {
    setMarkingAllRead(true);
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications(nots => nots.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER_CONFIRMED': return <CheckCircle size={20} color="#4caf50" />;
      case 'BATCH_CLOSING': return <Clock size={20} color="#ff9800" />;
      case 'NEW_MESSAGE': return <MessageCircle size={20} color="#2196f3" />;
      case 'BATCH_JOINED': return <Users size={20} color="#9c27b0" />;
      default: return <Bell size={20} color="#757575" />;
    }
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#2c2420' }}>
            Notifications
          </h1>
          <div style={{ color: '#8a7d76', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'You&apos;re all caught up'}
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAllRead}
            style={{
              background: '#2c2420',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: markingAllRead ? 0.7 : 1
            }}
          >
            {markingAllRead ? 'Marking...' : 'Mark all read'}
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#8a7d76' }}>
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#8a7d76' }}>
          <Bell size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <p>No notifications yet. You&apos;ll see updates here for new messages, batch changes, and order confirmations.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid rgba(44,36,32,0.04)',
                cursor: notification.isRead ? 'default' : 'pointer',
                background: notification.isRead ? '#f9f8f6' : '#fff',
                transition: 'background 0.2s',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
              onMouseEnter={(e) => !notification.isRead && (e.currentTarget.style.background = '#f0ede6')}
              onMouseLeave={(e) => !notification.isRead && (e.currentTarget.style.background = '#fff')}
            >
              <div style={{ flexShrink: 0, marginTop: '0.2rem' }}>
                {getIcon(notification.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2c2420', margin: 0 }}>
                    {notification.title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#8a7d76', fontWeight: 500 }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.95rem', color: '#6a5d55', lineHeight: 1.5, margin: 0 }}>
                  {notification.body}
                </p>
              </div>
              {!notification.isRead && (
                <div style={{ width: '8px', height: '8px', background: '#c96442', borderRadius: '50%', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
