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
  const isHigherEd = ['11th', '12th', 'UG-1', 'UG-2', 'UG-3', 'UG-4', 'PG'].includes(
    this.academic?.currentClass
  );

  const trackedFields = [
    { name: 'academic.currentClass', val: this.academic?.currentClass },
    { name: 'location.state', val: this.location?.state },
    { name: 'personal.category', val: this.personal?.category },
    { name: 'economic.annualIncome', val: this.economic?.annualIncome },
    { name: 'location.district', val: this.location?.district },
    { name: 'location.areaType', val: this.location?.areaType },
    { name: 'academic.institutionType', val: this.academic?.institutionType },
    { name: 'academic.lastPercentage', val: this.academic?.lastPercentage },
    { name: 'economic.parentOccupation', val: this.economic?.parentOccupation },
    { name: 'economic.familyStatus', val: this.economic?.familyStatus },
    { name: 'personal.gender', val: this.personal?.gender },
    {
      name: 'academic.stream',
      val: isHigherEd ? this.academic?.stream : (this.academic?.currentClass ? 'N/A' : null),
    },
    { name: 'personal.disabilityStatus', isBool: true, val: this.personal?.disabilityStatus },
    { name: 'specialCategories.sportsQuota', isBool: true, val: this.specialCategories?.sportsQuota },
    { name: 'specialCategories.minorityReligion', isBool: true, val: this.specialCategories?.minorityReligion },
    { name: 'specialCategories.exServicemenChild', isBool: true, val: this.specialCategories?.exServicemenChild },
    { name: 'specialCategories.firstGenLearner', isBool: true, val: this.specialCategories?.firstGenLearner },
  ];

  let filledCount = 0;
  const missingFields = [];

  trackedFields.forEach((field) => {
    let isFilled = false;

    if (field.isBool) {
      // Boolean fields count as filled whether true OR false (boolean presence)
      isFilled = typeof field.val === 'boolean' || field.val === true || field.val === false;
    } else {
      isFilled = field.val !== null && field.val !== undefined && field.val !== '';
    }

    if (isFilled) {
      filledCount++;
    } else {
      missingFields.push(field.name);
    }
  });

  const totalFields = trackedFields.length;
  const percentage = Math.min(100, Math.round((filledCount / totalFields) * 100));

  this.profileCompleteness = percentage;

  console.log(
    `[Profile Completeness Debug]: User ${this.userId} score: ${percentage}% (${filledCount}/${totalFields}). Missing fields:`,
    missingFields.length > 0 ? missingFields : 'None (100% Complete!)'
  );

  return percentage;
};

// Pre-save hook to ensure profileCompleteness is updated before saving
studentProfileSchema.pre('save', function (next) {
  this.calculateCompleteness();
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
