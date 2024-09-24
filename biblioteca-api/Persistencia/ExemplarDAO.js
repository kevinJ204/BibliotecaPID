import conectar from './Conexao.js';
import Exemplar from '../Modelo/Exemplar.js';
import TituloDAO from './TituloDAO.js';

export default class ExemplarDAO {
    async gravar(exemplar){
        if (exemplar instanceof Exemplar){
            const conexao = await conectar();
            const sql = `INSERT INTO exemplares (codigo,titulo_id,status) values (?,?,?)`;
            const parametros = [
                exemplar.getCodigo(),
                exemplar.getTitulo().getId(),
                exemplar.getStatus()
            ];
            const [resultados] = await conexao.execute(sql,parametros);
            exemplar.setId(resultados.insertId);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(exemplar){
        if (exemplar instanceof Exemplar){
            const conexao = await conectar();
            const sql = `UPDATE exemplares SET codigo = ?, titulo_id = ?, status = ? WHERE id = ?`;
            const parametros = [
                exemplar.getCodigo(),
                exemplar.getTitulo.getId(),
                exemplar.getStatus(),
                exemplar.getId()
            ];

            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(exemplar){
        if (exemplar instanceof Exemplar){
            const conexao = await conectar();
            const sql = `DELETE FROM exemplares WHERE id = ?`;
            const parametros = [
                exemplar.getId()
            ]
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    
    async consultar(termoDePesquisa) {
        // Verifica se termoDePesquisa é undefined e define como string vazia
        if (termoDePesquisa === undefined) {
            termoDePesquisa = "";
        }
    
        let sql = "";
    
        // Verifica se termoDePesquisa não é um número
        if (isNaN(parseInt(termoDePesquisa))) {
            sql = `SELECT e.*, t.nome 
                   FROM exemplares e 
                   JOIN titulos t ON e.titulo_id = t.id
                   WHERE t.nome LIKE ? ;`;
            termoDePesquisa = '%' + termoDePesquisa + '%'; // Usando uma nova variável
        } else {
            sql = `SELECT * FROM exemplares WHERE id LIKE ? ;`;
            termoDePesquisa = '%' + termoDePesquisa + '%'; // Usando uma nova variável
        }
        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, [termoDePesquisa]);

        let listaExemplares = [];
        const dao = new TituloDAO();
    
        // Itera sobre os registros e cria os objetos Exemplar
        for (const registro of registros) {
            const titulos = await dao.consultar(registro.titulo_id);
    
            const exemplar = new Exemplar(
                registro.id,
                registro.codigo,
                titulos[0],
                registro.status
            );
            listaExemplares.push(exemplar);
        }
    
        global.poolConexoes.releaseConnection(conexao); // Libera a conexão
        return listaExemplares; // Retorna a lista de exemplares
    }
}