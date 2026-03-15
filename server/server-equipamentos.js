const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { verificarToken } = require('./auth-middleware');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// 1. Criar nova solicitação (Qualquer pessoa logada)
router.post('/', verificarToken, async (req, res) => {
    const { titulo, descricao, departamento, urgencia } = req.body;
    const usuario_id = req.usuario.id; // Vem do token JWT

    try {
        await pool.query(
            'INSERT INTO dtbSolicitacoesEquipamentos (usuario_id, titulo, descricao, departamento, urgencia) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, titulo, descricao, departamento, urgencia]
        );
        res.status(201).json({ sucesso: true, mensagem: 'Solicitação criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar solicitação.' });
    }
});

// 2. Listar solicitações (Traz o nome do utilizador junto)
router.get('/', verificarToken, async (req, res) => {
    try {
        const [solicitacoes] = await pool.query(`
            SELECT s.*, u.nome AS nome_solicitante 
            FROM dtbSolicitacoesEquipamentos s
            JOIN dtbUsuariosSite u ON s.usuario_id = u.id
            ORDER BY s.data_criacao DESC
        `);
        res.status(200).json({ sucesso: true, dados: solicitacoes });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar solicitações.' });
    }
});

// 3. Atualizar Status (Apenas Admin ou Gestor)
router.put('/:id/status', verificarToken, async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const perfil = req.usuario.perfil;

    // A MÁGICA DO RBAC: Bloqueia se for apenas um colaborador
    if (perfil !== 'Admin' && perfil !== 'Gestor') {
        return res.status(403).json({ 
            sucesso: false, 
            mensagem: 'Acesso negado. Apenas Gestores e Administradores podem aprovar solicitações.' 
        });
    }

    try {
        await pool.query('UPDATE dtbSolicitacoesEquipamentos SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ sucesso: true, mensagem: `Status atualizado para ${status}!` });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar status.' });
    }
});

module.exports = router;