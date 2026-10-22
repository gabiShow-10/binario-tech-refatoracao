#!/bin/bash

# Captura a porta passada via parâmetro do CLI ou usa 3014 como padrão
PORT=${1:-3014}
BASE_URL="http://localhost:${PORT}/api/v1"
LOG_FILE="crud_result.log"

echo "======================================"
echo " Teste de CRUD Dinâmico na Porta $PORT"
echo "======================================"

echo "=== INICIANDO TESTES CRUD - $(date) ===" > $LOG_FILE

# 1. Healthcheck (Missão 1)
echo -e "\n0. Checando Healthcheck..." >> $LOG_FILE
curl -s "${BASE_URL}/health" | jq . >> $LOG_FILE

# 2. Cadastro 1 e Captura Dinâmica do ID (Missão 3)
echo -e "\n1. Cadastrando Veículo 1 (DAF)..." >> $LOG_FILE
RES_POST=$(curl -s -X POST "${BASE_URL}/veiculos" \
  -H "Content-Type: application/json" \
  -d '{"placa":"ABC-9999","montadora":"DAF","modelo":"XF"}')

echo "$RES_POST" | jq . >> $LOG_FILE

# Extrai o ID dinâmico retornado pelo servidor
ID_CRIADO=$(echo "$RES_POST" | jq -r '.id // .veiculo.id')

# 3. Atualizando status usando o ID Dinâmico
echo -e "\n2. Atualizando status do Veículo ID $ID_CRIADO..." >> $LOG_FILE
curl -s -X PATCH "${BASE_URL}/veiculos/${ID_CRIADO}/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"EM_ROTA"}' | jq . >> $LOG_FILE

# 4. Deletando usando o ID Dinâmico
echo -e "\n3. Deletando Veículo ID $ID_CRIADO..." >> $LOG_FILE
curl -s -X DELETE "${BASE_URL}/veiculos/${ID_CRIADO}" | jq . >> $LOG_FILE

echo -e "\n=== TESTES FINALIZADOS DE FORMA SEQUENCIAL ===" >> $LOG_FILE

echo "."
sleep 1
echo "."
sleep 1
echo "."

echo "====================================================="
echo " TESTES FINALIZADOS - RESULTADO EM '$LOG_FILE'"
echo "====================================================="
