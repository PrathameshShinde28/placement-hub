import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  FilePlus,
  Users,
  Target,
  Calendar,
  ArrowUpRight,
  Zap,
  Award,
  Users2,
  Package,
  BarChart3,
  Activity,
  Briefcase,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { drivesAPI } from '../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDrives: 0,
    totalApplications: 0,
    activeDrives: 0,
  });
  const [recentDrives, setRecentDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      // Mock data - replace with real API calls
      setStats({
        totalDrives: 12,
        totalApplications: 156,
        activeDrives: 5,
      });
      setRecentDrives([
        { id: 1, title: 'Frontend Developer - TCS', applications: 23, status: 'Active' },
        { id: 2, title: 'Backend Engineer - Infosys', applications: 18, status: 'Active' },
        { id: 3, title: 'Fullstack Developer - Wipro', applications: 34, status: 'Closed' },
      ]);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      title: 'Add New Drive',
      description: 'Create placement drive for companies',
      link: '/add-drive',
      icon: FilePlus,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Manage Drives',
      description: 'View, edit and track all drives',
      link: '/drives',
      icon: Package,
      color: 'bg-primary-500',
      lightColor: 'bg-primary-50 text-primary-700',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        <Sidebar />
        <div className="flex-1 page-container">
          <div className="max-w-6xl mx-auto space-y-6 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded-lg mb-6 w-64"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <div className="flex-1 page-container">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="page-title">
                Admin Dashboard, <span className="text-primary-600">{user?.name}</span>
              </h1>
              <p className="text-slate-500 mt-1">
                Manage placement drives and track applications
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200 shadow-saas">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700">
                {stats.activeDrives} Active Drives
              </span>
            </div>
          </div>

          {/* Admin Overview */}
          <div className="card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-saas">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="section-title">Admin Overview</h2>
                  <p className="text-sm text-slate-500">
                    Key metrics for placement drives management
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              title="Total Drives"
              value={stats.totalDrives}
              subtitle="created"
              icon={Target}
              trend="+3 this week"
              color="from-primary-500 to-primary-600"
              lightColor="bg-primary-50"
            />
            <StatCard
              title="Total Applications"
              value={stats.totalApplications.toLocaleString()}
              subtitle="received"
              icon={Users2}
              trend="+45 this week"
              color="from-emerald-500 to-emerald-600"
              lightColor="bg-emerald-50"
            />
            <StatCard
              title="Active Drives"
              value={stats.activeDrives}
              subtitle="running"
              icon={Clock}
              trend="2 ending soon"
              color="from-orange-500 to-orange-600"
              lightColor="bg-orange-50"
            />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="section-title mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actions.map((action) => (
                <Link
                  key={action.link}
                  to={action.link}
                  className="group card-hover flex items-start gap-4 p-5"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${action.lightColor} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
                  >
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {action.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Drives Table */}
          <div className="card-hover">
            <h2 className="section-title mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              Recent Drives
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Drive Title</th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-700 text-sm hidden lg:table-cell">Applications</th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDrives.map((drive) => (
                    <tr key={drive.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900 max-w-md truncate">
                        {drive.title}
                      </td>
                      <td className="py-4 px-6 text-center text-sm font-medium text-slate-600 hidden lg:table-cell">
                        {drive.applications}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          drive.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {drive.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Link
                to="/drives"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1"
              >
                View All Drives <TrendingUp className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, trend, color, lightColor }) {
  return (
    <div className="card-hover group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${lightColor} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="badge-green text-[10px]">{trend}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <p className="text-sm font-medium text-slate-600 mt-1">{title}</p>
    </div>
  );
}
