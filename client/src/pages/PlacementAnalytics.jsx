import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { analyticsAPI } from '../services/api';
import { BarChart3, TrendingUp } from 'lucide-react';

const PlacementAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [analyticsData, setAnalyticsData] = useState({
    companyWise: [],
    departmentWise: [],
    yearTrends: [],
    packageDistribution: [],
    statusDistribution: [],
    monthlyStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      const [
        companyRes,
        departmentRes,
        yearRes,
        packageRes,
        statusRes,
        monthlyRes,
      ] = await Promise.all([
        analyticsAPI.getCompanyWiseAnalytics(),
        analyticsAPI.getDepartmentWiseAnalytics(),
        analyticsAPI.getYearWiseTrends(),
        analyticsAPI.getPackageDistribution(),
        analyticsAPI.getStatusDistribution(),
        analyticsAPI.getMonthlyStats(),
      ]);

      setAnalyticsData({
        companyWise: companyRes.data.data,
        departmentWise: departmentRes.data.data,
        yearTrends: yearRes.data.data,
        packageDistribution: packageRes.data.data,
        statusDistribution: statusRes.data.data,
        monthlyStats: monthlyRes.data.data,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showToast('Failed to fetch analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  const SimpleBarChart = ({ data, label, valueKey }) => {
    const maxValue = Math.max(...data.map((item) => item[valueKey]));
    return (
      <div className="space-y-4">
        {data.slice(0, 8).map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{item._id || 'N/A'}</span>
              <span className="text-sm font-semibold text-gray-900">{item[valueKey]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">📈 Placement Analytics</h1>
              <p className="text-gray-600">View detailed placement analytics and insights</p>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company-wise Placements */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Company-wise Placements</h2>
                </div>
                {analyticsData.companyWise.length > 0 ? (
                  <SimpleBarChart
                    data={analyticsData.companyWise}
                    label="Company"
                    valueKey="count"
                  />
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>

              {/* Department-wise Placements */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="text-green-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Department-wise Placements</h2>
                </div>
                {analyticsData.departmentWise.length > 0 ? (
                  <SimpleBarChart
                    data={analyticsData.departmentWise}
                    label="Department"
                    valueKey="count"
                  />
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>

              {/* Year-wise Trends */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="text-purple-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Year-wise Trends</h2>
                </div>
                {analyticsData.yearTrends.length > 0 ? (
                  <div className="space-y-4">
                    {analyticsData.yearTrends.map((item, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-gray-900">Year {item._id}</span>
                          <span className="text-gray-600">{item.count} placed</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Avg Package: ₹{(item.avgPackage || 0).toFixed(2)} LPA
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>

              {/* Placement Status Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="text-orange-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Placement Status</h2>
                </div>
                {analyticsData.statusDistribution.length > 0 ? (
                  <div className="space-y-4">
                    {analyticsData.statusDistribution.map((item, index) => {
                      const total = analyticsData.statusDistribution.reduce(
                        (sum, s) => sum + s.count,
                        0
                      );
                      const percentage = ((item.count / total) * 100).toFixed(1);
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{item._id}</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {item.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>

              {/* Monthly Statistics */}
              <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Monthly Placement Statistics</h2>
                </div>
                {analyticsData.monthlyStats.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-gray-700 font-semibold">Month-Year</th>
                          <th className="text-left py-2 text-gray-700 font-semibold">Count</th>
                          <th className="text-left py-2 text-gray-700 font-semibold">Avg Package</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.monthlyStats.slice(0, 12).map((item, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-2 text-gray-900 font-medium">
                              {item._id.month}/{item._id.year}
                            </td>
                            <td className="py-2 text-gray-700">{item.count}</td>
                            <td className="py-2 text-gray-700">
                              ₹{(item.avgPackage || 0).toFixed(2)} LPA
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💡 <strong>Note:</strong> Charts use simple bar visualizations. For advanced charting with
                Recharts or Chart.js, install the package and customize the visualizations.
              </p>
            </div>
          </div>
        </main>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default PlacementAnalytics;
