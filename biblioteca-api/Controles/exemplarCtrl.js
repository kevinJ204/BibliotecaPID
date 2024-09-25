import Exemplar from "../Modelo/Exemplar.js";
import Genero from "../Modelo/Genero.js";
import Titulo from "../Modelo/Titulo.js";

export default class ExemplarCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const titulo = new Titulo(dados.titulo.id, dados.titulo.nome, new Genero(dados.titulo.genero.id, 
                dados.titulo.genero.genero),dados.titulo.assunto, dados.titulo.autores);
            const status = "Disponível";

            if (codigo && titulo.getId() && titulo.getNome() && titulo.getGenero().getId() && 
            titulo.getGenero().getGenero() && titulo.getAssunto() && titulo.getAutores().length > 0 
            && status) {
                const exemplar = new Exemplar(0, codigo, titulo, status);
                try {
                    await exemplar.gravar();
                    resposta.status(201).json({
                        "status": true,
                        "mensagem": "Exemplar gravado com sucesso!",
                        "id_exemplar": exemplar.id
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar o Exemplar! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Exemplar, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar um Exemplar!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');

        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const id = dados.id;
            const codigo = dados.codigo;
            const titulo = new Titulo(dados.titulo.id, dados.titulo.nome, new Genero(dados.titulo.genero.id, 
                dados.titulo.genero.genero),dados.titulo.assunto, dados.titulo.autores);
            const status = dados.status;

            if (id && codigo && titulo.getId() && titulo.getNome() && titulo.getGenero().getId() && 
            titulo.getGenero().getGenero() && titulo.getAssunto() && titulo.getAutores().length > 0 
            && status) {
                const exemplar = new Exemplar(id, codigo, titulo, status);
                try {
                    await exemplar.atualizar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Exemplar atualizado com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o Exemplar! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do Exemplar, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH, PUT e dados no formato JSON para atualizar um Exemplar!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "DELETE") {
            const id = requisicao.params.id;

            if (id && id > 0) {
                const exemplar = new Exemplar(id);
                try {
                    await exemplar.excluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Exemplar excluído com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o Exemplar! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o id do Exemplar que deseja excluir, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir um Exemplar!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "GET") {
            const termoDeQuery = requisicao.params.termo;
            const exemplar = new Exemplar(0);
            
            try {
                const exemplares = await exemplar.consultar(termoDeQuery);
                resposta.status(200).json(exemplares);
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível consultar os Exemplares! " + erro.message
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar os Exemplares!"
            });
        }
    }

}
