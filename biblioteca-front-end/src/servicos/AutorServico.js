const API_BASE_URL = "http://localhost:3001";

class AutorServico {
    async obterAutores() {
        try {
            const response = await fetch(`${API_BASE_URL}/autores`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar autores: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter autores:", error);
            return [];
        }
    }

    async obterAutorPorIdOuNome(termo) {
        try {
            const response = await fetch(`${API_BASE_URL}/autores/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar autores: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter autores por ID ou Nome:", error);
            return null;
        }
    }

    async adicionarAutores(autor) {
        try {
            const response = await fetch(`${API_BASE_URL}/autores`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(autor),
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar autor: ${response.statusText}`);
            }
            const novoAutor = await response.json();
            return novoAutor;
        } catch (error) {
            console.error("Erro ao adicionar autor:", error);
            return null;
        }
    }

    async atualizarAutor(id, autor) {
        try {
            const response = await fetch(`${API_BASE_URL}/autores/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(autor),
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar autor: ${response.statusText}`);
            }
            const autorAtualizado = await response.json();
            return autorAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar autor:", error);
            return null;
        }
    }

    async deletarAutor(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/autores/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar autor: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao deletar autor:", error);
        }
    }
}

export default AutorServico;
