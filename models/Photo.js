const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Photo title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  category: {
    type: String,
    enum: ['landscape', 'portrait', 'street', 'nature', 'architecture', 'wildlife', 'macro', 'abstract', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
photoSchema.index({ user: 1, createdAt: -1 });
photoSchema.index({ category: 1 });
photoSchema.index({ tags: 1 });

module.exports = mongoose.model('Photo', photoSchema);
