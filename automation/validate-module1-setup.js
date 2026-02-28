const { execSync } = require('child_process');

function checkNode() {
  try {
    const output = execSync('node -v').toString().trim();
    return `Node.js version: ${output}`;
  } catch {
    return 'Node.js not installed or not in PATH';
  }
}

function checkNpm() {
  try {
    const output = execSync('npm -v').toString().trim();
    return `npm version: ${output}`;
  } catch {
    return 'npm not installed or not in PATH';
  }
}

function checkOpenClaw() {
  try {
    const output = execSync('openclaw --version').toString().trim();
    return `OpenClaw CLI version: ${output}`;
  } catch {
    return 'OpenClaw CLI not installed or not in PATH';
  }
}

function checkGateway() {
  try {
    const output = execSync('openclaw gateway status').toString().trim();
    if(output.includes('running')) {
      return 'OpenClaw Gateway is running ✅';
    } else {
      return 'OpenClaw Gateway NOT running ❌';
    }
  } catch {
    return 'OpenClaw Gateway status command failed';
  }
}

function checkTelegramBot() {
  try {
    const output = execSync('openclaw channels status').toString().trim();
    if(output.toLowerCase().includes('telegram') && output.toLowerCase().includes('connected')) {
      return 'Telegram Bot is connected ✅';
    } else {
      return 'Telegram Bot NOT connected ❌';
    }
  } catch {
    return 'OpenClaw channels status command failed';
  }
}

function checkDmPolicy() {
  try {
    const content = execSync('cat ~/.openclaw/openclaw.json').toString();
    const dmPolicyMatch = content.match(/"dmPolicy"\s*:\s*"([a-zA-Z]+)"/);
    if(dmPolicyMatch && dmPolicyMatch[1].toLowerCase() === 'allowlist') {
      return 'dmPolicy is set to allowlist ✅';
    } else {
      return 'dmPolicy not set to allowlist ❌';
    }
  } catch {
    return 'Failed to read openclaw.json';
  }
}

function runAllChecks() {
  return [
    checkNode(),
    checkNpm(),
    checkOpenClaw(),
    checkGateway(),
    checkTelegramBot(),
    checkDmPolicy()
  ];
}

if(require.main === module) {
  const results = runAllChecks();
  console.log('--- Módulo 1 Setup Validation ---');
  results.forEach(r => console.log(r));
}

module.exports = { runAllChecks };