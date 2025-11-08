const mongoose = require('mongoose');

const urlScanSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // ML Prediction
  prediction: {
    isPhishing: {
      type: Boolean,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    features: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  // Threat Intelligence Data
  threatIntel: {
    virusTotal: {
      malicious: { type: Number, default: 0 },
      suspicious: { type: Number, default: 0 },
      harmless: { type: Number, default: 0 },
      undetected: { type: Number, default: 0 },
      lastAnalysisDate: Date,
      permalink: String
    },
    phishTank: {
      isPhishing: Boolean,
      verifiedAt: Date,
      submissionTime: Date
    }
  },
  // Metadata
  domain: String,
  protocol: String,
  scanDate: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  error: String
});

// Index for faster queries
urlScanSchema.index({ userId: 1, scanDate: -1 });
urlScanSchema.index({ url: 1 });
urlScanSchema.index({ 'prediction.isPhishing': 1 });

module.exports = mongoose.model('URLScan', urlScanSchema);
