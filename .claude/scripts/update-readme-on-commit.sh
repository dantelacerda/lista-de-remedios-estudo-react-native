#!/bin/bash
# Hook de documentação automática: atualiza README.md após cada commit.
set -euo pipefail

PROJECT_DIR="/Users/dantelacerda/projetos/projetos-react/my-app"
cd "$PROJECT_DIR"

# Obtém o diff do último commit (apenas arquivos de código relevantes)
DIFF=$(git diff HEAD~1 HEAD -- '*.ts' '*.tsx' '*.js' '*.json' 2>/dev/null | head -300)
[ -z "$DIFF" ] && exit 0

# Lê o README atual (ou usa um template vazio)
README=$(cat README.md 2>/dev/null || echo "# My App")

# Usa claude CLI para gerar o README atualizado
UPDATED=$(claude --print "Você é um assistente de documentação para um projeto React Native/Expo.

README.md atual:
---
$README
---

Diff do último commit git (arquivos .ts, .tsx, .js, .json):
---
$DIFF
---

Analise as mudanças e atualize o README.md para refletir as alterações mais recentes.
Mantenha o estilo e estrutura existentes. Retorne APENAS o conteúdo markdown completo e atualizado do README.md, sem texto adicional." 2>/dev/null)

if [ -n "$UPDATED" ]; then
    echo "$UPDATED" > README.md
    echo '{"systemMessage": "📄 README.md atualizado automaticamente com base no último commit."}'
fi
