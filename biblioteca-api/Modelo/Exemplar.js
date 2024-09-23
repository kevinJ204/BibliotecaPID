import Titulo from "./Titulo.js";
import ExemplarDAO from "../Persistencia/ExemplarDAO.js"

export default class Exemplar {
    #id;
    #codigo;
    #titulo;
    #status;

    constructor(id=0, codigo=0, titulo = new Titulo(), status="") {
        this.#id = id;
        this.#codigo = codigo;
        this.#titulo = titulo;
        this.#status = status;
    }

    getId() {
        return this.#id;
    }

    setId(id) {
        this.#id = id;
    }

    getCodigo() {
        return this.#codigo;
    }

    setCodigo(codigo) {
        this.#codigo = codigo;
    }

    getTitulo() {
        return this.#titulo;
    }

    setTitulo(titulo) {
        this.#titulo = titulo;
    }

    getStatus() {
        return this.#status;
    }

    setStatus(status) {
        this.#status = status;
    }

    async gravar(){
        const dao = new ExemplarDAO();
        return await dao.gravar(this); 
    }

    async atualizar(){
        const dao = new ExemplarDAO();
        return await dao.atualizar(this);
    }

    async excluir(){
        const dao = new ExemplarDAO();
        return await dao.excluir(this);
    }

    async consultar(termoDePesquisa){
        const dao = new ExemplarDAO();
        return await dao.consultar(termoDePesquisa);
    }

    toString(){
        return `Exemplar id: ${this.#id} - codigo: ${this.#codigo} -  titulo: ${this.#titulo} - status: ${this.#status}`;
    }

    toJSON(){
        return {
            "id": this.#id,
            "codigo": this.#codigo,
            "titulo": this.#titulo.toJSON(),
            "status": this.#status
        }
    }
}