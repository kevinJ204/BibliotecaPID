import Usuario from "../Modelo/Usuario.js";
import { assinar, verificarAssinatura } from "../Seguranca/funcoesJWT.js";
import jwt from 'jsonwebtoken';
import NodeMailer from 'nodemailer'
import conectar from '../Persistencia/Conexao.js'


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
                    "nivel": usuario[0].nivel,
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

    static async resetPassword(req, res) {
        try {
            const token = jwt.sign(
                { email: req.body.email },
                process.env.CHAVE_SECRETA,
                { expiresIn: '1h' }
            );

            const transporter = NodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.APP_PASS
                }
            });

            console.log('Transporter configurado com sucesso. Token:', token);

            const resetLink = `https://localhost:3000/ConfirmarRedefinicao/${token}`;
            console.log('Link de redefinição:', resetLink);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: req.body.email,
                subject: 'Password Reset',
                text: `Você solicitou uma redefinição de senha. Clique no link para redefinir sua senha: ${resetLink}`,
                html: `<p>Você solicitou uma redefinição de senha. Clique no link para redefinir sua senha:<br><br><a href="${resetLink}">${resetLink}</a></p>`
            };

            await transporter.sendMail(mailOptions);
            console.log('E-mail enviado com sucesso para:', req.body.email);

            return res.status(200).json({
                success: true,
                message: 'Se seu e-mail estiver registrado, um link de redefinição foi enviado.'
            });
        } catch (error) {
            console.error('Erro ao enviar o e-mail:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao enviar o e-mail. Tente novamente mais tarde.'
            });
        }
    }


    static async handlePassword(req, res) {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Token and password are required.",
                });
            }
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.CHAVE_SECRETA);
            } catch (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token.",
                });
            }

            const userEmail = decoded.email;
            const conexao = await conectar();
            const sql = `UPDATE usuarios SET senha = ? WHERE email = ?`;
            const [resultados] = await conexao.execute(sql, [password, userEmail]);

            if (resultados.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }

            console.log('Password updated for user:', userEmail);
            return res.status(200).json({
                success: true,
                message: "Password updated successfully.",
            });

        } catch (error) {
            console.error("Error in handlePassword:", error.message);
            return res.status(500).json({
                success: false,
                message: "An error occurred while updating the password.",
            });
        }
    }



    static async obterUsuarioLogado(requisicao, resposta) {
        resposta.type('application/json');
        try {
            const usuario = requisicao.session.usuario;
            if (usuario) {
                resposta.status(200).json({
                    "status": true,
                    "nome": usuario[0].nome,
                    "email": usuario[0].email
                });
            } else {
                resposta.status(401).json({
                    "status": false,
                    "mensagem": "Usuário não autenticado"
                });
            }
        } catch (erro) {
            resposta.status(500).json({
                "status": false,
                "mensagem": "Erro ao obter usuário logado"
            });
        }
    }

    static async verificarEmail(requisicao, resposta) {
        resposta.type('application/json');
        try {
            const { email } = requisicao.body;
            console.log('req body ' + email);
            if (!email) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "E-mail não fornecido."
                });
            }

            const usuario = new Usuario(0);

            const usuarios = await usuario.consultar(email);

            if (usuarios.length > 0) {
                return resposta.status(200).json({
                    "status": true,
                    "mensagem": "E-mail encontrado",
                    "email": usuarios[0].email
                });
            } else {
                return resposta.status(404).json({
                    "status": false,
                    "mensagem": "E-mail não registrado"
                });
            }
        } catch (erro) {
            console.error("Erro ao verificar e-mail:", erro);
            return resposta.status(500).json({
                "status": false,
                "mensagem": "Erro ao verificar e-mail"
            });
        }
    }
}