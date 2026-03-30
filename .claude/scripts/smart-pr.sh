#!/bin/bash
# Hook de Pull Request Inteligente:
# Após git push, analisa as mudanças, gera resumo técnico e riscos de segurança,
# e cria o PR via GitHub API (se GITHUB_TOKEN estiver configurado).

PROJECT_DIR="/Users/dantelacerda/projetos/projetos-react/my-app"
cd "$PROJECT_DIR" || exit 0

# ─── Contexto do branch ───────────────────────────────────────────────────────
BRANCH=$(git branch --show-current 2>/dev/null)

# Não cria PR a partir de main/master
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ] || [ -z "$BRANCH" ]; then
    exit 0
fi

# Verifica se há commits à frente de origin/main
COMMITS=$(git log origin/main..HEAD --oneline 2>/dev/null)
if [ -z "$COMMITS" ]; then
    exit 0
fi

# ─── Coleta de dados para análise ────────────────────────────────────────────
DIFF=$(git diff origin/main...HEAD -- '*.ts' '*.tsx' '*.js' '*.json' 2>/dev/null | head -600)
FILE_SUMMARY=$(git diff origin/main...HEAD --stat 2>/dev/null | tail -5)

# ─── Geração do conteúdo do PR via Claude ────────────────────────────────────
PR_CONTENT=$(claude --print "Você é um engenheiro de software sênior revisando um Pull Request de um app React Native/Expo.

Branch: $BRANCH
Commits incluídos:
$COMMITS

Resumo de arquivos alterados:
$FILE_SUMMARY

Diff (arquivos .ts, .tsx, .js, .json):
$DIFF

Gere o conteúdo completo do PR em markdown com exatamente estas seções:

## Resumo
(2-4 bullet points descrevendo o que foi implementado/corrigido)

## Detalhes Técnicos
(explicação das mudanças mais relevantes para o revisor)

## Riscos de Segurança
(liste problemas potenciais: dados expostos, validações ausentes, dependências, etc. Se não houver riscos, escreva 'Nenhum risco identificado.')

## Checklist para Revisão
- [ ] (itens específicos para o revisor verificar baseados nas mudanças)

Retorne APENAS o markdown acima, sem texto adicional." 2>/dev/null)

if [ -z "$PR_CONTENT" ]; then
    MSG="⚠️ Não foi possível gerar o conteúdo do PR. Verifique se o Claude CLI está autenticado."
    echo "{\"systemMessage\": $(jq -n --arg m "$MSG" '$m')}"
    exit 0
fi

# ─── Extrai o título dos commits ──────────────────────────────────────────────
FIRST_COMMIT=$(echo "$COMMITS" | head -1 | sed 's/^[a-f0-9]* //')
PR_TITLE=$(echo "$BRANCH: $FIRST_COMMIT" | cut -c1-70)

# ─── Tenta criar o PR via GitHub API ─────────────────────────────────────────
REPO=$(git remote get-url origin 2>/dev/null \
    | sed 's|.*github\.com[:/]||' \
    | sed 's|\.git$||')
TOKEN="${GITHUB_TOKEN:-}"

if [ -n "$TOKEN" ] && [ -n "$REPO" ]; then
    API_PAYLOAD=$(jq -n \
        --arg title "$PR_TITLE" \
        --arg body "$PR_CONTENT" \
        --arg head "$BRANCH" \
        --arg base "main" \
        '{"title":$title,"body":$body,"head":$head,"base":$base}')

    API_RESPONSE=$(curl -s -X POST \
        -H "Authorization: token $TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -H "Content-Type: application/json" \
        "https://api.github.com/repos/$REPO/pulls" \
        -d "$API_PAYLOAD" 2>/dev/null)

    PR_URL=$(echo "$API_RESPONSE" | jq -r '.html_url // empty' 2>/dev/null)
    API_ERROR=$(echo "$API_RESPONSE" | jq -r '.message // empty' 2>/dev/null)

    if [ -n "$PR_URL" ]; then
        MSG="✅ Pull Request criado automaticamente!\n🔗 $PR_URL\n\n$PR_CONTENT"
    else
        MSG="⚠️ GitHub API retornou erro: ${API_ERROR:-resposta inválida}\n\nConteúdo do PR gerado (copie e cole manualmente):\n\n**Título:** $PR_TITLE\n\n$PR_CONTENT"
    fi
else
    MSG="📋 PR Inteligente gerado! Configure GITHUB_TOKEN para criação automática.\n\n**Título sugerido:** $PR_TITLE\n\n$PR_CONTENT"
fi

echo "{\"systemMessage\": $(jq -n --arg m "$MSG" '$m')}"
