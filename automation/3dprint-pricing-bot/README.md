# BlogBot — Precificação Impressão 3D

## Endpoints
- Base: `https://zfwwaeualfmsjobflnpj.supabase.co/functions/v1/create-blog-post`
- Auth: header `x-api-key: $BLOG_API_KEY`

## Configuração de segredo
Crie um arquivo **não versionado**:
- `.env` (na raiz do workspace) ou `secure/blogbot.env`

Conteúdo:
- `BLOG_API_KEY=...`
- (opcional) `BLOG_ENDPOINT=...` (se quiser sobrescrever)

> Importante: se a chave foi enviada em chat, rotacione/recrie a key no Supabase e atualize aqui.

## Fontes
- `sources.ptbr.json` — RSS + fontes manuais + queries

## Prompt
- `PROMPT_ARTICLE.md` — regras editoriais + formato de saída

## Crons
- `crons/blogbot-3dpricing-morning.json` — 08:10 BRT
- `crons/blogbot-3dpricing-evening.json` — 17:10 BRT

## Próximos passos recomendados
1) Implementar upload de imagem (cover) em um bucket (Supabase Storage) e usar a URL pública no `cover_image_url`.
2) Criar tabela/controle de deduplicação (últimos slugs publicados) para evitar repetição.
3) Começar 3–5 dias com `published=false` e só depois auto-publicar.
