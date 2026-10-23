// DOM Elements
const statusBadge = document.getElementById('status-badge');
const statusText = document.getElementById('status-text');
const greetForm = document.getElementById('greet-form');
const userNameInput = document.getElementById('user-name');
const btnSubmit = document.getElementById('btn-submit');
const greetResult = document.getElementById('greet-result');
const btnQuote = document.getElementById('btn-quote');
const quoteResult = document.getElementById('quote-result');
const btnRefreshStatus = document.getElementById('btn-refresh-status');

const diagStatus = document.getElementById('diag-status');
const diagUptime = document.getElementById('diag-uptime');
const diagLatency = document.getElementById('diag-latency');
const rawJson = document.getElementById('raw-json');
const responseTimestamp = document.getElementById('response-timestamp');

// Update Raw JSON Viewer
function updateRawPreview(data) {
  rawJson.textContent = JSON.stringify(data, null, 2);
  responseTimestamp.textContent = new Date().toLocaleTimeString();
}

// Format seconds to readable uptime
function formatUptime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return `${mins}m ${remainingSecs}s`;
}

// Check Backend Health & Diagnostics
async function checkServerStatus() {
  const startTime = performance.now();
  try {
    statusText.textContent = 'Checking server...';
    const response = await fetch('/api/status');
    const latency = Math.round(performance.now() - startTime);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    
    // Update Badge
    statusBadge.className = 'badge online';
    statusText.textContent = 'Backend Online (Port 3000)';

    // Update Diagnostics
    diagStatus.textContent = 'Active (200 OK)';
    diagStatus.style.color = '#10b981';
    diagUptime.textContent = formatUptime(data.uptimeSeconds);
    diagLatency.textContent = `${latency} ms`;

    updateRawPreview(data);
  } catch (err) {
    statusBadge.className = 'badge offline';
    statusText.textContent = 'Backend Disconnected';
    diagStatus.textContent = 'Offline';
    diagStatus.style.color = '#f43f5e';
    diagLatency.textContent = 'Timeout';
    console.error('Failed to connect to backend:', err);
  }
}

// Handle POST Greeting
greetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = userNameInput.value.trim();
  if (!name) return;

  const originalBtnText = btnSubmit.innerHTML;
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span>Sending...</span>';

  const startTime = performance.now();
  try {
    const res = await fetch('/api/greet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    const latency = Math.round(performance.now() - startTime);
    diagLatency.textContent = `${latency} ms`;

    const data = await res.json();
    updateRawPreview(data);

    greetResult.className = 'result-box success';
    greetResult.innerHTML = `
      <strong>${data.greeting}</strong>
      <span>${data.note}</span>
      <span class="time-tag">Roundtrip: ${latency}ms</span>
    `;
    userNameInput.value = '';
  } catch (err) {
    greetResult.className = 'result-box';
    greetResult.innerHTML = `<span style="color: #f43f5e;">Error connecting to server.</span>`;
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = originalBtnText;
  }
});

// Handle GET Quote
btnQuote.addEventListener('click', async () => {
  const originalBtnText = btnQuote.innerHTML;
  btnQuote.disabled = true;
  btnQuote.innerHTML = '<span>Fetching...</span>';

  const startTime = performance.now();
  try {
    const res = await fetch('/api/quote');
    const latency = Math.round(performance.now() - startTime);
    diagLatency.textContent = `${latency} ms`;

    const data = await res.json();
    updateRawPreview(data);

    quoteResult.className = 'result-box success';
    quoteResult.innerHTML = `
      <span>“${data.quote}”</span>
      <span class="time-tag">Fetched in ${latency}ms</span>
    `;
  } catch (err) {
    quoteResult.className = 'result-box';
    quoteResult.innerHTML = `<span style="color: #f43f5e;">Error fetching quote.</span>`;
  } finally {
    btnQuote.disabled = false;
    btnQuote.innerHTML = originalBtnText;
  }
});

btnRefreshStatus.addEventListener('click', checkServerStatus);

// Initialize on page load
checkServerStatus();
