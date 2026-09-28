import Report from '../models/Report.js';
import Placement from '../models/Placement.js';
import Company from '../models/Company.js';
import mongoose from 'mongoose';

// Generate company-wise report
export const generateCompanyWiseReport = async (req, res) => {
  try {
    const { company } = req.body;

    const placements = await Placement.find({
      companyName: company,
      placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] },
    })
      .populate('studentId', 'name email')
      .lean();

    if (placements.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No placement records found for this company',
      });
    }

    const statistics = {
      totalRecords: placements.length,
      totalPackage: placements.reduce((sum, p) => sum + p.package, 0),
      averagePackage: (
        placements.reduce((sum, p) => sum + p.package, 0) / placements.length
      ).toFixed(2),
      highestPackage: Math.max(...placements.map((p) => p.package)),
      lowestPackage: Math.min(...placements.map((p) => p.package)),
      placementRate: 100,
    };

    const report = await Report.create({
      reportType: 'Company-Wise',
      title: `${company} - Placement Report`,
      filters: { company },
      data: placements,
      statistics,
      generatedBy: req.userId,
      fileName: `${company}-placement-report.json`,
      status: 'Generated',
    });

    res.status(200).json({
      success: true,
      message: 'Company-wise report generated',
      data: {
        report: {
          id: report._id,
          title: report.title,
          statistics: report.statistics,
        },
        placements,
        statistics,
      },
    });
  } catch (error) {
    console.error('Error generating company-wise report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate report',
    });
  }
};

// Generate department-wise report
export const generateDepartmentWiseReport = async (req, res) => {
  try {
    const { department } = req.body;

    const placements = await Placement.find({
      department,
      placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] },
    })
      .populate('studentId', 'name email')
      .lean();

    const statistics = {
      totalRecords: placements.length,
      totalPackage: placements.reduce((sum, p) => sum + p.package, 0),
      averagePackage:
        placements.length > 0
          ? (placements.reduce((sum, p) => sum + p.package, 0) / placements.length).toFixed(2)
          : 0,
      highestPackage: placements.length > 0 ? Math.max(...placements.map((p) => p.package)) : 0,
      lowestPackage: placements.length > 0 ? Math.min(...placements.map((p) => p.package)) : 0,
      placementRate: placements.length > 0 ? 100 : 0,
    };

    const report = await Report.create({
      reportType: 'Department-Wise',
      title: `${department} - Placement Report`,
      filters: { department },
      data: placements,
      statistics,
      generatedBy: req.userId,
      fileName: `${department}-placement-report.json`,
      status: 'Generated',
    });

    res.status(200).json({
      success: true,
      message: 'Department-wise report generated',
      data: {
        report: {
          id: report._id,
          title: report.title,
          statistics: report.statistics,
        },
        placements,
        statistics,
      },
    });
  } catch (error) {
    console.error('Error generating department-wise report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate report',
    });
  }
};

// Generate year-wise report
export const generateYearWiseReport = async (req, res) => {
  try {
    const { year } = req.body;

    const placements = await Placement.find({
      passingYear: year,
      placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] },
    })
      .populate('studentId', 'name email')
      .lean();

    const totalStudents = await Placement.countDocuments({ passingYear: year });
    const placementRate = totalStudents > 0 ? ((placements.length / totalStudents) * 100).toFixed(2) : 0;

    const statistics = {
      totalRecords: placements.length,
      totalPackage: placements.reduce((sum, p) => sum + p.package, 0),
      averagePackage:
        placements.length > 0
          ? (placements.reduce((sum, p) => sum + p.package, 0) / placements.length).toFixed(2)
          : 0,
      highestPackage: placements.length > 0 ? Math.max(...placements.map((p) => p.package)) : 0,
      lowestPackage: placements.length > 0 ? Math.min(...placements.map((p) => p.package)) : 0,
      placementRate,
    };

    const report = await Report.create({
      reportType: 'Year-Wise',
      title: `${year} Batch - Placement Report`,
      filters: { year },
      data: placements,
      statistics,
      generatedBy: req.userId,
      fileName: `${year}-placement-report.json`,
      status: 'Generated',
    });

    res.status(200).json({
      success: true,
      message: 'Year-wise report generated',
      data: {
        report: {
          id: report._id,
          title: report.title,
          statistics: report.statistics,
        },
        placements,
        statistics,
      },
    });
  } catch (error) {
    console.error('Error generating year-wise report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate report',
    });
  }
};

// Generate salary statistics report
export const generateSalaryStatsReport = async (req, res) => {
  try {
    const placements = await Placement.find({
      placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] },
    })
      .populate('studentId', 'name email')
      .lean();

    const statistics = {
      totalRecords: placements.length,
      totalPackage: placements.reduce((sum, p) => sum + p.package, 0),
      averagePackage:
        placements.length > 0
          ? (placements.reduce((sum, p) => sum + p.package, 0) / placements.length).toFixed(2)
          : 0,
      highestPackage: placements.length > 0 ? Math.max(...placements.map((p) => p.package)) : 0,
      lowestPackage: placements.length > 0 ? Math.min(...placements.map((p) => p.package)) : 0,
      placementRate: 100,
    };

    const report = await Report.create({
      reportType: 'Salary-Stats',
      title: 'Salary Statistics Report',
      data: placements,
      statistics,
      generatedBy: req.userId,
      fileName: 'salary-stats-report.json',
      status: 'Generated',
    });

    res.status(200).json({
      success: true,
      message: 'Salary statistics report generated',
      data: {
        report: {
          id: report._id,
          title: report.title,
          statistics: report.statistics,
        },
        placements,
        statistics,
      },
    });
  } catch (error) {
    console.error('Error generating salary stats report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate report',
    });
  }
};

// Generate student placement list report
export const generateStudentListReport = async (req, res) => {
  try {
    const { department, year } = req.body;

    const filter = {
      placementStatus: { $in: ['Selected', 'Offer Accepted', 'Joined'] },
    };

    if (department) filter.department = department;
    if (year) filter.passingYear = year;

    const placements = await Placement.find(filter)
      .populate('studentId', 'name email')
      .lean();

    const statistics = {
      totalRecords: placements.length,
      totalPackage: placements.reduce((sum, p) => sum + p.package, 0),
      averagePackage:
        placements.length > 0
          ? (placements.reduce((sum, p) => sum + p.package, 0) / placements.length).toFixed(2)
          : 0,
      highestPackage: placements.length > 0 ? Math.max(...placements.map((p) => p.package)) : 0,
      lowestPackage: placements.length > 0 ? Math.min(...placements.map((p) => p.package)) : 0,
      placementRate: 100,
    };

    const report = await Report.create({
      reportType: 'Student-List',
      title: 'Student Placement List',
      filters: { department, year },
      data: placements,
      statistics,
      generatedBy: req.userId,
      fileName: 'student-list-report.json',
      status: 'Generated',
    });

    res.status(200).json({
      success: true,
      message: 'Student placement list generated',
      data: {
        report: {
          id: report._id,
          title: report.title,
          statistics: report.statistics,
        },
        placements,
        statistics,
      },
    });
  } catch (error) {
    console.error('Error generating student list report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate report',
    });
  }
};

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, reportType } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (reportType) filter.reportType = reportType;

    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reports',
    });
  }
};

// Get single report
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid report ID' });
    }

    const report = await Report.findById(id).populate('generatedBy', 'name email');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch report',
    });
  }
};

// Delete report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid report ID' });
    }

    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete report',
    });
  }
};
