import conectar from './Conexao.js';
import Aluno from '../Modelo/Aluno.js';

export default class AlunoDAO {
    async gravar(aluno){
        if (aluno instanceof Aluno){
            const conexao = await conectar();
            const sql = `INSERT INTO alunos (nome, email, ra, telefone) values (?, ?, ?, ?)`;
            const parametros = [
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getRa(),
                aluno.getTelefone()
            ];
            const [resultados, campos] = await conexao.execute(sql,parametros);
            aluno.setId(resultados.insertId);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(aluno){
        if (aluno instanceof Aluno){
            const conexao = await conectar();
            const sql = `UPDATE alunos SET nome = ?,
                         email = ?, ra = ?, telefone = ? WHERE id = ?`;
            const parametros = [
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getRa(),
                aluno.getTelefone(),
                aluno.getId()
            ];

            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(aluno){
        if (aluno instanceof Aluno){
            const conexao = await conectar();
            const sql = `DELETE FROM alunos WHERE id = ?`;
            const parametros = [
                aluno.getId()
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
        if (isNaN(parseInt(termoDePesquisa))){
            sql = `SELECT * FROM alunos WHERE nome LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
        }
        else{
            sql = `SELECT * FROM alunos WHERE id LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
        }

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql,[termoDePesquisa]);
        let listaAlunos = [];
        for (const registro of registros){
            const aluno = new Aluno(
                registro.id,
                registro.nome,
                registro.email,
                registro.ra,
                registro.telefone
            );
            listaAlunos.push(aluno);
        }
        return listaAlunos;
        global.poolConexoes.releaseConnection(conexao);
    }
}