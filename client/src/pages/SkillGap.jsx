import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function SkillGap() {
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchSkillGap();
  }, []);

  const fetchSkillGap = async () => {
    try {
      setLoading(true);
      const response = await skillsAPI.getSkillGap();
      setSkillGap(response.data.data);
    } catch (err) {
      setError('Failed to fetch skill gap analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill) return;

    try {
      await skillsAPI.addSkill({ skill: newSkill });
      setNewSkill('');
      fetchSkillGap(); // refresh UI
    } catch (err) {
      console.error(err);
      setError('Failed to add skill');
    }
  };

  const removeSkill = async (skill) => {
    try {
      await skillsAPI.removeSkill({ skill });
      fetchSkillGap(); // refresh UI
    } catch (err) {
      console.error(err);
      setError('Failed to remove skill');
    }
  };

  // Loading UI
  if (loading)
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 text-lg font-semibold">
          ⏳ Analyzing your skills...
        </div>
      </div>
    );

  // Error UI
  if (error)
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 text-red-600">{error}</div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">
          Skill Gap Analysis 📈
        </h1>

        {/* Add Skill */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Add Your Skill</h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a skill (e.g. React)"
              className="border p-2 rounded w-full"
            />

            <button
              onClick={addSkill}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* Empty State */}
        {skillGap?.currentSkills?.length === 0 && (
          <div className="bg-yellow-100 p-4 rounded mb-6">
            ⚠️ You haven’t added any skills yet. Start by adding your skills above.
          </div>
        )}

        {skillGap && (
          <div className="space-y-6">

            {/* Current Skills */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Current Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skillGap.currentSkills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 group cursor-pointer hover:bg-green-300 transition-colors"
                    onClick={() => removeSkill(skill)}
                  >
                    ✓ {skill}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">✕</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Missing Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skillGap.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    ✗ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Skills */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Suggested Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skillGap?.suggestedSkills?.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    ⭐ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Recommended Courses</h2>
              <div className="space-y-3">
                {skillGap.recommendedCourses.map((course, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold">{course.name}</h3>
                    <p className="text-sm text-gray-600">
                      {course.provider} • {course.duration}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
              <h3 className="font-semibold text-lg">
                Timeline: {skillGap.timeline}
              </h3>
              <p className="text-gray-600 mt-2">
                Estimated time to bridge your skill gap with consistent practice.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}