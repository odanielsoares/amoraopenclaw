const { execSync } = require('child_process');

function checkDmPolicy() {
  try {
    const content = execSync('cat ~/.openclaw/openclaw.json').toString();
    const dmPolicyMatch = content.match(/"dmPolicy"\s*:\s*"([a-zA-Z]+)"/);
    if(dmPolicyMatch) {
      return `dmPolicy: ${dmPolicyMatch[1]}`;
    } else {
      return 'dmPolicy: NOT FOUND';
    }
  } catch {
    return 'Failed to read openclaw.json';
  }
}

function checkUfwStatus() {
  try {
    const status = execSync('sudo ufw status verbose').toString();
    return `UFW Status:\n${status}`;
  } catch {
    return 'UFW not installed or failed to run';
  }
}

function checkFail2banStatus() {
  try {
    const status = execSync('sudo fail2ban-client status').toString();
    let sshdStatus = 'Fail2ban not running or no sshd jail';
    if(status.includes('sshd')) {
      sshdStatus = execSync('sudo fail2ban-client status sshd').toString();
    }
    return `Fail2Ban Status:\n${status}\n\nsshd Jail Status:\n${sshdStatus}`;
  } catch {
    return 'Fail2ban not installed or failed to run';
  }
}

function checkSshdConfig() {
  try {
    const content = execSync('cat /etc/ssh/sshd_config').toString();
    const permitRootLogin = content.match(/^PermitRootLogin\s+(.*)$/m);
    if(permitRootLogin) {
      return `sshd_config PermitRootLogin: ${permitRootLogin[1]}`;
    } else {
      return 'PermitRootLogin not set in sshd_config';
    }
  } catch {
    return 'Failed to read sshd_config';
  }
}

function auditCredentials() {
  try {
    const grepOutput = execSync(`grep -r -n -I \
      -e "sk-[a-zA-Z0-9]" \
      -e "ANTHROPIC_API_KEY.*=.*['\"]" \
      -e "OPENAI_API_KEY.*=.*['\"]" \
      -e "TELEGRAM.*TOKEN.*=.*['\"]" \
      --include="*.json" --include="*.md" --include="*.js" --include="*.sh" --include="*.yml" --include="*.yaml" \
      ~/.openclaw/ 2>/dev/null || true`);
    if(grepOutput.trim() === '') {
      return 'No credentials hardcoded found';
    } else {
      return `Potential hardcoded credentials found:\n${grepOutput}`;
    }
  } catch {
    return 'Grep failed or no hardcoded credentials found';
  }
}

function checkSystemdOverride() {
  try {
    const override = execSync('sudo systemctl show openclaw -p Environment').toString();
    if(override.includes('=')) {
      return `Systemd Environment override:\n${override}`;
    } else {
      return 'No systemd Environment override found';
    }
  } catch {
    return 'Failed to check systemd override';
  }
}

function runAudit() {
  return [
    checkDmPolicy(),
    checkUfwStatus(),
    checkFail2banStatus(),
    checkSshdConfig(),
    auditCredentials(),
    checkSystemdOverride()
  ].join('\n-------------------\n');
}

if(require.main === module) {
  console.log(runAudit());
}

module.exports = { runAudit };
