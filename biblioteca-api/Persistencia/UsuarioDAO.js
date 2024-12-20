import conectar from './Conexao.js';
import Usuario from '../Modelo/Usuario.js';

export default class UsuarioDAO {
    async gravar(usuario){
        if (usuario instanceof Usuario){
            const conexao = await conectar();
            const sql = `INSERT INTO usuarios (nome, email, senha, nivel) values (?, ?, ?, ?)`;
            const parametros = [
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getSenha(),
                usuario.getNivel()
            ];
            const [resultados, campos] = await conexao.execute(sql,parametros);
            usuario.setId(resultados.insertId);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(usuario){
        if (usuario instanceof Usuario){
            const conexao = await conectar();
            const sql = `UPDATE usuarios SET nome = ?, email = ?, senha = ?, nivel = ? WHERE id = ?`;
            const parametros = [
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getSenha(),
                usuario.getNivel(),
                usuario.getId()
            ];

            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(usuario){
        if (usuario instanceof Usuario){
            const conexao = await conectar();
            const sql = `DELETE FROM usuarios WHERE id = ?`;
            const parametros = [
                usuario.getId()
            ]
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    
    async consultar(termoDePesquisa){
        if (termoDePesquisa === undefined){
            termoDePesquisa = "";
        }
        let sql="";
        const conexao = await conectar();
        let registros = [];

        if (isNaN(parseInt(termoDePesquisa))){
            sql = `SELECT * FROM usuarios WHERE nome LIKE ? OR email LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
            [registros] = await conexao.execute(sql,[termoDePesquisa, termoDePesquisa]);
        }
        else{
            sql = `SELECT * FROM usuarios WHERE id LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
            [registros] = await conexao.execute(sql,[termoDePesquisa]);
        }

        let listaUsuarios = [];
        for (const registro of registros){
            const usuario = new Usuario(
                registro.id,
                registro.nome,
                registro.email,
                registro.senha,
                registro.nivel
            );
            listaUsuarios.push(usuario);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaUsuarios;
    }

    async autenticar(email, senha) {
        const conexao = await conectar();
        const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
        const parametros = [
            email,
            senha
        ]
        const result = await conexao.execute(sql,parametros);
        global.poolConexoes.releaseConnection(conexao);
        if (result[0].length > 0) {
            return result[0];
        } else {
            throw new Error('Usuário ou senha inválidos');
        }
    }
}