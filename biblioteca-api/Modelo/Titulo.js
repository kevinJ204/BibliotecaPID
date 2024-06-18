import TituloDAO from "../Persistencia/TituloDAO.js";
import Genero from "../Modelo/Genero.js";

export default class Titulo {
    #id;
    #nome;
    #genero;
    #assunto;

    constructor(id = 0, nome = "", genero = new Genero(), assunto = "") {
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

    async gravar() {
        const dao = new TituloDAO();
        await dao.gravar(this);
    }

    async atualizar() {
        const dao = new TituloDAO();
        await dao.atualizar(this);
    }

    async excluir() {
        const dao = new TituloDAO();
        await dao.excluir(this);
    }

    async consultar(termoDePesquisa) {
        const dao = new TituloDAO();
        const titulos = await dao.consultar(termoDePesquisa);
        const listaTitulos = titulos.map(titulo => {
            const genero = new Genero(titulo.#genero.id, titulo.#genero.genero);
            return new Titulo(titulo.#id, titulo.#nome, genero, titulo.#assunto);
        });

        return listaTitulos;
    }

    toString() {
        return `Titulo id: ${this.#id} - nome: ${this.#nome} - genero: ${this.#genero.toString()} - assunto: ${this.#assunto}`;
    }

    toJSON() {
        return {
            "id": this.#id,
            "nome": this.#nome,
            "genero": this.#genero.toJSON(),
            "assunto": this.#assunto
        };
    }
}
