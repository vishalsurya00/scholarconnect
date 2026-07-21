const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scholarship name is required'],
      trim: true,
    },
    issuingBody: {
      type: String,
      enum: ['Central Govt', 'State Govt', 'Private Trust'],
      required: [true, 'Issuing body type is required'],
    },
    state: {
      type: String,
      default: 'ALL',
      trim: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    renewable: {
      type: Boolean,
      default: false,
    },
    awardAmount: {
      type: String,
      required: [true, 'Award amount description is required'],
      trim: true,
    },
    applicationLink: {
      type: String,
      required: [true, 'Official application link is required'],
      trim: true,
    },
    sourceVerifiedLink: {
      type: String,
      required: [true, 'Verified source proof link is required'],
      trim: true,
    },
    documentsRequired: {
      type: [String],
      default: [],
    },
    eligibilityRules: {
      minClass: {
        type: String,
        default: '1st',
      },
      maxClass: {
        type: String,
        default: 'PG',
      },
      maxIncome: {
        type: Number,
        default: null,
      },
      categories: {
        type: [String],
        default: ['ALL'],
      },
      states: {
        type: [String],
        default: ['ALL'],
      },
      genders: {
        type: [String],
        default: ['ALL'],
      },
      requiresDisability: {
        type: Boolean,
        default: false,
      },
      requiresFirstGen: {
        type: Boolean,
        default: false,
      },
      requiresSportsQuota: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastVerifiedDate: {
      type: Date,
      default: Date.now,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);
