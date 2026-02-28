const { execSync } = require('child_process');

class OpenClawAPIClient {
  async spawnAgent(label, thinking) {
    try {
      const output = execSync(`openclaw sessions_spawn --label "${label}" --thinking "${thinking}" --json`, { encoding: 'utf-8' });
      const json = JSON.parse(output);
      return json.sessionKey;
    } catch (e) {
      console.error('Erro ao spawnar agente:', e.message);
      return null;
    }
  }

  async sendMessage(sessionKey, message) {
    try {
      execSync(`openclaw sessions_send --session-key ${sessionKey} --message "${message}"`);
      console.log(`Mensagem enviada para sessão ${sessionKey}`);
      return true;
    } catch (e) {
      console.error('Erro ao enviar mensagem:', e.message);
      return false;
    }
  }

  async getSessionOutput(agentLabel) {
    // Exemplo: leitura de arquivo comum com output (pode ser adaptado)
    const fs = require('fs');
    const path = require('path');
    const outputFile = path.resolve(__dirname, '../../shared/outputs', `${agentLabel}-output.txt`);
    if (fs.existsSync(outputFile)) {
      return fs.readFileSync(outputFile, 'utf-8');
    } else {
      return null;
    }
  }
}

module.exports = OpenClawAPIClient;
