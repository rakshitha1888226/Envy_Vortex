// Phishing Detector Service Worker (FIXED & COMPLETE)

class PhishingDetector {
  constructor() {
    this.threatDatabase = {
      blacklist: new Set(),
      whitelist: new Set()
    };

    // Store page-level analysis per tab
    this.pageAnalysisCache = {}; // tabId -> { score, indicators }

    this.loadDatabase();
  }

  /* -------------------- DATABASE -------------------- */

  async loadDatabase() {
    try {
      const data = await chrome.storage.local.get(['blacklist', 'whitelist']);
      this.threatDatabase.blacklist = new Set(data.blacklist || []);
      this.threatDatabase.whitelist = new Set(data.whitelist || []);
      await this.updateThreatLists();
    } catch (err) {
      console.error('Database load failed:', err);
    }
  }

  async updateThreatLists() {
    try {
      const response = await fetch('https://openphish.com/feed.txt');
      const text = await response.text();
      const urls = text.split('\n').filter(Boolean);

      urls.forEach(url =>
        this.threatDatabase.blacklist.add(this.normalizeUrl(url))
      );

      await chrome.storage.local.set({
        blacklist: [...this.threatDatabase.blacklist],
        whitelist: [...this.threatDatabase.whitelist]
      });
    } catch {
      console.log('Using local threat database');
    }
  }

  normalizeUrl(url) {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '')
      .split('/')[0]
      .toLowerCase();
  }

  /* -------------------- URL ANALYSIS -------------------- */

  calculateUrlRisk(url) {
    let score = 0;
    const findings = [];

    const domain = this.normalizeUrl(url);
    const urlObj = new URL(url);

    if (this.threatDatabase.blacklist.has(domain)) {
      score += 100;
      findings.push('URL found in phishing blacklist');
    }

    if (/^\d+\.\d+\.\d+\.\d+$/.test(urlObj.hostname)) {
      score += 30;
      findings.push('IP address used instead of domain');
    }

    const subdomains = urlObj.hostname.split('.').length - 2;
    if (subdomains > 3) {
      score += 20;
      findings.push('Too many subdomains');
    }

    if (/(%|@|-|_)\d/.test(urlObj.hostname)) {
      score += 25;
      findings.push('Suspicious domain pattern');
    }

    const brands = ['paypal', 'google', 'facebook', 'amazon', 'apple', 'microsoft'];
    brands.forEach(brand => {
      if (urlObj.hostname.includes(brand) && !urlObj.hostname.endsWith(`${brand}.com`)) {
        score += 40;
        findings.push(`Possible ${brand} impersonation`);
      }
    });

    if (urlObj.protocol !== 'https:') {
      score += 50;
      findings.push('Website is not HTTPS');
    }

    return { score, findings };
  }

  /* -------------------- COMBINED ANALYSIS -------------------- */

  async analyzeUrl(url, tabId) {
    if (!url || url.startsWith('chrome://') || url.startsWith('about:')) return;

    const urlResult = this.calculateUrlRisk(url);
    const pageResult = this.pageAnalysisCache[tabId] || { score: 0 };

    const finalScore = Math.min(urlResult.score + pageResult.score, 100);

    const result = {
      url,
      score: finalScore,
      riskLevel: this.getRiskLevel(finalScore),
      findings: [
        ...urlResult.findings,
        ...(pageResult.score > 0 ? ['Suspicious page content detected'] : [])
      ],
      timestamp: Date.now()
    };

    await chrome.storage.local.set({ [`analysis_${tabId}`]: result });

    await this.updateBadge(tabId, finalScore);

    if (finalScore >= 70) {
      await this.showWarning(tabId, finalScore);
    }
  }

  /* -------------------- PAGE ANALYSIS (FROM content.js) -------------------- */

  async handlePageAnalysis(message, sender) {
    if (!sender.tab) return;

    const tabId = sender.tab.id;

    // Cache page-level score
    this.pageAnalysisCache[tabId] = {
      score: message.score,
      indicators: message.indicators
    };

    // Re-analyze with merged score
    await this.analyzeUrl(sender.tab.url, tabId);
  }

  /* -------------------- UI HELPERS -------------------- */

  getRiskLevel(score) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 20) return 'LOW';
    return 'SAFE';
  }

  async updateBadge(tabId, score) {
    const colors = {
      CRITICAL: '#ff0000',
      HIGH: '#ff6b00',
      MEDIUM: '#ffd700',
      LOW: '#90ee90',
      SAFE: '#008000'
    };

    const level = this.getRiskLevel(score);

    await chrome.action.setBadgeText({
      tabId,
      text: score > 0 ? '!' : '✓'
    });

    await chrome.action.setBadgeBackgroundColor({
      tabId,
      color: colors[level]
    });
  }

  async showWarning(tabId, score) {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon48.png',
      title: '⚠️ Phishing Warning',
      message: `High risk website detected (Score: ${score})`,
      priority: 2
    });
  }
}

/* -------------------- INIT -------------------- */

const detector = new PhishingDetector();

/* -------------------- EVENTS -------------------- */

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    detector.analyzeUrl(tab.url, tabId);
  }
});

chrome.webNavigation.onCompleted.addListener(details => {
  detector.analyzeUrl(details.url, details.tabId);
});

/* -------------------- MESSAGE HANDLER -------------------- */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_ANALYSIS') {
    detector.handlePageAnalysis(message, sender);
  }

  if (message.type === 'GET_ANALYSIS' && sender.tab) {
    chrome.storage.local
      .get([`analysis_${sender.tab.id}`])
      .then(data => sendResponse(data[`analysis_${sender.tab.id}`]));
    return true;
  }
});

/* -------------------- KEEP ALIVE -------------------- */

chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(() => {});
const analysisCache = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_ANALYSIS') {
    const tabId = sender.tab.id;

    analysisCache[tabId] = {
      url: message.url,
      pageScore: message.score,
      indicators: message.indicators
    };

    analyzeFinal(tabId);
  }

  if (message.type === 'GET_ANALYSIS') {
  const tabId = message.tabId;

  chrome.storage.local.get([`analysis_${tabId}`]).then(data => {
    sendResponse(data[`analysis_${tabId}`] || null);
  });

  return true; // REQUIRED
}

});

function analyzeFinal(tabId) {
  const pageData = analysisCache[tabId];
  if (!pageData) return;

  let finalScore = pageData.pageScore;

  // URL-based phishing heuristics
  if (pageData.url.includes('@')) finalScore += 20;
  if (pageData.url.startsWith('http://')) finalScore += 10;
  if (pageData.url.length > 75) finalScore += 10;

  finalScore = Math.min(finalScore, 100);

  let riskLevel = 'SAFE';
  if (finalScore > 50) riskLevel = 'DANGEROUS';
  else if (finalScore > 20) riskLevel = 'DOUBTFUL';

  analysisCache[tabId] = {
    ...pageData,
    finalScore,
    riskLevel
  };

  chrome.storage.local.set({
    [`analysis_${tabId}`]: analysisCache[tabId]
  });

  chrome.action.setBadgeText({
    tabId,
    text: finalScore > 20 ? '!' : ''
  });

  chrome.action.setBadgeBackgroundColor({
    tabId,
    color:
      riskLevel === 'DANGEROUS' ? '#ff0000' :
      riskLevel === 'DOUBTFUL' ? '#ffb300' :
      '#00c853'
  });
}