import Usuario from "../Modelo/Usuario.js";

export default class UsuarioCtrl {

    async gravar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "POST" && requisicao.is('application/json')) {
            const { nome, email, senha, nivel } = requisicao.body;

            if (nome && email && senha && nivel) {
                const usuario = new Usuario(0, nome, email, senha, nivel);
                try {
                    const consulta = await usuario.consultar(email);
                    if (consulta.length > 0) {
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": "Email em uso por parte de outro usuário previamente cadastrado!"
                        });
                    } else {
                        await usuario.gravar();
                        resposta.status(201).json({
                            "status": true,
                            "mensagem": "Usuário gravado com sucesso!",
                            "id_usuario": usuario.id
                        });
                    }
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível armazenar o usuário! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do usuário, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar um usuário!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');

        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')) {
            const { nome, email, senha, nivel } = requisicao.body;
            const { id } = requisicao.params;

            if (id && id > 0 && nome && email && senha && nivel) {
                const usuario = new Usuario(id, nome, email, senha, nivel);
                try {
                    await usuario.atualizar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Usuário atualizado com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível atualizar o usuário! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do usuário, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método PATCH ou PUT e dados no formato JSON para atualizar um usuário!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "DELETE") {
            const { id } = requisicao.params;

            if (id && id > 0) {
                const usuario = new Usuario(id);
                try {
                    await usuario.excluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Usuário excluído com sucesso!",
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o usuário! " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o ID do usuário que deseja excluir, conforme documentação da API"
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir um usuário!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === "GET") {
            const { termo } = requisicao.params;
            const usuario = new Usuario(0);

            try {
                const usuarios = await usuario.consultar(termo);
                resposta.status(200).json(usuarios);
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Não foi possível consultar os usuários! " + erro.message
                });
            }
        } else {
            resposta.status(405).json({
                "status": false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar os usuários!"
            });
        }
    }
}
