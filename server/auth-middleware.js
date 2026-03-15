const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // 1. Obtém o token do cabeçalho da requisição (padrão Bearer Token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Se não houver token, barra o acesso imediatamente
    if (!token) {
        return res.status(401).json({ 
            sucesso: false, 
            mensagem: 'Acesso negado. Token de autenticação não fornecido.' 
        });
    }

    try {
        // 3. Verifica se o token é válido usando a chave secreta do .env
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Injeta os dados do usuário (ex: id, perfil) na requisição para uso nas rotas seguintes
        req.usuario = decodificado;
        
        // 5. Libera o fluxo para o próximo controlador
        next();
    } catch (error) {
        return res.status(403).json({ 
            sucesso: false, 
            mensagem: 'Token inválido ou expirado. Faça login novamente.' 
        });
    }
};

// Exemplo de um Middleware extra para verificar perfil de Admin
const verificarAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.perfil === 'Admin') {
        next();
    } else {
        return res.status(403).json({ 
            sucesso: false, 
            mensagem: 'Acesso restrito. Privilégios de Administrador requeridos.' 
        });
    }
};

module.exports = { verificarToken, verificarAdmin };