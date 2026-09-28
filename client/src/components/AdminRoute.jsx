import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { SkeletonPage } from './Skeleton';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        <div className="hidden md:block w-64" />
        <div className="flex-1 page-container">
          <SkeletonPage />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50 p-4">
        <div className="card-elevated text-center max-w-md w-full animate-fade-in">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Access Denied
          </h1>
          <p className="text-slate-600 mb-8">
            Only administrators can access this page. Contact your admin if you believe this is a mistake.
          </p>
          <a
            href="/dashboard"
            className="btn-primary inline-flex"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}

