import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { reportsAPI } from '../services/api';
import { Download, Printer, FileText } from 'lucide-react';

const ReportGenerator = () => {
  const { user } = useContext(AuthContext);
  const [reportType, setReportType] = useState('company-wise');
  const [filters, setFilters] = useState({
    company: '',
    department: '',
    year: new Date().getFullYear(),
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const generateReport = async () => {
    try {
      setLoading(true);

      let response;
      switch (reportType) {
        case 'company-wise':
          response = await reportsAPI.generateCompanyWiseReport({ company: filters.company });
          break;
        case 'department-wise':
          response = await reportsAPI.generateDepartmentWiseReport({ department: filters.department });
          break;
        case 'year-wise':
          response = await reportsAPI.generateYearWiseReport({ year: parseInt(filters.year) });
          break;
        case 'salary-stats':
          response = await reportsAPI.generateSalaryStatsReport();
          break;
        case 'student-list':
          response = await reportsAPI.generateStudentListReport({
            department: filters.department,
            year: parseInt(filters.year),
          });
          break;
        default:
          throw new Error('Invalid report type');
      }

      setReportData(response.data.data);
      showToast('Report generated successfully', 'success');
    } catch (error) {
      console.error('Error generating report:', error);
      showToast(error.response?.data?.message || 'Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!reportData) return;

    const element = document.getElementById('report-print');
    const html = element.innerHTML;
    const cssContent = Array.from(document.styleSheets)
      .filter((sheet) => !sheet.href || !sheet.href.includes('extension://'))
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules).map((rule) => rule.cssText).join(' ');
        } catch (e) {
          return '';
        }
      })
      .join(' ');

    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(
      `<html><head><style>${cssContent}</style></head><body>${html}</body></html>`
    );
    printWindow.document.close();
    printWindow.print();
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Report Generator</h1>
              <p className="text-gray-600">Generate and download placement reports</p>
            </div>

            {/* Report Generator Panel */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Report</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Report Type */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Report Type *</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="company-wise">Company-wise Report</option>
                    <option value="department-wise">Department-wise Report</option>
                    <option value="year-wise">Year-wise Report</option>
                    <option value="salary-stats">Salary Statistics</option>
                    <option value="student-list">Student Placement List</option>
                  </select>
                </div>

                {/* Filter Fields - shown based on report type */}
                {reportType === 'company-wise' && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
                    <input
                      type="text"
                      value={filters.company}
                      onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                      placeholder="Enter company name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                )}

                {(reportType === 'department-wise' || reportType === 'student-list') && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Department</label>
                    <select
                      value={filters.department}
                      onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="">All Departments</option>
                      <option>CSE</option>
                      <option>ECE</option>
                      <option>IT</option>
                      <option>CIVIL</option>
                      <option>MECH</option>
                      <option>EEE</option>
                    </select>
                  </div>
                )}

                {(reportType === 'year-wise' || reportType === 'student-list') && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Year</label>
                    <input
                      type="number"
                      value={filters.year}
                      onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={generateReport}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2 transition"
              >
                <FileText size={20} /> {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>

            {/* Report Display */}
            {reportData && (
              <div>
                {/* Download & Print Buttons */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={downloadPDF}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                  >
                    <Download size={18} /> Download PDF
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                  >
                    <Printer size={18} /> Print
                  </button>
                </div>

                {/* Report Content */}
                <div
                  id="report-print"
                  className="bg-white rounded-lg shadow-md p-8 print:shadow-none print:border"
                >
                  {/* Report Header */}
                  <div className="border-b-2 border-gray-300 pb-6 mb-6">
                    <div className="text-center mb-4">
                      <h1 className="text-3xl font-bold text-gray-900">
                        KKW College Placement Report
                      </h1>
                      <p className="text-gray-600 mt-2">{reportData.report.title}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-4">
                      <span>Generated Date: {new Date().toLocaleDateString()}</span>
                      <span>Generated Time: {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {/* Statistics Summary */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-gray-600 text-sm">Total Records</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {reportData.report.statistics?.totalRecords || 0}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-gray-600 text-sm">Average Package</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{(reportData.report.statistics?.averagePackage || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p className="text-gray-600 text-sm">Highest Package</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ₹{reportData.report.statistics?.highestPackage || 0}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-gray-600 text-sm">Placement Rate</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {reportData.report.statistics?.placementRate || 0}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Placement Details Table */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Placement Details</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100 border-b">
                            <th className="px-4 py-2 text-left font-semibold text-gray-900">Student</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-900">Company</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-900">Role</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-900">Package</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.placements?.slice(0, 20).map((placement, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-2 text-gray-700">{placement.studentName}</td>
                              <td className="px-4 py-2 text-gray-700">{placement.companyName}</td>
                              <td className="px-4 py-2 text-gray-700">{placement.jobRole}</td>
                              <td className="px-4 py-2 font-semibold text-gray-900">
                                ₹{placement.package} LPA
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {reportData.placements?.length > 20 && (
                      <p className="text-gray-600 text-sm mt-2">
                        ... and {reportData.placements.length - 20} more records
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t-2 border-gray-300 pt-6 mt-8">
                    <p className="text-gray-600 text-sm text-center">
                      This is an automatically generated report from KKW College Placement Management System
                    </p>
                  </div>
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

export default ReportGenerator;
