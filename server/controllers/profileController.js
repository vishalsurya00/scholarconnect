const StudentProfile = require('../models/StudentProfile');

/**
 * @route   GET /api/profile
 * @desc    Get logged-in student's profile (create default if not found)
 * @access  Private (JWT Protected)
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await StudentProfile.findOne({ userId }).populate(
      'userId',
      'fullName email phone role'
    );

    if (!profile) {
      profile = new StudentProfile({
        userId,
        academic: {},
        economic: {},
        location: {},
        personal: {},
        specialCategories: {},
      });
      profile.calculateCompleteness();
      await profile.save();

      profile = await StudentProfile.findOne({ userId }).populate(
        'userId',
        'fullName email phone role'
      );
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('[Get Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch student profile.',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/profile
 * @desc    Update student profile (accepts partial updates, merges data & recalculates completeness)
 * @access  Private (JWT Protected)
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { academic, economic, location, personal, specialCategories } = req.body;

    let profile = await StudentProfile.findOne({ userId });

    if (!profile) {
      profile = new StudentProfile({ userId });
    }

    // Merge nested partial updates safely
    if (academic) {
      profile.academic = {
        ...profile.academic.toObject(),
        ...academic,
      };
    }

    if (economic) {
      profile.economic = {
        ...profile.economic.toObject(),
        ...economic,
      };
    }

    if (location) {
      profile.location = {
        ...profile.location.toObject(),
        ...location,
      };
    }

    if (personal) {
      profile.personal = {
        ...profile.personal.toObject(),
        ...personal,
      };
    }

    if (specialCategories) {
      profile.specialCategories = {
        ...profile.specialCategories.toObject(),
        ...specialCategories,
      };
    }

    // Auto calculate completeness score
    profile.calculateCompleteness();
    await profile.save();

    // Re-populate user info
    const updatedProfile = await StudentProfile.findOne({ userId }).populate(
      'userId',
      'fullName email phone role'
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update student profile.',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
