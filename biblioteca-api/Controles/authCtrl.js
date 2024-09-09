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
                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Login bem-sucedido",
                    "usuario": usuario,
                    "token": assinar(JSON.stringify(usuario))
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
        requisicao.session.destroy();
    }
    
}
export function verificarAutenticacao(req, resp, next) {
    const token = req.headers['authorization'];
    let tokenVerificado = undefined;
    if (token) {
        tokenVerificado = verificarAssinatura(token);
        console.log(req.session.usuario);
        if (tokenVerificado != undefined && tokenVerificado.usuario == req.session.usuario){
            next();
        }
    }
    else{
        resp.status(401).json({
            status: false,
            mensagem: 'Acesso não autorizado! Faça o login na aplicação!'
        })
    }
}
