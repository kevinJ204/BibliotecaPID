const API_BASE_URL = "http://localhost:3001";

class UsuarioServico {
    async obterUsuarios() {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar usuários");
            return [];
        }
        const dados = await response.json();
        return dados;
    }

    async obterUsuarioPorIdOuNome(termo) {
        const response = await fetch(`${API_BASE_URL}/usuarios/${termo}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar usuário");
            return null;
        }
        const dados = await response.json();
        return dados;
    }

    async adicionarUsuario(usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario),
        });
        if (!response.ok) {
            throw new Error("Erro ao adicionar usuário");
            return null;
        }
        const novoUsuario = await response.json();
        return novoUsuario;
    }

    async atualizarUsuario(id, usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario),
        });
        if (!response.ok) {
            throw new Error("Erro ao atualizar usuário");
            return null;
        }
        const usuarioAtualizado = await response.json();
        return usuarioAtualizado;
    }

    async deletarUsuario(id) {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao deletar usuário");
        }
    }
}

export default UsuarioServico;
