import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const SolicitacaoEquipamentos = () => {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [form, setForm] = useState({ titulo: '', descricao: '', departamento: 'TI', urgencia: 'Média' });
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario')) || {};
    const token = localStorage.getItem('token');

    const carregarSolicitacoes = async () => {
        const response = await fetch('http://localhost:5000/api/equipamentos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.sucesso) setSolicitacoes(data.dados);
    };

    useEffect(() => {
        carregarSolicitacoes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5000/api/equipamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(form)
        });
        setForm({ titulo: '', descricao: '', departamento: 'TI', urgencia: 'Média' });
        carregarSolicitacoes(); // Recarrega a lista após criar
    };

    const atualizarStatus = async (id, novoStatus) => {
        await fetch(`http://localhost:5000/api/equipamentos/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: novoStatus })
        });
        carregarSolicitacoes();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Cabeçalho da Aplicação (Navbar Simples) */}
            <Navbar />
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Solicitação de Equipamentos</h2>

            {/* Formulário de Nova Solicitação */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8 space-y-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título da Solicitação</label>
                        <input type="text" required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Monitor Extra" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Departamento</label>
                        <select value={form.departamento} onChange={e => setForm({...form, departamento: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                            <option>TI</option><option>Recursos Humanos</option><option>Operações</option><option>Financeiro</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Descrição Longa</label>
                        <textarea required value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} rows="3" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="Justifique a necessidade..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nível de Urgência</label>
                        <select value={form.urgencia} onChange={e => setForm({...form, urgencia: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                            <option>Baixa</option><option>Média</option><option>Alta</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Enviar Solicitação</button>
            </form>

            {/* Tabela de Solicitações */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipamento</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solicitante</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgência</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            {/* O cabeçalho de ações só aparece se for Admin ou Gestor */}
                            {(usuarioLogado.perfil === 'Admin' || usuarioLogado.perfil === 'Gestor') && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {solicitacoes.map(sol => (
                            <tr key={sol.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sol.titulo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sol.nome_solicitante}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${sol.urgencia === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{sol.urgencia}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${sol.status === 'Aprovado' ? 'bg-green-100 text-green-800' : sol.status === 'Reprovado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{sol.status}</span>
                                </td>
                                
                                {/* Os botões de ação só renderizam se o utilizador tiver perfil de gestão */}
                                {(usuarioLogado.perfil === 'Admin' || usuarioLogado.perfil === 'Gestor') && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {sol.status === 'Pendente' && (
                                            <>
                                                <button onClick={() => atualizarStatus(sol.id, 'Aprovado')} className="text-green-600 hover:text-green-900">Aprovar</button>
                                                <button onClick={() => atualizarStatus(sol.id, 'Reprovado')} className="text-red-600 hover:text-red-900">Reprovar</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SolicitacaoEquipamentos;