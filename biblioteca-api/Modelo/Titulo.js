import TituloDAO from "../Persistencia/TituloDAO.js";
import Genero from "../Modelo/Genero.js";
import Autor from "../Modelo/Autor.js";

export default class Titulo {
    #id;
    #nome;
    #genero;
    #assunto;
    #autores;

    constructor(id = 0, nome = "", genero = new Genero(), assunto = "", autores = []) {
        this.#id = id;
        this.#nome = nome;
        this.#genero = genero;
        this.#assunto = assunto;
        this.#autores = autores;
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

    getAutores() {
        return this.#autores;
    }

    setAutores(autores) {
        if (Array.isArray(autores)) {
            this.#autores = autores;
        }
    }

    adicionarAutor(autor) {
        if (autor instanceof Autor) {
            this.#autores.push(autor);
        }
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
            const genero = new Genero(titulo.getGenero().getId(), titulo.getGenero().getGenero());
            const autores = titulo.getAutores().map(autor => new Autor(autor.getId(), autor.getNome()));
            return new Titulo(titulo.getId(), titulo.getNome(), genero, titulo.getAssunto(), autores);
        });
    
        return listaTitulos;
    }
    
    toString() {
        const autoresNomes = this.#autores.map(autor => autor.getNome()).join(', ');
        return `Titulo id: ${this.#id} - nome: ${this.#nome} - genero: ${this.#genero.toString()} - assunto: ${this.#assunto} - autores: ${autoresNomes}`;
    }

    toJSON() {
        return {
            "id": this.#id,
            "nome": this.#nome,
            "genero": this.#genero.toJSON(),
            "assunto": this.#assunto,
            "autores": this.#autores.map(autor => autor.toJSON())
        };
    }
}
