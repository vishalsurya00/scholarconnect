const Scholarship = require('../models/Scholarship');
const StudentProfile = require('../models/StudentProfile');

// Real verified Indian government scholarships for offline fallback
const FALLBACK_SCHOLARSHIPS = [
  {
    _id: 'sc_01',
    name: 'Pre-Matric Scholarship for SC Students',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-01',
    deadline: '2026-10-31',
    renewable: true,
    awardAmount: '₹225-750/month + book grant',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Caste Certificate', 'Income Certificate', 'Bonafide Certificate', 'Aadhaar Card', 'Bank Passbook'],
    eligibilityRules: {
      minClass: '1st',
      maxClass: '10th',
      maxIncome: null,
      categories: ['SC'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_02',
    name: 'Pre-Matric Scholarship for ST Students',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-01',
    deadline: '2026-10-31',
    renewable: true,
    awardAmount: '₹225-750/month + book grant',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Caste Certificate', 'Income Certificate', 'Bonafide Certificate', 'Aadhaar Card', 'Bank Passbook'],
    eligibilityRules: {
      minClass: '1st',
      maxClass: '10th',
      maxIncome: null,
      categories: ['ST'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_03',
    name: 'Pre-Matric Scholarship for Minorities',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-15',
    deadline: '2026-11-15',
    renewable: true,
    awardAmount: '₹1,000-10,000/year',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Minority Community Certificate', 'Income Certificate', 'Bonafide Certificate', 'Aadhaar Card'],
    eligibilityRules: {
      minClass: '1st',
      maxClass: '10th',
      maxIncome: 100000,
      categories: ['Minority'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_04',
    name: 'Post-Matric Scholarship for SC/ST/OBC Students',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-05-01',
    deadline: '2026-11-30',
    renewable: true,
    awardAmount: '₹1,000-20,000/year (varies by course)',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Caste Certificate', 'Income Certificate', 'Previous Marksheet', 'Bonafide Certificate', 'Bank Passbook', 'Aadhaar Card'],
    eligibilityRules: {
      minClass: '11th',
      maxClass: 'PG',
      maxIncome: 250000,
      categories: ['SC', 'ST', 'OBC'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_05',
    name: 'National Means-cum-Merit Scholarship (NMMSS)',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-01',
    deadline: '2026-10-15',
    renewable: true,
    awardAmount: '₹12,000/year',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Income Certificate', 'Previous Marksheet (min 55%)', 'Bonafide Certificate', 'Bank Passbook'],
    eligibilityRules: {
      minClass: '9th',
      maxClass: '12th',
      maxIncome: 350000,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: true,
  },
  {
    _id: 'sc_06',
    name: 'Central Sector Scheme of Scholarships for College Students',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-15',
    deadline: '2026-11-30',
    renewable: true,
    awardAmount: '₹12,000/year (UG), ₹20,000/year (PG)',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Class 12 Marksheet (min 80th percentile)', 'Income Certificate', 'Bonafide Certificate', 'Bank Passbook', 'Aadhaar Card'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'UG-4',
      maxIncome: 450000,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: true,
  },
  {
    _id: 'sc_07',
    name: 'PM Young Achievers Scholarship (Vibrant India Scheme)',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-05-15',
    deadline: '2026-10-31',
    renewable: true,
    awardAmount: '₹75,000/year (residential), ₹25,000/year (day scholar)',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['OBC Certificate', 'Income Certificate', 'Previous Marksheet', 'Bonafide Certificate'],
    eligibilityRules: {
      minClass: '9th',
      maxClass: '12th',
      maxIncome: 250000,
      categories: ['OBC'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_08',
    name: 'Top Class Education Scheme for SC Students',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-01',
    deadline: '2026-12-15',
    renewable: true,
    awardAmount: 'Full tuition + maintenance allowance',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Caste Certificate', 'Income Certificate', 'Admission Proof (notified institution)', 'Bank Passbook'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'PG',
      maxIncome: 800000,
      categories: ['SC'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: true,
  },
  {
    _id: 'sc_09',
    name: 'AICTE Pragati Scholarship for Girls',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-15',
    deadline: '2026-11-15',
    renewable: true,
    awardAmount: '₹50,000/year',
    applicationLink: 'https://www.aicte-pragati-saksham-gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Income Certificate', 'Admission Proof (AICTE approved institution)', 'Aadhaar Card', 'Bank Passbook'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'UG-4',
      maxIncome: 800000,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['Female'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_10',
    name: 'AICTE Saksham Scholarship for Differently-Abled Students',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-15',
    deadline: '2026-11-15',
    renewable: true,
    awardAmount: '₹50,000/year',
    applicationLink: 'https://www.aicte-pragati-saksham-gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Disability Certificate (min 40%)', 'Income Certificate', 'Admission Proof', 'Aadhaar Card'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'UG-4',
      maxIncome: 800000,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: true,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_11',
    name: 'Maulana Azad National Fellowship',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-05-01',
    deadline: '2026-10-31',
    renewable: true,
    awardAmount: 'Monthly stipend (MPhil/PhD rates)',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Minority Certificate', 'NET/JRF or Admission Proof', 'Bonafide Certificate'],
    eligibilityRules: {
      minClass: 'PG',
      maxClass: 'PG',
      maxIncome: null,
      categories: ['Minority'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_12',
    name: 'National Fellowship for SC Students (UGC)',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-05-01',
    deadline: '2026-10-31',
    renewable: true,
    awardAmount: 'Monthly stipend for MPhil/PhD',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Caste Certificate', 'NET/JRF Qualification or Admission Proof', 'Bonafide Certificate'],
    eligibilityRules: {
      minClass: 'PG',
      maxClass: 'PG',
      maxIncome: null,
      categories: ['SC'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_13',
    name: 'PM Scholarship Scheme for Wards of Ex-Servicemen',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-01',
    deadline: '2026-11-30',
    renewable: true,
    awardAmount: '₹2,500-3,000/month',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Ex-Servicemen Certificate', 'Admission Proof', 'Bank Passbook'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'PG',
      maxIncome: null,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_14',
    name: 'Single Girl Child Scholarship (CBSE)',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-07-01',
    deadline: '2026-12-15',
    renewable: true,
    awardAmount: '₹500/month (₹6,000/year)',
    applicationLink: 'https://www.cbse.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Single Girl Child Certificate from School', 'Class 12 Marksheet', 'Bank Passbook'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'UG-4',
      maxIncome: null,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['Female'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
  {
    _id: 'sc_15',
    name: 'Merit-cum-Means Scholarship for Professional Courses',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-06-15',
    deadline: '2026-11-30',
    renewable: true,
    awardAmount: 'Course fee (up to ₹20,000) + maintenance allowance',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://scholarships.gov.in',
    documentsRequired: ['Minority Certificate', 'Income Certificate', 'Admission Proof (professional/technical course)', 'Bank Passbook'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'PG',
      maxIncome: 250000,
      categories: ['Minority'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: false,
  },
];

// Numeric rank index mapping for class comparison
const CLASS_RANKS = {
  '1st': 1,
  '2nd': 2,
  '3rd': 3,
  '4th': 4,
  '5th': 5,
  '6th': 6,
  '7th': 7,
  '8th': 8,
  '9th': 9,
  '10th': 10,
  '11th': 11,
  '12th': 12,
  'UG-1': 13,
  'UG-2': 14,
  'UG-3': 15,
  'UG-4': 16,
  'PG': 17,
};

/**
 * Helper function to evaluate matching status for a single scholarship
 * Returns: 'eligible' | 'uncertain' | 'not_eligible'
 */
const evaluateScholarshipMatch = (scholarship, profile) => {
  const rules = scholarship.eligibilityRules || {};
  let hasMissing = false;

  // 1. Class / Education Level Rule
  const studentClass = profile?.academic?.currentClass;
  if (rules.minClass || rules.maxClass) {
    if (!studentClass) {
      hasMissing = true;
    } else {
      const studentRank = CLASS_RANKS[studentClass] || 0;
      const minRank = CLASS_RANKS[rules.minClass] || 1;
      const maxRank = CLASS_RANKS[rules.maxClass] || 17;

      if (studentRank < minRank || studentRank > maxRank) {
        return { status: 'not_eligible', reason: `Class requirement (${rules.minClass} to ${rules.maxClass})` };
      }
    }
  }

  // 2. Domicile State Rule
  const studentState = profile?.location?.state;
  const allowedStates = rules.states && rules.states.length > 0 ? rules.states : [scholarship.state || 'ALL'];
  if (!allowedStates.includes('ALL')) {
    if (!studentState) {
      hasMissing = true;
    } else if (!allowedStates.includes(studentState)) {
      return { status: 'not_eligible', reason: `State requirement (${allowedStates.join(', ')})` };
    }
  }

  // 3. Category Rule
  const studentCategory = profile?.personal?.category;
  const allowedCategories = rules.categories || ['ALL'];
  if (!allowedCategories.includes('ALL')) {
    if (!studentCategory) {
      hasMissing = true;
    } else if (!allowedCategories.includes(studentCategory)) {
      return { status: 'not_eligible', reason: `Category requirement (${allowedCategories.join(', ')})` };
    }
  }

  // 4. Annual Income Rule
  const studentIncome = profile?.economic?.annualIncome;
  if (rules.maxIncome !== null && rules.maxIncome !== undefined) {
    if (studentIncome === null || studentIncome === undefined) {
      hasMissing = true;
    } else if (studentIncome > rules.maxIncome) {
      return { status: 'not_eligible', reason: `Max Income requirement (≤ ₹${rules.maxIncome.toLocaleString('en-IN')})` };
    }
  }

  // 5. Gender Rule
  const studentGender = profile?.personal?.gender;
  const allowedGenders = rules.genders || ['ALL'];
  if (!allowedGenders.includes('ALL')) {
    if (!studentGender) {
      hasMissing = true;
    } else if (!allowedGenders.includes(studentGender)) {
      return { status: 'not_eligible', reason: `Gender requirement (${allowedGenders.join(', ')})` };
    }
  }

  // 6. Quota Booleans
  if (rules.requiresDisability && !profile?.personal?.disabilityStatus) {
    return { status: 'not_eligible', reason: 'Requires Person with Disability (PWD) status' };
  }

  if (rules.requiresFirstGen && !profile?.specialCategories?.firstGenLearner) {
    return { status: 'not_eligible', reason: 'Requires First-Generation Learner status' };
  }

  if (rules.requiresSportsQuota && !profile?.specialCategories?.sportsQuota) {
    return { status: 'not_eligible', reason: 'Requires Sports Quota achievement' };
  }

  if (hasMissing) {
    return { status: 'uncertain', reason: 'Missing profile fields required for complete match verification' };
  }

  return { status: 'eligible', reason: 'All criteria satisfied!' };
};

/**
 * @route   GET /api/scholarships
 * @desc    Fetch all active scholarships with optional query filters (?state=, ?class=, ?category=)
 * @access  Public
 */
const getAllScholarships = async (req, res) => {
  try {
    const { state, class: reqClass, category } = req.query;

    let scholarships = [];
    try {
      const query = { isActive: true };
      if (state && state !== 'ALL') {
        query.$or = [{ state: 'ALL' }, { state: state }, { 'eligibilityRules.states': { $in: ['ALL', state] } }];
      }
      if (category && category !== 'ALL') {
        query['eligibilityRules.categories'] = { $in: ['ALL', category] };
      }
      scholarships = await Scholarship.find(query).sort({ featured: -1, deadline: 1 });
    } catch (dbErr) {
      console.warn('[Scholarships Controller]: MongoDB offline, using fallback scholarships.');
      scholarships = FALLBACK_SCHOLARSHIPS;
    }

    if (!scholarships || scholarships.length === 0) {
      scholarships = FALLBACK_SCHOLARSHIPS;
    }

    return res.status(200).json({
      success: true,
      count: scholarships.length,
      scholarships,
    });
  } catch (error) {
    console.error('[Get All Scholarships Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch scholarships.',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/scholarships/matched
 * @desc    Get matched scholarships for logged-in user (eligible, uncertain, not_eligible)
 * @access  Private (JWT Protected)
 */
const getMatchedScholarships = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = null;
    try {
      profile = await StudentProfile.findOne({ userId });
    } catch (err) {
      console.warn('[Matched Scholarships]: Database error fetching profile, using empty profile object.');
    }

    if (!profile) {
      profile = { academic: {}, economic: {}, location: {}, personal: {}, specialCategories: {} };
    }

    let scholarships = [];
    try {
      scholarships = await Scholarship.find({ isActive: true }).sort({ featured: -1, deadline: 1 });
    } catch (err) {
      scholarships = FALLBACK_SCHOLARSHIPS;
    }

    if (!scholarships || scholarships.length === 0) {
      scholarships = FALLBACK_SCHOLARSHIPS;
    }

    const eligible = [];
    const uncertain = [];
    const not_eligible = [];

    scholarships.forEach((item) => {
      const plainItem = typeof item.toObject === 'function' ? item.toObject() : item;
      const matchResult = evaluateScholarshipMatch(plainItem, profile);
      const itemWithMatchInfo = {
        ...plainItem,
        matchReason: matchResult.reason,
      };

      if (matchResult.status === 'eligible') {
        eligible.push(itemWithMatchInfo);
      } else if (matchResult.status === 'uncertain') {
        uncertain.push(itemWithMatchInfo);
      } else {
        not_eligible.push(itemWithMatchInfo);
      }
    });

    return res.status(200).json({
      success: true,
      profileCompleteness: profile.profileCompleteness || 0,
      counts: {
        eligible: eligible.length,
        uncertain: uncertain.length,
        not_eligible: not_eligible.length,
        total: scholarships.length,
      },
      matched: {
        eligible,
        uncertain,
        not_eligible,
      },
    });
  } catch (error) {
    console.error('[Get Matched Scholarships Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute scholarship matches.',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/scholarships/:id
 * @desc    Fetch single scholarship details by ID
 * @access  Public
 */
const getScholarshipById = async (req, res) => {
  try {
    const { id } = req.params;

    let scholarship = null;
    try {
      scholarship = await Scholarship.findById(id);
    } catch (err) {
      scholarship = FALLBACK_SCHOLARSHIPS.find((s) => String(s._id) === String(id));
    }

    if (!scholarship) {
      scholarship = FALLBACK_SCHOLARSHIPS.find((s) => String(s._id) === String(id));
    }

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found.',
      });
    }

    const plainScholarship = typeof scholarship.toObject === 'function' ? scholarship.toObject() : scholarship;

    return res.status(200).json({
      success: true,
      scholarship: plainScholarship,
    });
  } catch (error) {
    console.error('[Get Scholarship By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch scholarship details.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllScholarships,
  getMatchedScholarships,
  getScholarshipById,
};
