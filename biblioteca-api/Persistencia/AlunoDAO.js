import conectar from './Conexao.js';
import Aluno from '../Modelo/Aluno.js';

export default class AlunoDAO {
    async gravar(aluno){
        if (aluno instanceof Aluno){
            const conexao = await conectar();
            const sql = `INSERT INTO aluno (nome, email, ra, telefone) values (?, ?, ?)`;
            const parametros = [
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getRa(),
                aluno.getTelefone
            ];
            const [resultados, campos] = await conexao.execute(sql,parametros);
            aluno.setId(resultados.insertId);
        }
    }

    async atualizar(usuario){
        if (usuario instanceof Usuario){
            const conexao = await conectar();
            const sql = `UPDATE usuario SET nome = ?,
                         email = ?, nivel = ? WHERE id = ?`;
            const parametros = [
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getNivel()
            ];

            await conexao.execute(sql,parametros);
        }
    }

    async excluir(usuario){
        if (usuario instanceof Usuario){
            const conexao = await conectar();
            const sql = `DELETE FROM usuario WHERE id = ?`;
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
            sql = `SELECT * FROM usuario WHERE nome LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
        }
        else{
            sql = `SELECT * FROM usuario WHERE id = ?`;
        }

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql,[termoDePesquisa]);
        let listaUsuarios = [];
        for (const registro of registros){
            const usuario = new Usuario(
                registro.id,
                registro.nome,
                registro.email,
                registro.nivel
            );
            listaUsuarios.push(usuario);
        }
        return listaUsuarios;
    }
}