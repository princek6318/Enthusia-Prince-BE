const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A blog must have a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'A blog must have a description'],
    trim: true
  },
  mediaPath: {
    type: String,
    default: null
  },
  mediaUrl: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: 'General'
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
