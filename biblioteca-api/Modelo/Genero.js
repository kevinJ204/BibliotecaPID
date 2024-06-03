import GeneroDAO from "../Persistencia/GeneroDAO.js";

export default class Genero {
    #id;
    #genero;

    constructor(id=0, genero="") {
        this.#id = id;
        this.#genero = genero;
    }

    getId() {
        return this.#id;
    }
    setId(id) {
        this.#id = id;
    }
    getGenero() {
        return this.#genero;
    }
    setGenero(genero) {
        this.#genero = genero;
    }

    async gravar(){
        const dao = new GeneroDAO();
        await dao.gravar(this); 
    }

    async atualizar(){
        const dao = new GeneroDAO();
        await dao.atualizar(this);
    }

    async excluir(){
        const dao = new GeneroDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa){
        const dao = new GeneroDAO();
        return await dao.consultar(termoDePesquisa);
    }

    toString(){
        return `Genero id: ${this.#id} -  genero: ${this.#genero}`;
    }

    toJSON(){
        return {
            "id": this.#id,
            "genero": this.#genero
        }
    }
}