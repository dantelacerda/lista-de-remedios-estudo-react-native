#!/bin/bash
# Hook de Validação de Qualidade: bloqueia commits com problemas de TypeScript,
# console.log esquecidos ou credenciais hardcoded.

PROJECT_DIR="/Users/dantelacerda/projetos/projetos-react/my-app"
cd "$PROJECT_DIR" || exit 0

ERRORS=""

# ─── 1. TypeScript: verifica erros de tipo ────────────────────────────────────
TSC_OUTPUT=$(npx tsc --noEmit 2>&1)
if [ $? -ne 0 ]; then
    ERRORS="${ERRORS}\n\n🔴 ERROS TYPESCRIPT (npx tsc --noEmit)\n${TSC_OUTPUT}"
fi

# ─── 2. console.log esquecidos nos arquivos de código ─────────────────────────
SCAN_DIRS="app hooks services"
CONSOLE_LOGS=$(grep -rn "console\.log" --include="*.ts" --include="*.tsx" $SCAN_DIRS 2>/dev/null \
    | grep -v "^\s*//" \
    | head -10)
if [ -n "$CONSOLE_LOGS" ]; then
    ERRORS="${ERRORS}\n\n⚠️  CONSOLE.LOG ENCONTRADO (remova antes do commit)\n${CONSOLE_LOGS}"
fi

# ─── 3. Credenciais hardcoded ─────────────────────────────────────────────────
SECRETS=$(grep -rEin "(api_key|apikey|secret|password|token)\s*[:=]\s*['\"][^'\"]{8,}['\"]" \
    --include="*.ts" --include="*.tsx" $SCAN_DIRS 2>/dev/null \
    | grep -iv "process\.env\|placeholder\|example\|your_" \
    | head -5)
if [ -n "$SECRETS" ]; then
    ERRORS="${ERRORS}\n\n🚨 POSSÍVEIS CREDENCIAIS HARDCODED\n${SECRETS}"
fi

# ─── Resultado ────────────────────────────────────────────────────────────────
if [ -n "$ERRORS" ]; then
    HEADER="❌ Commit bloqueado — problemas encontrados. Corrija antes de commitar:"
    FULL_MESSAGE="${HEADER}${ERRORS}\n\n💡 Dica: corrija os problemas acima e tente novamente."

    REASON=$(printf '%s' "$FULL_MESSAGE" | jq -Rs .)
    printf '{"continue": false, "stopReason": %s, "hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": %s}}' \
        "$REASON" "$REASON"
    exit 2
fi

echo '{"systemMessage": "✅ [Hook: Qualidade] TypeScript OK · sem console.log · sem credenciais expostas → commit liberado!"}'
exit 0
