import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../services/api';

export default function NotificationBell() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [latest, setLatest] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasUser = !!user?.id || !!user?._id;

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const res = await notificationsAPI.getNotifications();
      setUnreadCount(res.data.unreadCount || 0);
      setLatest((res.data.data || []).slice(0, 5));
    } catch (e) {
      // silent: navbar should never break the app
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasUser) return;
    fetchLatest();
    const t = setInterval(fetchLatest, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUser]);

  const bellButton = useMemo(() => {
    return (
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white rounded-full text-[10px] px-1.5 py-0.5 font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    );
  }, [unreadCount]);

  return (
    <div className="relative">
      {bellButton}

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="font-bold text-slate-900">Notifications</p>
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-sm text-primary-700 hover:text-primary-800 font-semibold"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="p-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            </div>
          ) : latest.length === 0 ? (
            <div className="p-4">
              <p className="text-sm text-slate-600">No notifications yet.</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-auto">
              {latest.map((n) => (
                <Link
                  key={n._id}
                  to="#"
                  className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-50"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {n.title}
                      </p>
                      <p className={`text-sm mt-1 truncate ${n.read ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                        {n.message}
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-400 whitespace-nowrap">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

