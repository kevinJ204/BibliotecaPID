import TituloDAO from "../Persistencia/TituloDAO.js";

export default class Titulo {
    #id;
    #nome;
    #genero;
    #assunto;

    constructor(id=0, nome="", genero="", assunto="") {
        this.#id = id;
        this.#nome = nome;
        this.#genero = genero;
        this.#assunto = assunto;
    }

    getId() {
        return this.#id;
    }
    setId(id) {
        this.#id = id;
    }
    getNome() {
        return this.#nome;
    }
    setNome(nome) {
        this.#nome = nome;
    }
    getGenero() {
        return this.#genero;
    }
    setGenero(genero) {
        this.#genero = genero;
    }
    getAssunto() {
        return this.#assunto;
    }
    setAssunto(assunto) {
        this.#assunto = assunto;
    }

    async gravar(){
        const dao = new TituloDAO();
        await dao.gravar(this); 
    }

    async atualizar(){
        const dao = new TituloDAO();
        await dao.atualizar(this);
    }

    async excluir(){
        const dao = new TituloDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa){
        const dao = new TituloDAO();
        return await dao.consultar(termoDePesquisa);
    }

    toString(){
        return `Titulo id: ${this.#id} - nome: ${this.#nome} - genero: ${this.#genero} - assunto - ${this.#assunto}
        `;
    }

    toJSON(){
        return {
            "id": this.#id,
            "nome": this.#nome,
            "genero": this.#genero,
            "assunto": this.#assunto
        }
    }
}