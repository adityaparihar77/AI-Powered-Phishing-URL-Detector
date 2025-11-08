const axios = require('axios');
const logger = require('../utils/logger');
const ThreatFeed = require('../models/ThreatFeed');

class ThreatIntelService {
  constructor() {
    this.virusTotalApiKey = process.env.VIRUSTOTAL_API_KEY;
    this.phishTankApiKey = process.env.PHISHTANK_API_KEY;
  }

  async enrichURL(url) {
    const threatData = {
      virusTotal: null,
      phishTank: null
    };

    try {
      // Run both checks in parallel
      const [vtData, ptData] = await Promise.allSettled([
        this.checkVirusTotal(url),
        this.checkPhishTank(url)
      ]);

      if (vtData.status === 'fulfilled') {
        threatData.virusTotal = vtData.value;
      }

      if (ptData.status === 'fulfilled') {
        threatData.phishTank = ptData.value;
      }

      // Save to threat feed if URL is malicious
      await this.updateThreatFeed(url, threatData);

      return threatData;
    } catch (error) {
      logger.error('Threat intel enrichment error:', error);
      return threatData;
    }
  }

  async checkVirusTotal(url) {
    if (!this.virusTotalApiKey || this.virusTotalApiKey === 'your-virustotal-api-key') {
      logger.warn('VirusTotal API key not configured');
      return null;
    }

    try {
      // URL encode the URL
      const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');

      const response = await axios.get(
        `https://www.virustotal.com/api/v3/urls/${urlId}`,
        {
          headers: { 'x-apikey': this.virusTotalApiKey },
          timeout: 10000
        }
      );

      const stats = response.data.data.attributes.last_analysis_stats;

      return {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
        lastAnalysisDate: new Date(response.data.data.attributes.last_analysis_date * 1000),
        permalink: response.data.data.links.self
      };
    } catch (error) {
      if (error.response?.status === 404) {
        logger.info('URL not found in VirusTotal database');
        return null;
      }
      logger.error('VirusTotal API error:', error.message);
      return null;
    }
  }

  async checkPhishTank(url) {
    if (!this.phishTankApiKey || this.phishTankApiKey === 'your-phishtank-api-key') {
      logger.warn('PhishTank API key not configured');
      return null;
    }

    try {
      const response = await axios.post(
        'https://checkurl.phishtank.com/checkurl/',
        new URLSearchParams({
          url: url,
          format: 'json',
          app_key: this.phishTankApiKey
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 10000
        }
      );

      if (response.data.results.in_database) {
        return {
          isPhishing: response.data.results.valid,
          verifiedAt: new Date(response.data.results.verified_at),
          submissionTime: new Date(response.data.results.submission_time)
        };
      }

      return null;
    } catch (error) {
      logger.error('PhishTank API error:', error.message);
      return null;
    }
  }

  async updateThreatFeed(url, threatData) {
    try {
      const isVirusTotalThreat = 
        threatData.virusTotal && 
        (threatData.virusTotal.malicious > 0 || threatData.virusTotal.suspicious > 2);

      const isPhishTankThreat = 
        threatData.phishTank && 
        threatData.phishTank.isPhishing;

      if (isVirusTotalThreat || isPhishTankThreat) {
        await ThreatFeed.findOneAndUpdate(
          { url },
          {
            url,
            threatType: isPhishTankThreat ? 'phishing' : 'malware',
            source: isPhishTankThreat ? 'phishtank' : 'virustotal',
            severity: this.calculateSeverity(threatData),
            lastSeenAt: new Date(),
            indicators: threatData,
            isActive: true
          },
          { upsert: true, new: true }
        );

        logger.info(`Threat feed updated for URL: ${url}`);
      }
    } catch (error) {
      logger.error('Update threat feed error:', error);
    }
  }

  calculateSeverity(threatData) {
    let score = 0;

    if (threatData.virusTotal) {
      score += threatData.virusTotal.malicious * 2;
      score += threatData.virusTotal.suspicious;
    }

    if (threatData.phishTank?.isPhishing) {
      score += 10;
    }

    if (score >= 10) return 'critical';
    if (score >= 5) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }
}

module.exports = new ThreatIntelService();
