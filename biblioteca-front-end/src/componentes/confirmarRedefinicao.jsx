import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from './Logo.png';
import './Login.css';
import AuthServico from '../servicos/AuthServico';
import { useParams } from 'react-router-dom';

const ConfirmarRedefinirSenha = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { token } = useParams();

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

                <label htmlFor="new-password">Nova Senha</label>
                <div className="password-field">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        id="new-password"
                        placeholder="Nova Senha"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (e.target.value.length >= 6 && e.target.value === confirmNewPassword) {
                                setError('');
                            } else if (e.target.value.length < 6) {
                                setError('A senha deve ter pelo menos 6 caracteres.');
                            }
                        }}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? '🙈' : '👁️'}
                    </span>
                </div>

                <label htmlFor="confirm-new-password">Confirmar Nova Senha</label>
                <div className="password-field">
                    <input
                        type={showConfirmNewPassword ? "text" : "password"}
                        id="confirm-new-password"
                        placeholder="Confirmar Nova Senha"
                        value={confirmNewPassword}
                        onChange={(e) => {
                            setConfirmNewPassword(e.target.value);
                            if (e.target.value === newPassword && newPassword.length >= 6) {
                                setError('');
                            }
                        }}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    >
                        {showConfirmNewPassword ? '🙈' : '👁️'}
                    </span>
                </div>

                <button type="submit">REDEFINIR</button>
            </form>
        </div>
    </div>
);
};

export default ConfirmarRedefinirSenha;
