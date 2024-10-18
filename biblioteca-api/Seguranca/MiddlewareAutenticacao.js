import { verificarAssinatura } from "./funcoesJWT.js";

export default class MiddlewareAutenticacao {
    static verificarAutenticacao(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: false,
                mensagem: 'Acesso não autorizado! Faça o login na aplicação!'
            });
        }

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            const tokenVerificado = verificarAssinatura(token);
            if (!tokenVerificado) {
                return res.status(403).json({
                    status: false,
                    mensagem: 'Token inválido!'
                });
            }

            if (tokenVerificado && JSON.stringify(tokenVerificado.usuario) === JSON.stringify(req.session.usuario)) {
                req.usuario = tokenVerificado.usuario;
                return next();
            } else {
                res.status(403).json({
                    status: false,
                    mensagem: 'Acesso não autorizado! Token inválido ou usuário não corresponde!'
                });
            }
        } else {
            res.status(401).json({
                status: false,
                mensagem: 'Acesso não autorizado! Faça o login na aplicação!'
            });
        }
    }

    static verificarNivelAcesso(requerido) {
        return (req, res, next) => {
            const usuario = req.session.usuario;
            const nivel = usuario[0].nivel;

            if (nivel === 'Avançado') {
                return next();
            }

            if (nivel === 'Intermediário') {
                if (req.method === 'GET' && requerido === 'usuario') {
                    return next();
                } else if (requerido !== 'usuario') {
                    return next();
                }
            }

            if (nivel === 'Básico' && req.method === 'GET') {
                return next();
            }

            res.status(403).json({
                status: false,
                mensagem: 'Acesso negado! Seu nível de acesso não permite realizar esta operação.'
            });
        };
    }
}
