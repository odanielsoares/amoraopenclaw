const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.resolve(__dirname)));

const agents = [
  { id: 'amora', name: 'Amora', status: 'Idle', sector: 'Inbox / Messages' },
  { id: 'conteudo', name: 'Conteúdo', status: 'Executing', sector: 'Research' },
  { id: 'scraper', name: 'Scraper', status: 'Waiting Input', sector: 'Planning' },
];

function generateRandomActivity(agent) {
  const activities = [
    'started a task',
    'completed a task',
    'waiting for input',
    'encountered an error',
    'called a tool',
    'returned a result'
  ];
  return `${agent.name} ${activities[Math.floor(Math.random() * activities.length)]}`;
}

wss.on('connection', (ws) => {
  // Send initial state
  ws.send(JSON.stringify({ type: 'initialState', agents }));

  // Periodic updates
  const interval = setInterval(() => {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const oldSector = agent.sector;
    const sectors = ['Inbox / Messages', 'Research', 'Planning', 'Execution', 'Waiting / Idle', 'Errors / Blocked', 'Completed'];
    agent.status = ['Idle', 'Executing', 'Waiting Input', 'Blocked', 'Completed'][Math.floor(Math.random() * 5)];
    // Move to random sector
    agent.sector = sectors[Math.floor(Math.random() * sectors.length)];

    ws.send(JSON.stringify({
      type: 'agentUpdate',
      agentId: agent.id,
      status: agent.status,
      oldSector,
      newSector: agent.sector,
      activity: generateRandomActivity(agent),
      timestamp: Date.now()
    }));
  }, 5000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Demo server running at http://localhost:${PORT}`);
});
