import conectar from './Conexao.js';
import Genero from '../Modelo/Genero.js';

export default class GeneroDAO {
    async gravar(genero){
        if (genero instanceof Genero){
            const conexao = await conectar();
            const sql = `INSERT INTO generos (genero) values (?)`;
            const parametros = [
                genero.getGenero()
            ];
            const [resultados, campos] = await conexao.execute(sql,parametros);
            genero.setId(resultados.insertId);
        }
    }

    async atualizar(genero){
        if (genero instanceof Genero){
            const conexao = await conectar();
            const sql = `UPDATE generos SET genero = ? WHERE id = ?`;
            const parametros = [
                genero.getGenero()
            ];

            await conexao.execute(sql,parametros);
        }
    }

    async excluir(genero){
        if (genero instanceof Genero){
            const conexao = await conectar();
            const sql = `DELETE FROM generos WHERE id = ?`;
            const parametros = [
                genero.getId()
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
            sql = `SELECT * FROM generos WHERE genero LIKE ?`;
            termoDePesquisa= '%' + termoDePesquisa + '%';
        }
        else{
            sql = `SELECT * FROM generos WHERE id = ?`;
        }

        const conexao = await conectar();
        const [registros] = await conexao.execute(sql,[termoDePesquisa]);
        let listaGeneros = [];
        for (const registro of registros){
            const genero = new Genero(
                genero.id,
                genero.genero
            );
            listaGeneros.push(genero);
        }
        return listaGeneros;
    }
}