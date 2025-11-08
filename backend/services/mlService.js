const axios = require('axios');
const logger = require('../utils/logger');

class MLService {
  constructor() {
    this.baseURL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
  }

  async analyzeURL(url) {
    try {
      const response = await axios.post(`${this.baseURL}/predict`, { url }, {
        timeout: 30000
      });

      return {
        isPhishing: response.data.prediction === 1,
        confidence: response.data.confidence,
        features: response.data.features || {}
      };
    } catch (error) {
      logger.error('ML Service error:', error.message);
      
      // Return default safe prediction if ML service is down
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        logger.warn('ML service unavailable, returning default prediction');
        return {
          isPhishing: false,
          confidence: 0.5,
          features: {},
          error: 'ML service unavailable'
        };
      }
      
      throw error;
    }
  }

  async getModelInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/model/info`);
      return response.data;
    } catch (error) {
      logger.error('Get model info error:', error.message);
      throw error;
    }
  }
}

module.exports = new MLService();
