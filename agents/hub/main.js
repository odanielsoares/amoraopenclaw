const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const sharedPath = path.resolve(__dirname, '../../shared');

class HubAgent {
  constructor() {
    this.agents = {
      conteudo: null,
      scraper: null,
    };
  }

  spawnAgents() {
    // spawn é via comando CLI sessions_spawn
    console.log('Spawnando agentes especialistas...');
    this.agents.conteudo = this.spawnAgent('conteudo', 'Agente Conteúdo');
    this.agents.scraper = this.spawnAgent('scraper', 'Agente Scraper');
  }

  spawnAgent(label, description) {
    try {
      const output = execSync(`openclaw sessions_spawn --label "${label}" --thinking "${description}"`, { encoding: 'utf-8' });
      console.log(`Agente ${label} spawnado`);
      // Extrair sessionKey do output JSON
      const match = output.match(/"sessionKey"\s*:\s*"([^"]+)"/);
      if (match) return { sessionKey: match[1] };
      return null;
    } catch (e) {
      console.error(`Erro ao spawnar agente ${label}: ${e.message}`);
      return null;
    }
  }

  sendTaskToAgent(agentLabel, message) {
    const session = this.agents[agentLabel];
    if (!session) {
      console.error(`Agent ${agentLabel} não spawnado.`);
      return;
    }
    const { sessionKey } = session;
    try {
      execSync(`openclaw sessions_send --session-key ${sessionKey} --message "${message}"`, { encoding: 'utf-8' });
      console.log(`Mensagem enviada para ${agentLabel}`);
    } catch (e) {
      console.error(`Erro ao enviar mensagem para ${agentLabel}: ${e.message}`);
    }
  }

  receiveResults(agentLabel) {
    const outputFile = path.join(sharedPath, 'outputs', `${agentLabel}-output.txt`);
    if (fs.existsSync(outputFile)) {
      const content = fs.readFileSync(outputFile, 'utf-8');
      return content;
    }
    return null;
  }

}

module.exports = HubAgent;
