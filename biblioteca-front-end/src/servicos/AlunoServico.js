import TokenServico from './TokenServico';

const API_BASE_URL = "http://localhost:3001";

class AlunoServico {
    async obterAlunos() {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/alunos`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar alunos: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter alunos:", error);
            return [];
        }
    }

    async obterAlunoPorIdOuNome(termo) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/alunos/${termo}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar aluno: ${response.statusText}`);
            }
            const dados = await response.json();
            return dados;
        } catch (error) {
            console.error("Erro ao obter aluno por ID ou Nome:", error);
            return null;
        }
    }

    async adicionarAluno(aluno) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/alunos`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(aluno)
            });
            if (!response.ok) {
                throw new Error(`Erro ao adicionar aluno: ${response.statusText}`);
            }
            const novoAluno = await response.json();
            return novoAluno;
        } catch (error) {
            console.error("Erro ao adicionar aluno:", error);
            return null;
        }
    }

    async atualizarAluno(id, aluno) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/alunos/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(aluno)
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar aluno: ${response.statusText}`);
            }
            const alunoAtualizado = await response.json();
            return alunoAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            return null;
        }
    }

    async deletarAluno(id) {
        try {
            const token = TokenServico.recuperarToken();
            const response = await fetch(`${API_BASE_URL}/alunos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Erro ao deletar aluno: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao deletar aluno:", error);
        }
    }
}

export default AlunoServico;
