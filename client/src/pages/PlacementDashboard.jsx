import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { analyticsAPI } from '../services/api';
import { Users, TrendingUp, Building2, BarChart3, UserCheck, DollarSign } from 'lucide-react';

const PlacementDashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboardAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setToastMessage('Failed to fetch analytics');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Placement Dashboard</h1>
              <p className="text-gray-600">Monitor placement statistics and analytics</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Students */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics?.totalStudents || 0}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="text-blue-600" size={28} />
                  </div>
                </div>
              </div>

              {/* Total Placed */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Placed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics?.totalPlacements || 0}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <UserCheck className="text-green-600" size={28} />
                  </div>
                </div>
              </div>

              {/* Placement %age */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Placement %</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics?.placementPercentage || 0}%
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="text-purple-600" size={28} />
                  </div>
                </div>
              </div>

              {/* Active Companies */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Companies</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics?.totalCompanies || 0}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Building2 className="text-orange-600" size={28} />
                  </div>
                </div>
              </div>

              {/* Highest Package */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Highest Package</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ₹{analytics?.highestPackage || 0} LPA
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <DollarSign className="text-red-600" size={28} />
                  </div>
                </div>
              </div>

              {/* Average Package */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Average Package</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ₹{(analytics?.averagePackage || 0).toFixed(2)} LPA
                    </p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <BarChart3 className="text-indigo-600" size={28} />
                  </div>
                </div>
              </div>

              {/* Lowest Package */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Lowest Package</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ₹{analytics?.lowestPackage || 0} LPA
                    </p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <DollarSign className="text-pink-600" size={28} />
                  </div>
                </div>
              </div>

              {/* Active Drives */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Drives</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics?.activeDrives || 0}
                    </p>
                  </div>
                  <div className="bg-cyan-100 p-3 rounded-lg">
                    <Building2 className="text-cyan-600" size={28} />
                  </div>
                </div>
              </div>
            </div>

            {/* Placement Type Distribution */}
            {analytics?.placementTypeStats && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Placement Type Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analytics.placementTypeStats.map((stat) => (
                    <div key={stat._id} className="text-center">
                      <p className="text-gray-600 font-medium mb-2">{stat._id}</p>
                      <p className="text-4xl font-bold text-blue-600">{stat.count}</p>
                      <p className="text-gray-500 text-sm mt-2">Students</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default PlacementDashboard;
