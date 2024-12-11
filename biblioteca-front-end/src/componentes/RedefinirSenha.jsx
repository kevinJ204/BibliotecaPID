import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from './Logo.png';
import './Login.css';
import AuthServico from '../servicos/AuthServico';

const RedefinirSenha = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRedefinirSenha = async (e) => {
        e.preventDefault();

        try {
            const authServico = new AuthServico();
            
            const result = await authServico.verificarEmail(email);
            
            if (!result || !result.status) {
                setError('E-mail não registrado. Por favor, verifique e tente novamente.');
                return;
            }

            const resetResult = await authServico.resetPassword(email);

            if (resetResult && resetResult.status) {
                setSuccess('E-mail de redefinição de senha enviado com sucesso!');
                setError('');
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError(resetResult ? resetResult.mensagem : 'Erro ao enviar e-mail. Tente novamente mais tarde.');
            }
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
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">ENVIAR CÓDIGO</button>
                </form>
            </div>
        </div>
    );
};

export default RedefinirSenha;
