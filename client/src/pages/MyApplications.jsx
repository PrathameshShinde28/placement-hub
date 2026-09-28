import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Loader2,
  Mail,
  MapPin,
  BriefcaseBusiness,
  MessageSquare,
  History,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

const STATUS_META = {
  applied: { label: 'Applied', badge: 'bg-blue-100 text-blue-800' },
  resume_shortlisted: { label: 'Resume Shortlisted', badge: 'bg-purple-100 text-purple-800' },
  aptitude_test_scheduled: { label: 'Aptitude Test Scheduled', badge: 'bg-orange-100 text-orange-800' },
  technical_interview_scheduled: { label: 'Technical Interview Scheduled', badge: 'bg-indigo-100 text-indigo-800' },
  hr_interview_scheduled: { label: 'HR Interview Scheduled', badge: 'bg-cyan-100 text-cyan-800' },
  selected: { label: 'Selected', badge: 'bg-green-100 text-green-800' },
  offered: { label: 'Offered', badge: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Rejected', badge: 'bg-red-100 text-red-800' },
};

function formatDateTime(d) {
  if (!d) return '—';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

export default function MyApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState([]);

  const refresh = async () => {
    try {
      setError('');
      setLoading(true);
      const res = await applicationsAPI.getMyApplications();
      setApplications(res.data.data || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasApps = applications.length > 0;

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="ml-3 text-slate-600">Loading your applications...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      );
    }

    if (!hasApps) {
      return (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <BriefcaseBusiness className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">No applications yet</h3>
          <p className="text-slate-600 mt-1">Apply for a placement drive to start tracking your progress.</p>
          <button
            onClick={() => navigate('/drives')}
            className="btn-primary mt-6"
          >
            Browse Drives
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {applications.map((a) => {
          const status = a.status;
          const meta = STATUS_META[status] || { label: status, badge: 'bg-slate-100 text-slate-800' };
          const interviewDate = a.interviewDate || null;
          const history = a.statusHistory || [];

          return (
            <div key={a._id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge !rounded-full px-3 py-1 text-xs">{a.driveId?.companyName || 'Company'}</span>
                    <span className={
                      `px-3 py-1 rounded-full text-xs font-semibold ${meta.badge}`
                    }>{meta.label}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-3 truncate">
                    {a.driveId?.jobTitle || 'Role'}
                  </h3>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Applied: {new Date(a.appliedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>Interview: {formatDateTime(interviewDate)}</span>
                    </div>
                  </div>

                  {a.notes && (
                    <div className="mt-3 flex items-start gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-primary-600 mt-0.5" />
                      <div className="text-slate-700">
                        <p className="font-semibold text-slate-900">Officer notes</p>
                        <p className="text-slate-600">{a.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:w-[360px]">
                  <div className="border border-slate-200 rounded-xl p-4 bg-white">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-slate-500" />
                      <p className="font-bold text-slate-900 text-sm">Timeline</p>
                    </div>

                    {history.length === 0 ? (
                      <p className="text-sm text-slate-600 mt-2">No timeline entries yet.</p>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {[...history]
                          .slice()
                          .reverse()
                          .map((h, idx) => {
                            const hMeta = STATUS_META[h.status] || { label: h.status, badge: 'bg-slate-100 text-slate-800' };
                            return (
                              <div key={`${a._id}-${idx}`} className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className={`text-xs font-semibold px-2 py-0.5 rounded-full ${hMeta.badge} inline-block`}>
                                    {hMeta.label}
                                  </p>
                                  {h.interviewDate && (
                                    <p className="text-xs text-slate-600 mt-1">{formatDateTime(h.interviewDate)}</p>
                                  )}
                                  {h.notes && (
                                    <p className="text-xs text-slate-600 mt-1">{h.notes}</p>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 whitespace-nowrap">
                                  {h.updatedAt ? new Date(h.updatedAt).toLocaleString() : ''}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [error, hasApps, loading, applications, user, navigate]);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <div className="flex-1 page-container">
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="mb-6">
            <h1 className="page-title">My Applications</h1>
            <p className="text-slate-600 mt-1">Track status, interview schedule, and officer notes for every drive.</p>
          </div>

          {content}
        </div>
      </div>
    </div>
  );
}

