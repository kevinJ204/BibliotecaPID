import conectar from './Conexao.js';
import Titulo from '../Modelo/Titulo.js';

export default class TituloDAO {
    async gravar(titulo){
        if (titulo instanceof Titulo){
            const conexao = await conectar();
            const sql = `INSERT INTO titulos (nome, genero, assunto) values (?, ?, ?)`;
            const parametros = [
                titulo.getNome(),
                titulo.getGenero(),
                titulo.getAssunto()
            ];
            const [resultados, campos] = await conexao.execute(sql,parametros);
            titulo.setId(resultados.insertId);
        }
    }

    async atualizar(titulo){
        if (titulo instanceof Titulo){
            const conexao = await conectar();
            const sql = `UPDATE titulos SET nome = ?,
                         genero = ?, assunto = ? WHERE id = ?`;
            const parametros = [
                titulo.getNome(),
                titulo.getGenero(),
                titulo.getAssunto(),
                titulo.getId()
            ];

            await conexao.execute(sql,parametros);
        }
    }

    async excluir(titulo){
        if (titulo instanceof Titulo){
            const conexao = await conectar();
            const sql = `DELETE FROM titulos WHERE id = ?`;
            const parametros = [
                titulo.getId()
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
            sql = `SELECT * FROM titulos WHERE nome LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
        }
        else{
            sql = `SELECT * FROM titulos WHERE id LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
        }

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql,[termoDePesquisa]);
        let listaTitulos = [];
        for (const registro of registros){
            const titulo = new Titulo(
                registro.id,
                registro.nome,
                registro.genero,
                registro.assunto
            );
            listaTitulos.push(titulo);
        }
        return listaTitulos;
    }
}