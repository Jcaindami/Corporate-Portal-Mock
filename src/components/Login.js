import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // Gestão de estado do formulário
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Hook do React Router para redirecionar o utilizador após o login
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita que a página recarregue
        setErro('');
        setLoading(true);

        try {
            // Chamada à nossa API mockada local
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (response.ok && data.sucesso) {
                // 1. Guarda o token de forma segura no Local Storage
                localStorage.setItem('token', data.token);
                
                // 2. Guarda os dados básicos do utilizador para exibir no cabeçalho
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                
                // 3. Redireciona para o módulo de Processo Seletivo (Vagas)
                navigate('/vagas');
            } else {
                // Exibe a mensagem de erro vinda do Back-end (ex: Palavra-passe incorreta)
                setErro(data.mensagem || 'Falha na autenticação.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            setErro('Erro ao ligar ao servidor. Verifique se a API está a correr.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
                
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Corporate Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Acesso ao Ambiente de Demonstração
                    </p>
                </div>

                {erro && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-sm text-red-700">{erro}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Endereço de Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="admin@mock.local"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                                Palavra-passe
                            </label>
                            <input
                                id="senha"
                                name="senha"
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                        >
                            {loading ? 'A autenticar...' : 'Iniciar Sessão'}
                        </button>
                    </div>
                </form>
                
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        Credenciais de Teste: <br/>
                        <strong>Email:</strong> admin@mock.local | <strong>Senha:</strong> senhaTeste123
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;