const mongoose = require('mongoose');

const threatFeedSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  threatType: {
    type: String,
    enum: ['phishing', 'malware', 'spam', 'suspicious'],
    required: true
  },
  source: {
    type: String,
    enum: ['virustotal', 'phishtank', 'internal', 'manual'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  description: String,
  discoveredAt: {
    type: Date,
    default: Date.now
  },
  lastSeenAt: {
    type: Date,
    default: Date.now
  },
  indicators: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

threatFeedSchema.index({ url: 1 });
threatFeedSchema.index({ threatType: 1, severity: 1 });
threatFeedSchema.index({ discoveredAt: -1 });

module.exports = mongoose.model('ThreatFeed', threatFeedSchema);
