import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario')) || {};

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    // Função para destacar dinamicamente a aba selecionada
    const isActive = (path) => {
        return location.pathname === path 
            ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold" 
            : "text-gray-500 hover:text-blue-600 pb-1 font-medium transition-colors";
    };

    return (
        <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-6 border-b border-gray-200">
            <div className="flex items-center space-x-10">
                {/* Logotipo Fictício */}
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center text-white font-bold shadow-sm">
                        CP
                    </div>
                    <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Corporate Portal</h1>
                </div>
                
                {/* Links de Navegação */}
                <div className="hidden md:flex space-x-8 pt-2">
                    <Link to="/vagas" className={isActive('/vagas')}>
                        Módulo de Vagas
                    </Link>
                    <Link to="/equipamentos" className={isActive('/equipamentos')}>
                        Equipamentos
                    </Link>
                </div>
            </div>

            {/* Informações do Usuário e Logout */}
            <div className="flex items-center space-x-6">
                <div className="text-sm text-right hidden sm:block">
                    <p className="font-semibold text-gray-800">{usuarioLogado.nome || 'Usuário'}</p>
                    <p className="text-xs text-gray-500">{usuarioLogado.perfil || 'Colaborador'}</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800 font-semibold transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md"
                >
                    Sair
                </button>
            </div>
        </nav>
    );
};

export default Navbar;