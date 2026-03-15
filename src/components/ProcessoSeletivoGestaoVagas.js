import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const ProcessoSeletivoGestaoVagas = () => {
    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    // Recupera os dados do utilizador logado para exibir no ecrã
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario')) || {};

    useEffect(() => {
        const fetchVagas = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:5000/api/processo-seletivo/vagas', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // <-- O envio do token JWT!
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok && data.sucesso) {
                    setVagas(data.dados);
                } else if (response.status === 401 || response.status === 403) {
                    // Se o token for inválido ou tiver expirado, limpa a sessão e expulsa o utilizador
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    navigate('/login');
                } else {
                    setErro(data.mensagem || 'Erro ao carregar as vagas.');
                }
            } catch (err) {
                console.error('Erro na requisição:', err);
                setErro('Falha na comunicação com o servidor. A API está a correr?');
            } finally {
                setLoading(false);
            }
        };

        fetchVagas();
    }, [navigate]);


    // Formatar data para o padrão PT
    const formatarData = (dataString) => {
        if (!dataString) return '-';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-PT');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Cabeçalho da Aplicação (Navbar Simples) */}
            <Navbar />

            {/* Conteúdo Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Gestão de Vagas</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                        + Nova Vaga
                    </button>
                </div>

                {/* Tratamento de Estados: Loading, Erro ou Tabela */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : erro ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-red-700">{erro}</p>
                    </div>
                ) : vagas.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
                        Nenhuma vaga encontrada no sistema.
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título da Vaga</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Abertura</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vagas.map((vaga) => (
                                    <tr key={vaga.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{vaga.titulo}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{vaga.departamento}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{formatarData(vaga.data_abertura)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${vaga.status === 'Aberta' ? 'bg-green-100 text-green-800' : 
                                                  vaga.status === 'Fechada' ? 'bg-red-100 text-red-800' : 
                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                {vaga.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProcessoSeletivoGestaoVagas;