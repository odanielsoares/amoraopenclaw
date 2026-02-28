const OpenClawAPIClient = require('./client-api');

async function test() {
  const client = new OpenClawAPIClient();

  console.log('Spawnando agentes...');
  const conteudoSession = await client.spawnAgent('conteudo', 'Criação de conteúdo');
  const scraperSession = await client.spawnAgent('scraper', 'Coleta de dados');

  if (!conteudoSession || !scraperSession) {
    console.error('Falha ao spawnar agentes');
    return;
  }

  console.log(`Sessão Conteúdo: ${conteudoSession}`);
  console.log(`Sessão Scraper: ${scraperSession}`);

  console.log('Enviando mensagens...');
  await client.sendMessage(conteudoSession, 'Resuma o último relatório do projeto XYZ.');
  await client.sendMessage(scraperSession, 'Busque dados recentes sobre AI.');

  console.log('Aguardando respostas... (5s)');
  await new Promise(r => setTimeout(r, 5000));

  const conteudoOutput = await client.getSessionOutput('conteudo');
  const scraperOutput = await client.getSessionOutput('scraper');

  console.log('Conteúdo Output:', conteudoOutput);
  console.log('Scraper Output:', scraperOutput);
}

test();
