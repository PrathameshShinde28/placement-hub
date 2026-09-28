import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { placementsAPI } from '../services/api';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const PlacementRecords = () => {
  const { user } = useContext(AuthContext);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    company: '',
  });

  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    department: 'CSE',
    passingYear: 2024,
    companyName: '',
    companyType: 'Product',
    jobRole: '',
    package: '',
    placementType: 'Full-Time',
    placementDate: '',
    jobLocation: '',
    workMode: 'OnSite',
    selectionRoundsCleared: [],
    placementStatus: 'Applied',
    notes: '',
  });

  useEffect(() => {
    fetchPlacements();
  }, [page, searchTerm, filters]);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchTerm,
        department: filters.department,
        status: filters.placementStatus,
        company: filters.company,
      };
      const response = await placementsAPI.getAllPlacements(params);
      setPlacements(response.data.data);
      setTotal(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching placements:', error);
      showToast('Failed to fetch placement records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await placementsAPI.updatePlacement(editingId, formData);
        showToast('Placement record updated successfully', 'success');
      } else {
        await placementsAPI.createPlacement(formData);
        showToast('Placement record created successfully', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        studentName: '',
        studentEmail: '',
        department: 'CSE',
        passingYear: 2024,
        companyName: '',
        companyType: 'Product',
        jobRole: '',
        package: '',
        placementType: 'Full-Time',
        placementDate: '',
        jobLocation: '',
        workMode: 'OnSite',
        selectionRoundsCleared: [],
        placementStatus: 'Applied',
        notes: '',
      });
      fetchPlacements();
    } catch (error) {
      console.error('Error:', error);
      showToast(error.response?.data?.message || 'Failed to save placement record', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (placement) => {
    setEditingId(placement._id);
    setFormData({
      studentName: placement.studentName,
      studentEmail: placement.studentEmail,
      department: placement.department,
      passingYear: placement.passingYear,
      companyName: placement.companyName,
      companyType: placement.companyType,
      jobRole: placement.jobRole,
      package: placement.package,
      placementType: placement.placementType,
      placementDate: placement.placementDate?.split('T')[0] || '',
      jobLocation: placement.jobLocation,
      workMode: placement.workMode,
      selectionRoundsCleared: placement.selectionRoundsCleared,
      placementStatus: placement.placementStatus,
      notes: placement.notes,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        setLoading(true);
        await placementsAPI.deletePlacement(id);
        showToast('Placement record deleted successfully', 'success');
        fetchPlacements();
      } catch (error) {
        console.error('Error:', error);
        showToast('Failed to delete placement record', 'error');
      } finally {
        setLoading(false);
      }
    }
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Placement Records</h1>
                <p className="text-gray-600">Manage student placement records</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <Plus size={20} /> Add Placement Record
              </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingId ? '✏️ Edit Placement Record' : '➕ New Placement Record'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Student Name *</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="Enter student name"
                    />
                  </div>

                  {/* Student Email */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="studentEmail"
                      value={formData.studentEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="Enter email"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Department *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option>CSE</option>
                      <option>ECE</option>
                      <option>IT</option>
                      <option>CIVIL</option>
                      <option>MECH</option>
                      <option>EEE</option>
                    </select>
                  </div>

                  {/* Passing Year */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Passing Year *</label>
                    <input
                      type="number"
                      name="passingYear"
                      value={formData.passingYear}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Company Type */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Company Type *</label>
                    <select
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option>Product</option>
                      <option>Service</option>
                      <option>Startup</option>
                      <option>MNC</option>
                      <option>Government</option>
                    </select>
                  </div>

                  {/* Job Role */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Job Role *</label>
                    <input
                      type="text"
                      name="jobRole"
                      value={formData.jobRole}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="Enter job role"
                    />
                  </div>

                  {/* Package */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Package (LPA) *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="package"
                      value={formData.package}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="Enter package"
                    />
                  </div>

                  {/* Placement Type */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Placement Type *</label>
                    <select
                      name="placementType"
                      value={formData.placementType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option>Internship</option>
                      <option>Full-Time</option>
                      <option>PPO</option>
                    </select>
                  </div>

                  {/* Placement Date */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Placement Date *</label>
                    <input
                      type="date"
                      name="placementDate"
                      value={formData.placementDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Job Location */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Job Location *</label>
                    <input
                      type="text"
                      name="jobLocation"
                      value={formData.jobLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="Enter job location"
                    />
                  </div>

                  {/* Work Mode */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Work Mode *</label>
                    <select
                      name="workMode"
                      value={formData.workMode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option>OnSite</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                    </select>
                  </div>

                  {/* Placement Status */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Placement Status *</label>
                    <select
                      name="placementStatus"
                      value={formData.placementStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option>Applied</option>
                      <option>Shortlisted</option>
                      <option>Interview Scheduled</option>
                      <option>Selected</option>
                      <option>Rejected</option>
                      <option>Offer Accepted</option>
                      <option>Joined</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="Enter any additional notes"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="md:col-span-2 flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition"
                    >
                      {loading ? 'Saving...' : editingId ? 'Update Record' : 'Create Record'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">🔍 Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, company, role..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => {
                      setFilters({ ...filters, department: e.target.value });
                      setPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="">All Departments</option>
                    <option>CSE</option>
                    <option>ECE</option>
                    <option>IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Status</label>
                  <select
                    value={filters.placementStatus}
                    onChange={(e) => {
                      setFilters({ ...filters, placementStatus: e.target.value });
                      setPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="">All Statuses</option>
                    <option>Selected</option>
                    <option>Rejected</option>
                    <option>Applied</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Company</label>
                  <input
                    type="text"
                    placeholder="Filter by company..."
                    value={filters.company}
                    onChange={(e) => {
                      setFilters({ ...filters, company: e.target.value });
                      setPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Records Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Student</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Company</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Role</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Package</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placements.map((placement) => (
                      <tr key={placement._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div>
                            <p className="font-semibold text-gray-900">{placement.studentName}</p>
                            <p className="text-sm text-gray-600">{placement.studentEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-gray-700">{placement.companyName}</td>
                        <td className="px-6 py-3 text-gray-700">{placement.jobRole}</td>
                        <td className="px-6 py-3 font-semibold text-gray-900">₹{placement.package} LPA</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              placement.placementStatus === 'Selected'
                                ? 'bg-green-100 text-green-800'
                                : placement.placementStatus === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {placement.placementStatus}
                          </span>
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(placement)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(placement._id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {placements.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No placement records found</p>
                </div>
              )}

              {/* Pagination */}
              {total > 10 && (
                <div className="flex justify-between items-center px-6 py-4 border-t">
                  <p className="text-gray-600 text-sm">
                    Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page * 10 >= total}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
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

export default PlacementRecords;
