const HubAgent = require('./main');

async function test() {
  const hub = new HubAgent();
  console.log('Spawnando agentes especialistas...');
  await hub.spawnAgents();

  console.log('Enviando task para Conteúdo...');
  await hub.sendTaskToAgent('conteudo', 'Escreva um resumo do módulo 6.');

  console.log('Enviando task para Scraper...');
  await hub.sendTaskToAgent('scraper', 'Colete dados sobre arquitetura multi-agentes.');

  console.log('Aguardando resultados... 5s');
  await new Promise(r => setTimeout(r, 5000));

  const conteudoResult = await hub.receiveResults('conteudo');
  const scraperResult = await hub.receiveResults('scraper');

  console.log('Resultado do Conteúdo:', conteudoResult);
  console.log('Resultado do Scraper:', scraperResult);
}

test();
