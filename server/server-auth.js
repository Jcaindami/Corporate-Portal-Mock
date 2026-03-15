const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Configuração do Pool de Conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'corporate_portal_mock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoint: Realizar Login
router.post('/login', async (req, res) => {
    // 1. Recebe os dados enviados pelo Front-end
    const { email, senha } = req.body;

    // 2. Validação básica
    if (!email || !senha) {
        return res.status(400).json({ 
            sucesso: false, 
            mensagem: 'Email e palavra-passe são obrigatórios.' 
        });
    }

    try {
        // 3. Procura o utilizador na base de dados
        const [usuarios] = await pool.query('SELECT * FROM dtbUsuariosSite WHERE email = ?', [email]);

        if (usuarios.length === 0) {
            return res.status(401).json({ 
                sucesso: false, 
                mensagem: 'Credenciais inválidas. Utilizador não encontrado.' 
            });
        }

        const usuario = usuarios[0];

        // 4. Compara a palavra-passe enviada com o hash guardado na base de dados
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ 
                sucesso: false, 
                mensagem: 'Credenciais inválidas. Palavra-passe incorreta.' 
            });
        }

        // 5. Gera o Token JWT (válido por 2 horas)
        // Colocamos o ID e o Perfil dentro do token para usar nos middlewares
        const token = jwt.sign(
            { id: usuario.id, perfil: usuario.perfil, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // 6. Devolve o token e os dados básicos do utilizador para o Front-end
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Login efetuado com sucesso!',
            token: token,
            usuario: {
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });

    } catch (error) {
        console.error('Erro no endpoint de login:', error);
        return res.status(500).json({ 
            sucesso: false, 
            mensagem: 'Erro interno no servidor ao tentar iniciar sessão.' 
        });
    }
});

module.exports = router;