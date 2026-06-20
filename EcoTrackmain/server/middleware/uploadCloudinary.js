const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinaryStoragePackage = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const CloudinaryStorage = cloudinaryStoragePackage.CloudinaryStorage || cloudinaryStoragePackage;

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${req.user?.id || 'anon'}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const cloudinaryStorage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'wastewise/uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        width: 1200,
        crop: 'limit',
        public_id: (req) => `${req.user?.id || 'anon'}-${Date.now()}`
      }
    })
  : null;

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  cb(allowedTypes.includes(file.mimetype) ? null : new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), allowedTypes.includes(file.mimetype));
};

const upload = multer({
  storage: cloudinaryStorage || localStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5
  }
});

const getFileUrl = (req, file) => {
  if (file.path && /^https?:\/\//i.test(file.path)) return file.path;
  if (file.secure_url) return file.secure_url;
  if (file.url) return file.url;
  return `/uploads/${file.filename}`;
};

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 5MB'
        : err.code === 'LIMIT_FILE_COUNT'
          ? 'Too many files. Maximum is 5 files'
          : err.message;

    return res.status(400).json({ success: false, message });
  }

  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  next();
};

module.exports = { upload, handleMulterError, cloudinary, getFileUrl };
