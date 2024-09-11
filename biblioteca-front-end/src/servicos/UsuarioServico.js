import TokenServico from './TokenServico';

const API_BASE_URL = "http://localhost:3001";

class UsuarioServico {
    async obterUsuarios() {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar usuários: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter usuários:", error);
            return [];
        }
    }

    async obterUsuarioPorIdOuNome(termo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/usuarios/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter usuário por ID ou Nome:", error);
            return null;
        }
    }

    async adicionarUsuario(usuario) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(usuario),
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar usuário: ${response.statusText}`);
            }
            const novoUsuario = await response.json();
            return novoUsuario;
        } catch (error) {
            console.error("Erro ao adicionar usuário:", error);
            return null;
        }
    }

    async atualizarUsuario(id, usuario) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(usuario),
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar usuário: ${response.statusText}`);
            }
            const usuarioAtualizado = await response.json();
            return usuarioAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            return null;
        }
    }

    async deletarUsuario(id) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar usuário: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
        }
    }
}

export default UsuarioServico;
