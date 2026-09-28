import Placement from '../models/Placement.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create new placement record
export const createPlacement = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      studentEmail,
      department,
      passingYear,
      companyName,
      companyType,
      jobRole,
      packageLPA,
      placementType,
      placementDate,
      jobLocation,
      workMode,
      selectionRoundsCleared,
      placementStatus,
      offerLetterUrl,
      notes,
    } = req.body;

    // Validation
    if (!studentId || !companyName || !jobRole || packageLPA === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const placement = await Placement.create({
      studentId,
      studentName,
      studentEmail,
      department,
      passingYear,
      companyName,
      companyType,
      jobRole,
      packageLPA,
      placementType: placementType || 'Full-Time',
      placementDate,
      jobLocation,
      workMode,
      selectionRoundsCleared: selectionRoundsCleared || [],
      placementStatus: placementStatus || 'Applied',
      offerLetterUrl,
      notes,
      createdBy: req.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Placement record created successfully',
      data: placement,
    });
  } catch (error) {
    console.error('Error creating placement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create placement record',
    });
  }
};

// Get all placement records with filters
export const getAllPlacements = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, year, status, company } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { jobRole: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) filter.department = department;
    if (year) filter.passingYear = parseInt(year);
    if (status) filter.placementStatus = status;
    if (company) filter.companyName = { $regex: company, $options: 'i' };

    const total = await Placement.countDocuments(filter);
    const placements = await Placement.find(filter)
      .populate('studentId', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.status(200).json({
      success: true,
      data: placements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching placements:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch placements',
    });
  }
};

// Get single placement
export const getPlacementById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid placement ID' });
    }

    const placement = await Placement.findById(id)
      .populate('studentId', 'name email')
      .populate('createdBy', 'name email');

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement record not found' });
    }

    res.status(200).json({ success: true, data: placement });
  } catch (error) {
    console.error('Error fetching placement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch placement',
    });
  }
};

// Update placement record
export const updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid placement ID' });
    }

    const placement = await Placement.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('studentId', 'name email')
      .populate('createdBy', 'name email');

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Placement record updated successfully',
      data: placement,
    });
  } catch (error) {
    console.error('Error updating placement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update placement',
    });
  }
};

// Delete placement record
export const deletePlacement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid placement ID' });
    }

    const placement = await Placement.findByIdAndDelete(id);

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Placement record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting placement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete placement',
    });
  }
};

// Get student's placement records
export const getMyPlacements = async (req, res) => {
  try {
    const placements = await Placement.find({ studentId: req.userId })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: placements.length,
      data: placements,
    });
  } catch (error) {
    console.error('Error fetching student placements:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch placements',
    });
  }
};

// Bulk update placement status
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { placementIds, status } = req.body;

    if (!placementIds || !Array.isArray(placementIds) || !status) {
      return res
        .status(400)
        .json({ success: false, message: 'placementIds array and status are required' });
    }

    const result = await Placement.updateMany(
      { _id: { $in: placementIds } },
      { $set: { placementStatus: status } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} records updated`,
      data: result,
    });
  } catch (error) {
    console.error('Error bulk updating placements:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to bulk update placements',
    });
  }
};
