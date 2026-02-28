const { execSync } = require('child_process');

const crons = [
  {
    name: "Heartbeat Diário",
    schedule: { kind: "cron", expr: "0 7 * * *", tz: "America/Sao_Paulo" },
    sessionTarget: "isolated",
    payload: { kind: "agentTurn", message: "Executar heartbeat e check básico de saúde" },
    delivery: { mode: "announce" }
  },
  {
    name: "Check Agenda",
    schedule: { kind: "cron", expr: "*/15 * * * *", tz: "America/Sao_Paulo" },
    sessionTarget: "isolated",
    payload: { kind: "agentTurn", message: "Verificar compromissos dos próximos 30 minutos e alertar" },
    delivery: { mode: "announce" }
  },
  {
    name: "Revisão Semanal",
    schedule: { kind: "cron", expr: "0 10 * * 5", tz: "America/Sao_Paulo" },
    sessionTarget: "isolated",
    payload: { kind: "agentTurn", message: "Revisar projetos e pendências semanais" },
    delivery: { mode: "announce" }
  }
];

function createCron(cron) {
  const cmd = `openclaw cron create --name "${cron.name}" --schedule '${JSON.stringify(cron.schedule)}' --session-target ${cron.sessionTarget} --payload '${JSON.stringify(cron.payload)}' --delivery '${JSON.stringify(cron.delivery)}'`;
  try {
    const result = execSync(cmd, { encoding: 'utf-8' });
    console.log(`Cron '${cron.name}' criado: ${result}`);
  } catch (e) {
    console.error(`Erro ao criar cron '${cron.name}': ${e.message}`);
  }
}

function run() {
  console.log('Criando crons essenciais...');
  for (const cron of crons) {
    createCron(cron);
  }
}

run();
