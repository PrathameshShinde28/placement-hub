import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Drive from '../models/Drive.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const APPLICATION_STATUS = {
  applied: 'applied',
  resume_shortlisted: 'resume_shortlisted',
  aptitude_test_scheduled: 'aptitude_test_scheduled',
  technical_interview_scheduled: 'technical_interview_scheduled',
  hr_interview_scheduled: 'hr_interview_scheduled',
  selected: 'selected',
  offered: 'offered',
  rejected: 'rejected',
};

const VALID_STATUSES = Object.values(APPLICATION_STATUS);

const mapDriveStatusToApplicationStatus = (driveStatus) => {
  // Drive schema statuses: pending -> approved -> (interview scheduling via Interview model)
  // But we also accept the requested mapping list (pending/approved/technical/hr/offered/selected/rejected)
  switch (driveStatus) {
    case 'pending':
      return APPLICATION_STATUS.applied;
    case 'approved':
      return APPLICATION_STATUS.resume_shortlisted;
    case 'technical':
      return APPLICATION_STATUS.technical_interview_scheduled;
    case 'hr':
      return APPLICATION_STATUS.hr_interview_scheduled;
    case 'offered':
      return APPLICATION_STATUS.offered;
    case 'selected':
      return APPLICATION_STATUS.selected;
    case 'rejected':
      return APPLICATION_STATUS.rejected;
    default:
      return null;
  }
};

const createStatusHistoryEntry = ({ status, interviewDate, notes, updatedBy }) => {
  return {
    status,
    interviewDate: interviewDate || null,
    notes: notes || '',
    updatedBy: updatedBy || null,
    updatedAt: new Date(),
  };
};

const notifyStudent = async ({ studentId, title, message, type }) => {
  await Notification.create({
    user: studentId,
    title,
    message,
    type,
    read: false,
  });
};

