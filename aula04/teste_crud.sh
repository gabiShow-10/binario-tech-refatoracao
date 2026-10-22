#!/bin/bash

echo "======================================"
echo " Teste de PATCH e DELETE iniciando..."
echo "======================================"

sleep 1

LOG_FILE="crud_result.log"

echo "=== INICIANDO TESTES CRUD - $(date) ===" > $LOG_FILE

echo -e "\n1. Cadastrando Veículo 1 (DAF)..." >> $LOG_FILE
curl -s -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" -d '{"placa":"ABC-9999","montadora":"DAF","modelo":"XF"}' | jq . >> $LOG_FILE

echo -e "\n2. Cadastrando Veículo 2 (Iveco)..." >> $LOG_FILE
curl -s -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" -d '{"placa":"XYZ-8888","montadora":"Volvo","modelo":"FH 540"}' | jq . >> $LOG_FILE

echo -e "\n3. Atualizando status do Veículo ID 3..." >> $LOG_FILE
curl -s -X PATCH http://localhost:3013/api/v1/veiculos/3/status -H "Content-Type: application/json" -d '{"status":"EM_ROTA"}' | jq . >> $LOG_FILE

echo -e "\n4. Deletando Veículo ID 4..." >> $LOG_FILE
curl -s -X DELETE http://localhost:3013/api/v1/veiculos/5 | jq . >> $LOG_FILE

echo -e "\n=== TESTES FINALIZADOS DE FORMA SEQUENCIAL ===" >> $LOG_FILE

echo "."
sleep 1
echo "."
sleep 1
echo "."
sleep 1

echo "====================================================="
echo " TESTES FINALIZADOS - RESULTADO EM ´crud_result.log´"
echo "====================================================="
