const OpenClawWsClient = require('./ws-client-openclaw');

async function test() {
  const token = process.env.OPENCLAW_GATEWAY_TOKEN;
  if (!token) throw new Error('Missing OPENCLAW_GATEWAY_TOKEN');
  const client = new OpenClawWsClient('ws://127.0.0.1:18789', token);
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
