const mongoose = require('mongoose');

const documentChecklistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    scholarshipId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Scholarship reference is required'],
    },
    checkedDocuments: {
      type: [String],
      default: [],
    },
    applied: {
      type: Boolean,
      default: false,
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

// Compound unique index ensuring one checklist per student per scholarship
documentChecklistSchema.index({ userId: 1, scholarshipId: 1 }, { unique: true });

module.exports = mongoose.model('DocumentChecklist', documentChecklistSchema);
