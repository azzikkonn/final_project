const express = require('express');
const router = express.Router();
const {
  createPhoto,
  getPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto
} = require('../controllers/photoController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/upload');

// All routes below are protected
router.use(protect);

// @route   POST /api/photos
// @desc    Create a new photo (with file upload support)
// @access  Private
router.post('/', upload.single('image'), createPhoto);

// @route   GET /api/photos
// @desc    Get all user photos
// @access  Private
router.get('/', getPhotos);

// @route   GET /api/photos/:id
// @desc    Get a single photo
// @access  Private
router.get('/:id', getPhotoById);

// @route   PUT /api/photos/:id
// @desc    Update a photo (with file upload support)
// @access  Private
router.put('/:id', upload.single('image'), updatePhoto);

// @route   DELETE /api/photos/:id
// @desc    Delete a photo
// @access  Private
router.delete('/:id', deletePhoto);

module.exports = router;
