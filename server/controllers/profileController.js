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

// Recursive helper to convert empty strings ("") to null for all nested properties
const sanitizeEmptyStrings = (data) => {
  if (data === null || data === undefined) return null;
  if (typeof data !== 'object') {
    return data === '' ? null : data;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeEmptyStrings);
  }
  const sanitized = {};
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (val === '') {
      sanitized[key] = null;
    } else if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
      sanitized[key] = sanitizeEmptyStrings(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
};

/**
 * @route   PUT /api/profile
 * @desc    Update student profile (accepts partial updates, merges data & recalculates completeness)
 * @access  Private (JWT Protected)
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const sanitizedBody = sanitizeEmptyStrings(req.body);
    const { academic, economic, location, personal, specialCategories } = sanitizedBody;

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
      message: error.message || 'Failed to update student profile.',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
