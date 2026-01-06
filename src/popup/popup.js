document.addEventListener('DOMContentLoaded', () => {

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs[0].id;
    const url = tabs[0].url;

    document.getElementById('currentUrl').innerText = url;

    chrome.runtime.sendMessage(
      { type: 'GET_ANALYSIS', tabId },
      data => {
        if (!data) {
          setSafeUI();
          return;
        }
        updateUI(data);
      }
    );
  });

  document.getElementById('scanButton').addEventListener('click', () => {
    chrome.tabs.reload();
    window.close();
  });
});

/* ---------------- UI UPDATE ---------------- */

function updateUI(data) {
  const score = data.score || 0;
  const level = data.riskLevel || 'SAFE';

  document.getElementById('riskScore').innerText = score;
  document.getElementById('riskLevel').innerText = level;

  const meter = document.getElementById('meterFill');
  meter.style.width = `${score}%`;

  const card = document.getElementById('riskCard');
  const status = document.getElementById('statusIndicator');
  const findings = document.getElementById('findingsList');

  findings.innerHTML = '';

  if (level === 'CRITICAL' || level === 'HIGH') {
    card.style.background = '#ffe6e6';
    meter.style.background = '#ff0000';
    status.innerText = 'Dangerous Website';
    status.style.background = '#ff0000';

    data.findings.forEach(f =>
      findings.innerHTML += `<li>⚠️ ${f}</li>`
    );
  }
  else if (level === 'MEDIUM') {
    card.style.background = '#fff8e1';
    meter.style.background = '#ffb300';
    status.innerText = 'Suspicious Website';
    status.style.background = '#ffb300';

    data.findings.forEach(f =>
      findings.innerHTML += `<li>⚠️ ${f}</li>`
    );
  }
  else {
    setSafeUI();
  }
}

/* ---------------- SAFE UI ---------------- */

function setSafeUI() {
  document.getElementById('riskScore').innerText = '0';
  document.getElementById('riskLevel').innerText = 'SAFE';
  document.getElementById('meterFill').style.width = '0%';
  document.getElementById('meterFill').style.background = '#00c853';

  document.getElementById('statusIndicator').innerText = 'Safe Website';
  document.getElementById('statusIndicator').style.background = '#00c853';

  document.getElementById('findingsList').innerHTML =
    '<li>No issues detected</li>';
}