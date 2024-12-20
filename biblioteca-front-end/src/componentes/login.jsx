import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from './Logo.png';
import './Login.css';
import AuthServico from '../servicos/AuthServico';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email.length <= 3 || password.length <= 3) {
            setError('O usuário e a senha devem ter mais de 3 caracteres.');
            return;
        }

        const authServico = new AuthServico();

        try {
            const result = await authServico.login(email, password);
            if (result && result.status) {
                navigate('/home');
            } else {
                setError(result ? result.mensagem : 'Erro ao fazer login. Tente novamente mais tarde.');
            }
        } catch (error) {
            setError('Erro ao fazer login. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="logo-container">
                    <img src={logoImage} alt="Logo" className="logo" />
                </div>
                <form onSubmit={handleLogin} className="login-form">
                    {error && <p className="error">{error}</p>}

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Senha</label>
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>

                    <div>
                        <Link to="/redefinirsenha" className="redefinir-senha-link">
                            Esqueci minha senha
                        </Link>
                    </div>

                    <button type="submit">LOGIN</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
