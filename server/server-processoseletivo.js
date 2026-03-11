const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { verificarToken } = require('./auth-middleware');

// Configuração do Pool de Conexões com o Banco de Dados
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'corporate_portal_mock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoint: Listar todas as vagas (Rota Protegida)
// O front-end terá que enviar o token JWT no cabeçalho para acessar isto!
router.get('/vagas', verificarToken, async (req, res) => {
    try {
        const [vagas] = await pool.query('SELECT * FROM dtbVagas ORDER BY data_abertura DESC');
        
        return res.status(200).json({ 
            sucesso: true, 
            total: vagas.length,
            dados: vagas 
        });
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        return res.status(500).json({ 
            sucesso: false, 
            mensagem: 'Erro interno no servidor ao procurar vagas.' 
        });
    }
});

module.exports = router;