const GarbageReport = require('../models/GarbageReport.js');
const User = require('../models/User.js');
const RewardTransaction = require('../models/RewardTransaction.js');
const Notification = require('../models/Notification.js');
const { emitSocketEvent } = require('../services/notificationService.js');

const parseCoordinate = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeLocation = (payload = {}) => {
  let location = payload.location || {};

  if (typeof location === 'string') {
    try {
      location = JSON.parse(location);
    } catch {
      location = { address: location };
    }
  }

  const sourceCoordinates = location.coordinates || location || payload.coordinates || {};
  const lat = parseCoordinate(sourceCoordinates.lat ?? sourceCoordinates.latitude);
  const lng = parseCoordinate(sourceCoordinates.lng ?? sourceCoordinates.longitude ?? sourceCoordinates.lon);
  const hasCoordinates = lat !== null && lng !== null && !(lat === 0 && lng === 0);

  return {
    address: location.address || payload.address || '',
    coordinates: hasCoordinates ? { lat, lng } : undefined
  };
};

const extractImageUrls = (req) => {
  let imageUrls = [];

  if (req.files?.length) {
    imageUrls = req.files
      .map((file) => file.path || file.secure_url || file.url || file.location)
      .filter(Boolean);
  }

  if (!imageUrls.length) {
    const candidates = [req.body.images, req.body.image, req.body.imageUrls, req.body.urls, req.body.files];

    for (const candidate of candidates) {
      if (!candidate) continue;

      if (Array.isArray(candidate)) {
        imageUrls = candidate
          .map((item) => (typeof item === 'string' ? item : item?.path || item?.secure_url || item?.url || item?.location || ''))
          .filter(Boolean);
      } else if (typeof candidate === 'string') {
        try {
          const parsed = JSON.parse(candidate);
          imageUrls = Array.isArray(parsed)
            ? parsed.map((item) => (typeof item === 'string' ? item : item?.path || item?.secure_url || item?.url || item?.location || '')).filter(Boolean)
            : [parsed.path || parsed.secure_url || parsed.url || parsed.location].filter(Boolean);
        } catch {
          imageUrls = [candidate];
        }
      } else if (typeof candidate === 'object') {
        imageUrls = [candidate.secure_url || candidate.url || candidate.path].filter(Boolean);
      }

      if (imageUrls.length) break;
    }
  }

  return [...new Set(imageUrls.filter((url) => /^https?:\/\//i.test(url) || url.startsWith('/uploads/')))];
};

const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    const reportStats = await GarbageReport.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = {
      pending: 0,
      assigned: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      total: 0
    };

    reportStats.forEach((stat) => {
      stats[stat._id] = stat.count;
      stats.total += stat.count;
    });

    const recentActivity = await RewardTransaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);
    const unreadCount = await Notification.countDocuments({ recipient: user._id, isRead: false });
    const leaderboardPosition = await User.countDocuments({ rewardPoints: { $gt: user.rewardPoints }, role: 'user' }) + 1;
    const totalUsers = await User.countDocuments({ role: 'user' });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          address: user.address,
          rewardPoints: user.rewardPoints,
          memberSince: user.createdAt
        },
        stats,
        recentActivity,
        unreadCount,
        leaderboard: {
          position: leaderboardPosition,
          totalUsers,
          percentile: totalUsers ? Math.round(((totalUsers - leaderboardPosition + 1) / totalUsers) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
};

const getUserReports = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };

    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    const reports = await GarbageReport.find(query)
      .populate('assignedCollector', 'name phone')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await GarbageReport.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ success: false, message: 'Error fetching reports' });
  }
};

const createReport = async (req, res) => {
  try {
    const { title, description, wasteType, estimatedWeight, scheduledDate } = req.body;
    const location = normalizeLocation(req.body);

    if (!location.address) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }

    const report = await GarbageReport.create({
      user: req.user.id,
      title,
      description,
      wasteType,
      estimatedWeight,
      location,
      images: extractImageUrls(req),
      scheduledDate
    });

    emitSocketEvent('data:update', {
      scope: 'all',
      entity: 'report',
      action: 'created',
      reportId: report._id.toString(),
      userId: req.user.id
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully', data: report });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating report' });
  }
};

const getReport = async (req, res) => {
  try {
    const report = await GarbageReport.findOne({ _id: req.params.id, user: req.user.id })
      .populate('assignedCollector', 'name phone');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ success: false, message: 'Error fetching report' });
  }
};

const cancelReport = async (req, res) => {
  try {
    const report = await GarbageReport.findOne({ _id: req.params.id, user: req.user.id });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (!['pending', 'assigned'].includes(report.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel report in current status' });
    }

    report.status = 'cancelled';
    await report.save();

    emitSocketEvent('data:update', {
      scope: 'all',
      entity: 'report',
      action: 'cancelled',
      reportId: report._id.toString(),
      userId: req.user.id
    });

    res.status(200).json({ success: true, message: 'Report cancelled successfully' });
  } catch (error) {
    console.error('Cancel report error:', error);
    res.status(500).json({ success: false, message: 'Error cancelling report' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await User.find({ role: 'user' })
      .select('name rewardPoints avatar createdAt')
      .sort({ rewardPoints: -1 })
      .limit(Number(limit));

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.name,
      avatar: user.avatar,
      rewardPoints: user.rewardPoints,
      memberSince: user.createdAt
    }));

    const currentUser = await User.findById(req.user.id);
    const userPosition = await User.countDocuments({ rewardPoints: { $gt: currentUser.rewardPoints }, role: 'user' }) + 1;

    res.status(200).json({ success: true, data: { leaderboard: rankedLeaderboard, currentUserRank: userPosition } });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching leaderboard' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar, address } = req.body;
    const user = await User.findById(req.user.id);

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (address !== undefined) user.address = address;

    await user.save();

    emitSocketEvent('data:update', {
      scope: 'all',
      entity: 'user',
      action: 'profile-updated',
      userId: user._id.toString()
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        role: user.role,
        rewardPoints: user.rewardPoints
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

module.exports = {
  getDashboardData,
  getUserReports,
  createReport,
  getReport,
  cancelReport,
  getLeaderboard,
  updateProfile
};
