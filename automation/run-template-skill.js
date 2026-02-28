const { execSync } = require('child_process');

function runTemplateSkill() {
  try {
    const output = execSync('openclaw agent --skill template-skill --tool hello --message "Teste de execução" --print', { encoding: 'utf-8' });
    console.log('Output da skill template-skill:', output);
  } catch (e) {
    console.error('Erro ao rodar skill template-skill:', e.message);
  }
}

runTemplateSkill();
