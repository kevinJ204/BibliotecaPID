import TokenServico from './TokenServico';

const API_BASE_URL = "http://localhost:3001";

class AuthServico {
    async login(email, senha) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao fazer login: ${response.statusText}`);
            }

            const dados = await response.json();

            if (dados.status && dados.token) {
                TokenServico.armazenarToken(dados.token);
            }

            return dados;
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            return null;
        }
    }

    async logout() {
        try {
            TokenServico.removerToken();

            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao fazer logout: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            return false;
        }
    }
}

export default AuthServico;
