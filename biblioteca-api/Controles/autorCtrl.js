import Autor from "../Modelo/Autor.js";

export default class AutorCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;

            if (nome) {
                const autor = new Autor(0, nome);
                try {
                    await autor.gravar();
                    resposta.status(201).json({
                        "status": true,
                        "mensagem": "Autor gravado com sucesso!",
                        "id_autor": autor.id
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar o Autor! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Autor, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar um Autor!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');

        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const id = requisicao.params.id;
            const nome = dados.nome;

            if (id && id > 0 && nome) {
                const autor = new Autor(id, nome);
                try {
                    await autor.atualizar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Autor atualizado com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o Autor! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Autor, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH, PUT e dados no formato JSON para atualizar um Autor!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "DELETE") {
            const id = requisicao.params.id;

            if (id && id > 0) {
                const autor = new Autor(id);
                try {
                    await autor.excluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Autor excluído com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o Autor! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o id do Autor que deseja excluir, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir um Autor!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "GET") {
            const termoDeQuery = requisicao.params.termo;
            const autor = new Autor(0);

            try {
                const autores = await autor.consultar(termoDeQuery);
                resposta.status(200).json(autores);
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível consultar os Autores! " + erro.message
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar os Autores!"
            });
        }
    }

}
