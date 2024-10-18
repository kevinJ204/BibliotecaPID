import TokenServico from './TokenServico';

const API_BASE_URL = "https://localhost:3001";

class GeneroServico {
    async obterGeneros() {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/generos`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar gêneros: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter gêneros:", error);
            const dados = { message: error.message }; // Criando a constante dados com a mensagem de erro
            return dados; // Retornando dados com a mensagem de erro
        }
    }

    async obterGeneroPorIdOuNome(termo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/generos/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar gênero: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter gênero por ID ou Nome:", error);
            return error; // Retornando apenas o objeto error
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
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(genero),
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar gênero: ${response.statusText}`);
            }
            const novoGenero = await response.json();
            return novoGenero;
        } catch (error) {
            console.error("Erro ao adicionar gênero:", error);
            return error; // Retornando apenas o objeto error
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
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(genero),
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar gênero: ${response.statusText}`);
            }
            const generoAtualizado = await response.json();
            return generoAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar gênero:", error);
            return error; // Retornando apenas o objeto error
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
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar gênero: ${response.statusText}`);
            }
            const generoDeletado = await response.json(); // Capturando o resultado da operação
            return generoDeletado; // Retornando o resultado
        } catch (error) {
            console.error("Erro ao deletar gênero:", error);
            return error; // Retornando apenas o objeto error
        }
    }
}

export default GeneroServico;
