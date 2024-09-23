import Exemplar from "./Exemplar.js"
import Aluno from "./Aluno.js"
import EmprestimoDAO from "../Persistencia/EmprestimoDAO.js"
import AlunoDAO from "../Persistencia/AlunoDAO.js";

export default class Emprestimo {
    #id;
    #exemplares;
    #aluno;
    #dataEmprestimo;
    #dataPrazo;
    #status;

    constructor(id = 0, exemplares = [], aluno = new Aluno(), dataEmprestimo = new Date(), dataPrazo = new Date(), status="") {
        this.#id = id;
        this.#exemplares = exemplares;
        this.#aluno = aluno;
        this.#dataEmprestimo = dataEmprestimo;
        this.#dataPrazo = dataPrazo;
        this.#status = status;
    }

    getId() {
        return this.#id;
    }

    setId(id) {
        this.#id = id;
    }

    getExemplares() {
        return this.#exemplares;
    }

    setExemplares(exemplares) {
        if (Array.isArray(exemplares)) {
            this.#exemplares = exemplares;
        }
    } 

    getAluno() {
        return this.#aluno;
    }

    setAluno(aluno) {
        this.#aluno = aluno;
    }

    getDataEmprestimo() {
        return this.#dataEmprestimo;
    }

    setDataEmprestimo(dataEmprestimo) {
        this.#dataEmprestimo = dataEmprestimo;
    }

    getdataPrazo() {
        return this.#dataPrazo;
    }

    setdataPrazo(dataPrazo) {
        this.#dataPrazo = dataPrazo;
    }

    getStatus() {
        return this.#status;
    }

    setStatus(status) {
        this.#status = status;
    }

    async gravar() {
        const dao = new EmprestimoDAO();
        await dao.gravar(this);
    }

    async atualizar() {
        const dao = new EmprestimoDAO();
        await dao.atualizar(this);
    }

    async excluir() {
        const dao = new EmprestimoDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa) {
        const dao = new EmprestimoDAO();
        const emprestimos = await dao.consultar(termoDePesquisa);
    
        const listaEmprestimos = emprestimos.map(emprestimo => {
            const aluno = new Aluno(emprestimo.getAluno().getId(), emprestimo.getAluno().getNome(), emprestimo.getAluno().getEmail(), emprestimo.getAluno().getRa(), emprestimo.getAluno().getTelefone());
            const exemplares = emprestimo.getExemplares().map(exemplar => new Exemplar(exemplar.getId(), exemplar.getCodigo(), exemplar.getTitulo(), exemplar.getStatus()));
            return new Emprestimo(emprestimo.getId(), exemplares, aluno, emprestimo.getDataEmprestimo(), emprestimo.getdataPrazo());
        });
    
        return listaEmprestimos;
    }
    
    toString() {
        const exemplaresNomes = this.#exemplares.map(exemplar => exemplar.getTitulo().getNome()).join(', ');
        return `Emprestimo id: ${this.#id} - exemplares: ${exemplaresNomes} - aluno: ${this.#aluno.toString()} - DataEmprestimo: ${this.#dataEmprestimo} - dataPrazo: ${this.#dataPrazo}`;
    }

    toJSON() {
        return {
            "id": this.#id,
            "exemplares": this.#exemplares.map(exemplar => exemplar.toJSON()),
            "aluno": this.#aluno.toJSON(),
            "dataEmprestimo": this.#dataEmprestimo,
            "dataPrazo": this.#dataPrazo
        };
    }
}
