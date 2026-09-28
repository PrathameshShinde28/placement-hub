import Company from '../models/Company.js';
import mongoose from 'mongoose';

// Create new company
export const createCompany = async (req, res) => {
  try {
    const {
      name,
      type,
      website,
      industry,
      headCount,
      contactPerson,
      location,
      ctc,
      jobProfiles,
      eligibility,
      requiredSkills,
      notes,
    } = req.body;

    if (!name || !type) {
      return res
        .status(400)
        .json({ success: false, message: 'Company name and type are required' });
    }

    const company = await Company.create({
      name,
      type,
      website,
      industry,
      headCount,
      contactPerson,
      location,
      ctc,
      jobProfiles: jobProfiles || [],
      eligibility: eligibility || {},
      requiredSkills: requiredSkills || [],
      notes,
      createdBy: req.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    console.error('Error creating company:', error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: 'Company with this name already exists' });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create company',
    });
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const total = await Company.countDocuments(filter);
    const companies = await Company.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.status(200).json({
      success: true,
      data: companies,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch companies',
    });
  }
};

// Get single company
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }

    const company = await Company.findById(id).populate('createdBy', 'name email');

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch company',
    });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }

    const company = await Company.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update company',
    });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }

    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete company',
    });
  }
};

// Update company hiring statistics
export const updateHiringStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalApplications, totalSelected } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID' });
    }

    const company = await Company.findByIdAndUpdate(
      id,
      {
        $set: {
          'hiringStats.totalApplications': totalApplications,
          'hiringStats.totalSelected': totalSelected,
        },
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Hiring statistics updated',
      data: company,
    });
  } catch (error) {
    console.error('Error updating hiring stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update hiring stats',
    });
  }
};
