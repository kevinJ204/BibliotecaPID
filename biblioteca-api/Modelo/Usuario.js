import UsuarioDAO from "../Persistencia/UsuarioDAO.js";

export default class Usuario {
    #id;
    #nome;
    #email;
    #senha;
    #nivel;

    constructor(id=0, nome="", email="", senha="", nivel="") {
        this.#id = id;
        this.#nome = nome;
        this.#senha = senha;
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
    getSenha() {
        return this.#senha;
    }
    setSenha(senha) {
        this.#senha = senha;
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

    static async autenticar(email, senha) {
        const dao = new UsuarioDAO();
        return await dao.autenticar(email, senha);
    }

    toString(){
        return `Usuario id: ${this.#id} -  nome: ${this.#nome} - email: ${this.#email} - senha: ${this.#senha} - nivel: ${this.#nivel}
        `;
    }

    toJSON(){
        return {
            "id": this.#id,
            "nome": this.#nome,
            "email": this.#email,
            "senha": this.#senha,
            "nivel": this.#nivel
        }
    }
}