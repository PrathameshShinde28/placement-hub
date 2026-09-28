import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { drivesAPI, skillsAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
  Plus,
  Loader2,
  AlertCircle,
  Globe,
  Building2,
  Briefcase,
  Clock,
  Zap
} from 'lucide-react';
import { SkeletonPage } from '../components/Skeleton';

export default function DriveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [addingSkills, setAddingSkills] = useState(false);

  useEffect(() => {
    fetchDriveDetails();
  }, [id]);

  const fetchDriveDetails = async () => {
    try {
      setLoading(true);
      const response = await drivesAPI.getDriveById(id);
      setDrive(response.data.data);
      setIsRegistered(response.data.data.isApplied);
      setError('');
    } catch (err) {
      setError('Failed to fetch drive details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterForDrive = async () => {
    try {
      setRegistering(true);
      await drivesAPI.registerForDrive(id);
      setIsRegistered(true);
      await fetchDriveDetails();
    } catch (err) {
      setError('Failed to register for drive');
    } finally {
      setRegistering(false);
    }
  };

  const handleViewApplicants = () => {
    navigate(`/drives/${id}/applicants`);
  };

  const handleAddMissingSkills = async () => {
    try {
      setAddingSkills(true);
      for (const skill of drive.missingSkills) {
        await skillsAPI.addSkill({ skill });
      }
      await fetchDriveDetails();
      alert('Missing skills added!');
    } catch (err) {
      setError('Failed to add skills');
    } finally {
      setAddingSkills(false);
    }
  };

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        <Sidebar />
        <div className="flex-1 page-container">
          <div className="max-w-4xl mx-auto">
            <SkeletonPage />
          </div>
        </div>
      </div>
    );
  }

  // ❌ Not Found UI
  if (!drive) {
    return (
      <div className="flex min-h-screen bg-slate-50/50">
        <Sidebar />
        <div className="flex-1 page-container">
          <div className="max-w-4xl mx-auto">
            <div className="card text-center py-16">
              <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold">Drive not found</h2>
              <button onClick={() => navigate('/drives')} className="btn-primary mt-4">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = new Date(drive.deadline) < new Date();

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <div className="flex-1 page-container">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <button onClick={() => navigate('/drives')} className="mb-6 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Error */}
          {error && (
            <div className="bg-red-100 p-3 rounded mb-4 flex items-center gap-2">
              <AlertCircle /> {error}
            </div>
          )}

          {/* Header */}
          <div className="card mb-6">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold">{drive.companyName}</h1>
                <p className="text-primary-600">{drive.jobTitle}</p>
              </div>

              <span className={`badge ${isDeadlinePassed ? 'bg-red-100' : 'bg-green-100'}`}>
                {isDeadlinePassed ? 'Closed' : 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <DetailItem icon={MapPin} label="Location" value={drive.location} />
              <DetailItem icon={DollarSign} label="Salary" value={drive.salary} />
              <DetailItem icon={Users} label="Applicants" value={drive.applicantCount} />
              <DetailItem icon={Calendar} label="Deadline" value={new Date(drive.deadline).toLocaleDateString()} />
            </div>
          </div>

          {/* Description */}
          <div className="card mb-6">
            <h2 className="font-bold mb-2">Job Description</h2>
            <p>{drive.jobDescription}</p>
          </div>

          {/* Skills */}
          <div className="card mb-6">
            <h2 className="font-bold mb-2">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {drive.requiredSkills.map((skill, i) => (
                <span key={i} className="badge">{skill}</span>
              ))}
            </div>
          </div>

          {/* Skill Match */}
          <div className="card mb-6">
            <h2 className="font-bold mb-4">Skill Match: {drive.matchPercentage}%</h2>

            {drive.missingSkills?.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {drive.missingSkills.map((s, i) => (
                    <span key={i} className="badge-red">{s}</span>
                  ))}
                </div>

                <button onClick={handleAddMissingSkills} className="btn-primary">
                  {addingSkills ? "Adding..." : "Add Missing Skills"}
                </button>
              </>
            )}
          </div>

          {/* Role-based Action Button */}
          {!isDeadlinePassed && (
            <div className="flex gap-3">
              {user?.role === 'student' && (
                <button
                  onClick={handleRegisterForDrive}
                  disabled={isRegistered || registering}
                  className="flex-1 btn-primary"
                >
                  {registering
                    ? <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    : isRegistered
                    ? "✅ Already Applied"
                    : "📝 Apply Now"}
                </button>
              )}
              
              {user?.role === 'admin' && (
                <button
                  onClick={handleViewApplicants}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition"
                >
                  👥 View Applicants ({drive.applicantCount})
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// 🔹 Reusable component
function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="p-3 bg-gray-50 rounded text-center">
      <Icon className="mx-auto mb-1" />
      <p className="text-xs">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}