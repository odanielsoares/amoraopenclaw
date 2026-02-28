/**
 * Memory Consolidation Script
 * 
 * Lê notas diárias (memory/YYYY-MM-DD.md) e consolida
 * conteúdo relevante nos topic files:
 * - decisions.md, lessons.md, projects.md, people.md, pending.md
 * 
 * Regras:
 * - Notas com mais de 3 dias são candidatas a consolidação
 * - Após consolidar, marca nota como "[CONSOLIDADA]"
 * - Nunca deleta notas diárias (histórico)
 */
const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(process.cwd(), 'memory');
const DAYS_THRESHOLD = 3;

function getDailyNotes() {
  const files = fs.readdirSync(MEMORY_DIR);
  const datePattern = /^\d{4}-\d{2}-\d{2}\.md$/;
  return files.filter(f => datePattern.test(f)).map(f => ({
    file: f,
    date: new Date(f.replace('.md', '')),
    path: path.join(MEMORY_DIR, f)
  }));
}

function isOlderThan(date, days) {
  const now = new Date();
  const diff = (now - date) / (1000 * 60 * 60 * 24);
  return diff >= days;
}

function isConsolidated(content) {
  return content.includes('[CONSOLIDADA]');
}

function extractSections(content) {
  const sections = {
    decisions: [],
    lessons: [],
    projects: [],
    people: [],
    pending: []
  };

  const lines = content.split('\n');
  let currentSection = null;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('decisão') || lower.includes('decisao') || lower.includes('decision')) {
      currentSection = 'decisions';
    } else if (lower.includes('lição') || lower.includes('licao') || lower.includes('lesson') || lower.includes('aprendizado')) {
      currentSection = 'lessons';
    } else if (lower.includes('projeto') || lower.includes('project')) {
      currentSection = 'projects';
    } else if (lower.includes('pessoa') || lower.includes('contato') || lower.includes('people')) {
      currentSection = 'people';
    } else if (lower.includes('pendente') || lower.includes('pending') || lower.includes('aguardando')) {
      currentSection = 'pending';
    }

    if (currentSection && line.trim().startsWith('-')) {
      sections[currentSection].push(line.trim());
    }
  }

  return sections;
}

function appendToTopicFile(topicFile, entries, sourceDate) {
  if (entries.length === 0) return;
  const filePath = path.join(MEMORY_DIR, topicFile);
  const header = `\n\n## Consolidado de ${sourceDate}\n`;
  const content = header + entries.join('\n') + '\n';
  fs.appendFileSync(filePath, content);
  console.log(`  → Adicionado ${entries.length} item(s) em ${topicFile}`);
}

function markConsolidated(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  fs.writeFileSync(filePath, `[CONSOLIDADA]\n\n${content}`);
}

function run() {
  console.log('=== Memory Consolidation ===');
  console.log(`Diretório: ${MEMORY_DIR}`);
  console.log(`Threshold: ${DAYS_THRESHOLD} dias\n`);

  const notes = getDailyNotes();
  console.log(`Notas diárias encontradas: ${notes.length}`);

  let consolidated = 0;

  for (const note of notes) {
    if (!isOlderThan(note.date, DAYS_THRESHOLD)) {
      console.log(`⏭  ${note.file} — recente demais, pulando`);
      continue;
    }

    const content = fs.readFileSync(note.path, 'utf-8');

    if (isConsolidated(content)) {
      console.log(`✅ ${note.file} — já consolidada`);
      continue;
    }

    console.log(`🔄 ${note.file} — consolidando...`);
    const sections = extractSections(content);

    appendToTopicFile('decisions.md', sections.decisions, note.file);
    appendToTopicFile('lessons.md', sections.lessons, note.file);
    appendToTopicFile('projects.md', sections.projects, note.file);
    appendToTopicFile('people.md', sections.people, note.file);
    appendToTopicFile('pending.md', sections.pending, note.file);

    markConsolidated(note.path);
    consolidated++;
  }

  console.log(`\n✅ Consolidação completa. ${consolidated} nota(s) processada(s).`);
}

run();
