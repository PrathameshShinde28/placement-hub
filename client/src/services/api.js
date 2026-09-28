import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Skills API calls
export const skillsAPI = {
  getSkillGap: () => api.get('/skills/gap-analysis'),
  addSkill: (data) => api.post('/skills/add', data),
  removeSkill: (data) => api.post('/skills/remove', data),
};

// Resume API calls
export const resumeAPI = {
  createResume: (data) => api.post('/resume/create', data),
  getResume: () => api.get('/resume'),
  updateResume: (data) => api.put('/resume/update', data),
  analyzeResume: () => api.post('/resume/analyze'),
};

// Chat API calls
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  getChatHistory: () => api.get('/chat/history'),
};

// Interview API calls
export const interviewAPI = {
  startInterview: (data) => api.post('/interview/start', data),
  submitAnswer: (data) => api.post('/interview/submit-answer', data),
  getInterviewHistory: () => api.get('/interview/history'),
};

// Projects API calls
export const projectsAPI = {
  createProject: (data) => api.post('/projects/create', data),
  getUserProjects: () => api.get('/projects'),
  updateProject: (projectId, data) => api.put(`/projects/${projectId}`, data),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),
};

// Drives API calls
export const drivesAPI = {
  getAllDrives: () => api.get('/drives'),
  getDriveById: (driveId) => api.get(`/drives/${driveId}`),
  createDrive: (data) => api.post('/drives', data),
  updateDrive: (driveId, data) => api.put(`/drives/${driveId}`, data),
  deleteDrive: (driveId) => api.delete(`/drives/${driveId}`),
  registerForDrive: (driveId) => api.post(`/drives/${driveId}/register`),
  getUserDrives: () => api.get('/drives/user/registered'),
  getDriveApplicants: (driveId) => api.get(`/drives/${driveId}/applicants`),
  approveApplicant: (driveId, studentId) => api.put(`/drives/${driveId}/applicants/${studentId}/approve`),
  rejectApplicant: (driveId, studentId, data) => api.put(`/drives/${driveId}/applicants/${studentId}/reject`, data),
  revokeApplicant: (driveId, studentId) => api.put(`/drives/${driveId}/applicants/${studentId}/revoke`),
  deleteApplicant: (driveId, studentId) => api.delete(`/drives/${driveId}/applicants/${studentId}`),
};

// Placements API calls
export const placementsAPI = {
  createPlacement: (data) => api.post('/placements', data),
  getAllPlacements: (params) => api.get('/placements', { params }),
  getPlacementById: (id) => api.get(`/placements/${id}`),
  updatePlacement: (id, data) => api.put(`/placements/${id}`, data),
  deletePlacement: (id) => api.delete(`/placements/${id}`),
  getMyPlacements: () => api.get('/placements/my-placements'),
  bulkUpdateStatus: (data) => api.post('/placements/bulk-update/status', data),
};

// Companies API calls
export const companiesAPI = {
  createCompany: (data) => api.post('/companies', data),
  getAllCompanies: (params) => api.get('/companies', { params }),
  getCompanyById: (id) => api.get(`/companies/${id}`),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/companies/${id}`),
  updateHiringStats: (id, data) => api.put(`/companies/${id}/hiring-stats`, data),
};

// Analytics API calls
export const analyticsAPI = {
  getDashboardAnalytics: () => api.get('/analytics/dashboard'),
  getCompanyWiseAnalytics: () => api.get('/analytics/company-wise'),
  getDepartmentWiseAnalytics: () => api.get('/analytics/department-wise'),
  getYearWiseTrends: () => api.get('/analytics/year-trends'),
  getPackageDistribution: () => api.get('/analytics/package-distribution'),
  getStatusDistribution: () => api.get('/analytics/status-distribution'),
  getMonthlyStats: () => api.get('/analytics/monthly-stats'),
};

// Applications API calls
export const applicationsAPI = {
  applyForDrive: (driveId) => api.post(`/applications/${driveId}/apply`),
  getMyApplications: () => api.get('/applications/me'),
  getApplicantsByDrive: (driveId) => api.get(`/applications/drives/${driveId}/applicants`),
  updateApplicationStatus: (applicationId, data) => api.patch(`/applications/${applicationId}/status`, data),
  bulkUpdate: (data) => api.patch('/applications/bulk-update', data),
};

// Notifications API calls
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Reports API calls
export const reportsAPI = {

  generateCompanyWiseReport: (data) => api.post('/reports/company-wise', data),
  generateDepartmentWiseReport: (data) => api.post('/reports/department-wise', data),
  generateYearWiseReport: (data) => api.post('/reports/year-wise', data),
  generateSalaryStatsReport: () => api.post('/reports/salary-stats'),
  generateStudentListReport: (data) => api.post('/reports/student-list', data),
  getAllReports: (params) => api.get('/reports', { params }),
  getReportById: (id) => api.get(`/reports/${id}`),
  deleteReport: (id) => api.delete(`/reports/${id}`),
};

// Mock Interview API calls (Voice-based interviews)
export const mockInterviewAPI = {
  startInterview: (data) => api.post('/mock-interviews/start', data),
  getCurrentQuestion: (questionId) => api.get(`/mock-interviews/question/${questionId}`),
  submitAnswer: (data) => api.post('/mock-interviews/submit-answer', data),
  completeInterview: (interviewId) => api.post(`/mock-interviews/complete/${interviewId}`),
  getResult: (resultId) => api.get(`/mock-interviews/result/${resultId}`),
  getHistory: (params) => api.get('/mock-interviews/history', { params }),
};

export default api;
