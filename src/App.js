import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação dos componentes
import Login from './components/Login';
import ProcessoSeletivoGestaoVagas from './components/ProcessoSeletivoGestaoVagas';
import SolicitacaoEquipamentos from './components/SolicitacaoEquipamentos';

/**
 * Componente de Guarda de Rota (Route Guard)
 * Avalia se o utilizador está autenticado antes de permitir o acesso.
 */
const RotaProtegida = ({ children }) => {
    // Procura o token gerado pela nossa API Node.js no Local Storage
    const token = localStorage.getItem('token');

    // Se não existir token, expulsa o utilizador para a tela de Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Se existir token, permite a renderização do componente protegido
    return children;
};

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    {/* Rota Pública */}
                    <Route path="/login" element={<Login />} />

                    {/* Redirecionamento Padrão */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Rota Protegida (Módulo de Processo Seletivo) */}
                    <Route 
                        path="/vagas" 
                        element={
                            <RotaProtegida>
                                <ProcessoSeletivoGestaoVagas />
                            </RotaProtegida>
                        } 
                    />
                    
                    {/* Rota Protegida (Módulo Solicitação Equipamentos) */}
                    <Route
                     path="/equipamentos"
                      element={
                        <RotaProtegida>
                            <SolicitacaoEquipamentos />
                            </RotaProtegida>
                        } 
                    />
                        
                    {/* Rota para capturar URLs não encontradas (404) */}
                    <Route 
                        path="*" 
                        element={
                            <div className="flex items-center justify-center min-h-screen">
                                <h1 className="text-2xl font-bold text-gray-700">404 - Página não encontrada</h1>
                            </div>
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;