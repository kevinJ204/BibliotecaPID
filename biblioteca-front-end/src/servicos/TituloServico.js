import TokenServico from './TokenServico';

const API_BASE_URL = "https://localhost:3001";

class TituloServico {
    async obterTitulos() {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/titulos`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.mensagem || `Erro ao buscar títulos: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter títulos:", error);
            const dados = { message: error.message }; 
            return dados; 
        }
    }

    async obterTituloPorIdOuNome(termo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/titulos/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.mensagem || `Erro ao buscar título: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter título por ID ou Nome:", error);
            return error; 
        }
    }

    async adicionarTitulo(titulo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/titulos`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(titulo),
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.mensagem || `Erro ao adicionar título: ${response.statusText}`);
            }
            const novoTitulo = await response.json();
            return novoTitulo;
        } catch (error) {
            console.error("Erro ao adicionar título:", error);
            return error; 
        }
    }

    async atualizarTitulo(id, titulo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/titulos/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(titulo),
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.mensagem || `Erro ao atualizar título: ${response.statusText}`);
            }
            const tituloAtualizado = await response.json();
            return tituloAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar título:", error);
            return error; 
        }
    }

    async deletarTitulo(id) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/titulos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.mensagem || `Erro ao deletar título: ${response.statusText}`);
            }
            const tituloDeletado = await response.json(); 
            return tituloDeletado; 
        } catch (error) {
            console.error("Erro ao deletar título:", error);
            return error; 
        }
    }
}

export default TituloServico;
