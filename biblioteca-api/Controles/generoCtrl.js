import Genero from "../Modelo/Genero.js";

export default class GeneroCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const genero = dados.genero;

            if (genero) {
                const gen = new Genero(0, genero);
                try {
                    await gen.gravar();
                    resposta.status(201).json({
                        "status": true,
                        "mensagem": "Gênero gravado com sucesso!",
                        "id_genero": gen.id
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar o Gênero! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Gênero, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar um Gênero!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');

        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const id = requisicao.params.id;
            const genero = dados.genero;

            if (id && id > 0 && genero) {
                const gen = new Genero(id, genero);
                try {
                    await gen.atualizar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Gênero atualizado com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o Gênero! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Gênero, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH, PUT e dados no formato JSON para atualizar um Gênero!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "DELETE") {
            const id = requisicao.params.id;

            if (id && id > 0) {
                const genero = new Genero(id);
                try {
                    await genero.excluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Gênero excluído com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o Gênero! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o id do Gênero que deseja excluir, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir um Gênero!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "GET") {
            const termoDeQuery = requisicao.params.termo;
            const genero = new Genero(0);
            
            try {
                const generos = await genero.consultar(termoDeQuery);
                resposta.status(200).json(generos);
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível consultar os Gêneros! " + erro.message
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar os Gêneros!"
            });
        }
    }

}
