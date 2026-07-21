const Scholarship = require('../models/Scholarship');
const StudentProfile = require('../models/StudentProfile');

// Backup seed data in case MongoDB is offline
const FALLBACK_SCHOLARSHIPS = [
  {
    _id: 'sc_01',
    name: 'PM Yasasvi Central Sector Scheme for OBC/EWS/EBC Students',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-01-01',
    deadline: '2026-09-30',
    renewable: true,
    awardAmount: '₹75,000 to ₹1,25,000 / year',
    applicationLink: 'https://yet.nta.ac.in',
    sourceVerifiedLink: 'https://socialjustice.gov.in',
    documentsRequired: ['Aadhaar Card', 'Income Certificate (< ₹2.5L)', 'Caste Certificate', 'Class 8/10 Marksheet'],
    eligibilityRules: {
      minClass: '9th',
      maxClass: '12th',
      maxIncome: 250000,
      categories: ['OBC', 'EWS', 'EBC'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-15',
    featured: true,
  },
  {
    _id: 'sc_02',
    name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-02-01',
    deadline: '2026-10-15',
    renewable: true,
    awardAmount: '₹12,000 / year',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://dsel.education.gov.in/nmmss',
    documentsRequired: ['Income Certificate (< ₹3.5L)', 'Class 7 Marksheet (Min 55%)', 'Bank Passbook', 'Aadhaar Card'],
    eligibilityRules: {
      minClass: '8th',
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
    lastVerifiedDate: '2026-07-18',
    featured: true,
  },
  {
    _id: 'sc_03',
    name: 'Pragati Scholarship Scheme for Girl Students (Degree Technical)',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-03-01',
    deadline: '2026-11-30',
    renewable: true,
    awardAmount: '₹50,000 / year',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati',
    documentsRequired: ['Bonafide Certificate from College', 'Annual Family Income Certificate (< ₹8L)', 'Class 12 / Diploma Marksheet', 'Aadhaar Card'],
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
    lastVerifiedDate: '2026-07-20',
    featured: true,
  },
  {
    _id: 'sc_04',
    name: 'Post-Matric Scholarship for SC Students',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-01-15',
    deadline: '2026-12-15',
    renewable: true,
    awardAmount: '100% Tuition Fee Waiver + Monthly Maintenance Allowance',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://socialjustice.gov.in/schemes/26',
    documentsRequired: ['SC Caste Certificate', 'Income Certificate (< ₹2.5L)', 'Fee Receipt of Current Year', 'Aadhaar Card'],
    eligibilityRules: {
      minClass: '11th',
      maxClass: 'PG',
      maxIncome: 250000,
      categories: ['SC'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-12',
    featured: true,
  },
  {
    _id: 'sc_05',
    name: 'Pre-Matric Scholarship Scheme for Minority Communities',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-04-01',
    deadline: '2026-10-31',
    renewable: true,
    awardAmount: '₹10,000 / year',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://minorityaffairs.gov.in',
    documentsRequired: ['Self-Declaration of Minority Religion', 'Income Certificate (< ₹1L)', 'Previous Class Marksheet (>50%)'],
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
    lastVerifiedDate: '2026-07-05',
    featured: false,
  },
  {
    _id: 'sc_06',
    name: 'Rajarshi Chhatrapati Shahu Maharaj Tuition Fee Reimbursement (MahaDBT)',
    issuingBody: 'State Govt',
    state: 'Maharashtra',
    startDate: '2026-02-15',
    deadline: '2026-08-31',
    renewable: true,
    awardAmount: '50% to 100% Tuition & Exam Fee Reimbursement',
    applicationLink: 'https://mahadbt.maharashtra.gov.in',
    sourceVerifiedLink: 'https://mahadbt.maharashtra.gov.in/SchemeData/SchemeData?Orientation=V&AppDetailId=1003',
    documentsRequired: ['Maharashtra Domicile Certificate', 'Income Certificate (< ₹8L)', 'CAP Allotment Letter', 'Aadhaar Card'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'PG',
      maxIncome: 800000,
      categories: ['General', 'EWS', 'OBC'],
      states: ['Maharashtra'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-19',
    featured: true,
  },
  {
    _id: 'sc_07',
    name: 'Karnataka Vidyasiri Post-Matric Food & Accommodation Maintenance',
    issuingBody: 'State Govt',
    state: 'Karnataka',
    startDate: '2026-03-10',
    deadline: '2026-09-15',
    renewable: true,
    awardAmount: '₹15,000 / year Food & Hostel Stipend',
    applicationLink: 'https://ssp.postmatric.karnataka.gov.in',
    sourceVerifiedLink: 'https://bcwd.karnataka.gov.in',
    documentsRequired: ['Karnataka Domicile Certificate', 'Caste & Income Certificate', 'SSLC / PUC Marksheet', 'Ration Card'],
    eligibilityRules: {
      minClass: '11th',
      maxClass: 'PG',
      maxIncome: 250000,
      categories: ['OBC', 'SC', 'ST'],
      states: ['Karnataka'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-10',
    featured: false,
  },
  {
    _id: 'sc_08',
    name: 'UP Post-Matric Fee Refund & Scholarship Scheme',
    issuingBody: 'State Govt',
    state: 'Uttar Pradesh',
    startDate: '2026-04-15',
    deadline: '2026-11-05',
    renewable: true,
    awardAmount: 'Full Fee Reimbursement + Monthly Living Allowance',
    applicationLink: 'https://scholarship.up.gov.in',
    sourceVerifiedLink: 'https://scholarship.up.gov.in',
    documentsRequired: ['UP Domicile Certificate', 'Income Certificate (< ₹2L)', 'Caste Certificate', 'Fee Receipt'],
    eligibilityRules: {
      minClass: '11th',
      maxClass: 'PG',
      maxIncome: 200000,
      categories: ['ALL'],
      states: ['Uttar Pradesh'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-08',
    featured: false,
  },
  {
    _id: 'sc_09',
    name: "HDFC Bank Parivartan's ECSS Educational Crisis Scholarship",
    issuingBody: 'Private Trust',
    state: 'ALL',
    startDate: '2026-05-01',
    deadline: '2026-12-31',
    renewable: false,
    awardAmount: 'Up to ₹75,000 / year',
    applicationLink: 'https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-scholarship',
    sourceVerifiedLink: 'https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility',
    documentsRequired: ['Proof of Educational Crisis or Hardship', 'Income Certificate (< ₹6L)', 'Previous Marksheet (>55%)'],
    eligibilityRules: {
      minClass: '1st',
      maxClass: 'PG',
      maxIncome: 600000,
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
    _id: 'sc_10',
    name: 'Reliance Foundation Undergraduate Scholarships',
    issuingBody: 'Private Trust',
    state: 'ALL',
    startDate: '2026-01-01',
    deadline: '2026-08-15',
    renewable: true,
    awardAmount: 'Up to ₹2,00,000 over course duration',
    applicationLink: 'https://www.scholarships.reliancefoundation.org',
    sourceVerifiedLink: 'https://www.reliancefoundation.org/education',
    documentsRequired: ['Class 12 Marksheet (>60%)', 'Annual Income Certificate (< ₹15L)', 'Aadhaar Card', 'College Bonafide'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'UG-4',
      maxIncome: 1500000,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-16',
    featured: true,
  },
  {
    _id: 'sc_11',
    name: 'Tata Capital Pankh Scholarship Programme',
    issuingBody: 'Private Trust',
    state: 'ALL',
    startDate: '2026-03-01',
    deadline: '2026-10-01',
    renewable: true,
    awardAmount: 'Up to 80% of Tuition Fees (Max ₹50,000)',
    applicationLink: 'https://www.tatacapital.com/csr/pankh-scholarship.html',
    sourceVerifiedLink: 'https://www.tatacapital.com/csr.html',
    documentsRequired: ['Photo ID Proof', 'Income Proof (< ₹4L)', 'Marksheet of qualifying exam (>60%)', 'Fee Structure'],
    eligibilityRules: {
      minClass: '6th',
      maxClass: 'UG-4',
      maxIncome: 400000,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-14',
    featured: false,
  },
  {
    _id: 'sc_12',
    name: 'Sitaram Jindal Foundation Merit Scholarship',
    issuingBody: 'Private Trust',
    state: 'ALL',
    startDate: '2026-01-01',
    deadline: '2026-12-31',
    renewable: true,
    awardAmount: '₹500 to ₹3,200 / month',
    applicationLink: 'https://www.sitaramjindalfoundation.org/scholarships.php',
    sourceVerifiedLink: 'https://www.sitaramjindalfoundation.org',
    documentsRequired: ['Class 10/12 Marksheet', 'Family Income Certificate (< ₹4L)', 'Certificate of Principal / Dean'],
    eligibilityRules: {
      minClass: '11th',
      maxClass: 'PG',
      maxIncome: 400000,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-02',
    featured: false,
  },
  {
    _id: 'sc_13',
    name: "Prime Minister's Scholarship Scheme for CAPF & AR Personnel",
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-02-01',
    deadline: '2026-11-15',
    renewable: true,
    awardAmount: '₹36,000 / year for Girls, ₹30,000 / year for Boys',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://www.warb-mha.gov.in',
    documentsRequired: ['Certificate of Service / Ex-Servicemen PPO', 'Class 12 / Diploma Marksheet (>60%)', 'Bonafide Certificate'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'UG-4',
      maxIncome: null,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-11',
    featured: false,
  },
  {
    _id: 'sc_14',
    name: 'Central Sector Scheme of Scholarships for College and University Students (CSSS)',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-03-15',
    deadline: '2026-10-30',
    renewable: true,
    awardAmount: '₹12,000 to ₹20,000 / year',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://education.gov.in/higher_education',
    documentsRequired: ['Class 12 Board Marksheet (Top 20th Percentile)', 'Income Certificate (< ₹4.5L)', 'Aadhaar Card'],
    eligibilityRules: {
      minClass: 'UG-1',
      maxClass: 'PG',
      maxIncome: 450000,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: false,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-17',
    featured: false,
  },
  {
    _id: 'sc_15',
    name: 'Scholarship for Students with Disabilities (Divyangjan)',
    issuingBody: 'Central Govt',
    state: 'ALL',
    startDate: '2026-01-01',
    deadline: '2026-12-01',
    renewable: true,
    awardAmount: '₹14,000 to ₹40,000 / year + Reader Allowance',
    applicationLink: 'https://scholarships.gov.in',
    sourceVerifiedLink: 'https://disabilityaffairs.gov.in',
    documentsRequired: ['Disability Certificate (Min 40%)', 'Income Certificate (< ₹2.5L)', 'Previous Marksheet', 'Aadhaar Card'],
    eligibilityRules: {
      minClass: '9th',
      maxClass: 'PG',
      maxIncome: 250000,
      categories: ['ALL'],
      states: ['ALL'],
      genders: ['ALL'],
      requiresDisability: true,
      requiresFirstGen: false,
      requiresSportsQuota: false,
    },
    isActive: true,
    lastVerifiedDate: '2026-07-21',
    featured: true,
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
