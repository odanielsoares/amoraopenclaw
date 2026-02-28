const OpenClawWebSocketClient = require('./ws-gateway-client');

async function test() {
  const token = process.env.OPENCLAW_GATEWAY_TOKEN;
  if (!token) throw new Error('Missing OPENCLAW_GATEWAY_TOKEN');
  const client = new OpenClawWebSocketClient('ws://127.0.0.1:18789', token);
  await client.connect();
  
  console.log('Spawnando agentes...');
  const conteudo = await client.spawnAgent('conteudo', 'Agente Conteúdo');
  console.log('Sessão Conteúdo:', conteudo);
  const scraper = await client.spawnAgent('scraper', 'Agente Scraper');
  console.log('Sessão Scraper:', scraper);

  console.log('Enviando mensagens...');
  await client.sendMessage(conteudo.sessionKey, 'Crie um resumo do módulo 6, por favor.');
  await client.sendMessage(scraper.sessionKey, 'Busque dados recentes sobre sistemas multi-agentes.');

  console.log('Testes enviados com sucesso. Aguarde as respostas.');
}

test();
