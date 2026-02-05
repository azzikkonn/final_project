const Photo = require('../models/Photo');
const fs = require('fs');
const path = require('path');

// @desc    Create a new photo with file upload
// @route   POST /api/photos
// @access  Private
const createPhoto = async (req, res, next) => {
  try {
    const { title, description, category, tags } = req.body;
    
    // Get image URL - either from file upload or from URL field
    let imageUrl;
    if (req.file) {
      // File was uploaded - create URL path
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      // URL was provided
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file or URL'
      });
    }

    // Parse tags if it's a string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(t => t.trim()).filter(t => t);
    }

    const photo = await Photo.create({
      title,
      description,
      imageUrl,
      category,
      tags: parsedTags,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Photo created successfully',
      data: photo
    });
  } catch (error) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    next(error);
  }
};

// @desc    Get all photos for logged-in user
// @route   GET /api/photos
// @access  Private
const getPhotos = async (req, res, next) => {
  try {
    // Query parameters for filtering and pagination
    const { category, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };
    if (category) {
      query.category = category;
    }

    const photos = await Photo.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Photo.countDocuments(query);

    res.status(200).json({
      success: true,
      count: photos.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: photos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single photo by ID
// @route   GET /api/photos/:id
// @access  Private
const getPhotoById = async (req, res, next) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'username avatar');

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    res.status(200).json({
      success: true,
      data: photo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a photo
// @route   PUT /api/photos/:id
// @access  Private
const updatePhoto = async (req, res, next) => {
  try {
    const { title, description, category, tags } = req.body;

    let photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Prepare update data
    const updateData = { title, description, category };
    
    // Handle new file upload
    if (req.file) {
      // Delete old file if it was an uploaded file
      if (photo.imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', photo.imageUrl);
        fs.unlink(oldPath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      updateData.imageUrl = req.body.imageUrl;
    }

    // Parse tags if provided
    if (tags) {
      updateData.tags = typeof tags === 'string' 
        ? tags.split(',').map(t => t.trim()).filter(t => t)
        : tags;
    }

    photo = await Photo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Photo updated successfully',
      data: photo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a photo
// @route   DELETE /api/photos/:id
// @access  Private
const deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Delete the file if it was an uploaded file
    if (photo.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', photo.imageUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await Photo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPhoto,
  getPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto
};
