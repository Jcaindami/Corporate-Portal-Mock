require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globais
app.use(cors()); // Permite requisições do Front-end (React)
app.use(express.json()); // Permite receber dados no formato JSON

// Importação das rotas
// Vamos criar este ficheiro no próximo passo
const rotasProcessoSeletivo = require('./server-processoseletivo');

// Configuração dos Endpoints
app.use('/api/processo-seletivo', rotasProcessoSeletivo);

// Rota de verificação de status (Health Check)
app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', mensagem: 'API Corporate Portal Mock operacional!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor da API a rodar na porta ${PORT}`);
});