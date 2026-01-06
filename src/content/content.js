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
    this.sendAnalysis();
    this.applyVisualIndicators();
  }

  scanForms() {
    const forms = document.querySelectorAll('form');
    this.riskIndicators.loginForms = forms.length;

    forms.forEach(form => {
      const passwords = form.querySelectorAll('input[type="password"]');
      const users = form.querySelectorAll('input[type="text"], input[type="email"]');

      if (passwords.length && users.length) {
        this.riskIndicators.passwordFields += passwords.length;
        this.markForm(form);
      }
    });
  }

  markForm(form) {
    if (form.dataset.marked) return;
    form.dataset.marked = "true";

    form.style.border = '2px solid #ff6b00';

    const label = document.createElement('div');
    label.innerText = '⚠️ Login Form Detected';
    label.style.cssText = `
      background:#ff6b00;
      color:white;
      padding:5px;
      font-size:12px;
      margin-bottom:5px;
    `;

    form.prepend(label);
  }

  scanText() {
    const text = document.body.innerText.toLowerCase();
    this.urgentKeywords.forEach(word => {
      const matches = text.match(new RegExp(`\\b${word}\\b`, 'g'));
      if (matches) this.riskIndicators.urgentWords += matches.length;
    });
  }

  scanResources() {
    const scripts = document.querySelectorAll('script[src]');
    this.riskIndicators.scripts = scripts.length;

    scripts.forEach(s => {
      if (!s.src.startsWith(location.origin)) {
        this.riskIndicators.externalResources++;
      }
    });

    this.riskIndicators.iframes =
      document.querySelectorAll('iframe').length;
  }

  calculatePageRisk() {
    let score = 0;
    if (this.riskIndicators.loginForms) score += 10;
    if (this.riskIndicators.passwordFields) score += 20;
    if (this.riskIndicators.urgentWords > 3) score += 20;
    if (this.riskIndicators.externalResources > 5) score += 15;
    if (this.riskIndicators.iframes > 2) score += 10;
    this.riskScore = Math.min(score, 100);
  }

  async sendAnalysis() {
    chrome.runtime.sendMessage({
      type: 'PAGE_ANALYSIS',
      url: location.href,
      indicators: this.riskIndicators,
      score: this.riskScore
    });
  }

  applyVisualIndicators() {
    if (this.riskScore > 40) this.showRiskIndicator();
  }

  showRiskIndicator() {
    if (document.getElementById('phishing-indicator')) return;

    const div = document.createElement('div');
    div.id = 'phishing-indicator';
    div.innerText = '⚠️ This page may be suspicious';
    div.style.cssText = `
      position:fixed;
      top:10px;
      right:10px;
      background:#ff6b00;
      color:white;
      padding:10px;
      z-index:99999;
      font-size:12px;
    `;

    document.body.appendChild(div);
  }
}

new PageAnalyzer().scanPage();