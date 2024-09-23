import conectar from './Conexao.js';
import Titulo from '../Modelo/Titulo.js';
import Autor from '../Modelo/Autor.js';
import Genero from '../Modelo/Genero.js';

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
            const [resultados] = await conexao.execute(sql, parametros);
            titulo.setId(resultados.insertId);

            for (const autor of titulo.getAutores()) {
                const sqlAutor = `INSERT INTO titulos_autores (titulo_id, autor_id) VALUES (?, ?)`;
                await conexao.execute(sqlAutor, [titulo.getId(), autor.getId()]);
            }

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

            const sqlDeleteAutores = `DELETE FROM titulos_autores WHERE titulo_id = ?`;
            await conexao.execute(sqlDeleteAutores, [titulo.getId()]);

            for (const autor of titulo.getAutores()) {
                const sqlAutor = `INSERT INTO titulos_autores (titulo_id, autor_id) VALUES (?, ?)`;
                await conexao.execute(sqlAutor, [titulo.getId(), autor.getId()]);
            }

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(titulo) {
        if (titulo instanceof Titulo) {
            const conexao = await conectar();
            
            const sqlDeleteAutores = `DELETE FROM titulos_autores WHERE titulo_id = ?`;
            await conexao.execute(sqlDeleteAutores, [titulo.getId()]);
            
            const sql = `DELETE FROM titulos WHERE id = ?`;
            await conexao.execute(sql, [titulo.getId()]);

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
            const genero = new Genero(registro.genero_id, registro.genero_nome);
    
            const autores = await this.consultarAutoresPorTituloId(registro.id);
            
            const titulo = new Titulo(
                registro.id,
                registro.nome,
                genero, 
                registro.assunto,
                autores 
            );
            listaTitulos.push(titulo);
        }
    
        global.poolConexoes.releaseConnection(conexao);
        return listaTitulos;
    }
    
    async consultarAutoresPorTituloId(tituloId) {
        const conexao = await conectar();
        const sql = `SELECT a.id, a.nome FROM autores a
                     JOIN titulos_autores ta ON a.id = ta.autor_id
                     WHERE ta.titulo_id = ?`;
    
        const [registros] = await conexao.execute(sql, [tituloId]);
        global.poolConexoes.releaseConnection(conexao);
    
        return registros.map(registro => new Autor(registro.id, registro.nome));
    }
}