// Student apply for a drive (sync layer)
export const applyForDrive = async (req, res) => {

  try {
    const { id: driveId } = req.params;
    const studentId = req.userId;

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    if (new Date(drive.deadline) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: 'Application deadline has passed' });
    }

    const existingApplication = await Application.findOne({ studentId, driveId });
    if (existingApplication) {
      return res.status(200).json({
        success: true,
        message: 'Already applied',
        data: existingApplication,
      });
    }

    const application = await Application.create({
      studentId,
      driveId,
      student: studentId,
      drive: driveId,
      status: APPLICATION_STATUS.applied,
      appliedAt: new Date(),
      interviewDate: null,
      notes: '',
      remarks: '',
      statusHistory: [
        createStatusHistoryEntry({
          status: APPLICATION_STATUS.applied,
          interviewDate: null,
          notes: '',
          updatedBy: null,
        }),
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Applied successfully',
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all applications for a specific drive (Admin/Officer)
export const getDriveApplications = async (req, res) => {
  try {
    const { driveId } = req.params;

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    const applications = await Application.find({ driveId })
      .populate('studentId', 'name email skills targetRole')
      .populate('driveId', 'companyName jobTitle')
      .sort({ appliedAt: -1 });

    const summary = applications.reduce(
      (acc, a) => {
        acc.total += 1;
        if (a.status === APPLICATION_STATUS.applied) acc.applied += 1;
        if (a.status === APPLICATION_STATUS.resume_shortlisted) acc.resume_shortlisted += 1;
        if (a.status === APPLICATION_STATUS.technical_interview_scheduled) acc.technical_interview_scheduled += 1;
        if (a.status === APPLICATION_STATUS.hr_interview_scheduled) acc.hr_interview_scheduled += 1;
        if (a.status === APPLICATION_STATUS.selected) acc.selected += 1;
        if (a.status === APPLICATION_STATUS.offered) acc.offered += 1;
        if (a.status === APPLICATION_STATUS.rejected) acc.rejected += 1;
        return acc;
      },
      {
        total: 0,
        applied: 0,
        resume_shortlisted: 0,
        technical_interview_scheduled: 0,
        hr_interview_scheduled: 0,
        selected: 0,
        offered: 0,
        rejected: 0,
      }
    );

    res.status(200).json({
      success: true,
      data: applications,
      summary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update application status (Admin/Officer)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { status, notes, interviewDate } = req.body;

    const updatedBy = req.userId;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const updated = await Application.findByIdAndUpdate(
      applicationId,
      {
        $set: {
          status,
          notes: notes || '',
          interviewDate: interviewDate ? new Date(interviewDate) : null,
          statusUpdatedAt: new Date(),
          updatedBy,
          // backward compat
          remarks: notes || application.remarks || '',
        },
        $push: {
          statusHistory: createStatusHistoryEntry({
            status,
            interviewDate: interviewDate ? new Date(interviewDate) : null,
            notes: notes || '',
            updatedBy,
          }),
        },
      },
      { new: true, runValidators: true }
    )
      .populate('studentId', 'name email')
      .populate('driveId', 'companyName jobTitle');

    const studentId = updated.studentId?._id || updated.studentId || updated.student;
    const company = updated.driveId?.companyName || updated.driveId?.companyName || 'Company';

    await notifyStudent({
      studentId,
      type: 'application_status_updated',
      title: 'Application Updated',
      message: `Your application for ${company} has been updated to ${String(status)
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (m) => m.toUpperCase())}.`,
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get student's applications
export const getMyApplications = async (req, res) => {
  try {
    const studentId = req.userId;

    const applications = await Application.find({ studentId })
      .populate('driveId')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if student applied for a specific drive
export const checkApplicationStatus = async (req, res) => {
  try {
    const { id: driveId } = req.params;
    const studentId = req.userId;

    const application = await Application.findOne({
      studentId,
      driveId,
    });

    res.status(200).json({
      success: true,
      hasApplied: !!application,
      application: application || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get application stats for dashboard
export const getApplicationStats = async (req, res) => {
  try {
    const studentId = req.userId;

    const stats = await Application.aggregate([
      { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      applied: 0,
      resume_shortlisted: 0,
      aptitude_test_scheduled: 0,
      technical_interview_scheduled: 0,
      hr_interview_scheduled: 0,
      selected: 0,
      offered: 0,
      rejected: 0,
    };

    stats.forEach((stat) => {
      if (result[stat._id] !== undefined) result[stat._id] = stat.count;
      result.total += stat.count;
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk update application statuses (Admin/Officer)
export const bulkUpdateApplications = async (req, res) => {
  try {
    const { applicationIds, status, notes, interviewDate } = req.body;

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'applicationIds array is required',
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const updatedBy = req.userId;

    const applications = await Application.find({ _id: { $in: applicationIds } })
      .populate('studentId', 'name email')
      .populate('driveId', 'companyName jobTitle');

    await Application.updateMany(
      { _id: { $in: applicationIds } },
      {
        $set: {
          status,
          notes: notes || '',
          interviewDate: interviewDate ? new Date(interviewDate) : null,
          statusUpdatedAt: new Date(),
          updatedBy,
        },
        $push: {
          statusHistory: createStatusHistoryEntry({
            status,
            interviewDate: interviewDate ? new Date(interviewDate) : null,
            notes: notes || '',
            updatedBy,
          }),
        },
      },
      { runValidators: true }
    );

    // Best-effort notifications
    await Promise.all(
      applications.map(async (app) => {
        const company = app.driveId?.companyName || 'Company';
        const studentId = app.studentId?._id || app.studentId || app.student;
        await notifyStudent({
          studentId,
          type: 'application_status_updated',
          title: 'Application Updated',
          message: `Your application for ${company} has been updated to ${String(status)
            .replaceAll('_', ' ')
            .replace(/\b\w/g, (m) => m.toUpperCase())}.`,
        });
      })
    );

    res.status(200).json({
      success: true,
      message: 'Bulk application update completed',
      data: { applicationIdsCount: applicationIds.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applications by drive
export const getApplicationsByDrive = async (req, res) => {
  try {
    const { driveId } = req.params;

    const applications = await Application.find({ driveId })
      .populate('studentId', 'name email skills targetRole')
      .populate('driveId', 'companyName jobTitle')
      .sort({ appliedAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

