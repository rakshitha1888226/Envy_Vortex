// Content Script - Runs on every page
class PageAnalyzer {
  constructor() {
    this.riskIndicators = {
      loginForms: 0,
      passwordFields: 0,
      urgentWords: 0,
      externalResources: 0,
      iframes: 0,
      scripts: 0
    };
    
    this.urgentKeywords = [
      'urgent', 'immediately', 'verify', 'confirm', 'suspended',
      'locked', 'compromised', 'security', 'alert', 'warning'
    ];
  }

  scanPage() {
    this.scanForms();
    this.scanText();
    this.scanResources();
    this.calculatePageRisk();
    
    // Send results to background script
    this.sendAnalysis();
    
    // Apply visual warnings if needed
    this.applyVisualIndicators();
  }

  scanForms() {
    const forms = document.querySelectorAll('form');
    this.riskIndicators.loginForms = forms.length;
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input[type="password"]');
      this.riskIndicators.passwordFields += inputs.length;
      
      // Check for username/password patterns
      const usernameFields = form.querySelectorAll('input[type="text"], input[type="email"]');
      if (usernameFields.length > 0 && inputs.length > 0) {
        this.markForm(form);
      }
    });
  }

  markForm(form) {
    form.style.border = '2px solid #ff6b00';
    form.style.padding = '10px';
    form.style.borderRadius = '5px';
    form.style.position = 'relative';
    
    // Add warning label
    const warning = document.createElement('div');
    warning.innerHTML = `
      <div style="
        background: #ff6b00;
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 12px;
        margin-bottom: 10px;
        display: inline-block;
      ">
        ⚠️ Login Form Detected
      </div>
    `;
    form.insertBefore(warning, form.firstChild);
  }

  scanText() {
    const pageText = document.body.innerText.toLowerCase();
    this.urgentKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = pageText.match(regex);
      if (matches) {
        this.riskIndicators.urgentWords += matches.length;
      }
    });
  }

  scanResources() {
    // Count external scripts
    const scripts = document.querySelectorAll('script[src]');
    this.riskIndicators.scripts = scripts.length;
    
    // Count iframes
    const iframes = document.querySelectorAll('iframe');
    this.riskIndicators.iframes = iframes.length;
    
    // Check for suspicious domains in resources
    scripts.forEach(script => {
      const src = script.src;
      if (src && !src.startsWith(window.location.origin)) {
        this.riskIndicators.externalResources++;
      }
    });
  }

  calculatePageRisk() {
    let riskScore = 0;
    
    if (this.riskIndicators.loginForms > 0) riskScore += 10;
    if (this.riskIndicators.passwordFields > 0) riskScore += 20;
    if (this.riskIndicators.urgentWords > 3) riskScore += this.riskIndicators.urgentWords * 5;
    if (this.riskIndicators.externalResources > 5) riskScore += 15;
    if (this.riskIndicators.iframes > 2) riskScore += 10;
    
    this.riskScore = Math.min(riskScore, 100);
  }

  async sendAnalysis() {
    try {
      const analysis = {
        type: 'PAGE_ANALYSIS',
        url: window.location.href,
        indicators: this.riskIndicators,
        score: this.riskScore,
        timestamp: Date.now()
      };
      
      await chrome.runtime.sendMessage(analysis);
    } catch (error) {
      console.log('Could not send analysis:', error);
    }
  }

  applyVisualIndicators() {
    if (this.riskScore > 40) {
      this.showRiskIndicator();
    }
  }

  showRiskIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'phishing-detector-indicator';
    indicator.innerHTML = `
      <style>
        #phishing-detector-indicator {
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(255, 107, 0, 0.9);
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          font-family: Arial, sans-serif;
          font-size: 12px;
          z-index: 999999;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          backdrop-filter: blur(5px);
          cursor: pointer;
        }
        #phishing-detector-indicator:hover {
          background: rgba(255, 0, 0, 0.9);
        }
      </style>
      <span>⚠️ This page may be suspicious</span>
    `;
    
    indicator.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        type: 'SHOW_DETAILS',
        url: window.location.href
      });
    });
    
    document.body.appendChild(indicator);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity 0.5s';
        setTimeout(() => indicator.remove(), 500);
      }
    }, 10000);
  }
}

// Initialize when page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const analyzer = new PageAnalyzer();
    analyzer.scanPage();
  });
} else {
  const analyzer = new PageAnalyzer();
  analyzer.scanPage();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCAN_PAGE') {
    const analyzer = new PageAnalyzer();
    analyzer.scanPage();
    sendResponse({ success: true });
  }
});