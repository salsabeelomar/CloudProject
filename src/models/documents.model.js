const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    default: 'Uncategorized',
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true,
  },
  sizeKB: {
    type: Number,
    required: true,
  },
  cloudURL: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Document', DocumentSchema);