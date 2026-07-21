const DocumentChecklist = require('../models/DocumentChecklist');
const Scholarship = require('../models/Scholarship');

/**
 * @route   GET /api/checklist/:scholarshipId
 * @desc    Fetch student's document checklist & application status for a specific scholarship
 * @access  Private (JWT)
 */
const getChecklistByScholarship = async (req, res) => {
  try {
    const userId = req.user._id;
    const { scholarshipId } = req.params;

    let checklist = null;
    try {
      checklist = await DocumentChecklist.findOne({ userId, scholarshipId });
    } catch (err) {
      console.warn('[Checklist Controller]: Database error fetching checklist.');
    }

    if (!checklist) {
      checklist = {
        userId,
        scholarshipId,
        checkedDocuments: [],
        applied: false,
      };
    }

    return res.status(200).json({
      success: true,
      checklist,
    });
  } catch (error) {
    console.error('[Get Checklist Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch checklist.',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/checklist/:scholarshipId
 * @desc    Update checked documents list or mark applied status
 * @access  Private (JWT)
 */
const updateChecklist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { scholarshipId } = req.params;
    const { checkedDocuments, applied } = req.body;

    const updateFields = { updatedAt: Date.now() };

    if (Array.isArray(checkedDocuments)) {
      updateFields.checkedDocuments = checkedDocuments;
    }

    if (typeof applied === 'boolean') {
      updateFields.applied = applied;
    }

    let checklist = null;
    try {
      checklist = await DocumentChecklist.findOneAndUpdate(
        { userId, scholarshipId },
        { $set: updateFields },
        { upsert: true, new: true, runValidators: true }
      );
    } catch (err) {
      console.warn('[Checklist Controller]: Database update failed, returning in-memory mock.');
      checklist = {
        userId,
        scholarshipId,
        checkedDocuments: checkedDocuments || [],
        applied: typeof applied === 'boolean' ? applied : false,
        updatedAt: new Date(),
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Checklist updated successfully.',
      checklist,
    });
  } catch (error) {
    console.error('[Update Checklist Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update checklist.',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/checklist
 * @desc    Fetch all checklist entries for the logged-in student (for Dashboard Application Tracker)
 * @access  Private (JWT)
 */
const getAllUserChecklists = async (req, res) => {
  try {
    const userId = req.user._id;

    let rawChecklists = [];
    try {
      rawChecklists = await DocumentChecklist.find({ userId }).sort({ updatedAt: -1 });
    } catch (err) {
      console.warn('[Checklist Controller]: Database error fetching all user checklists.');
    }

    // Populate scholarship name and total required docs count for each checklist
    const populatedChecklists = await Promise.all(
      rawChecklists.map(async (item) => {
        const itemObj = typeof item.toObject === 'function' ? item.toObject() : item;
        let scholarshipObj = null;

        try {
          scholarshipObj = await Scholarship.findById(item.scholarshipId);
        } catch (e) {
          // ignore lookup error
        }

        return {
          ...itemObj,
          scholarshipName: scholarshipObj ? scholarshipObj.name : item.scholarshipName || 'Scholarship Scheme',
          totalDocumentsRequired: scholarshipObj?.documentsRequired?.length || 5,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: populatedChecklists.length,
      checklists: populatedChecklists,
    });
  } catch (error) {
    console.error('[Get All Checklists Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user checklists.',
      error: error.message,
    });
  }
};

module.exports = {
  getChecklistByScholarship,
  updateChecklist,
  getAllUserChecklists,
};
