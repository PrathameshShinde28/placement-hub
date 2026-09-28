import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { drivesAPI } from '../services/api';
import Sidebar from '../components/Sidebar';


export default function AddDrive() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    } else {
      // Create a date at start of day for comparison
      const deadlineDate = new Date(formData.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline must be today or in the future';
      }
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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('🔥 BUTTON CLICKED - handleSubmit called');

  // VALIDATE FORM
  if (!validateForm()) {
    console.log('❌ Validation failed');
    return;
  }

  try {
    setLoading(true);

    console.log('🚀 Starting API call...');

    // Convert skills string to array
    const requiredSkills = formData.requiredSkills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill);

    // Build eligibility object
    const eligibility = {};

    if (formData.cgpa) {
      eligibility.cgpa = parseFloat(formData.cgpa);
    }

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

      // IMPORTANT FIX
      companyWebsite: formData.companyWebsite
        ? formData.companyWebsite.trim()
        : '',

      deadline: formData.deadline
        ? new Date(formData.deadline + 'T23:59:59').toISOString()
        : null,

      eligibility,
    };

    console.log('📦 Payload ready:', payload);

    // API CALL
    const response = await drivesAPI.createDrive(payload);

    console.log('✅ SUCCESS RESPONSE:', response);

    alert('✅ Placement Drive Created Successfully');

    navigate('/drives');

  } catch (err) {
    console.error('❌ FULL ERROR:', err);

    console.error('❌ RESPONSE:', err.response);

    alert(
      err?.response?.data?.message ||
      err.message ||
      'Failed to create drive'
    );
  } finally {
    setLoading(false);
  }
};

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


          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">➕ Create Placement Drive</h1>
            <p className="text-gray-600">Post a new job opportunity for students</p>
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
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  id="companyName"
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
                <label htmlFor="companyWebsite" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Website
                </label>
                <input
                  id="companyWebsite"
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
                <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  id="jobTitle"
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
                <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  id="jobDescription"
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
                <label htmlFor="jobType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  id="jobType"
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
                    <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary (optional)
                  </label>
                  <input
                    id="salary"
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g., 10-15 LPA"
                    className="input-field"
                  />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                    Location (optional)
                  </label>
                  <input
                    id="location"
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
                <label htmlFor="requiredSkills" className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Skills *
                </label>
                <textarea
                  id="requiredSkills"
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
                  <label htmlFor="cgpa" className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum CGPA
                  </label>
                  <input
                    id="cgpa"
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
                  <label htmlFor="branch" className="block text-sm font-semibold text-gray-700 mb-2">
                    Eligible Branches
                  </label>
                  <input
                    id="branch"
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
                  <label htmlFor="passoutYear" className="block text-sm font-semibold text-gray-700 mb-2">
                    Eligible Passout Years
                  </label>
                  <input
                    id="passoutYear"
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
                  <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 mb-2">
                  Deadline *
                </label>
                <input
                  id="deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`input-field ${errors.deadline ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.deadline && (
                  <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  Select a date in the future for applications to be accepted
                </p>
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
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg text-white px-6 py-3 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? '⏳ Creating Drive...' : '✅ Create Placement Drive'}
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
