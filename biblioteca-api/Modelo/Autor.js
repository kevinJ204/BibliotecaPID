import AutorDAO from "../Persistencia/AutorDAO.js";

export default class Autor {
    #id;
    #nome;

    constructor(id=0, nome="") {
        this.#id = id;
        this.#nome = nome;
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

    async gravar(){
        const dao = new AutorDAO();
        await dao.gravar(this); 
    }

    async atualizar(){
        const dao = new AutorDAO();
        await dao.atualizar(this);
    }

    async excluir(){
        const dao = new AutorDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa){
        const dao = new AutorDAO();
        return await dao.consultar(termoDePesquisa);
    }

    toString(){
        return `Genero id: ${this.#id} -  nome: ${this.#nome}`;
    }

    toJSON(){
        return {
            "id": this.#id,
            "nome": this.#nome
        }
    }
}