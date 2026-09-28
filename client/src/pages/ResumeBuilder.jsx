import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function ResumeBuilder() {
  const [resume, setResume] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.getResume();
      setResume(response.data.resume);
    } catch (err) {
      console.log('No resume found, creating new');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume({ ...resume, [name]: value });
  };

  const handleSaveResume = async () => {
    try {
      setLoading(true);
      await resumeAPI.updateResume(resume);
      setMessage('Resume saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeResume = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.analyzeResume();
      setMessage('Resume analyzed! Score: ' + response.data.analysis.score);
    } catch (err) {
      setMessage('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Resume Builder 📄</h1>

        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Info */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={resume.fullName}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={resume.email}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={resume.phone}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={resume.location}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <textarea
              name="summary"
              placeholder="Professional Summary"
              value={resume.summary}
              onChange={handleChange}
              className="input-field mt-4"
              rows="3"
            />
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Skills</h2>
            <input
              type="text"
              placeholder="Add skills separated by commas"
              defaultValue={resume.skills.join(', ')}
              onChange={(e) => setResume({ ...resume, skills: e.target.value.split(',').map(s => s.trim()) })}
              className="input-field"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSaveResume}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              💾 Save Resume
            </button>
            <button
              onClick={handleAnalyzeResume}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              🤖 Analyze with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
