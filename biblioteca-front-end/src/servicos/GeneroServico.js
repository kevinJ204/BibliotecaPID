import TokenServico from './TokenServico';

const API_BASE_URL = "http://localhost:3001";

class GeneroServico {
    async obterGeneros() {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/generos`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar gêneros: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter gêneros:", error);
            return [];
        }
    }

    async obterGeneroPorIdOuNome(termo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/generos/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar gênero: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter gênero por ID ou Nome:", error);
            return null;
        }
    }

    async adicionarGenero(genero) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/generos`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(genero),
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar gênero: ${response.statusText}`);
            }
            const novoGenero = await response.json();
            return novoGenero;
        } catch (error) {
            console.error("Erro ao adicionar gênero:", error);
            return null;
        }
    }

    async atualizarGenero(id, genero) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/generos/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(genero),
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar gênero: ${response.statusText}`);
            }
            const generoAtualizado = await response.json();
            return generoAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar gênero:", error);
            return null;
        }
    }

    async deletarGenero(id) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/generos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar gênero: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao deletar gênero:", error);
        }
    }
}

export default GeneroServico;
