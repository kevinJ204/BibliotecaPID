import jwt from 'jsonwebtoken';

export function assinar(usuario) {
    const token = jwt.sign({ usuario }, process.env.CHAVE_SECRETA, {
        expiresIn: '60m',
    });

    return token;
}

export function verificarAssinatura(token){
    return jwt.verify(token, process.env.CHAVE_SECRETA);
}