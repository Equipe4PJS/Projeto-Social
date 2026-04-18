#!/bin/bash

echo "🚀 Monitoramento iniciado... Pressione [CTRL+C] para parar."

while true; do
  # Verifica se há mudanças (arquivos novos, modificados ou deletados)
  if [[ -n $(git status -s) ]]; then
    echo "Files changed! Sincronizando com o GitHub..."
    git add .
    git commit -m "Auto-commit: $(date +'%Y-%m-%d %H:%M:%S')"
    git push origin main  # Mude para 'master' se for o caso
    echo "✅ Sincronizado. Aguardando próximas mudanças..."
  fi
  sleep 30 # Verifica a cada 30 segundos para não sobrecarregar
done