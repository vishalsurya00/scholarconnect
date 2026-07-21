const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    academic: {
      currentClass: {
        type: String,
        default: null,
        set: (v) => (v === '' ? null : v),
      },
      stream: {
        type: String,
        default: null,
        set: (v) => (v === '' ? null : v),
      },
      institutionType: {
        type: String,
        enum: ['Government', 'Private', 'Government-Aided', 'Deemed', 'Other', null],
        default: null,
        set: (v) => (v === '' ? null : v),
      },
      lastPercentage: {
        type: Number,
        default: null,
      },
    },
    economic: {
      annualIncome: {
        type: Number,
        default: null,
      },
      parentOccupation: {
        type: String,
        default: null,
        set: (v) => (v === '' ? null : v),
      },
      familyStatus: {
        type: String,
        enum: ['singleParent', 'orphan', 'none'],
        default: 'none',
        set: (v) => (v === '' ? null : v),
      },
    },
    location: {
      state: {
        type: String,
        default: null,
        set: (v) => (v === '' ? null : v),
      },
      district: {
        type: String,
        default: null,
        set: (v) => (v === '' ? null : v),
      },
      areaType: {
        type: String,
        enum: ['rural', 'urban', null],
        default: null,
        set: (v) => (v === '' ? null : v),
      },
    },
    personal: {
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', null],
        default: null,
        set: (v) => (v === '' ? null : v),
      },
      category: {
        type: String,
        enum: ['SC', 'ST', 'OBC', 'General', 'EWS', 'Minority', null],
        default: null,
        set: (v) => (v === '' ? null : v),
      },
      disabilityStatus: {
        type: Boolean,
        default: false,
      },
    },
    specialCategories: {
      sportsQuota: {
        type: Boolean,
        default: false,
      },
      minorityReligion: {
        type: Boolean,
        default: false,
      },
      exServicemenChild: {
        type: Boolean,
        default: false,
      },
      firstGenLearner: {
        type: Boolean,
        default: false,
      },
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Method to calculate completeness percentage dynamically
studentProfileSchema.methods.calculateCompleteness = function () {
  const fieldsToCheck = [
    this.academic?.currentClass,
    this.location?.state,
    this.personal?.category,
    this.economic?.annualIncome,
    this.location?.district,
    this.location?.areaType,
    this.academic?.institutionType,
    this.academic?.lastPercentage,
    this.economic?.parentOccupation,
    this.economic?.familyStatus && this.economic.familyStatus !== 'none' ? this.economic.familyStatus : null,
    this.personal?.gender,
    // Stream counts if higher education or if stream is set
    ['11th', '12th', 'UG-1', 'UG-2', 'UG-3', 'UG-4', 'PG'].includes(this.academic?.currentClass)
      ? this.academic?.stream
      : 'N/A',
  ];

  let filledCount = 0;
  fieldsToCheck.forEach((val) => {
    if (val !== null && val !== undefined && val !== '') {
      filledCount++;
    }
  });

  const totalFields = fieldsToCheck.length;
  const percentage = Math.min(100, Math.round((filledCount / totalFields) * 100));
  this.profileCompleteness = percentage;
  return percentage;
};

// Pre-save hook to ensure profileCompleteness is updated before saving
studentProfileSchema.pre('save', function (next) {
  this.calculateCompleteness();
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
