const Scholarship = require('../models/Scholarship');
const User = require('../models/User');
const DocumentChecklist = require('../models/DocumentChecklist');

/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide admin dashboard statistics
 * @access  Private (Admin Only)
 */
const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, totalScholarships, activeScholarships, inactiveScholarships, totalApplicationsTracked] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Scholarship.countDocuments(),
      Scholarship.countDocuments({ isActive: { $ne: false } }),
      Scholarship.countDocuments({ isActive: false }),
      DocumentChecklist.countDocuments({ applied: true }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalScholarships,
        activeScholarships,
        inactiveScholarships,
        totalApplicationsTracked,
      },
    });
  } catch (error) {
    console.error('[Get Admin Stats Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard statistics.',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/admin/scholarships
 * @desc    Get all scholarships (including inactive ones)
 * @access  Private (Admin Only)
 */
const getAdminScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: scholarships.length,
      scholarships,
    });
  } catch (error) {
    console.error('[Get Admin Scholarships Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch scholarships list for admin.',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/admin/scholarships
 * @desc    Create a new scholarship scheme
 * @access  Private (Admin Only)
 */
const createScholarship = async (req, res) => {
  try {
    const {
      name,
      issuingBody,
      state,
      startDate,
      deadline,
      renewable,
      awardAmount,
      applicationLink,
      sourceVerifiedLink,
      documentsRequired,
      eligibilityRules,
      isActive,
      featured,
    } = req.body;

    if (!name || !issuingBody || !deadline || !awardAmount || !applicationLink || !sourceVerifiedLink) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, issuingBody, deadline, awardAmount, applicationLink, sourceVerifiedLink).',
      });
    }

    const newScholarship = await Scholarship.create({
      name,
      issuingBody,
      state: state || 'ALL',
      startDate: startDate || null,
      deadline,
      renewable: !!renewable,
      awardAmount,
      applicationLink: applicationLink.trim(),
      sourceVerifiedLink: sourceVerifiedLink.trim(),
      documentsRequired: documentsRequired || [],
      eligibilityRules: eligibilityRules || {},
      isActive: isActive !== undefined ? !!isActive : true,
      featured: !!featured,
      lastVerifiedDate: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Scholarship scheme created successfully!',
      scholarship: newScholarship,
    });
  } catch (error) {
    console.error('[Create Scholarship Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create scholarship.',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/admin/scholarships/:id
 * @desc    Edit an existing scholarship scheme
 * @access  Private (Admin Only)
 */
const updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship scheme not found.',
      });
    }

    const fieldsToUpdate = [
      'name',
      'issuingBody',
      'state',
      'startDate',
      'deadline',
      'renewable',
      'awardAmount',
      'applicationLink',
      'sourceVerifiedLink',
      'documentsRequired',
      'eligibilityRules',
      'isActive',
      'featured',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        scholarship[field] = req.body[field];
      }
    });

    scholarship.lastVerifiedDate = new Date();
    await scholarship.save();

    return res.status(200).json({
      success: true,
      message: 'Scholarship scheme updated successfully!',
      scholarship,
    });
  } catch (error) {
    console.error('[Update Scholarship Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update scholarship scheme.',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/admin/scholarships/:id
 * @desc    Soft delete a scholarship scheme (sets isActive to false)
 * @access  Private (Admin Only)
 */
const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship scheme not found.',
      });
    }

    scholarship.isActive = false;
    await scholarship.save();

    return res.status(200).json({
      success: true,
      message: 'Scholarship soft-deleted successfully! (Set to inactive)',
      scholarship,
    });
  } catch (error) {
    console.error('[Delete Scholarship Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to soft-delete scholarship.',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getAdminScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
};
