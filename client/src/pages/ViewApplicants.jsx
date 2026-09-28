import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { drivesAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  Users,
  User,
  Mail,
  GraduationCap,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export default function ViewApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await drivesAPI.getDriveApplicants(id);
      console.log('Applicants API response:', response.data);
      setApplicants(response.data.data || []);
    } catch (err) {
      console.error('Fetch applicants error:', err.response?.data || err.message);
      setError(`Failed to fetch applicants: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId, interviewType) => {
    try {
      await drivesAPI.approveApplicant(id, studentId, { interviewType });
      fetchApplicants();
    } catch (err) {
      setError('Failed to approve applicant');
    }
  };

  const handleRevoke = async (studentId) => {
    if (!confirm('Revoke this approval?')) return;
    try {
      await drivesAPI.revokeApplicant(id, studentId);
      fetchApplicants();
    } catch (err) {
      setError('Failed to revoke');
    }
  };

  const handleDelete = async (studentId) => {
    if (!confirm('Delete this applicant record permanently?')) return;
    try {
      await drivesAPI.deleteApplicant(id, studentId);
      fetchApplicants();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const handleReject = async (studentId) => {
    if (!rejectReason.trim()) {
      setError('Please provide rejection reason');
      return;
    }

    try {
      setRejecting(studentId);
      await drivesAPI.rejectApplicant(id, studentId, { rejectionReason });
      setRejectReason('');
      fetchApplicants();
    } catch (err) {
      setError('Failed to reject applicant');
    } finally {
      setRejecting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <button 
            onClick={() => navigate('/drives')}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Drives
          </button>

          <div className="card mb-6">
            <h1 className="text-2xl font-bold mb-2">👥 Applicants Management</h1>
            <p className="text-gray-600">
              Total Applicants: <span className="font-bold text-primary-600">{applicants.length}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {error}
            </div>
          )}

          {/* Applicants Table */}
          <div className="card overflow-hidden">
            {applicants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No applicants yet</h3>
                <p className="text-gray-500">Share this drive with students to get applications</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase hidden lg:table-cell">Skills</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase hidden xl:table-cell">CGPA/Branch</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((applicant) => (
                      <tr key={applicant.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {applicant.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{applicant.name}</div>
                              <div className="text-sm text-gray-500">{applicant.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {applicant.skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                            {applicant.skills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                +{applicant.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <div>
                            <div className="text-sm font-medium">{applicant.cgpa || 'N/A'}</div>
                            <div className="text-xs text-gray-500">
                              {applicant.branch?.[0] || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            applicant.status === 'approved' ? 'bg-green-100 text-green-800' :
                            applicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {applicant.status.toUpperCase()}
                          </span>
                          {applicant.rejectionReason && (
                            <div className="text-xs text-gray-500 mt-1 italic">
                              {applicant.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {applicant.status === 'pending' ? (
                            <div className="flex gap-2 justify-center">
                              <select 
                                onChange={(e) => {
                                  if (e.target.value === 'technical') handleApprove(applicant.id, 'technical');
                                  else if (e.target.value === 'coding') handleApprove(applicant.id, 'technical'); // coding as technical
                                  else if (e.target.value === 'hr') handleApprove(applicant.id, 'hr');
                                  else if (e.target.value === 'revoke') {} // Handled separately
                                }}
                                className="px-3 py-2 bg-green-600 text-white text-xs rounded-lg font-semibold hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
                                defaultValue=""
                              >
                                <option value="">Next Step</option>
                                <option value="technical">Technical Interview</option>
                                <option value="coding">Coding Assessment</option>
                                <option value="hr">HR Round</option>
                              </select>
                              <button
                                onClick={() => setRejecting(applicant.id)}
                                className="px-4 py-2 bg-red-600 text-white text-xs rounded-lg font-semibold hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          ) : applicant.status === 'approved' ? (
                            <div className="flex gap-2 justify-center">
                              <span className="text-sm text-green-600 font-medium">Approved</span>
                              <button
                                onClick={() => handleRevoke(applicant.id)}
                                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition"
                                title="Revoke approval"
                              >
                                Revoke
                              </button>
                            </div>
                          ) : applicant.status === 'rejected' ? (
                            <div className="flex gap-2 justify-center">
                              <span className="text-sm text-red-600 font-medium">Rejected</span>
                              <button
                                onClick={() => handleDelete(applicant.id)}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                                title="Delete applicant record"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Action completed</span>
                          )}

                          
                          {rejecting === applicant.id && (
                            <div className="mt-2 flex flex-col gap-2">
                              <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                className="w-full p-2 border rounded text-sm resize-none"
                                rows="2"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleReject(applicant.id)}
                                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-red-700"
                                  disabled={!rejectReason.trim()}
                                >
                                  {rejecting === applicant.id ? 'Rejecting...' : 'Reject'}
                                </button>
                                <button
                                  onClick={() => setRejecting(null)}
                                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold text-sm hover:bg-gray-400"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

