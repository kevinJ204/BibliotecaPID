import Titulo from "../Modelo/Titulo.js";
import Genero from "../Modelo/Genero.js";
import Autor from "../Modelo/Autor.js";

export default class TituloCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const genero = new Genero(dados.genero.id, dados.genero.genero);
            const assunto = dados.assunto;
            const autores = dados.autores;

            if (nome && genero.getId() && genero.getGenero() && assunto && autores && autores.length > 0) {
                const titulo = new Titulo(0, nome, genero, assunto);

                for (const autorData of autores) {
                    const autor = new Autor(autorData.id, autorData.nome);
                    titulo.adicionarAutor(autor);
                }

                await titulo.gravar().then(() => {
                    resposta.status(201);
                    resposta.json({
                        "status": true,
                        "mensagem": "Titulo gravado com sucesso!",
                        "id_titulo": titulo.getId()
                    });
                }).catch((erro) => {
                    resposta.status(500);
                    resposta.json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar o Titulo! " + erro.message
                    });
                });
            } else {
                resposta.status(400);
                resposta.json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Titulo, incluindo autores, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405);
            resposta.json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar um Titulo!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const id = requisicao.params.id;
            const nome = dados.nome;
            const genero = new Genero(dados.genero.id, dados.genero.genero);
            const assunto = dados.assunto;
            const autores = dados.autores;

            if (id && id > 0 && nome && genero.getId() && genero.getGenero() && assunto && autores && autores.length > 0) {
                const titulo = new Titulo(id, nome, genero, assunto);

                titulo.setAutores([]);
                for (const autorData of autores) {
                    const autor = new Autor(autorData.id, autorData.nome);
                    titulo.adicionarAutor(autor);
                }

                await titulo.atualizar()
                    .then(() => {
                        resposta.status(200);
                        resposta.json({
                            "status": true,
                            "mensagem": "Titulo atualizado com sucesso!",
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500);
                        resposta.json({
                            "status": false,
                            "mensagem": "Não foi possível atualizar o Titulo! " + erro.message
                        });
                    });
            } else {
                resposta.status(400);
                resposta.json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Titulo, incluindo autores, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405);
            resposta.json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH, PUT e dados no formato JSON para atualizar um Titulo!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "DELETE") {
            const id = requisicao.params.id;
            if (id && id > 0) {
                const titulo = new Titulo(id);
                await titulo.excluir()
                    .then(() => {
                        resposta.status(200);
                        resposta.json({
                            "status": true,
                            "mensagem": "Titulo excluído com sucesso!",
                        });
                    })
                    .catch((erro) => {
                        resposta.status(500);
                        resposta.json({
                            "status": false,
                            "mensagem": "Não foi possível excluir o Titulo! " + erro.message
                        });
                    });
            } else {
                resposta.status(400);
                resposta.json({
                    "status": false,
                    "mensagem": "Por favor, informe o id do Titulo que deseja excluir, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405);
            resposta.json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir um Titulo!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === "GET") {
            const termoDeQuery = requisicao.params.termo;
            const titulo = new Titulo();
            await titulo.consultar(termoDeQuery)
                .then((titulos) => {
                    resposta.status(200);
                    resposta.json(titulos.map(t => ({
                        id: t.getId(),
                        nome: t.getNome(),
                        genero: t.getGenero(),
                        assunto: t.getAssunto(),
                        autores: t.getAutores().map(a => ({
                            id: a.getId(),
                            nome: a.getNome()
                        }))
                    })));
                })
                .catch((erro) => {
                    resposta.status(500);
                    resposta.json({
                        "status": false,
                        "mensagem": "Não foi possível consultar os Titulos! " + erro.message
                    });
                });
        } else {
            resposta.status(405);
            resposta.json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar os Titulos!"
            });
        }
    }
}
