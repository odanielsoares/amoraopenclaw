const OpenClawWebSocketClient = require('./ws-gateway-client');

async function test() {
  const client = new OpenClawWebSocketClient('ws://127.0.0.1:18789', process.env.OPENCLAW_GATEWAY_TOKEN || '3102525e009ce729fc848b52c5312af3bf39ee69fb888978');
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
