const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    
    console.log(`Found ${blogs.length} blogs`);
    
    return res.status(200).json({
      status: 'success',
      results: blogs.length,
      data: blogs
    });
  } catch (err) {
    console.error('Error in getAllBlogs:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while fetching blogs'
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: blog
    });
  } catch (err) {
    console.error('Error in getBlogById:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while fetching blog'
    });
  }
};

exports.createBlog = async (req, res) => {
  try {
    console.log('Create blog request received:', req.body);
    
    if (req.file) {
      console.log('File uploaded:', req.file);
      req.body.mediaPath = req.file.path.replace(/\\/g, '/');
    }
    
    const newBlog = await Blog.create(req.body);
    console.log('Blog created successfully:', newBlog);
    
    return res.status(201).json({
      status: 'success',
      data: newBlog
    });
  } catch (err) {
    console.error('Error in createBlog:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while creating blog',
      error: err.message
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    console.log('Update blog request received for ID:', req.params.id);
    console.log('Update data:', req.body);
    
    if (req.file) {
      console.log('New file uploaded:', req.file);
      req.body.mediaPath = req.file.path.replace(/\\/g, '/');
      
      const oldBlog = await Blog.findById(req.params.id);
      if (oldBlog && oldBlog.mediaPath) {
        const oldFilePath = path.join(__dirname, '..', oldBlog.mediaPath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log('Deleted old file:', oldFilePath);
        }
      }
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBlog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }
    
    console.log('Blog updated successfully:', updatedBlog);
    
    return res.status(200).json({
      status: 'success',
      data: updatedBlog
    });
  } catch (err) {
    console.error('Error in updateBlog:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while updating blog',
      error: err.message
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }
    
    return res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.error('Error in deleteBlog:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while deleting blog'
    });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }
    
    blog.likes = (blog.likes || 0) + 1;
    await blog.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        likes: blog.likes
      }
    });
  } catch (err) {
    console.error('Error liking blog:', err);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while liking the blog'
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { name, email, content } = req.body;
    
    if (!name || !email || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email and comment content'
      });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }
    
    blog.comments.push({ name, email, content });
    await blog.save();
    
    return res.status(201).json({
      status: 'success',
      data: {
        comment: blog.comments[blog.comments.length - 1]
      }
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while adding comment'
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      results: blog.comments.length,
      data: {
        comments: blog.comments
      }
    });
  } catch (err) {
    console.error('Error getting comments:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while fetching comments'
    });
  }
};
