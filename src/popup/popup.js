class PopupManager {
  constructor() {
    this.currentTab = null;
    this.currentAnalysis = null;
    this.stats = {
      sitesScanned: 0,
      threatsBlocked: 0,
      lastUpdate: Date.now()
    };
    
    this.init();
  }

  async init() {
    await this.loadCurrentTab();
    await this.loadAnalysis();
    await this.loadStats();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tabs[0];
    document.getElementById('currentUrl').textContent = 
      this.currentTab.url || 'No URL available';
  }

  async loadAnalysis() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_ANALYSIS',
        tabId: this.currentTab.id
      });
      
      this.currentAnalysis = response;
      this.updateRiskDisplay();
    } catch (error) {
      console.error('Failed to load analysis:', error);
    }
  }

  async loadStats() {
    const data = await chrome.storage.local.get(['stats']);
    if (data.stats) {
      this.stats = { ...this.stats, ...data.stats };
    }
    this.updateStatsDisplay();
  }

  updateRiskDisplay() {
    if (!this.currentAnalysis) return;
    
    const { score, findings, riskLevel } = this.currentAnalysis;
    
    // Update risk score
    const riskScoreElement = document.getElementById('riskScore');
    riskScoreElement.textContent = score || 0;
    riskScoreElement.className = 'risk-score ' + this.getRiskClass(score);
    
    // Update risk level
    const riskLevelElement = document.getElementById('riskLevel');
    riskLevelElement.textContent = riskLevel || 'SAFE';
    riskLevelElement.className = 'risk-level ' + this.getRiskClass(score);
    
    // Update meter
    const meterFill = document.getElementById('meterFill');
    meterFill.style.width = `${score || 0}%`;
    meterFill.style.background = this.getRiskColor(score);
    
    // Update status indicator
    const statusIndicator = document.getElementById('statusIndicator');
    statusIndicator.textContent = this.getStatusText(score);
    statusIndicator.className = 'status-indicator ' + this.getStatusClass(score);
    
    // Update site status
    const siteStatus = document.getElementById('siteStatus');
    siteStatus.textContent = this.getStatusText(score);
    siteStatus.className = 'site-status ' + this.getStatusClass(score);
    
    // Update findings
    const findingsList = document.getElementById('findingsList');
    findingsList.innerHTML = '';
    
    if (findings && findings.length > 0) {
      findings.forEach(finding => {
        const li = document.createElement('li');
        li.textContent = `⚠️ ${finding}`;
        findingsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = '✅ No security issues detected';
      findingsList.appendChild(li);
    }
  }

  getRiskClass(score) {
    if (score >= 80) return 'risk-critical';
    if (score >= 60) return 'risk-high';
    if (score >= 40) return 'risk-medium';
    if (score >= 20) return 'risk-low';
    return 'risk-safe';
  }

  getRiskColor(score) {
    if (score >= 80) return '#f44336';
    if (score >= 60) return '#FF9800';
    if (score >= 40) return '#FFC107';
    if (score >= 20) return '#8BC34A';
    return '#4CAF50';
  }

  getStatusClass(score) {
    if (score >= 60) return 'status-danger';
    if (score >= 40) return 'status-warning';
    return 'status-safe';
  }

  getStatusText(score) {
    if (score >= 80) return 'CRITICAL RISK';
    if (score >= 60) return 'HIGH RISK';
    if (score >= 40) return 'MEDIUM RISK';
    if (score >= 20) return 'LOW RISK';
    return 'SAFE';
  }

  updateStatsDisplay() {
    document.getElementById('sitesScanned').textContent = this.stats.sitesScanned;
    document.getElementById('threatsBlocked').textContent = this.stats.threatsBlocked;
    document.getElementById('lastUpdate').textContent = 
      this.formatTime(this.stats.lastUpdate);
  }

  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
  }

  setupEventListeners() {
    // Rescan button
    document.getElementById('scanButton').addEventListener('click', async () => {
      await chrome.tabs.sendMessage(this.currentTab.id, { type: 'SCAN_PAGE' });
      await this.loadAnalysis();
      this.showNotification('Page rescanned successfully!');
    });
    
    // Report phishing button
    document.getElementById('reportButton').addEventListener('click', async () => {
      const confirmed = confirm('Report this site as phishing? This will block it for all users.');
      if (confirmed) {
        await chrome.runtime.sendMessage({
          type: 'REPORT_PHISHING',
          url: this.currentTab.url
        });
        this.showNotification('Site reported as phishing!');
        this.stats.threatsBlocked++;
        await this.saveStats();
      }
    });
    
    // Mark as safe button
    document.getElementById('safeButton').addEventListener('click', async () => {
      await chrome.runtime.sendMessage({
        type: 'MARK_SAFE',
        url: this.currentTab.url
      });
      this.showNotification('Site marked as safe!');
    });
    
    // View history button
    document.getElementById('historyButton').addEventListener('click', () => {
      chrome.tabs.create({ url: 'src/options/options.html' });
    });
    
    // Settings link
    document.getElementById('settingsLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
    
    // Help link
    document.getElementById('helpLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://example.com/help' });
    });
    
    // About link
    document.getElementById('aboutLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://example.com/about' });
    });
  }

  async saveStats() {
    this.stats.sitesScanned++;
    this.stats.lastUpdate = Date.now();
    await chrome.storage.local.set({ stats: this.stats });
    this.updateStatsDisplay();
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  updateUI() {
    // Add animation for risk meter
    const meterFill = document.getElementById('meterFill');
    if (meterFill) {
      const width = meterFill.style.width;
      meterFill.style.width = '0%';
      setTimeout(() => {
        meterFill.style.width = width;
      }, 100);
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const popupManager = new PopupManager();
});