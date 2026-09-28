import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { companiesAPI } from '../services/api';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';

const CompanyManagement = () => {
  const { user } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'Product',
    website: '',
    industry: '',
    headCount: '',
    location: '',
    ctc: '',
    jobProfiles: '',
    requiredSkills: '',
    notes: '',
    contactPerson: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    fetchCompanies();
  }, [page, searchTerm]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companiesAPI.getAllCompanies({
        page,
        limit: 10,
        search: searchTerm,
      });
      setCompanies(response.data.data);
      setTotal(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching companies:', error);
      showToast('Failed to fetch companies', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const field = name.replace('contact.', '');
      setFormData((prev) => ({
        ...prev,
        contactPerson: { ...prev.contactPerson, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        jobProfiles: formData.jobProfiles.split(',').map((p) => p.trim()),
        requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()),
        headCount: parseInt(formData.headCount) || 0,
        ctc: parseInt(formData.ctc) || 0,
      };

      if (editingId) {
        await companiesAPI.updateCompany(editingId, payload);
        showToast('Company updated successfully', 'success');
      } else {
        await companiesAPI.createCompany(payload);
        showToast('Company created successfully', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchCompanies();
    } catch (error) {
      console.error('Error:', error);
      showToast(error.response?.data?.message || 'Failed to save company', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    setEditingId(company._id);
    setFormData({
      name: company.name,
      type: company.type,
      website: company.website || '',
      industry: company.industry || '',
      headCount: company.headCount || '',
      location: company.location || '',
      ctc: company.ctc || '',
      jobProfiles: company.jobProfiles?.join(', ') || '',
      requiredSkills: company.requiredSkills?.join(', ') || '',
      notes: company.notes || '',
      contactPerson: company.contactPerson || { name: '', email: '', phone: '' },
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        setLoading(true);
        await companiesAPI.deleteCompany(id);
        showToast('Company deleted successfully', 'success');
        fetchCompanies();
      } catch (error) {
        console.error('Error:', error);
        showToast('Failed to delete company', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Product',
      website: '',
      industry: '',
      headCount: '',
      location: '',
      ctc: '',
      jobProfiles: '',
      requiredSkills: '',
      notes: '',
      contactPerson: { name: '', email: '', phone: '' },
    });
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
                <h1 className="text-4xl font-bold text-gray-900 mb-2">🏢 Company Management</h1>
                <p className="text-gray-600">Manage recruitment companies and drives</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                  resetForm();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <Plus size={20} /> Add Company
              </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingId ? '✏️ Edit Company' : '➕ New Company'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Company Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Company Type *</label>
                    <select
                      name="type"
                      value={formData.type}
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

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">CTC (LPA)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="ctc"
                      value={formData.ctc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Job Profiles (comma-separated)</label>
                    <input
                      type="text"
                      name="jobProfiles"
                      value={formData.jobProfiles}
                      onChange={handleInputChange}
                      placeholder="e.g., Software Engineer, DevOps"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Required Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="requiredSkills"
                      value={formData.requiredSkills}
                      onChange={handleInputChange}
                      placeholder="e.g., JavaScript, React, Node.js"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Contact Name</label>
                    <input
                      type="text"
                      name="contact.name"
                      value={formData.contactPerson.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Contact Email</label>
                    <input
                      type="email"
                      name="contact.email"
                      value={formData.contactPerson.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      name="contact.phone"
                      value={formData.contactPerson.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition"
                    >
                      {loading ? 'Saving...' : editingId ? 'Update Company' : 'Create Company'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <input
                type="text"
                placeholder="Search companies by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Companies Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Company</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Type</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">CTC</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Location</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Contact</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <Building2 className="text-gray-400" size={20} />
                            <div>
                              <p className="font-semibold text-gray-900">{company.name}</p>
                              <p className="text-sm text-gray-600">{company.industry}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            {company.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-semibold text-gray-900">₹{company.ctc} LPA</td>
                        <td className="px-6 py-3 text-gray-700">{company.location}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{company.contactPerson?.name || 'N/A'}</td>
                        <td className="px-6 py-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(company)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(company._id)}
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

              {companies.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No companies found</p>
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

export default CompanyManagement;
