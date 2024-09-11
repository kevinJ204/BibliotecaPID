import conectar from './Conexao.js';
import Titulo from '../Modelo/Titulo.js';

export default class TituloDAO {

    async gravar(titulo) {
        if (titulo instanceof Titulo) {
            const conexao = await conectar();
            const sql = `INSERT INTO titulos (nome, genero_id, assunto) VALUES (?, ?, ?)`;
            const parametros = [
                titulo.getNome(),
                titulo.getGenero().getId(),
                titulo.getAssunto()
            ];
            const [resultados, campos] = await conexao.execute(sql, parametros);
            titulo.setId(resultados.insertId);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(titulo) {
        if (titulo instanceof Titulo) {
            const conexao = await conectar();
            const sql = `UPDATE titulos SET nome = ?, genero_id = ?, assunto = ? WHERE id = ?`;
            const parametros = [
                titulo.getNome(),
                titulo.getGenero().getId(),
                titulo.getAssunto(),
                titulo.getId()
            ];

            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(titulo) {
        if (titulo instanceof Titulo) {
            const conexao = await conectar();
            const sql = `DELETE FROM titulos WHERE id = ?`;
            const parametros = [
                titulo.getId()
            ];
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termoDePesquisa) {
        if (termoDePesquisa === undefined) {
            termoDePesquisa = "";
        }
        let sql = "";
        if (isNaN(parseInt(termoDePesquisa))) {
            sql = `SELECT t.*, g.id AS genero_id, g.genero AS genero_nome
                   FROM titulos t 
                   JOIN generos g ON t.genero_id = g.id 
                   WHERE t.nome LIKE ?`;
            termoDePesquisa = '%' + termoDePesquisa + '%';
        } else {
            sql = `SELECT t.*, g.id AS genero_id, g.genero AS genero_nome
                   FROM titulos t 
                   JOIN generos g ON t.genero_id = g.id 
                   WHERE t.id LIKE ?`;
            termoDePesquisa = '%' + termoDePesquisa + '%';
        }

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, [termoDePesquisa]);
        let listaTitulos = [];
        for (const registro of registros) {
            const genero = {
                id: registro.genero_id,
                genero: registro.genero_nome
            };
            const titulo = new Titulo(
                registro.id,
                registro.nome,
                genero,
                registro.assunto
            );
            listaTitulos.push(titulo);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaTitulos;
    }
}
