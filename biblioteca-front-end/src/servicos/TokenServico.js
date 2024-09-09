class TokenServico {
    static armazenarToken(token) {
        localStorage.setItem('token', token);
    }

    static recuperarToken() {
        return localStorage.getItem('token');
    }

    static removerToken() {
        localStorage.removeItem('token');
    }
}

export default TokenServico;
