const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ThreatFeed = require('../models/ThreatFeed');
const logger = require('../utils/logger');

// Get threat feed
router.get('/feed', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    
    if (req.query.severity) {
      filter.severity = req.query.severity;
    }
    
    if (req.query.threatType) {
      filter.threatType = req.query.threatType;
    }

    const threats = await ThreatFeed.find(filter)
      .sort({ discoveredAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ThreatFeed.countDocuments(filter);

    res.json({
      success: true,
      threats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get threat feed error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Check if URL is in threat database
router.post('/check', auth, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL is required' 
      });
    }

    const threat = await ThreatFeed.findOne({ url, isActive: true });

    res.json({
      success: true,
      isThreat: !!threat,
      threat: threat || null
    });
  } catch (error) {
    logger.error('Threat check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
