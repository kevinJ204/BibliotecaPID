import conectar from './Conexao.js';
import Autor from '../Modelo/Autor.js';

export default class AutorDAO {
    async gravar(autor){
        if (autor instanceof Autor){
            const conexao = await conectar();
            const sql = `INSERT INTO autores (nome) values (?)`;
            const parametros = [
                autor.getNome()
            ];
            const [resultados, campos] = await conexao.execute(sql,parametros);
            autor.setId(resultados.insertId);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(autor){
        if (autor instanceof Autor){
            const conexao = await conectar();
            const sql = `UPDATE autores SET nome = ? WHERE id = ?`;
            const parametros = [
                autor.getNome(),
                autor.getId()
            ];

            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(autor){
        if (autor instanceof Autor){
            const conexao = await conectar();
            const sql = `DELETE FROM autores WHERE id = ?`;
            const parametros = [
                autor.getId()
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
            sql = `SELECT * FROM autores WHERE nome LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
        }
        else{
            sql = `SELECT * FROM autores WHERE id LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
        }

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql,[termoDePesquisa]);
        let listaAutores = [];
        for (const registro of registros){
            const autor = new Autor(
                registro.id,
                registro.nome
            );
            listaAutores.push(autor);
        }
        return listaAutores;
        global.poolConexoes.releaseConnection(conexao);
    }
}