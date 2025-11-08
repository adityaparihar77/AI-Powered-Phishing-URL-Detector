const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const URLScan = require('../models/URLScan');
const ThreatFeed = require('../models/ThreatFeed');
const logger = require('../utils/logger');

// Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Total scans
    const totalScans = await URLScan.countDocuments({ userId });

    // Phishing detected
    const phishingDetected = await URLScan.countDocuments({ 
      userId,
      'prediction.isPhishing': true 
    });

    // Safe URLs
    const safeUrls = await URLScan.countDocuments({ 
      userId,
      'prediction.isPhishing': false 
    });

    // Recent scans (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentScans = await URLScan.countDocuments({
      userId,
      scanDate: { $gte: sevenDaysAgo }
    });

    // Scans by day (last 7 days)
    const scansByDay = await URLScan.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          scanDate: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$scanDate' } },
          count: { $sum: 1 },
          phishing: {
            $sum: { $cond: ['$prediction.isPhishing', 1, 0] }
          },
          safe: {
            $sum: { $cond: ['$prediction.isPhishing', 0, 1] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Active threats count
    const activeThreats = await ThreatFeed.countDocuments({ isActive: true });

    // Threat distribution
    const threatDistribution = await ThreatFeed.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$threatType', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalScans,
        phishingDetected,
        safeUrls,
        recentScans,
        activeThreats,
        scansByDay,
        threatDistribution
      }
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
