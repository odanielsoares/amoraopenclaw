/**
 * Tactical Lessons Expiration Script
 * 
 * Lê lessons.md e move lições táticas com mais de 30 dias
 * para um arquivo de arquivo (memory/expired-lessons.md).
 * 
 * Regras:
 * - Lições marcadas com (tática) e data > 30 dias → expiram
 * - Lições marcadas com (estratégica) → NUNCA expiram
 * - Lições expiradas são movidas, não deletadas
 */
const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(process.cwd(), 'memory');
const LESSONS_FILE = path.join(MEMORY_DIR, 'lessons.md');
const EXPIRED_FILE = path.join(MEMORY_DIR, 'expired-lessons.md');
const EXPIRY_DAYS = 30;

function run() {
  console.log('=== Tactical Lessons Expiration ===');
  
  if (!fs.existsSync(LESSONS_FILE)) {
    console.log('lessons.md não encontrado.');
    return;
  }

  const content = fs.readFileSync(LESSONS_FILE, 'utf-8');
  const lines = content.split('\n');
  
  const kept = [];
  const expired = [];
  let currentBlock = [];
  let currentDate = null;
  let currentType = null;

  function flushBlock() {
    if (currentBlock.length === 0) return;
    
    const blockText = currentBlock.join('\n');
    
    if (currentType === 'tatica' && currentDate) {
      const lessonDate = new Date(currentDate);
      const now = new Date();
      const diffDays = (now - lessonDate) / (1000 * 60 * 60 * 24);
      
      if (diffDays > EXPIRY_DAYS) {
        expired.push(blockText);
        console.log(`⏰ Expirada: ${currentDate} (tática, ${Math.floor(diffDays)} dias)`);
        currentBlock = [];
        currentDate = null;
        currentType = null;
        return;
      }
    }
    
    kept.push(blockText);
    currentBlock = [];
    currentDate = null;
    currentType = null;
  }

  for (const line of lines) {
    // Detect section headers like: ## 2026-02-22 (tática) — ...
    const headerMatch = line.match(/^## (\d{4}-\d{2}-\d{2}) \((tática|estratégica|tatica|estrategica)\)/i);
    
    if (headerMatch) {
      flushBlock();
      currentDate = headerMatch[1];
      currentType = headerMatch[2].toLowerCase().replace('á', 'a').replace('é', 'e');
      currentBlock.push(line);
    } else if (line.startsWith('## ') && currentBlock.length > 0) {
      // New section that doesn't match pattern
      flushBlock();
      currentBlock.push(line);
    } else {
      currentBlock.push(line);
    }
  }
  
  flushBlock();

  // Write kept lessons back
  fs.writeFileSync(LESSONS_FILE, kept.join('\n'));
  
  // Append expired to archive
  if (expired.length > 0) {
    const archiveHeader = fs.existsSync(EXPIRED_FILE) ? '' : '# Lições Táticas Expiradas\n\n';
    const expiredContent = archiveHeader + `\n## Expiradas em ${new Date().toISOString().split('T')[0]}\n\n` + expired.join('\n\n') + '\n';
    fs.appendFileSync(EXPIRED_FILE, expiredContent);
  }

  console.log(`\n✅ Mantidas: ${kept.length} blocos | Expiradas: ${expired.length} blocos`);
}

run();
