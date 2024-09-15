import TokenServico from './TokenServico';

const API_BASE_URL = "https://localhost:3001";

class EmprestimoServico {
    async obterEmprestimos() {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/emprestimos`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar empréstimos: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter empréstimos:", error);
            return [];
        }
    }

    async obterEmprestimoPorIdOuNome(termo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/emprestimos/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar empréstimo: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter empréstimo por ID ou Nome:", error);
            return null;
        }
    }

    async adicionarEmprestimo(emprestimo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/emprestimos`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(emprestimo),
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar empréstimo: ${response.statusText}`);
            }
            const novoEmprestimo = await response.json();
            return novoEmprestimo;
        } catch (error) {
            console.error("Erro ao adicionar empréstimo:", error);
            return null;
        }
    }

    async atualizarEmprestimo(id, emprestimo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/emprestimos/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(emprestimo),
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar empréstimo: ${response.statusText}`);
            }
            const emprestimoAtualizado = await response.json();
            return emprestimoAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar empréstimo:", error);
            return null;
        }
    }

    async deletarEmprestimo(id) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/emprestimos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar empréstimo: ${response.statusText}`);
            }
            const emprestimoDeletado = await response.json();
            return emprestimoDeletado;
        } catch (error) {
            console.error("Erro ao deletar empréstimo:", error);
        }
    }
}

export default EmprestimoServico;
