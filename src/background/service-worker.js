// Phishing Detector Service Worker
class PhishingDetector {
  constructor() {
    this.threatDatabase = {
      blacklist: new Set(),
      whitelist: new Set(),
      suspiciousPatterns: [
        'login',
        'verify',
        'secure',
        'account',
        'banking',
        'update',
        'password',
        'credential'
      ]
    };
    this.loadDatabase();
  }

  async loadDatabase() {
    try {
      const data = await chrome.storage.local.get(['blacklist', 'whitelist']);
      this.threatDatabase.blacklist = new Set(data.blacklist || []);
      this.threatDatabase.whitelist = new Set(data.whitelist || []);
      await this.updateThreatLists();
    } catch (error) {
      console.error('Failed to load database:', error);
    }
  }

  async updateThreatLists() {
    try {
      // Fetch updated threat lists (you can replace with actual API calls)
      const response = await fetch('https://openphish.com/feed.txt');
      const text = await response.text();
      const urls = text.split('\n').filter(url => url.trim());
      
      urls.forEach(url => {
        this.threatDatabase.blacklist.add(this.normalizeUrl(url));
      });
      
      await chrome.storage.local.set({
        blacklist: Array.from(this.threatDatabase.blacklist),
        whitelist: Array.from(this.threatDatabase.whitelist)
      });
    } catch (error) {
      console.log('Using local threat database');
    }
  }

  normalizeUrl(url) {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
  }

  calculateRiskScore(url, tabId) {
    let score = 0;
    const findings = [];
    
    // Check against blacklist
    if (this.threatDatabase.blacklist.has(this.normalizeUrl(url))) {
      score += 100;
      findings.push('URL found in global blacklist');
    }
    
    // Check URL structure
    const urlObj = new URL(url);
    
    // Check for IP address instead of domain
    if (/^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
      score += 30;
      findings.push('URL uses IP address instead of domain name');
    }
    
    // Check for too many subdomains
    const subdomainCount = urlObj.hostname.split('.').length - 2;
    if (subdomainCount > 3) {
      score += 20;
      findings.push('Excessive number of subdomains detected');
    }
    
    // Check for suspicious characters
    if (/(%|@|-|_)\d/.test(urlObj.hostname)) {
      score += 25;
      findings.push('Suspicious characters in domain');
    }
    
    // Check for brand impersonation
    const brands = ['paypal', 'google', 'facebook', 'apple', 'microsoft', 'amazon'];
    const hostname = urlObj.hostname.toLowerCase();
    brands.forEach(brand => {
      if (hostname.includes(brand) && !hostname.endsWith(`.${brand}.com`)) {
        score += 40;
        findings.push(`Possible ${brand} brand impersonation detected`);
      }
    });
    
    // Check SSL/TLS
    if (urlObj.protocol !== 'https:') {
      score += 50;
      findings.push('Connection is not using HTTPS');
    }
    
    return { score, findings };
  }

  async analyzeUrl(url, tabId) {
    if (!url || url.startsWith('chrome://') || url.startsWith('about:')) {
      return null;
    }

    const { score, findings } = this.calculateRiskScore(url, tabId);
    
    // Store analysis result
    await chrome.storage.local.set({
      [`analysis_${tabId}`]: {
        url,
        score,
        findings,
        timestamp: Date.now(),
        riskLevel: this.getRiskLevel(score)
      }
    });
    
    // Update badge
    await this.updateBadge(tabId, score);
    
    // Show notification for high risk
    if (score > 70) {
      await this.showWarning(tabId, score, findings);
    }
    
    return { score, findings };
  }

  getRiskLevel(score) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 20) return 'LOW';
    return 'SAFE';
  }

  async updateBadge(tabId, score) {
    const riskLevel = this.getRiskLevel(score);
    const badgeColors = {
      'CRITICAL': '#FF0000',
      'HIGH': '#FF6B00',
      'MEDIUM': '#FFD700',
      'LOW': '#90EE90',
      'SAFE': '#008000'
    };
    
    const text = score > 0 ? '!' : '✓';
    const color = badgeColors[riskLevel] || '#666666';
    
    await chrome.action.setBadgeText({ tabId, text });
    await chrome.action.setBadgeBackgroundColor({ tabId, color });
    await chrome.action.setBadgeTextColor({ tabId, color: '#FFFFFF' });
  }

  async showWarning(tabId, score, findings) {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon48.png',
      title: '⚠️ Phishing Warning',
      message: `High risk detected (Score: ${score})`,
      priority: 2,
      buttons: [
        { title: 'View Details' },
        { title: 'Ignore' }
      ]
    });
    
    // Store notification handler
    chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
      if (buttonIndex === 0) {
        chrome.tabs.update(tabId, { active: true });
      }
    });
  }
}

// Initialize detector
const detector = new PhishingDetector();

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    await detector.analyzeUrl(tab.url, tabId);
  }
});

// Listen for navigation
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.url) {
    await detector.analyzeUrl(details.url, details.tabId);
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'ANALYZE_URL':
      detector.analyzeUrl(message.url, sender.tab.id)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ error: error.message }));
      return true; // Will respond asynchronously
      
    case 'GET_ANALYSIS':
      chrome.storage.local.get([`analysis_${sender.tab.id}`])
        .then(data => sendResponse(data[`analysis_${sender.tab.id}`]))
        .catch(error => sendResponse({ error: error.message }));
      return true;
      
    case 'REPORT_PHISHING':
      // Add to blacklist
      detector.threatDatabase.blacklist.add(detector.normalizeUrl(message.url));
      chrome.storage.local.set({
        blacklist: Array.from(detector.threatDatabase.blacklist)
      });
      sendResponse({ success: true });
      break;
      
    case 'MARK_SAFE':
      // Add to whitelist
      detector.threatDatabase.whitelist.add(detector.normalizeUrl(message.url));
      chrome.storage.local.set({
        whitelist: Array.from(detector.threatDatabase.whitelist)
      });
      sendResponse({ success: true });
      break;
  }
});

// Keep service worker alive
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    // Just to keep the service worker alive
  }
});