import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email.length <= 3 || password.length <= 3) {
            setError('O usuário e a senha devem ter mais de 3 caracteres.');
            return;
        }
        navigate('/home');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="logo"></div>
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
                    <input
                        type="password"
                        id="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">LOGIN</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
