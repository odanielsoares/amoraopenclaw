const { execSync } = require('child_process');

const crons = [
  {
    name: "Heartbeat Diario",
    cron: "0 7 * * *",
    session: "isolated",
    message: "Executar heartbeat e check basico de saude",
    announce: true,
    tz: "America/Sao_Paulo"
  },
  {
    name: "Check Agenda",
    cron: "*/15 * * * *",
    session: "isolated",
    message: "Verificar compromissos dos proximos 30 minutos e alertar",
    announce: true,
    tz: "America/Sao_Paulo"
  },
  {
    name: "Revisao Semanal",
    cron: "0 10 * * 5",
    session: "isolated",
    message: "Revisar projetos e pendencias semanais",
    announce: true,
    tz: "America/Sao_Paulo"
  }
];

function createCron(cron) {
  let cmd = `openclaw cron add --name "${cron.name}" --cron "${cron.cron}" --session ${cron.session} --message "${cron.message}" --tz "${cron.tz}"`;
  if (cron.announce) {
    cmd += ' --announce';
  }

  try {
    const result = execSync(cmd, { encoding: 'utf-8' });
    console.log(`Cron '${cron.name}' criado: ${result}`);
  } catch (e) {
    console.error(`Erro ao criar cron '${cron.name}': ${e.message}`);
  }
}

function run() {
  console.log('Criando crons essenciais corrigidos...');
  for (const cron of crons) {
    createCron(cron);
  }
}

run();
