import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from './Logo.png';
import './Home.css';
import AuthServico from '../servicos/AuthServico';

const Home = () => {
    const userEmail = "usuario@exemplo.com";
    const navigate = useNavigate();

    const handleLogout = async () => {
        const authServico = new AuthServico();
        const success = await authServico.logout();
        if (success) {
            navigate('/');
        } else {
            console.error('Erro ao fazer logout');
        }
    };

    return (
        <div className="home-page">
            <div className="menu-background">
                <div className="logo-container">
                    <img src={logoImage} alt="Logo" className="logo" />
                </div>
                <div className="menu-options">
                    <div>
                        <Link to="/GerenciarUsuarios" className="menu-option">Gerenciar Usuários</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarAlunos" className="menu-option">Gerenciar Alunos</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarTitulos" className="menu-option">Gerenciar Títulos</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarGeneros" className="menu-option">Gerenciar Gêneros</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarAutores" className="menu-option">Gerenciar Autores</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarExemplares" className="menu-option">Gerenciar Exemplares</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarEmprestimos" className="menu-option">Gerenciar Empréstimos</Link>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    SAIR
                </button>
            </div>
            <div className="content-background">
                <div className="content-container">
                    <div className="welcome-message">
                        Bem-vindo, {userEmail}
                    </div>
                    <div className="info-message">
                        Este é o seu painel de gerenciamento, fique à vontade para consultar, adicionar, excluir e confirmar dados.
                    </div>
                </div>
                <div className="custom-rectangle">
                    <div className="rectangle-content">
                        <div className="rectangle-title">Bem-vindo, usuário.</div>
                        <div className="rectangle-subtitle">Use a nossa nova função, cadastrar livros.</div>
                        <Link to="/GerenciarTitulos" className="rectangle-button">CADASTRAR</Link>
                    </div>
                </div>

                <div className="second-rectangle">
                    <div className="rectangle-content">
                        <div className="second-rectangle-title">Faça o Gerenciamento da Sua Biblioteca</div>
                        <div className="square-container">
                            <Link to="/GerenciarUsuarios" className="square">
                                <div className="square-background"></div>
                                <div className="square-label">GERENCIAR USUÁRIOS</div>
                            </Link>
                            <Link to="/GerenciarAlunos" className="square">
                                <div className="square-background"></div>
                                <div className="square-label">GERENCIAR ALUNOS</div>
                            </Link>
                            <Link to="/GerenciarTitulos" className="square">
                                <div className="square-background"></div>
                                <div className="square-label">GERENCIAR TÍTULOS</div>
                            </Link>
                            <Link to="/GerenciarGeneros" className="square">
                                <div className="square-background"></div>
                                <div className="square-label">GERENCIAR Gêneros</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
