import TokenServico from './TokenServico';

const API_BASE_URL = "https://localhost:3001";

class AuthServico {
    async login(email, senha) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
                credentials: 'include'
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
                credentials: 'include'
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

    async resetPassword(email) {
        console.log('controller',email)
        try {
            TokenServico.removerToken();
            
            const response = await fetch(`${API_BASE_URL}/auth/resetPassword`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email }),
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

    async handlePassword(token,password) {
        console.log('controller',token, password)
        try {
            TokenServico.removerToken();
            
            const response = await fetch(`${API_BASE_URL}/auth/handlePassword`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ token, password }),
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
    
    

    async obterUsuarioLogado() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/usuario-logado`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TokenServico.recuperarToken()}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            if (!response.ok) {
                throw new Error('Erro ao obter usuário logado');
            }
    
            const dados = await response.json();
            return { nome: dados.nome, email: dados.email };
        } catch (error) {
            console.error('Erro ao obter usuário logado:', error);
            return null;
        }
    }
    
}

export default AuthServico;
