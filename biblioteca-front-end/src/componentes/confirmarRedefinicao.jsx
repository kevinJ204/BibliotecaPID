import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from './Logo.png';
import './Login.css';
import AuthServico from '../servicos/AuthServico';
import { useParams } from 'react-router-dom';
const ConfirmarRedefinirSenha = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { token } = useParams();

    console.log("Token:", token);

    const handleRedefinirSenha = async (e) => {
        e.preventDefault();
        try {
            console.log('Enviando dados para o servidor:', { token, newPassword });

            const authServico = new AuthServico();
            console.log('mandei pro back redefinicao de senha',token)
            const result = await authServico.handlePassword(token,confirmNewPassword);
            if (result && result.status) {
                navigate('/home');
            } else {
                setError(result ? result.mensagem : 'Erro ao fazer login. Tente novamente mais tarde.');
            }
            setSuccess('Senha redefinida com sucesso!');
            setError('');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setError('Erro ao redefinir a senha. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="logo-container">
                    <img src={logoImage} alt="Logo" className="logo" />
                </div>
                <form onSubmit={handleRedefinirSenha} className="login-form">
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                   {/*  <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /> */}
                    <label htmlFor="new-password">Nova Senha</label>
                    <input
                        type="password"
                        id="new-password"
                        placeholder="Nova Senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirm-new-password">Confirmar Nova Senha</label>
                    <input
                        type="password"
                        id="confirm-new-password"
                        placeholder="Confirmar Nova Senha"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit">REDEFINIR</button>
                </form>
            </div>
        </div>
    );
};

export default ConfirmarRedefinirSenha;