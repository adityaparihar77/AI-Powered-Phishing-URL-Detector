const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const URLScan = require('../models/URLScan');
const mlService = require('../services/mlService');
const threatIntelService = require('../services/threatIntelService');
const logger = require('../utils/logger');
const { URL } = require('url');

// Analyze URL
router.post('/analyze', auth, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL is required' 
      });
    }

    // Validate URL format
    try {
      const parsedUrl = new URL(url);
      var domain = parsedUrl.hostname;
      var protocol = parsedUrl.protocol;
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid URL format' 
      });
    }

    // Create initial scan record
    const scan = await URLScan.create({
      url,
      domain,
      protocol,
      userId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'pending',
      prediction: {
        isPhishing: false,
        confidence: 0
      }
    });

    // Analyze with ML service (async)
    mlService.analyzeURL(url)
      .then(async (mlResult) => {
        scan.prediction = mlResult;
        scan.status = 'completed';

        // Get threat intelligence data
        const threatData = await threatIntelService.enrichURL(url);
        scan.threatIntel = threatData;

        await scan.save();
        logger.info(`URL analysis completed: ${url}`);
      })
      .catch(async (error) => {
        logger.error('ML analysis error:', error);
        scan.status = 'failed';
        scan.error = error.message;
        await scan.save();
      });

    res.status(202).json({
      success: true,
      message: 'Analysis started',
      scanId: scan._id
    });
  } catch (error) {
    logger.error('URL analysis error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during analysis' 
    });
  }
});

// Get scan result
router.get('/scan/:id', auth, async (req, res) => {
  try {
    const scan = await URLScan.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });

    if (!scan) {
      return res.status(404).json({ 
        success: false, 
        message: 'Scan not found' 
      });
    }

    res.json({ success: true, scan });
  } catch (error) {
    logger.error('Get scan error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get user's scan history
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const scans = await URLScan.find({ userId: req.user.id })
      .sort({ scanDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await URLScan.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      scans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
