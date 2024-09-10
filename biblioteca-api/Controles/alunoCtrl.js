import Aluno from "../Modelo/Aluno.js";

export default class AlunoCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { nome, email, ra, telefone } = dados;

            if (nome && email && ra && telefone) {
                const aluno = new Aluno(0, nome, email, ra, telefone);
                try {
                    await aluno.gravar();
                    resposta.status(201).json({
                        "status": true,
                        "mensagem": "Aluno gravado com sucesso!",
                        "id_aluno": aluno.id
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar o Aluno! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Aluno, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar um Aluno!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');

        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const id = requisicao.params.id;
            const { nome, email, ra, telefone } = dados;

            if (id && id > 0 && nome && email && ra && telefone) {
                const aluno = new Aluno(id, nome, email, ra, telefone);
                try {
                    await aluno.atualizar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Aluno atualizado com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o Aluno! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Aluno, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH, PUT e dados no formato JSON para atualizar um Aluno!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "DELETE") {
            const id = requisicao.params.id;

            if (id && id > 0) {
                const aluno = new Aluno(id);
                try {
                    await aluno.excluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Aluno excluído com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o Aluno! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o id do Aluno que deseja excluir, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir um Aluno!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "GET") {
            const termoDeQuery = requisicao.params.termo;
            const aluno = new Aluno(0);
            
            try {
                const alunos = await aluno.consultar(termoDeQuery);
                resposta.status(200).json(alunos);
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível consultar os Alunos! " + erro.message
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar os Alunos!"
            });
        }
    }

}
