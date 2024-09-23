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
                exemplar.getTitulo.getId(),
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
    
    async consultar(termoDePesquisa){
        if (termoDePesquisa === undefined){
            termoDePesquisa = "";
        }
        let sql="";
        const conexao = await conectar();
        const registros = [];
        if (isNaN(parseInt(termoDePesquisa))){
            sql = `SELECT e.*, t.nome AS titulo_nome 
                   FROM exemplares e 
                   JOIN titulos t ON e.titulo_id = t.id
                   WHERE titulo_nome LIKE ? OR e.codigo LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
            [registros] = await conexao.execute(sql,[termoDePesquisa,termoDePesquisa]);
        }
        else{
            sql = `SELECT * FROM exemplares WHERE id LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
            [registros] = await conexao.execute(sql,[termoDePesquisa]);
        }

        let listaExemplares = [];

        const dao = new TituloDAO();

        for (const registro of registros){

            const titulos = await dao.consultar(registro.titulo_id);

            const exemplar = new Exemplar(
                registro.id,
                registro.codigo,
                titulos[0],
                registro.status
            );
            listaExemplares.push(exemplar);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaExemplares;
    }
}