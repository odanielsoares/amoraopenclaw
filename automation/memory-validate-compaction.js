/**
 * Validate Pre-Compaction Memory Flush
 * 
 * Verifica se a configuração de extração pré-compactação
 * está ativa e funcionando no openclaw.json.
 * 
 * Checa:
 * 1. compaction.memoryFlush.enabled = true
 * 2. compaction.memoryFlush.prompt existe e é robusto
 * 3. compaction.memoryFlush.softThresholdTokens está configurado
 * 4. Topic files foram atualizados recentemente (sinal de flush ativo)
 */
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw', 'openclaw.json');
const MEMORY_DIR = path.join(process.cwd(), 'memory');

function run() {
  console.log('=== Validate Pre-Compaction Memory Flush ===\n');

  // 1. Check config
  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch (e) {
    console.log('❌ Falha ao ler openclaw.json');
    return;
  }

  const compaction = config?.agents?.defaults?.compaction;
  
  if (!compaction) {
    console.log('❌ Seção compaction não encontrada no config');
    return;
  }

  // Check memoryFlush
  const flush = compaction.memoryFlush;
  
  if (!flush) {
    console.log('❌ memoryFlush não configurado');
    return;
  }

  console.log(`memoryFlush.enabled: ${flush.enabled ? '✅ true' : '❌ false'}`);
  console.log(`memoryFlush.softThresholdTokens: ${flush.softThresholdTokens || '❌ não definido'}`);
  console.log(`memoryFlush.prompt: ${flush.prompt ? '✅ presente (' + flush.prompt.length + ' chars)' : '❌ ausente'}`);

  // 2. Check if prompt covers essentials
  if (flush.prompt) {
    const essentials = ['DECISIONS', 'LESSONS', 'BLOCKERS', 'STATE CHANGES'];
    const missing = essentials.filter(e => !flush.prompt.toUpperCase().includes(e));
    
    if (missing.length === 0) {
      console.log('✅ Prompt cobre todos os tópicos essenciais');
    } else {
      console.log(`⚠️  Prompt não menciona: ${missing.join(', ')}`);
    }
  }

  // 3. Check topic files freshness
  console.log('\n--- Freshness dos Topic Files ---');
  const topicFiles = ['decisions.md', 'lessons.md', 'projects.md', 'people.md', 'pending.md'];
  
  for (const tf of topicFiles) {
    const filePath = path.join(MEMORY_DIR, tf);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      const ageDays = Math.floor((Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24));
      const status = ageDays <= 7 ? '✅' : ageDays <= 30 ? '⚠️' : '❌';
      console.log(`${status} ${tf} — última atualização: ${ageDays} dia(s) atrás`);
    } else {
      console.log(`❌ ${tf} — não existe`);
    }
  }

  // 4. Check feedback loops
  console.log('\n--- Feedback Loops ---');
  const feedbackDir = path.join(MEMORY_DIR, 'feedback');
  if (fs.existsSync(feedbackDir)) {
    const feedbackFiles = fs.readdirSync(feedbackDir);
    for (const ff of feedbackFiles) {
      const filePath = path.join(feedbackDir, ff);
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      try {
        const data = JSON.parse(content);
        const entries = data.entries || [];
        const status = entries.length > 0 ? '✅' : '⚠️ vazio';
        console.log(`${status} ${ff} — ${entries.length} entrada(s)`);
      } catch {
        console.log(`❌ ${ff} — JSON inválido`);
      }
    }
  } else {
    console.log('❌ Pasta feedback/ não existe');
  }

  console.log('\n=== Validação completa ===');
}

run();
