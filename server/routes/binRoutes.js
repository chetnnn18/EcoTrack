const express = require('express');
const { body, validationResult } = require('express-validator');
const { getBins, createBin, updateBin, deleteBin } = require('../controllers/binController.js');
const { protect } = require('../middleware/auth.js');
const { roleCheck } = require('../middleware/roleCheck.js');

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const createBinValidation = [
  body('name').trim().notEmpty().withMessage('Bin name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('fillLevel').optional().isInt({ min: 0, max: 100 }).withMessage('Fill level must be 0-100'),
  body('status').optional().isIn(['active', 'maintenance', 'full', 'inactive']).withMessage('Invalid status')
];

const updateBinValidation = [
  body('name').optional().trim().notEmpty().withMessage('Bin name cannot be empty'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('fillLevel').optional().isInt({ min: 0, max: 100 }).withMessage('Fill level must be 0-100'),
  body('status').optional().isIn(['active', 'maintenance', 'full', 'inactive']).withMessage('Invalid status')
];

router.use(protect);

router.get('/', getBins);

router.use(roleCheck('admin'));
router.post('/', createBinValidation, handleValidationErrors, createBin);
router.patch('/:id', updateBinValidation, handleValidationErrors, updateBin);
router.delete('/:id', deleteBin);

module.exports = router;
