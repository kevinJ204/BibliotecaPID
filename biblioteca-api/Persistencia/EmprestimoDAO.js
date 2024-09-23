import conectar from './Conexao.js';
import Emprestimo from '../Modelo/Emprestimo.js';
import Aluno from '../Modelo/Aluno.js';
import AlunoDAO from './AlunoDAO.js';
import ExemplarDAO from './ExemplarDAO.js';
import Exemplar from '../Modelo/Exemplar.js';

export default class EmprestimoDAO {
    async gravar(emprestimo) {
        if (emprestimo instanceof Emprestimo) {
            const conexao = await conectar();
            const sql = `INSERT INTO emprestimos (aluno_id, dataEmprestimo, dataPrazo, status) VALUES (?, ?, ?, ?)`;
            const parametros = [
                emprestimo.getAluno().getId(),
                emprestimo.getDataEmprestimo(),
                emprestimo.getdataPrazo(),
                emprestimo.getStatus()
            ];
            const [resultados] = await conexao.execute(sql, parametros);
            emprestimo.setId(resultados.insertId);

            for (const exemplar of emprestimo.getExemplares()) {
                const sqlExemplar = `INSERT INTO emprestimos_exemplares (emprestimo_id, exemplar_id) VALUES (?, ?)`;
                await conexao.execute(sqlExemplar, [emprestimo.getId(), exemplar.getId()]);
            }

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(emprestimo) {
        if (emprestimo instanceof Emprestimo) {
            const conexao = await conectar();
            const sql = `UPDATE emprestimos SET aluno_id = ?, dataEmprestimo = ?, dataPrazo = ?, 
                status = ? WHERE id = ?`;
            const parametros = [
                emprestimo.getAluno().getId(),
                emprestimo.getDataEmprestimo(),
                emprestimo.getdataPrazo(),
                emprestimo.getStatus()
            ];

            await conexao.execute(sql, parametros);

            const sqlDeleteExemplares = `DELETE FROM emprestimos_exemplares WHERE emprestimo_id = ?`;
            await conexao.execute(sqlDeleteExemplares, [emprestimo.getId()]);

            for (const exemplar of emprestimo.getExemplares()) {
                const sqlExemplar = `INSERT INTO emprestimos_exemplares (emprestimo_id, exemplar_id) VALUES (?, ?)`;
                await conexao.execute(sqlAutor, [emprestimo.getId(), exemplar.getId()]);
            }

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(emprestimo) {
        if (emprestimo instanceof Emprestimo) {
            const conexao = await conectar();
            
            const sqlDeleteExemplares = `DELETE FROM emprestimos_exemplares WHERE emprestimo_id = ?`;
            await conexao.execute(sqlDeleteExemplares, [emprestimo.getId()]);
            
            const sql = `DELETE FROM emprestimos WHERE id = ?`;
            await conexao.execute(sql, [emprestimo.getId()]);

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termoDePesquisa) {
        if (termoDePesquisa === undefined) {
            termoDePesquisa = "";
        }
        let sql = "";
        const conexao = await conectar();
        const [registros] = null;
        if (isNaN(parseInt(termoDePesquisa))) {
            sql = `SELECT em.* FROM emprestimos em 
                   JOIN alunos a ON em.aluno_id = a.id 
                   JOIN emprestimos_exemplares ee ON em.id = ee.emprestimo_id 
                   JOIN exemplares ex ON ex.id = ee.exemplar_id 
                   JOIN titulos t ON t.id = ex.titulo_id
                   WHERE a.nome LIKE ? OR t.nome LIKE ?;`;
            termoDePesquisa = '%' + termoDePesquisa + '%';
            [registros] = await conexao.execute(sql, [termoDePesquisa, termoDePesquisa]);
        } else {
            sql = `SELECT em.* 
                   FROM emprestimos em 
                   WHERE em.id = ?;`;
            termoDePesquisa = '%' + termoDePesquisa + '%';
            [registros] = await conexao.execute(sql, [termoDePesquisa]);
        }
    
        let listaEmprestimos = [];

        const dao = new AlunoDAO();
    
        for (const registro of registros) {
            const aluno = await dao.consultar(registro.aluno_id);
    
            const exemplares = await this.consultarExemplaresPorEmprestimoId(registro.id);
            
            const emprestimo = new Emprestimo(
                registro.id,
                exemplares,
                aluno[0], 
                registro.dataEmprestimo,
                registro.dataPrazo,
                registro.status 
            );
            listaEmprestimos.push(emprestimo.toJSON());
        }
    
        global.poolConexoes.releaseConnection(conexao);
        return listaEmprestimos;
    }
    
    async consultarExemplaresPorEmprestimoId(emprestimoId) {
        const conexao = await conectar();
        const sql = `SELECT ex.id
                     FROM exemplares ex
                     JOIN emprestimos_exemplares ee ON ex.id = ee.exemplar_id
                     WHERE ee.emprestimo_id = ?`;
    
        const [registros] = await conexao.execute(sql, [emprestimoId]);
        global.poolConexoes.releaseConnection(conexao);
        let listaExemplares = [];

        const dao = new ExemplarDAO();

        for (const registro of registros) {
            const exemplar = await dao.consultar(registro.id);
            listaExemplares.push(exemplar);
        }

        return listaExemplares.map(exemplar => new Exemplar(exemplar.id, exemplar.codigo, 
            exemplar.titulo, exemplar.status));
    }
}
