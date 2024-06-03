import AlunoDAO from "../Persistencia/AlunoDAO.js";

export default class Aluno {
    #id;
    #nome;
    #email;
    #ra;
    #telefone;

    constructor(id=0, nome="", email="", ra=0, telefone=0) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#ra = ra;
        this.#telefone = telefone
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
    getRa() {
        return this.#ra;
    }
    setRa(ra) {
        this.#ra = ra;
    }
    getTelefone() {
        return this.#telefone;
    }
    setTelefone(telefone) {
        this.#telefone = telefone;
    }

    async gravar(){
        const dao = new AlunoDAO();
        await dao.gravar(this); 
    }

    async atualizar(){
        const dao = new AlunoDAO();
        await dao.atualizar(this);
    }

    async excluir(){
        const dao = new AlunoDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa){
        const dao = new AlunoDAO();
        return await dao.consultar(termoDePesquisa);
    }

    toString(){
        return `Aluno id: ${this.#id} -  nome: ${this.#nome} - email: ${this.#email} - RA: ${this.#ra} - telefone - ${this.#telefone}
        `;
    }

    toJSON(){
        return {
            "id": this.#id,
            "nome": this.#nome,
            "email": this.#email,
            "ra": this.#ra,
            "telefone": this.#telefone
        }
    }
}