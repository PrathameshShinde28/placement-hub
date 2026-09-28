import Placement from '../models/Placement.js';
import Company from '../models/Company.js';
import User from '../models/User.js';

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Total students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Total placements
    const totalPlacements = await Placement.countDocuments({
      placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] },
    });

    // Placement percentage
    const placementPercentage =
      totalStudents > 0 ? ((totalPlacements / totalStudents) * 100).toFixed(2) : 0;

    // Package stats
    const packageStats = await Placement.aggregate([
      {
        $match: { placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] } },
      },
      {
        $group: {
          _id: null,
          highest: { $max: '$package' },
          lowest: { $min: '$package' },
          average: { $avg: '$package' },
          total: { $sum: 1 },
        },
      },
    ]);

    const stats = packageStats[0] || {
      highest: 0,
      lowest: 0,
      average: 0,
      total: 0,
    };

    // Company stats
    const totalCompanies = await Company.countDocuments({ status: 'Active' });
    const activeDrives = await Company.countDocuments({ status: 'Active' });

    // Internship vs full-time
    const placementTypeStats = await Placement.aggregate([
      {
        $group: {
          _id: '$placementType',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalPlacements,
        placementPercentage,
        highestPackage: stats.highest,
        lowestPackage: stats.lowest,
        averagePackage: stats.average,
        totalCompanies,
        activeDrives,
        placementTypeStats,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics',
    });
  }
};

// Company-wise placement analytics
export const getCompanyWiseAnalytics = async (req, res) => {
  try {
    const analytics = await Placement.aggregate([
      {
        $match: { placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] } },
      },
      {
        $group: {
          _id: '$companyName',
          count: { $sum: 1 },
          avgPackage: { $avg: '$package' },
          maxPackage: { $max: '$package' },
          minPackage: { $min: '$package' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    console.error('Error fetching company-wise analytics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics',
    });
  }
};

// Department-wise placement analytics
export const getDepartmentWiseAnalytics = async (req, res) => {
  try {
    const analytics = await Placement.aggregate([
      {
        $match: { placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] } },
      },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgPackage: { $avg: '$package' },
          maxPackage: { $max: '$package' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    console.error('Error fetching department-wise analytics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics',
    });
  }
};

// Year-wise placement trends
export const getYearWiseTrends = async (req, res) => {
  try {
    const trends = await Placement.aggregate([
      {
        $match: { placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] } },
      },
      {
        $group: {
          _id: '$passingYear',
          count: { $sum: 1 },
          avgPackage: { $avg: '$package' },
          percentage: { $avg: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    console.error('Error fetching year-wise trends:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch trends',
    });
  }
};

// Package distribution analytics
export const getPackageDistribution = async (req, res) => {
  try {
    const distribution = await Placement.aggregate([
      {
        $match: { placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] } },
      },
      {
        $bucket: {
          groupBy: '$package',
          boundaries: [0, 5, 10, 15, 20, 25, 50],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            packages: { $push: '$package' },
          },
        },
      },
    ]);

    res.status(200).json({ success: true, data: distribution });
  } catch (error) {
    console.error('Error fetching package distribution:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch distribution',
    });
  }
};

// Placement status distribution
export const getStatusDistribution = async (req, res) => {
  try {
    const distribution = await Placement.aggregate([
      {
        $group: {
          _id: '$placementStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ success: true, data: distribution });
  } catch (error) {
    console.error('Error fetching status distribution:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch distribution',
    });
  }
};

// Monthly placement statistics
export const getMonthlyStats = async (req, res) => {
  try {
    const stats = await Placement.aggregate([
      {
        $match: { placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] } },
      },
      {
        $group: {
          _id: {
            month: { $month: '$placementDate' },
            year: { $year: '$placementDate' },
          },
          count: { $sum: 1 },
          avgPackage: { $avg: '$package' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch monthly stats',
    });
  }
};
