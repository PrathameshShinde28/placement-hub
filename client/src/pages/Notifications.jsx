import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { notificationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowLeft,
} from 'lucide-react';

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await notificationsAPI.getNotifications();
      setItems(res.data.data || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const t = setInterval(fetchNotifications, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const markRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to mark as read');
    }
  };

  const deleteNotif = async (id) => {
    if (!confirm('Delete this notification?')) return;
    try {
      await notificationsAPI.deleteNotification(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
      setUnreadCount((c) => {
        const deletedWasUnread = items.find((n) => n._id === id)?.read === false;
        return deletedWasUnread ? Math.max(0, c - 1) : c;
      });
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to delete');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <div className="flex-1 page-container">
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-saas">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h1 className="page-title">Notifications</h1>
                <p className="text-slate-600 mt-1">You have {unreadCount} unread notifications.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
              <span className="ml-3 text-slate-600">Loading notifications...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">All caught up</h3>
              <p className="text-slate-600 mt-1">No notifications right now.</p>
            </div>
          ) : (
            <div className="card">
              <div className="divide-y divide-slate-100">
                {items.map((n) => (
                  <div key={n._id} className={`p-4 flex items-start justify-between gap-4 ${n.read ? 'bg-white' : 'bg-primary-50/30'}`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold text-slate-900 ${n.read ? 'opacity-80' : ''} truncate`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-600 text-white">UNREAD</span>
                        )}
                      </div>
                      <p className={`mt-2 text-sm ${n.read ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {!n.read && (
                        <button
                          onClick={() => markRead(n._id)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-semibold transition"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotif(n._id)}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded-lg font-semibold transition flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

