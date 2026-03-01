# Prompt base — Artigo de blog (Precificação impressão 3D)

## Objetivo
Gerar um artigo **original** (não copiar trechos longos), útil e acionável sobre precificação/custos/margem em impressão 3D, para público maker / pequenos vendedores.

## Regras
- Proibido reproduzir parágrafos das fontes; apenas **síntese**.
- Sempre incluir seção "Fontes e leituras" com links.
- Linguagem clara, didática, com exemplos numéricos.
- Incluir CTA discreto para o SaaS (calculadora de custos / precificação).

## Estrutura (HTML)
- H1: Título
- Introdução curta (2–4 frases)
- H2: O que compõe o custo real (filamento, energia, depreciação, falhas, pós-processo, embalagem, taxa marketplace, impostos)
- H2: Método de precificação (custo → margem → preço; e preço por valor)
- H2: Exemplo prático (valores, tabela simples em HTML)
- H2: Erros comuns e como evitar
- H2: Checklist rápido
- H2: FAQ (3–5 perguntas)
- Conclusão + CTA
- "Fontes e leituras" (lista com 5–10 links)

## SEO
- Meta title: até ~60 caracteres
- Meta description: 140–160 caracteres
- Usar keywords naturalmente (sem stuffing)

## Saída esperada (JSON para publicação)
- title
- excerpt
- content (HTML)
- meta_title
- meta_description
- cover_image_prompt (texto para gerar imagem)
- tags (array)
- sources (array de URLs)
