import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SkillGap from './pages/SkillGap';
import ResumeBuilder from './pages/ResumeBuilder';
import Chatbot from './pages/Chatbot';
import MockInterview from './pages/MockInterview';
import InterviewSession from './pages/InterviewSession';
import InterviewResults from './pages/InterviewResults';
import InterviewHistory from './pages/InterviewHistory';
import Projects from './pages/Projects';
import PlacementDrives from './pages/PlacementDrives';
import DriveDetails from './pages/DriveDetails';
import AddDrive from './pages/AddDrive';
import EditDrive from './pages/EditDrive';
import ViewApplicants from './pages/ViewApplicants';

import MyApplications from './pages/MyApplications';
import Notifications from './pages/Notifications';

// Placement Management Pages
import PlacementDashboard from './pages/PlacementDashboard';
import PlacementRecords from './pages/PlacementRecords';
import CompanyManagement from './pages/CompanyManagement';
import PlacementAnalytics from './pages/PlacementAnalytics';
import ReportGenerator from './pages/ReportGenerator';


// Styles
import './index.css';

// Student Route
function StudentRoute({ children }) {

  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        <div className="hidden md:block w-64" />
        <div className="flex-1 page-container">
          <div className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 rounded-lg w-64 mb-6"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-slate-200 rounded-xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
}

// Placement/Admin Route
function PlacementRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        <div className="hidden md:block w-64" />

        <div className="flex-1 page-container">
          <div className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 rounded-lg w-64 mb-6"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-slate-200 rounded-xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow admin & placement officer
  if (
    user?.role !== 'admin' &&
    user?.role !== 'placementOfficer'
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Student Dashboard */}
            <Route
              path="/dashboard"
              element={
                <StudentRoute>
                  <StudentDashboard />
                </StudentRoute>
              }
            />

            <Route
              path="/my-applications"
              element={
                <StudentRoute>
                  <MyApplications />
                </StudentRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />


            {/* Admin Dashboard */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/skill-gap"
              element={
                <ProtectedRoute>
                  <SkillGap />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resume"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <MockInterview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interview/session"
              element={
                <ProtectedRoute>
                  <InterviewSession />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interview/results/:resultId"
              element={
                <ProtectedRoute>
                  <InterviewResults />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interview/history"
              element={
                <ProtectedRoute>
                  <InterviewHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/drives"
              element={
                <ProtectedRoute>
                  <PlacementDrives />
                </ProtectedRoute>
              }
            />

            <Route
              path="/drives/:id"
              element={
                <ProtectedRoute>
                  <DriveDetails />
                </ProtectedRoute>
              }
            />

            {/* Admin Drive Routes */}
            <Route
              path="/add-drive"
              element={
                <AdminRoute>
                  <AddDrive />
                </AdminRoute>
              }
            />

            <Route
              path="/drives/:id/edit"
              element={
                <AdminRoute>
                  <EditDrive />
                </AdminRoute>
              }
            />

            <Route
              path="/drives/:id/applicants"
              element={
                <AdminRoute>
                  <ViewApplicants />
                </AdminRoute>
              }
            />

            {/* Placement Management Routes */}

            <Route
              path="/placement-dashboard"
              element={
                <PlacementRoute>
                  <PlacementDashboard />
                </PlacementRoute>
              }
            />

            <Route
              path="/placement-records"
              element={
                <PlacementRoute>
                  <PlacementRecords />
                </PlacementRoute>
              }
            />

            <Route
              path="/company-management"
              element={
                <PlacementRoute>
                  <CompanyManagement />
                </PlacementRoute>
              }
            />

            <Route
              path="/placement-analytics"
              element={
                <PlacementRoute>
                  <PlacementAnalytics />
                </PlacementRoute>
              }
            />

            <Route
              path="/report-generator"
              element={
                <PlacementRoute>
                  <ReportGenerator />
                </PlacementRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
