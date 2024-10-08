import Usuario from "../Modelo/Usuario.js";
import { assinar, verificarAssinatura } from "../Seguranca/funcoesJWT.js";

export default class AuthCtrl {
    static async login(requisicao, resposta) {
        resposta.type('application/json');
        const { email, senha } = requisicao.body;

        if (email && senha) {
            try {
                const usuario = await Usuario.autenticar(email, senha);
                requisicao.session.usuario = usuario;
                const token = assinar(usuario);

                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Login bem-sucedido",
                    "usuario": usuario[0].id,
                    "token": token
                });
            } catch (erro) {
                resposta.status(401).json({
                    "status": false,
                    "mensagem": "Usuário ou senha inválidos"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, forneça email e senha"
            });
        }
    }

    static async logout(requisicao, resposta) {
        requisicao.session.destroy((erro) => {
            if (erro) {
                console.error("Erro ao destruir a sessão:", erro);
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao fazer logout"
                });
            } else {
                resposta.clearCookie('sessionId');
                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Logout bem-sucedido"
                });
            }
        });
    }
}

export function verificarAutenticacao(req, resp, next) {
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        const tokenVerificado = verificarAssinatura(token);

        if (tokenVerificado && JSON.stringify(tokenVerificado.usuario) == JSON.stringify(req.session.usuario) /*JSON.stringify(tokenVerificado.usuario) === usuarioSessao*/) {
            next();
        } else {
            resp.status(403).json({
                status: false,
                mensagem: 'Acesso não autorizado! Token inválido ou usuário não corresponde!'
            });
        }
    } else {
        resp.status(401).json({
            status: false,
            mensagem: 'Acesso não autorizado! Faça o login na aplicação!'
        });
    }
}    