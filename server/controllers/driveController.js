import mongoose from 'mongoose';
import Drive from '../models/Drive.js';
import User from '../models/User.js';


// Get all placement drives (public)
export const getAllDrives = async (req, res) => {
  try {
    const drives = await Drive.find({ status: 'active' })
      .populate('createdBy', 'name email')
      .sort({ deadline: 1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      data: drives,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single drive with skill matching
export const getDriveById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware

    const drive = await Drive.findById(id).populate('createdBy', 'name email');

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Get user skills
    const user = await User.findById(userId);
    const userSkills = user.skills || [];

    // Calculate skill gap
    const missingSkills = drive.requiredSkills.filter(
      skill => !userSkills.some(s => s.toLowerCase() === skill.toLowerCase())
    );

    const matchingSkills = drive.requiredSkills.filter(
      skill => userSkills.some(s => s.toLowerCase() === skill.toLowerCase())
    );

    const matchPercentage = Math.round(
      (matchingSkills.length / drive.requiredSkills.length) * 100 || 0
    );

    // Safe isApplied check
    const isApplied = drive.registeredStudents.some(app => {
      try {
        return app.student && app.student._id && app.student._id.toString() === userId;
      } catch {
        return false;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        ...drive.toObject(),
        matchingSkills,
        missingSkills,
        matchPercentage,
        isApplied,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create placement drive (admin only)
export const createDrive = async (req, res) => {
  try {
    console.log('🔥 Backend createDrive called');
    console.log('   req.userId:', req.userId);
    console.log('   req.body keys:', Object.keys(req.body || {}));
    // Request payload logging
    console.log('📦 [createDrive] Request body:', req.body);

    const { companyName, jobTitle, jobDescription, requiredSkills, eligibility, deadline, salary, location, jobType, companyWebsite } = req.body;



    // Validation
    if (!companyName || !jobTitle || !jobDescription || !requiredSkills || !deadline) {
      console.log('❌ Validation failed - missing fields', {
        companyName: Boolean(companyName),
        jobTitle: Boolean(jobTitle),
        jobDescription: Boolean(jobDescription),
        requiredSkills: Boolean(requiredSkills),
        deadline: Boolean(deadline),
      });
      return res.status(400).json({ message: 'Please provide all required fields' });
    }


    // Ensure status is always active
    const drivePayload = {
      companyName,
      jobTitle,
      jobDescription,
      requiredSkills,
      eligibility: eligibility || {},
      deadline: new Date(deadline),
      salary,
      location,
      jobType,
      companyWebsite,
      createdBy: req.userId,
      status: 'active',
    };

    let drive;
    try {
      // MongoDB save result logging
      drive = await Drive.create(drivePayload);
      console.log('✅ [createDrive] MongoDB save success. driveId:', drive?._id);
      console.log('   created drive status:', drive?.status);
    } catch (mongoError) {
      console.error('❌ [createDrive] MongoDB save failed:', mongoError);

      // Explicit mongoose validation logging
      if (mongoError?.name === 'ValidationError') {
        console.error('   mongoose validation error name:', mongoError.name);
        console.error('   mongoose validation error message:', mongoError.message);
        console.error('   mongoose validation error fields:', mongoError.errors);
      }

      throw mongoError;
    }


    // API response logging
    const responseBody = {
      success: true,
      message: 'Placement drive created successfully',
      data: drive,
    };
    console.log('📤 [createDrive] API response:', {
      success: responseBody.success,
      driveId: responseBody.data?._id,
      status: responseBody.data?.status,
    });

    res.status(201).json(responseBody);

  } catch (error) {
    console.error('❌ Backend error creating drive:', error);

    if (error?.name === 'ValidationError') {
      console.error('   mongoose validation error name:', error.name);
      console.error('   mongoose validation error message:', error.message);
      console.error('   mongoose validation error fields:', error.errors);
    }

    res.status(500).json({ message: error.message });
  }

};

// Update placement drive (admin only)
export const updateDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, jobTitle, jobDescription, requiredSkills, eligibility, deadline, salary, location, jobType, status } = req.body;

    let drive = await Drive.findById(id);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Update fields
    if (companyName) drive.companyName = companyName;
    if (jobTitle) drive.jobTitle = jobTitle;
    if (jobDescription) drive.jobDescription = jobDescription;
    if (requiredSkills) drive.requiredSkills = requiredSkills.map(s => s.trim());
    if (eligibility) drive.eligibility = eligibility;
    if (deadline) drive.deadline = new Date(deadline);
    if (salary) drive.salary = salary;
    if (location) drive.location = location;
    if (jobType) drive.jobType = jobType;
    if (status) drive.status = status;

    // 🧹 Clean invalid registeredStudents before save (fix validation error)
    try {
      drive.registeredStudents = drive.registeredStudents.filter(app => {
        try {
          return app.student && 
                 mongoose.Types.ObjectId.isValid(new mongoose.Types.ObjectId(app.student));
        } catch {
          return false;
        }
      });
      drive.applicantCount = drive.registeredStudents.length;
      console.log(`✅ Cleaned ${drive.registeredStudents.length} valid applicants for drive ${drive._id}`);
    } catch (cleanupError) {
      console.warn('⚠️ Applicant cleanup warning:', cleanupError.message);
      drive.applicantCount = drive.registeredStudents?.length || 0;
    }

    drive = await drive.save();

    res.status(200).json({
      success: true,
      message: 'Drive updated successfully',
      data: drive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Delete placement drive (admin only)
export const deleteDrive = async (req, res) => {
  try {
    const { id } = req.params;

    const drive = await Drive.findByIdAndDelete(id);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Drive deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register student for drive
export const registerForDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const drive = await Drive.findById(id);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Filter valid applicants and check ALL statuses (no re-apply ever)
    const validApplicants = drive.registeredStudents.filter(app => 
      app?.student && mongoose.Types.ObjectId.isValid(app.student)
    );
    
    const existingApplicant = validApplicants.find(app => 
      app?.student?.toString?.() === userId
    );
    if (existingApplicant) {
      return res.status(400).json({ 
        message: `Already registered (Status: ${existingApplicant.status}). Cannot re-apply.` 
      });
    }

    drive.registeredStudents.push({
      student: userId,
      status: 'pending',
      // nextStep is enum: ['assessment','technical','hr','offered']
      // Schema default is null, but mongoose enum does not accept null.
      // So we must set a valid value on creation.
      nextStep: 'assessment',
      appliedAt: new Date()
    });
    drive.applicantCount = drive.registeredStudents.length;
    await drive.save();

    console.log('✅ Student registered:', userId, 'Drive:', id);

    res.status(200).json({
      success: true,
      message: 'Successfully registered for drive',
      data: drive,
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user registered drives
export const getUserDrives = async (req, res) => {
  try {
    const userId = req.userId;

    const drives = await Drive.find({
      registeredStudents: userId,
      status: 'active',
    });

    res.status(200).json({
      success: true,
      count: drives.length,
      data: drives,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get drive applicants (admin only) - NEW SUBDOC SUPPORT
export const getDriveApplicants = async (req, res) => {
  try {
    const { id } = req.params;

    const drive = await Drive.findById(id).populate('registeredStudents.student', 'name email skills targetRole cgpa branch');

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Filter valid populated applicants
    const validApplicants = drive.registeredStudents.filter(app => app.student && app.student._id);
    const applicants = validApplicants.map(app => ({
      id: app.student._id,
      name: app.student.name,
      email: app.student.email,
      skills: app.student.skills || [],
      cgpa: app.student.cgpa,
      branch: app.student.branch || [],
      status: app.status,
      rejectionReason: app.rejectionReason,
      appliedAt: app.appliedAt
    }));

    // Log invalid if any
    const invalidCount = drive.registeredStudents.length - validApplicants.length;
    if (invalidCount > 0) {
      console.warn(`⚠️ ${invalidCount} invalid applicants filtered in getDriveApplicants for drive ${id}`);
    }

    res.status(200).json({
      success: true,
      count: applicants.length,
      data: applicants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve applicant
export const approveApplicant = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const { interviewType = 'technical' } = req.body;

    const drive = await Drive.findById(id).populate('createdBy', 'name email');
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Find and validate applicant
    const applicantIndex = drive.registeredStudents.findIndex(app => 
      app?.student && app.student?.toString?.() === studentId && app.status === 'pending'
    );
    
    if (applicantIndex === -1) {
      return res.status(404).json({ message: 'Pending applicant not found' });
    }

    // Approve applicant
    drive.registeredStudents[applicantIndex].status = 'approved';

    // 🚀 Create Interview for approved student
    const Interview = (await import('../models/Interview.js')).default;
    await Interview.create({
      userId: studentId,
      interviewType,
      questionCategory: drive.jobTitle.toLowerCase(),
      driveId: id,
      status: 'scheduled'
    });

    await drive.save();

    console.log(`✅ Approved ${studentId} for ${drive.companyName} - ${interviewType.toUpperCase()} scheduled`);

    res.status(200).json({ 
      success: true, 
      message: `Applicant approved for ${interviewType.toUpperCase()}!` 
    });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reject applicant
export const rejectApplicant = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const { rejectionReason } = req.body;

    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    const applicantIndex = drive.registeredStudents.findIndex(app => 
      app?.student && app.student?.toString?.() === studentId
    );
    
    if (applicantIndex === -1) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    drive.registeredStudents[applicantIndex].status = 'rejected';
    drive.registeredStudents[applicantIndex].rejectionReason = rejectionReason;
    await drive.save();

    res.status(200).json({ 
      success: true, 
      message: 'Applicant rejected successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Revoke approved applicant (for misbehavior)
export const revokeApplicant = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    const applicantIndex = drive.registeredStudents.findIndex(app => 
      app?.student && app.student?.toString?.() === studentId && app.status === 'approved'
    );

    if (applicantIndex === -1) {
      return res.status(404).json({ message: 'Approved applicant not found' });
    }

    // Revoke to rejected
    drive.registeredStudents[applicantIndex].status = 'rejected';
    drive.registeredStudents[applicantIndex].rejectionReason = 'Revoked by admin (misbehavior)';

    // Update count (exclude rejected)
    drive.applicantCount = drive.registeredStudents.filter(app => app.status !== 'rejected').length;

    await drive.save();

    console.log(`❌ REVOKED ${studentId} from ${drive.companyName}`);

    res.status(200).json({ 
      success: true, 
      message: 'Approval revoked successfully' 
    });
  } catch (error) {
    console.error('Revoke error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete rejected applicant record
export const deleteApplicant = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    const applicantIndex = drive.registeredStudents.findIndex(app => 
      app?.student && app.student?.toString?.() === studentId && app.status === 'rejected'
    );

    if (applicantIndex === -1) {
      return res.status(404).json({ message: 'Rejected applicant not found' });
    }

    // Remove from array
    drive.registeredStudents.splice(applicantIndex, 1);
    drive.applicantCount = drive.registeredStudents.length;

    await drive.save();

    console.log(`🗑️ DELETED rejected applicant ${studentId} from ${drive.companyName}`);

    res.status(200).json({ 
      success: true, 
      message: 'Applicant record deleted' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
};

