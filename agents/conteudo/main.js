const path = require('path');
const fs = require('fs');

const sharedPath = path.resolve(__dirname, '../../shared');

class ConteudoAgent {
  async run(message) {
    // Exemplo simples: criar output a partir da mensagem recebida
    const response = `Conteudo processado: ${message}`;
    const outputFile = path.join(sharedPath, 'outputs', 'conteudo-output.txt');
    fs.writeFileSync(outputFile, response, { flag: 'a' });
    return response;
  }
}

module.exports = ConteudoAgent;
