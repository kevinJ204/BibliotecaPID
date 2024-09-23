import Aluno from "../Modelo/Aluno.js";
import Emprestimo from "../Modelo/Emprestimo.js";
import Exemplar from "../Modelo/Exemplar.js";

export default class EmprestimoCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const exemplares = dados.exemplares.map(exemplar => new Exemplar(exemplar.id, 
                exemplar.codigo, exemplar.titulo, exemplar.status));
            const aluno = new Aluno(dados.aluno.id, dados.aluno.nome, dados.aluno.email, 
                dados.aluno.ra, dados.aluno.telefone);
            const dataEmprestimo = dados.dataEmprestimo;
            const dataPrazo = dados.dataPrazo;
            const status = dados.status;

            if (exemplares.length > 0 && aluno.getId() && aluno.getNome() && aluno.getEmail() && 
            aluno.getRa() && aluno.getTelefone() && dataEmprestimo && dataPrazo && status) {
                const emprestimo = new Emprestimo(0, exemplares, aluno, dataEmprestimo, dataPrazo, status);

                await emprestimo.gravar().then(() => {
                    resposta.status(201);
                    resposta.json({
                        "status": true,
                        "mensagem": "Emprestimo gravado com sucesso!",
                        "id": emprestimo.getId()
                    });
                }).catch((erro) => {
                    resposta.status(500);
                    resposta.json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar o Emprestimo! " + erro.message
                    });
                });
            } else {
                resposta.status(400);
                resposta.json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Emprestimo, incluindo exemplares e aluno, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405);
            resposta.json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar um Emprestimo!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const emprestimosAtualizados = [];
    
            for (const dado of dados) {
                const exemplares = dado.exemplares.map(exemplar => new Exemplar(exemplar.id, 
                    exemplar.codigo, exemplar.titulo, exemplar.status));
                const aluno = new Aluno(dado.aluno.id, dado.aluno.nome, dado.aluno.email, 
                    dado.aluno.ra, dado.aluno.telefone);
                const dataEmprestimo = dado.dataEmprestimo;
                const dataPrazo = dado.dataPrazo;
                const status = dado.status;
        
                if (exemplares.length > 0 && aluno.getId() && aluno.getNome() && aluno.getEmail() && 
                aluno.getRa() && aluno.getTelefone() && dataEmprestimo && dataPrazo && status) {
                    const emprestimo = new Emprestimo(0, exemplares, aluno, dataEmprestimo, dataPrazo, status);
        
                    try {
                        await emprestimo.atualizar();
                        emprestimosAtualizados.push(emprestimo);
                    } catch (erro) {
                        resposta.status(500);
                        return resposta.json({
                            "status": false,
                            "mensagem": "Não foi possível atualizar o Emprestimo! " + erro.message
                        });
                    }
                } else {
                    resposta.status(400);
                    return resposta.json({
                        "status": false,
                        "mensagem": "Por favor, informe todos os dados do Emprestimo, incluindo exemplares e aluno, conforme documentação da API"
                    });
                }
            }
    
            resposta.status(200);
            return resposta.json({
                "status": true,
                "mensagem": "Todos os emprestimos foram atualizados com sucesso!",
                "emprestimosAtualizados": emprestimosAtualizados.map(t => t.toJSON())
            });
        } else {
            resposta.status(405);
            resposta.json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH, PUT e dados no formato JSON para atualizar um Emprestimo!"
            });
        }
    }
    
    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "DELETE") {
            const id = requisicao.params.id;
            if (id && id > 0) {
                const emprestimo = new Emprestimo(id);
                await emprestimo.excluir()
                    .then(() => {
                        resposta.status(200);
                        resposta.json({
                            "status": true,
                            "mensagem": "Emprestimo excluído com sucesso!",
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500);
                        resposta.json({
                            "status": false,
                            "mensagem": "Não foi possível excluir o Emprestimo! " + erro.message
                        });
                    });
            } else {
                resposta.status(400);
                resposta.json({
                    "status": false,
                    "mensagem": "Por favor, informe o id do Emprestimo que deseja excluir, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405);
            resposta.json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir um Emprestimo!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "GET") {
            let termoDeQuery = requisicao.params.termo;
    
            if (termoDeQuery === undefined || termoDeQuery.trim() === "") {
                termoDeQuery = "";
            }
    
            const emprestimo = new Emprestimo();
            try {
                const emprestimos = await emprestimo.consultar(termoDeQuery)
                resposta.status(200).json(emprestimos);
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível consultar os Emprestimos! " + erro.message
                });
            }
        } else {
            resposta.status(405);
            resposta.json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar os Emprestimos!"
            });
        }
    }
}
