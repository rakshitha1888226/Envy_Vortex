class OptionsManager {
  constructor() {
    this.settings = {
      enableDetection: true,
      showNotifications: true,
      autoBlock: true,
      sensitivity: 'medium',
      scanForms: true,
      checkUrls: true,
      analyzeContent: true,
      useMachineLearning: true,
      anonymousReporting: true,
      collectStats: true,
      dataRetention: '30'
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadLists();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadSettings() {
    const data = await chrome.storage.local.get(['settings']);
    if (data.settings) {
      this.settings = { ...this.settings, ...data.settings };
    }
    this.populateForm();
  }

  async loadLists() {
    const data = await chrome.storage.local.get(['blacklist', 'whitelist']);
    this.updateListDisplay('whitelistItems', data.whitelist || []);
    this.updateListDisplay('blacklistItems', data.blacklist || []);
    
    // Load stats
    const stats = await chrome.storage.local.get(['stats']);
    if (stats.stats) {
      document.getElementById('totalSitesScanned').textContent = stats.stats.sitesScanned || 0;
      document.getElementById('totalThreatsDetected').textContent = stats.stats.threatsBlocked || 0;
    }
    
    // Update database time
    document.getElementById('dbUpdateTime').textContent = 
      new Date().toLocaleString();
  }

  populateForm() {
    // Set checkbox values
    Object.keys(this.settings).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = this.settings[key];
        } else if (element.tagName === 'SELECT') {
          element.value = this.settings[key];
        }
      }
    });
  }

  updateListDisplay(listId, items) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = '';
    
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item}</span>
        <button class="remove-btn" data-domain="${item}">Remove</button>
      `;
      listElement.appendChild(li);
    });
    
    // Add remove event listeners
    listElement.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const domain = e.target.dataset.domain;
        await this.removeFromList(listId, domain);
      });
    });
  }

  async saveSettings() {
    // Get values from form
    Object.keys(this.settings).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          this.settings[key] = element.checked;
        } else if (element.tagName === 'SELECT') {
          this.settings[key] = element.value;
        }
      }
    });
    
    await chrome.storage.local.set({ settings: this.settings });
    this.showNotification('Settings saved successfully!');
  }

  async removeFromList(listType, domain) {
    const data = await chrome.storage.local.get([listType]);
    const list = data[listType] || [];
    const index = list.indexOf(domain);
    
    if (index > -1) {
      list.splice(index, 1);
      await chrome.storage.local.set({ [listType]: list });
      this.updateListDisplay(listType + 'Items', list);
      this.showNotification(`Removed ${domain} from ${listType}`);
    }
  }

  setupEventListeners() {
    // Save settings on change
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('change', () => this.saveSettings());
    });
    
    // Add to whitelist
    document.getElementById('addWhitelist').addEventListener('click', async () => {
      const input = document.getElementById('whitelistInput');
      const domain = input.value.trim().toLowerCase();
      
      if (domain && this.isValidDomain(domain)) {
        const data = await chrome.storage.local.get(['whitelist']);
        const whitelist = data.whitelist || [];
        
        if (!whitelist.includes(domain)) {
          whitelist.push(domain);
          await chrome.storage.local.set({ whitelist });
          this.updateListDisplay('whitelistItems', whitelist);
          input.value = '';
          this.showNotification('Domain added to whitelist');
        } else {
          this.showNotification('Domain already in whitelist', 'warning');
        }
      } else {
        this.showNotification('Please enter a valid domain', 'error');
      }
    });
    
    // Update database
    document.getElementById('updateDatabase').addEventListener('click', async () => {
      this.showNotification('Updating database...', 'info');
      await chrome.runtime.sendMessage({ type: 'UPDATE_DATABASE' });
      setTimeout(() => {
        this.showNotification('Database updated successfully!');
        document.getElementById('dbUpdateTime').textContent = 
          new Date().toLocaleString();
      }, 2000);
    });
    
    // Export data
    document.getElementById('exportData').addEventListener('click', async () => {
      const data = await chrome.storage.local.get(null);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `phishing-detector-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.showNotification('Data exported successfully!');
    });
    
    // Reset settings
    document.getElementById('resetSettings').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all settings to default?')) {
        chrome.storage.local.clear(() => {
          window.location.reload();
        });
      }
    });
    
    // Enter key in whitelist input
    document.getElementById('whitelistInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('addWhitelist').click();
      }
    });
  }

  isValidDomain(domain) {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return regex.test(domain);
  }

  showNotification(message, type = 'success') {
    const colors = {
      success: '#4CAF50',
      error: '#f44336',
      warning: '#FF9800',
      info: '#2196F3'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 15px 25px;
      border-radius: 5px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  updateUI() {
    // Add animation for list updates
    const lists = document.querySelectorAll('.domain-list');
    lists.forEach(list => {
      list.style.transition = 'all 0.3s ease';
    });
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize options page
document.addEventListener('DOMContentLoaded', () => {
  const optionsManager = new OptionsManager();
});