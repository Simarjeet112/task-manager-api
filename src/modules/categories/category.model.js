const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
 
    userId: {
      type: Number,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


categorySchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);