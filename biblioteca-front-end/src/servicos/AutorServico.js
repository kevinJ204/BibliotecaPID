import TokenServico from './TokenServico';

const API_BASE_URL = "https://localhost:3001";

class AutorServico {
    async obterAutores() {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/autores`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar autores: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter autores:", error);
            const dados = { message: error.message };
            return dados; // Retornando dados com a mensagem de erro
        }
    }

    async obterAutorPorIdOuNome(termo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/autores/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar autor: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter autor por ID ou Nome:", error);
            return error; // Retornando apenas o objeto error
        }
    }

    async adicionarAutores(autor) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/autores`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(autor),
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar autor: ${response.statusText}`);
            }
            const novoAutor = await response.json();
            return novoAutor;
        } catch (error) {
            console.error("Erro ao adicionar autor:", error);
            return error; // Retornando apenas o objeto error
        }
    }

    async atualizarAutor(id, autor) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/autores/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(autor),
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar autor: ${response.statusText}`);
            }
            const autorAtualizado = await response.json();
            return autorAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar autor:", error);
            return error; // Retornando apenas o objeto error
        }
    }

    async deletarAutor(id) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/autores/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar autor: ${response.statusText}`);
            }
            const autorDeletado = await response.json();
            return autorDeletado;
        } catch (error) {
            console.error("Erro ao deletar autor:", error);
            return error; // Retornando apenas o objeto error
        }
    }
}

export default AutorServico;
