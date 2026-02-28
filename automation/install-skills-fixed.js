const { execSync } = require('child_process');

const skills = [
  '1password',
  'healthcheck',
  'openai-image-gen',
  'openai-whisper-api',
  'github',
  'todoist-sync'
];

function installSkill(skill) {
  try {
    const result = execSync(`openclaw skills enable ${skill}`, { encoding: 'utf-8' });
    console.log(`Skill '${skill}' habilitada com sucesso.`);
  } catch (e) {
    console.error(`Erro ao habilitar skill '${skill}': ${e.message}`);
  }
}

function run() {
  console.log('Iniciando instalação das skills essenciais corrigido...');
  skills.forEach(installSkill);
  console.log('Instalação concluída.');
}

run();
