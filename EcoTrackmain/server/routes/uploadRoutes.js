const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth.js');
const { upload, handleMulterError, getFileUrl } = require('../middleware/uploadCloudinary.js');

router.post('/', protect, upload.array('images', 5), handleMulterError, (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      url: getFileUrl(req, file),
      public_id: file.public_id,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} file(s) uploaded successfully`,
      data: {
        files,
        urls: files.map((file) => file.url)
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Error uploading files' });
  }
});

router.post('/single', protect, upload.single('image'), handleMulterError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        url: getFileUrl(req, req.file),
        public_id: req.file.public_id,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Error uploading file' });
  }
});

module.exports = router;
