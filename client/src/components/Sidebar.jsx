import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Target,
  BarChart3,
  FileText,
  Mic2,
  Bot,
  FolderKanban,
  PlusCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Building2,
  TrendingUp,
  FileDown,
  Bell,
} from 'lucide-react';


export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isStudent = user?.role !== 'admin' && user?.role !== 'placementOfficer';
  const isPlacementRole = user?.role === 'admin' || user?.role === 'placementOfficer';
  
  const studentMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Placement Drives', path: '/drives', icon: Target },
    { name: 'My Applications', path: '/my-applications', icon: FolderKanban },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Skill Gap Analysis', path: '/skill-gap', icon: BarChart3 },
    { name: 'Resume Builder', path: '/resume', icon: FileText },
    { name: 'Mock Interview', path: '/interview', icon: Mic2 },
    { name: 'AI Chatbot', path: '/chatbot', icon: Bot },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
  ];


  const adminMenuItems = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Placement Drives', path: '/drives', icon: Target },
    { name: 'Add Drive', path: '/add-drive', icon: PlusCircle },
  ];

  const placementMenuItems = [
    { name: 'Placement Dashboard', path: '/placement-dashboard', icon: LayoutDashboard },
    { name: 'Placement Records', path: '/placement-records', icon: Users },
    { name: 'Company Management', path: '/company-management', icon: Building2 },
    { name: 'Analytics', path: '/placement-analytics', icon: TrendingUp },
    { name: 'Reports', path: '/report-generator', icon: FileDown },
  ];

  let allMenuItems = [];
  if (isStudent) {
    allMenuItems = studentMenuItems;
  } else if (isPlacementRole) {
    allMenuItems = [...adminMenuItems, ...placementMenuItems];
  } else {
    allMenuItems = adminMenuItems;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ease-saas ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 space-y-1 flex-1">
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 mb-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* Role-based Menu */}
        {allMenuItems.map((item) => {
          const isAdminItem = !isStudent && (item.path === '/admin-dashboard' || item.name === 'Add Drive');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? isAdminItem 
                    ? 'bg-emerald-50 text-emerald-700 shadow-saas border border-emerald-200'
                    : 'bg-primary-50 text-primary-700 shadow-saas'
                  : isAdminItem
                  ? 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700 border border-transparent'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.name : ''}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                  isActive(item.path) ? '' : 'group-hover:scale-110'
                }`}
              />
              {!collapsed && (
                <span className="font-medium text-sm truncate">{item.name}</span>
              )}
              {!collapsed && isActive(item.path) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full ${
                  isAdminItem ? 'bg-emerald-500' : 'bg-primary-500'
                }" />
              )}
            </Link>
          );
        })}

        {isStudent && (
          <>
            <div className="my-4 border-t border-slate-200" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Pro Features
            </p>
          </>
        )}
      </div>

      {/* Bottom Info */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200/80">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl p-3 border border-primary-100">
            <p className="text-xs font-semibold text-primary-800 mb-0.5">
              Pro Tip
            </p>
            <p className="text-[11px] text-primary-600 leading-relaxed">
              Keep your skills updated for better drive matches!
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

