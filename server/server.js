require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const rotasProcessoSeletivo = require('./server-processoseletivo');
// Importa a rota de autenticação
const rotasAuth = require('./server-auth'); 
const rotasEquipamentos = require('./server-equipamentos'); 

app.use('/api/equipamentos', rotasEquipamentos);
app.use('/api/processo-seletivo', rotasProcessoSeletivo);

// onfigura o prefixo da rota de autenticação
app.use('/api/auth', rotasAuth); 
app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', mensagem: 'API Corporate Portal Mock operacional!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor da API a rodar na porta ${PORT}`);
});