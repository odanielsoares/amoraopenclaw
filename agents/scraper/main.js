const path = require('path');
const fs = require('fs');

const sharedPath = path.resolve(__dirname, '../../shared');

class ScraperAgent {
  async run(message) {
    // Exemplo simples: criar output a partir da mensagem recebida
    const response = `Dados coletados: ${message}`;
    const outputFile = path.join(sharedPath, 'outputs', 'scraper-output.txt');
    fs.writeFileSync(outputFile, response, { flag: 'a' });
    return response;
  }
}

module.exports = ScraperAgent;
