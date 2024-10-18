import TokenServico from './TokenServico';

const API_BASE_URL = "https://localhost:3001";

class ExemplarServico {
    async obterExemplares() {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/exemplares`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar exemplares: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter exemplares:", error);
            const dados = { message: error.message }; // Criando a constante dados com a mensagem de erro
            return dados; // Retornando dados com a mensagem de erro
        }
    }

    async obterExemplarPorIdOuNome(termo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/exemplares/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar exemplar: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter exemplar por ID ou Nome:", error);
            return error; // Retornando apenas o objeto error
        }
    }

    async adicionarExemplar(exemplar) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/exemplares`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(exemplar),
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar exemplar: ${response.statusText}`);
            }
            const novoExemplar = await response.json();
            return novoExemplar;
        } catch (error) {
            console.error("Erro ao adicionar exemplar:", error);
            return error; // Retornando apenas o objeto error
        }
    }

    async atualizarExemplar(id, exemplar) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/exemplares/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(exemplar),
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar exemplar: ${response.statusText}`);
            }
            const exemplarAtualizado = await response.json();
            return exemplarAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar exemplar:", error);
            return error; // Retornando apenas o objeto error
        }
    }

    async deletarExemplar(id) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/exemplares/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar exemplar: ${response.statusText}`);
            }
            const exemplarDeletado = await response.json();
            return exemplarDeletado; // Retornando o resultado da operação
        } catch (error) {
            console.error("Erro ao deletar exemplar:", error);
            return error; // Retornando apenas o objeto error
        }
    }
}

export default ExemplarServico;
