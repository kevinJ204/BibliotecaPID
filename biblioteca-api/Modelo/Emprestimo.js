import Exemplar from "./Exemplar.js"
import Aluno from "./Aluno.js"
import EmprestimoDAO from "../Persistencia/EmprestimoDAO.js"

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
        return await dao.consultar(termoDePesquisa);
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
            "dataPrazo": this.#dataPrazo,
            "status": this.#status
        };
    }
}
