import UsuarioDAO from "../Persistencia/UsuarioDAO.js";

export default class Usuario {
    #id;
    #nome;
    #email;
    #nivel;

    constructor(id=0, nome="", email="", nivel=0) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#nivel = nivel;
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
    getEmail() {
        return this.#email;
    }
    setEmail(email) {
        this.#email = email;
    }
    getNivel() {
        return this.#nivel;
    }
    setNivel(nivel) {
        this.#nivel = nivel;
    }

    async gravar(){
        const dao = new UsuarioDAO();
        await dao.gravar(this); 
    }

    async atualizar(){
        const dao = new UsuarioDAO();
        await dao.atualizar(this);
    }

    async excluir(){
        const dao = new UsuarioDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa){
        const dao = new UsuarioDAO();
        return await dao.consultar(termoDePesquisa);
    }

    toString(){
        return `Usuario id: ${this.#id} -  nome: ${this.#nome} - email: ${this.#email} - nivel: ${this.#nivel}
        `;
    }

    toJSON(){
        return {
            "id": this.#id,
            "nome": this.#nome,
            "email": this.#email,
            "nivel": this.#nivel
        }
    }
}