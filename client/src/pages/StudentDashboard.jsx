import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  TrendingUp,
  FileText,
  UserCheck,
  FolderKanban,
  BarChart3,
  ArrowUpRight,
  Zap,
  Award,
  BookOpen,
  Bot,
  User,
  Mail,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  const [stats] = useState({
    skillsAdded: user?.skills?.length || 0,
    resumeScore: 72,
    interviewsCompleted: 3,
    projectsBuilt: 2,
  });

  const readiness = Math.min(
    (stats.skillsAdded * 5 + stats.resumeScore + stats.interviewsCompleted * 5) / 2,
    100
  );

  const actions = [
    {
      title: 'Analyze Skill Gap',
      description: 'Identify missing skills for your target role',
      link: '/skill-gap',
      icon: BarChart3,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Build Resume',
      description: 'Create and optimize your resume',
      link: '/resume',
      icon: FileText,
      color: 'bg-primary-500',
      lightColor: 'bg-primary-50 text-primary-700',
    },
    {
      title: 'Mock Interview',
      description: 'Practice with AI-powered interviews',
      link: '/interview',
      icon: UserCheck,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'AI Chatbot',
      description: 'Get instant placement guidance',
      link: '/chatbot',
      icon: Bot,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50 text-orange-700',
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <div className="flex-1 page-container">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="page-title">
                Welcome back, <span className="text-primary-600">{user?.name}</span>
              </h1>
              <p className="text-slate-500 mt-1">
                Here's what's happening with your placement journey
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-saas">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700">
                {Math.round(readiness)}% Ready
              </span>
            </div>
          </div>

          {/* Placement Readiness */}
          <div className="card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-saas">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="section-title">Placement Readiness</h2>
                  <p className="text-sm text-slate-500">
                    Based on your skills, resume, and interview practice
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {Math.round(readiness)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 via-primary-600 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${readiness}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              title="Skills"
              value={stats.skillsAdded}
              subtitle="technologies"
              icon={TrendingUp}
              trend="+2 this week"
              color="from-primary-500 to-primary-600"
              lightColor="bg-primary-50"
            />
            <StatCard
              title="Resume Score"
              value={`${stats.resumeScore}`}
              subtitle="out of 100"
              icon={FileText}
              trend="Good"
              color="from-emerald-500 to-emerald-600"
              lightColor="bg-emerald-50"
            />
            <StatCard
              title="Interviews"
              value={stats.interviewsCompleted}
              subtitle="completed"
              icon={UserCheck}
              trend="Keep practicing"
              color="from-purple-500 to-purple-600"
              lightColor="bg-purple-50"
            />
            <StatCard
              title="Projects"
              value={stats.projectsBuilt}
              subtitle="built"
              icon={FolderKanban}
              trend="Showcase ready"
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
                <a
                  key={action.link}
                  href={action.link}
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
                </a>
              ))}
            </div>
          </div>

          {/* Profile Card */}
          <div className="card-hover">
            <h2 className="section-title mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-500" />
              Profile Overview
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ProfileItem
                icon={User}
                label="Name"
                value={user?.name || '—'}
              />
              <ProfileItem
                icon={Mail}
                label="Email"
                value={user?.email || '—'}
              />
              <ProfileItem
                icon={Briefcase}
                label="Target Role"
                value={user?.targetRole || '—'}
              />
              <ProfileItem
                icon={TrendingUp}
                label="Skills"
                value={
                  user?.skills?.length > 0
                    ? user.skills.join(', ')
                    : 'No skills added'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

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

function ProfileItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-saas">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
