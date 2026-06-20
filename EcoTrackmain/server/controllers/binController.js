const Dustbin = require('../models/Dustbin.js');
const { emitSocketEvent } = require('../services/notificationService.js');

const normalizeStatus = (fillLevel, status) => {
  if (status) return status;
  return Number(fillLevel) >= 90 ? 'full' : 'active';
};

const getBins = async (req, res) => {
  try {
    const bins = await Dustbin.find().sort({ fillLevel: -1, updatedAt: -1 });
    res.status(200).json({ success: true, data: bins });
  } catch (error) {
    console.error('Get bins error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bins' });
  }
};

const createBin = async (req, res) => {
  try {
    const { name, location, fillLevel = 0, status } = req.body;

    const bin = await Dustbin.create({
      name,
      location,
      fillLevel,
      status: normalizeStatus(fillLevel, status),
      lastUpdated: new Date()
    });

    emitSocketEvent('data:update', {
      scope: 'all',
      entity: 'bin',
      action: 'created',
      binId: bin._id.toString()
    });

    res.status(201).json({ success: true, message: 'Bin created successfully', data: bin });
  } catch (error) {
    console.error('Create bin error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating bin' });
  }
};

const updateBin = async (req, res) => {
  try {
    const updates = { ...req.body, lastUpdated: new Date() };
    if (updates.fillLevel !== undefined) {
      updates.status = normalizeStatus(updates.fillLevel, updates.status);
    }

    const bin = await Dustbin.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!bin) {
      return res.status(404).json({ success: false, message: 'Bin not found' });
    }

    emitSocketEvent('data:update', {
      scope: 'all',
      entity: 'bin',
      action: 'updated',
      binId: bin._id.toString()
    });

    res.status(200).json({ success: true, message: 'Bin updated successfully', data: bin });
  } catch (error) {
    console.error('Update bin error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating bin' });
  }
};

const deleteBin = async (req, res) => {
  try {
    const bin = await Dustbin.findByIdAndDelete(req.params.id);

    if (!bin) {
      return res.status(404).json({ success: false, message: 'Bin not found' });
    }

    emitSocketEvent('data:update', {
      scope: 'all',
      entity: 'bin',
      action: 'deleted',
      binId: req.params.id
    });

    res.status(200).json({ success: true, message: 'Bin deleted successfully' });
  } catch (error) {
    console.error('Delete bin error:', error);
    res.status(500).json({ success: false, message: 'Error deleting bin' });
  }
};

module.exports = {
  getBins,
  createBin,
  updateBin,
  deleteBin
};
