import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { drivesAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function EditDrive() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    requiredSkills: '',
    salary: '',
    location: '',
    jobType: 'full-time',
    companyWebsite: '',
    deadline: '',
    cgpa: '',
    branch: '',
    passoutYear: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch drive data on mount
  useEffect(() => {
    fetchDrive();
  }, [id]);

  const fetchDrive = async () => {
    try {
      setLoading(true);
      const response = await drivesAPI.getDriveById(id);
      const drive = response.data.data;

      // Format deadline to datetime-local format
      const deadlineDate = new Date(drive.deadline);
      const formattedDeadline = deadlineDate.toISOString().slice(0, 16);

      setFormData({
        companyName: drive.companyName || '',
        jobTitle: drive.jobTitle || '',
        jobDescription: drive.jobDescription || '',
        requiredSkills: drive.requiredSkills.join(', ') || '',
        salary: drive.salary || '',
        location: drive.location || '',
        jobType: drive.jobType || 'full-time',
        companyWebsite: drive.companyWebsite || '',
        deadline: formattedDeadline,
        cgpa: drive.eligibility?.cgpa ? drive.eligibility.cgpa.toString() : '',
        branch: drive.eligibility?.branch ? drive.eligibility.branch.join(', ') : '',
        passoutYear: drive.eligibility?.passoutYear ? drive.eligibility.passoutYear.join(', ') : '',
      });
    } catch (err) {
      console.error('Error fetching drive:', err);
      showToast('Failed to load drive details', 'error');
      setTimeout(() => navigate('/drives'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    }
    if (!formData.requiredSkills.trim()) {
      newErrors.requiredSkills = 'Required skills are required';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors above', 'error');
      return;
    }

    try {
      setSubmitting(true);

      // Convert skills string to array
      const requiredSkills = formData.requiredSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      // Build eligibility object
      const eligibility = {};
      if (formData.cgpa) eligibility.cgpa = parseFloat(formData.cgpa);
      if (formData.branch) {
        eligibility.branch = formData.branch
          .split(',')
          .map((b) => b.trim())
          .filter((b) => b);
      }
      if (formData.passoutYear) {
        eligibility.passoutYear = formData.passoutYear
          .split(',')
          .map((y) => parseInt(y.trim()))
          .filter((y) => !isNaN(y));
      }

      const payload = {
        companyName: formData.companyName.trim(),
        jobTitle: formData.jobTitle.trim(),
        jobDescription: formData.jobDescription.trim(),
        requiredSkills,
        salary: formData.salary.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        companyWebsite: formData.companyWebsite.trim(),
        deadline: new Date(formData.deadline).toISOString(),
        eligibility: Object.keys(eligibility).length > 0 ? eligibility : {},
      };

      await drivesAPI.updateDrive(id, payload);

      showToast('✅ Placement drive updated successfully!', 'success');

      // Redirect to drives page after 1.5 seconds
      setTimeout(() => {
        navigate('/drives');
      }, 1500);
    } catch (err) {
      console.error('Error updating drive:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update drive';
      showToast(`❌ ${errorMessage}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-semibold">Loading drive details...</p>
          </div>
        </div>
      </div>
    );
  }

  const requiredFieldsCount = {
    companyName: 1,
    jobTitle: 2,
    jobDescription: 3,
    requiredSkills: 4,
    deadline: 5,
  };

  const filledRequired = Object.keys(requiredFieldsCount).filter(
    (field) => formData[field].trim()
  ).length;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {toast && <Toast message={toast.message} type={toast.type} />}

          {/* Header with Back Button */}
          <div className="mb-8 flex items-center gap-3">
            <button
              onClick={() => navigate('/drives')}
              className="p-2 hover:bg-blue-100 rounded-lg transition"
              title="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">✏️ Edit Placement Drive</h1>
              <p className="text-gray-600">Update job opportunity details</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
            {/* Company Details Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b-2 border-blue-500">
                📋 Company Details
              </h2>

              {/* Company Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g., Google, Microsoft, Amazon"
                  className={`input-field ${errors.companyName ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.companyName && (
                  <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>
                )}
              </div>

              {/* Company Website */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="input-field"
                />
              </div>
            </div>

            {/* Job Details Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b-2 border-green-500">
                💼 Job Details
              </h2>

              {/* Job Title */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer, Data Scientist"
                  className={`input-field ${errors.jobTitle ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.jobTitle && (
                  <p className="text-red-600 text-sm mt-1">{errors.jobTitle}</p>
                )}
              </div>

              {/* Job Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  placeholder="Describe the job role, responsibilities, and what you're looking for..."
                  rows="5"
                  className={`input-field ${errors.jobDescription ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.jobDescription && (
                  <p className="text-red-600 text-sm mt-1">{errors.jobDescription}</p>
                )}
              </div>

              {/* Job Type */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="full-time">Full-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>

              {/* Salary & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary (optional)
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g., 10-15 LPA"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Bangalore, Mumbai"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b-2 border-purple-500">
                ⚡ Required Skills
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Skills *
                </label>
                <textarea
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  placeholder="Enter skills separated by commas. e.g., React, Node.js, MongoDB, System Design"
                  rows="3"
                  className={`input-field ${errors.requiredSkills ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.requiredSkills && (
                  <p className="text-red-600 text-sm mt-1">{errors.requiredSkills}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  💡 Tip: Separate multiple skills with commas
                </p>
                {formData.requiredSkills && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.requiredSkills
                      .split(',')
                      .map((skill) => skill.trim())
                      .filter((skill) => skill)
                      .map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Eligibility Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b-2 border-orange-500">
                📊 Eligibility Criteria (Optional)
              </h2>

              <p className="text-gray-600 text-sm mb-4">
                Set minimum criteria students must meet to apply
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum CGPA
                  </label>
                  <input
                    type="number"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    placeholder="e.g., 7.0"
                    step="0.1"
                    min="0"
                    max="10"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Eligible Branches
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g., CSE, IT, ECE"
                    className="input-field"
                  />
                  <p className="text-gray-500 text-xs mt-1">Separate with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Eligible Passout Years
                  </label>
                  <input
                    type="text"
                    name="passoutYear"
                    value={formData.passoutYear}
                    onChange={handleChange}
                    placeholder="e.g., 2024, 2025"
                    className="input-field"
                  />
                  <p className="text-gray-500 text-xs mt-1">Separate with commas</p>
                </div>
              </div>
            </div>

            {/* Deadline Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b-2 border-red-500">
                ⏰ Application Deadline
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`input-field ${errors.deadline ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.deadline && (
                  <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>
                )}
              </div>
            </div>

            {/* Form Status */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Form Completion</h3>
                <span className="text-xl font-bold text-blue-600">
                  {filledRequired}/{Object.keys(requiredFieldsCount).length}
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(filledRequired / Object.keys(requiredFieldsCount).length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting || filledRequired < Object.keys(requiredFieldsCount).length}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg text-white px-6 py-3 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? '⏳ Updating Drive...' : '✅ Update Placement Drive'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/drives')}
                className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-bold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
