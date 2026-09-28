import React, { useState, useEffect } from 'react';
import { drivesAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function PlacementDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  useEffect(() => {
    // Reliable refresh whenever user lands on /drives (including after create)
    console.log('🔄 [PlacementDrives] location.pathname changed:', location.pathname);
    if (location.pathname === '/drives') {
      console.log('🔄 [PlacementDrives] route active - fetching drives');
      fetchDrives();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    // initial fetch fallback
    fetchDrives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchDrives = async () => {
    try {
      console.log('📥 [PlacementDrives] fetchDrives() executing...');

      const res = await drivesAPI.getAllDrives();
      console.log('✅ [PlacementDrives] fetch status:', res.status);
      console.log(
        '✅ [PlacementDrives] Drives fetched:',
        res.data?.data?.length || 0,
        'drives'
      );
      console.log('📋 [PlacementDrives] Drives data:', res.data?.data);
      setDrives(res.data?.data || []);
    } catch (err) {
      console.error('❌ [PlacementDrives] Error fetching drives');
      console.error('   error message:', err?.message);
      console.error('   error response:', err?.response?.status, err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDrive = async (driveId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this drive? This action cannot be undone.')) {
      return;
    }

    try {
      await drivesAPI.deleteDrive(driveId);
      setDrives(drives.filter((d) => d._id !== driveId));
    } catch (err) {
      console.error('Error deleting drive:', err);
      alert('Failed to delete drive');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">

        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Placement Drives</h1>
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/add-drive')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              ➕ Add Drive
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4">
            {drives.map((drive) => (
              <div
                key={drive._id}
                className="p-4 border rounded cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => navigate(`/drives/${drive._id}`)}
              >
                <div className="flex-1">
                  <h2 className="font-bold">{drive.companyName}</h2>
                  <p>{drive.jobTitle}</p>
                  <p className="text-sm text-gray-600">
                    Deadline: {new Date(drive.deadline).toLocaleDateString()}
                  </p>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/drives/${drive._id}/edit`);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-semibold text-sm transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteDrive(drive._id, e)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold text-sm transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}