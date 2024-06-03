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
        }
    }

    async atualizar(usuario){
        if (usuario instanceof Usuario){
            const conexao = await conectar();
            const sql = `UPDATE usuarios SET nome = ?,
                         email = ?, senha = ?, nivel = ? WHERE id = ?`;
            const parametros = [
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getSenha(),
                usuario.getNivel()
            ];

            await conexao.execute(sql,parametros);
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
        }
    }
    
    async consultar(termoDePesquisa){
        if (termoDePesquisa === undefined){
            termoDePesquisa = "";
        }
        let sql="";
        if (isNaN(parseInt(termoDePesquisa))){
            sql = `SELECT * FROM usuarios WHERE nome LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
        }
        else{
            sql = `SELECT * FROM usuarios WHERE id = ?`;
        }

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql,[termoDePesquisa]);
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
        return listaUsuarios;
    }
}