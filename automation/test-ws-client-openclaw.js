const OpenClawWsClient = require('./ws-client-openclaw');

async function test() {
  const client = new OpenClawWsClient('ws://127.0.0.1:18789', process.env.OPENCLAW_GATEWAY_TOKEN || '3102525e009ce729fc848b52c5312af3bf39ee69fb888978');
  await client.connect();

  console.log('Spawnando agentes...');
  const conteudoSession = await client.spawnSession('conteudo', 'Agente Conteúdo');
  const scraperSession = await client.spawnSession('scraper', 'Agente Scraper');

  console.log('Sessão Conteúdo:', conteudoSession);
  console.log('Sessão Scraper:', scraperSession);

  console.log('Enviando mensagens...');
  await client.sendMessage(conteudoSession.sessionKey, 'Crie um resumo do módulo 6, por favor.');
  await client.sendMessage(scraperSession.sessionKey, 'Busque dados recentes sobre sistemas multi-agentes.');

  console.log('Testes enviados com sucesso. Aguarde as respostas.');
}

test();
