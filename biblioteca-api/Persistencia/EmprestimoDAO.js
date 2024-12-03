import conectar from './Conexao.js';
import Emprestimo from '../Modelo/Emprestimo.js';
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
                const dao = new ExemplarDAO();
                const sqlExemplar = `INSERT INTO emprestimos_exemplares (emprestimo_id, exemplar_id) VALUES (?, ?)`;
                await conexao.execute(sqlExemplar, [emprestimo.getId(), exemplar.getId()]);
                const [exemplarCompleto] = await dao.consultar(exemplar.getId());
                if (exemplarCompleto) {
                    exemplarCompleto.setStatus("Emprestado");
                    await dao.atualizar(exemplarCompleto);
                }
            }

            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(emprestimo) {
        if (emprestimo instanceof Emprestimo) {
            const conexao = await conectar();
            try {
                const sqlEmprestimo = `
                    UPDATE emprestimos
                    SET aluno_id = ?, dataEmprestimo = ?, dataPrazo = ?, status = ?
                    WHERE id = ?`;
                const parametrosEmprestimo = [
                    emprestimo.getAluno().getId(),
                    emprestimo.getDataEmprestimo(),
                    emprestimo.getdataPrazo(),
                    emprestimo.getStatus(),
                    emprestimo.getId()
                ];
                await conexao.execute(sqlEmprestimo, parametrosEmprestimo);
        
                const sqlConsultaExemplares = `
                    SELECT exemplar_id
                    FROM emprestimos_exemplares
                    WHERE emprestimo_id = ?`;
                const [exemplaresAtuais] = await conexao.execute(sqlConsultaExemplares, [emprestimo.getId()]);
                const idsExemplaresAtuais = exemplaresAtuais.map(e => e.exemplar_id);
        
                for (const exemplar of emprestimo.getExemplares()) {
                    const dao = new ExemplarDAO();
                    if (!idsExemplaresAtuais.includes(exemplar.getId())) {
                        const sqlInserirExemplar = `
                            INSERT INTO emprestimos_exemplares (emprestimo_id, exemplar_id)
                            VALUES (?, ?)`;
                        await conexao.execute(sqlInserirExemplar, [emprestimo.getId(), exemplar.getId()]);
                    }
                    const [exemplarCompleto] = await dao.consultar(exemplar.getId());
                    if (exemplarCompleto) {
                        exemplarCompleto.setStatus("Emprestado");
                        await dao.atualizar(exemplarCompleto);
                    }
                }
        
                const idsExemplaresNovos = emprestimo.getExemplares().map(e => e.getId());
                for (const idExemplarAtual of idsExemplaresAtuais) {
                    if (!idsExemplaresNovos.includes(idExemplarAtual)) {
                        const dao = new ExemplarDAO();
                        const sqlRemoverExemplar = `
                            DELETE FROM emprestimos_exemplares
                            WHERE emprestimo_id = ? AND exemplar_id = ?`;
                        await conexao.execute(sqlRemoverExemplar, [emprestimo.getId(), idExemplarAtual]);
                        const [exemplarCompleto] = await dao.consultar(idExemplarAtual);
                        if (exemplarCompleto) {
                            exemplarCompleto.setStatus("Disponível");
                            await dao.atualizar(exemplarCompleto);
                        }   
                    }
                }
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async excluir(emprestimo) {
        if (emprestimo instanceof Emprestimo) {
            const conexao = await conectar();
            try {
                const dao = new ExemplarDAO();

                const sqlSelectExemplares = `
                    SELECT exemplar_id 
                    FROM emprestimos_exemplares 
                    WHERE emprestimo_id = ?`;
                const [exemplaresAssociados] = await conexao.execute(sqlSelectExemplares, [emprestimo.getId()]);

                for (const registro of exemplaresAssociados) {
                    const [exemplarCompleto] = await dao.consultar(registro.exemplar_id);
                    if (exemplarCompleto) {
                        exemplarCompleto.setStatus("Disponível");
                        await dao.atualizar(exemplarCompleto);
                    }
                }

                const sqlDeleteExemplares = `
                    DELETE FROM emprestimos_exemplares 
                    WHERE emprestimo_id = ?`;
                await conexao.execute(sqlDeleteExemplares, [emprestimo.getId()]);

                const sqlDeleteEmprestimo = `
                    DELETE FROM emprestimos 
                    WHERE id = ?`;
                await conexao.execute(sqlDeleteEmprestimo, [emprestimo.getId()]);
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async consultar(termoDePesquisa) {
        if (termoDePesquisa === undefined) {
            termoDePesquisa = "";
        }
        let sql = "";
        const conexao = await conectar();
        let registros = [];
        if (isNaN(parseInt(termoDePesquisa))) {
            sql = `SELECT em.* FROM emprestimos em 
                   JOIN alunos a ON em.aluno_id = a.id 
                   JOIN emprestimos_exemplares ee ON em.id = ee.emprestimo_id 
                   JOIN exemplares ex ON ex.id = ee.exemplar_id 
                   JOIN titulos t ON t.id = ex.titulo_id
                   WHERE a.nome LIKE ? OR t.nome LIKE ?
                   GROUP BY em.id;`;
            termoDePesquisa = '%' + termoDePesquisa + '%';
            [registros] = await conexao.execute(sql, [termoDePesquisa, termoDePesquisa]);
        } else {
            sql = `SELECT em.* 
                   FROM emprestimos em 
                   WHERE em.id = ?
                   GROUP BY em.id;`;
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
            listaEmprestimos.push(emprestimo);
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
            listaExemplares.push(exemplar[0]);
        }

        return listaExemplares.map(exemplar => new Exemplar(exemplar.getId(), exemplar.getCodigo(), 
            exemplar.getTitulo(), exemplar.getStatus()));
    }
}
