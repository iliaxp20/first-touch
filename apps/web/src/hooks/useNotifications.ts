import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type?: 'training' | 'nutrition' | 'system' | 'urgent';
  createdAt: string;
  isRead?: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/notifications`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
          localStorage.setItem('first_touch_notifications', JSON.stringify(data));
          return;
        }
      }
    } catch {}

    // Fallback to localStorage
    try {
      const cached = localStorage.getItem('first_touch_notifications');
      if (cached) {
        setNotifications(JSON.parse(cached));
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('ft_notifications_updated', handleUpdate);
    return () => {
      window.removeEventListener('ft_notifications_updated', handleUpdate);
    };
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    refetch: fetchNotifications,
  };
};
