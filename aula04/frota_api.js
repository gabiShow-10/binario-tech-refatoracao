const express = require('express');
const app = express();

// Missão 2: Ler porta via variável de ambiente ou usar 3014 por padrão - Talyson
const PORT = process.env.PORT || 3014;

app.use(express.json());

// Banco de dados em memória
let veiculos = [
    { id: 1, placa: "ABC-1234", montadora: "Scania", modelo: "R450", status: "DISPONIVEL" },
    { id: 2, placa: "XYZ-9876", montadora: "Mercedes-Benz", modelo: "Actros", status: "EM_ROTA" }
];

// Contador incremental para evitar conflitos/duplicações de ID
let proximoId = 3;

// --- ROTAS DA API ---

// Missão 1: Rota Healthcheck com uptime e uso de memória
app.get('/api/v1/health', (req, res) => {
    return res.status(200).json({
        status: 'UP',
        uptime: `${process.uptime().toFixed(2)}s`,
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// 1. GET /api/v1/veiculos - Listar todos os veículos (com filtro opcional por status)
app.get('/api/v1/veiculos', (req, res) => {
    const { status } = req.query;
    if (status) {
        const filtrados = veiculos.filter(v => v.status.toUpperCase() === status.toUpperCase());
        return res.status(200).json(filtrados);
    }
    return res.status(200).json(veiculos);
});

// 2. GET /api/v1/veiculos/:id - Buscar veículo por ID
app.get('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const veiculo = veiculos.find(v => v.id === id);
    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado na base de dados." });
    }
    return res.status(200).json(veiculo);
});

// 3. POST /api/v1/veiculos - Cadastrar novo veículo
app.post('/api/v1/veiculos', (req, res) => {
    const { placa, montadora, modelo } = req.body;
    if (!placa || !montadora || !modelo) {
        return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
    }
    const novoVeiculo = {
        id: proximoId++,
        placa,
        montadora,
        modelo,
        status: "DISPONIVEL"
    };
    veiculos.push(novoVeiculo);
    return res.status(201).json(novoVeiculo);
});

// 4. PATCH /api/v1/veiculos/:id/status - Atualizar status
app.patch('/api/v1/veiculos/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const veiculo = veiculos.find(v => v.id === id);

    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    if (!status) {
        return res.status(400).json({ erro: "O campo 'status' e obrigatorio." });
    }

    veiculo.status = status.toUpperCase();
    return res.status(200).json({ mensagem: "Status atualizado com sucesso!", veiculo });
});

// 5. DELETE /api/v1/veiculos/:id - Remover veículo
app.delete('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = veiculos.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    veiculos.splice(index, 1);
    return res.status(200).json({ mensagem: `Veiculo ID ${id} removido com sucesso.` });
});

// 6. PUT /api/v1/veiculos/:id - Substituir veículo
app.put('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { placa, montadora, modelo, status } = req.body;

    const index = veiculos.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }

    if (!placa || !montadora || !modelo) {
        return res.status(400).json({ erro: "Os campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
    }

    const novoStatus = status ? status.toUpperCase() : (veiculos[index].status || "DISPONIVEL");

    veiculos[index] = {
        id,
        placa,
        montadora,
        modelo,
        status: novoStatus
    };

    return res.status(200).json({ mensagem: "Veiculo atualizado completamente com sucesso!", veiculo: veiculos[index] });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`[Binario Tech] API de Frotas rodando em http://localhost:${PORT}`);
});
