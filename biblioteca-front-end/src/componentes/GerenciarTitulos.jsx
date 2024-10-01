import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './Logo.png';
import './Usuarios.css';
import TituloServico from '../servicos/TituloServico';
import GeneroServico from '../servicos/GeneroServico';
import AutorServico from '../servicos/AutorServico';

const GerenciarTitulos = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um Livro...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [titulos, setTitulos] = useState([]);
    const [novoTitulo, setNovoTitulo] = useState({ id: '', nome: '', genero: { id: 0, genero: '' }, assunto: '', autores: [] });
    const [selectedTituloIndex, setSelectedTituloIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [tituloADeletar, setTituloADeletar] = useState(null);
    const tituloServico = new TituloServico();
    const [generos, setGeneros] = useState([]);
    const generoServico = new GeneroServico();
    const [autores, setAutores] = useState([]); 
    const [selectedAutores, setSelectedAutores] = useState([{ id: 0 }]);
    const autorServico = new AutorServico(); 

    useEffect(() => {
        fetchTitulos();
        fetchAutores(); 
    }, []);

    useEffect(() => {
        generoServico.obterGeneros()
            .then(setGeneros)
            .catch(error => alert('Erro ao buscar gêneros:', error));
    }, []);

    const fetchTitulos = async () => {
        try {
            const dados = await tituloServico.obterTitulos();
            setTitulos(dados);
        } catch (error) {
            alert('Erro ao buscar títulos: ' + error);
        }
    };

    const fetchAutores = async () => {
        try {
            const dados = await autorServico.obterAutores();
            setAutores(dados);
        } catch (error) {
            alert('Erro ao buscar autores: ' + error);
        }
    };

    const handleAddTitulo = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                let resposta;
                if (selectedTituloIndex !== null) {
                    resposta = await tituloServico.atualizarTitulo(titulos[selectedTituloIndex].id, novoTitulo);
                    setSelectedTituloIndex(null);
                } else {
                    resposta = await tituloServico.adicionarTitulo(novoTitulo);
                }
    
                if (resposta && resposta.status === true) {
                    setConfirmationMessage(selectedTituloIndex !== null ? 'Título atualizado com sucesso!' : 'Título cadastrado com sucesso!');
                } else {
                    setConfirmationMessage('Erro ao salvar título!');
                }
    
                fetchTitulos();
                setNovoTitulo({ nome: '', genero: { id: 0, genero: '' }, assunto: '', autores: [] });
                setSelectedAutores([{ id: 0 }]);
                setModalIsOpen(false);
                setConfirmationModalIsOpen(true);
            } catch (error) {
                alert(error);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleChange = (field, value, index = null) => {
        if (field === 'genero') {
            if (parseInt(value) === 0) {
                setNovoTitulo({ ...novoTitulo, genero: { id: 0, genero: '' } });
            } else {
                const generoSelecionado = generos.find(genero => genero.id === parseInt(value));
                setNovoTitulo({ ...novoTitulo, genero: generoSelecionado });
            }
        } else if (field === 'autor') {
            const updatedAutores = [...selectedAutores];
            updatedAutores[index] = { id: parseInt(value) };
            setSelectedAutores(updatedAutores);
            setNovoTitulo({ ...novoTitulo, autores: updatedAutores });
        } else {
            setNovoTitulo({ ...novoTitulo, [field]: value });
        }
        validateField(field, value);
    };
    

    const handleAddAutorField = () => {
        setSelectedAutores([...selectedAutores, { id: 0 }]);
    };

    const handleRemoveAutorField = (index) => {
        const updatedAutores = [...selectedAutores];
        updatedAutores.splice(index, 1);
        setSelectedAutores(updatedAutores);
        setNovoTitulo({ ...novoTitulo, autores: updatedAutores });
    };

    const validateForm = () => {
        const newErrors = {};
        if (novoTitulo.nome.length < 3) {
            newErrors.nome = 'Nome deve ter mais que 3 letras.';
        }
        if (!novoTitulo.genero || novoTitulo.genero.id === 0) {
            newErrors.genero = 'Selecione um gênero.';
        }
        if (novoTitulo.assunto.length < 2) {
            newErrors.assunto = 'Assunto deve ter pelo menos 2 caracteres.';
        }
        if (novoTitulo.autores.length === 0 || novoTitulo.autores.some(autor => autor.id === 0)) {
            newErrors.autores = 'Selecione ao menos um autor.';
        }
        return newErrors;
    };

    const validateField = (field, value) => {
        const newErrors = { ...errors };
        if (field === 'nome') {
            if (value.length < 3) {
                newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
            } else {
                delete newErrors.nome;
            }
        } else if (field === 'genero') {
            if (!value || value === '0') {
                newErrors.genero = 'Gênero inválido';
            } else {
                delete newErrors.genero;
            }
        } else if (field === 'assunto') {
            if (value.length < 3) {
                newErrors.assunto = 'Assunto deve ter no mínimo 3 caracteres';
            } else {
                delete newErrors.assunto;
            }
        } else if (field === 'autor') {
            if (value === '0') {
                newErrors.autores = 'Autor inválido';
            } else {
                delete newErrors.autores;
            }
        }
        setErrors(newErrors);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setErrors({});
        setNovoTitulo({ nome: '', genero: { id: 0, genero: '' }, assunto: '', autores: [] });
        setSelectedAutores([{ id: 0 }]);
        setSelectedTituloIndex(null);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

const handleEditTitulo = (index) => {
    const titulo = titulos[index];
    setNovoTitulo({ ...titulo });
    setSelectedTituloIndex(index);
    setSelectedAutores(titulo.autores || []);
    setErrors({});
    setModalIsOpen(true);
    };

    const handleDeleteTitulo = (index) => {
        setTituloADeletar(index);
        setDeleteConfirmationModalIsOpen(true);
    };

    const confirmDeleteTitulo = async () => {
        try {
            await tituloServico.deletarTitulo(titulos[tituloADeletar].id);
            fetchTitulos();
            setDeleteConfirmationModalIsOpen(false);
            setTituloADeletar(null);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="home-page">
            <div className="menu-background">
                <div className="logo-container">
                    <img src={logoImage} alt="Logo" className="logo" />
                </div>
                <div className="menu-options">
                    <div>
                        <Link to="/GerenciarUsuarios"className="menu-option">Gerenciar Usuários</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarAlunos" className="menu-option">Gerenciar Alunos</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarTitulos" className="menu-option">Gerenciar Títulos</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarGeneros" className="menu-option">Gerenciar Gêneros</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarAutores" className="menu-option">Gerenciar Autores</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarExemplares" className="menu-option">Gerenciar Exemplares</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarEmprestimos" className="menu-option">Gerenciar Empréstimos</Link>
                    </div>
                </div>
                <Link to="/home" className="logout-button">
                    VOLTAR
                </Link>
            </div>
            <div className="content-background">
                <h1 className="page-title">Gerenciamento de Títulos</h1>
                <div className="search-add">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="search-box"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={() => setSearchPlaceholder('')}
                            onBlur={() => setSearchPlaceholder('Pesquisar um livro...')}
                        />
                        <span className="search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 11H11.71L11.43 10.73C12.4439 9.55402 13.0011 8.0527 13 6.5C13 5.21442 12.6188 3.95772 11.9046 2.8888C11.1903 1.81988 10.1752 0.986756 8.98744 0.494786C7.79973 0.00281635 6.49279 -0.125905 5.23192 0.124899C3.97104 0.375703 2.81285 0.994767 1.90381 1.90381C0.994767 2.81285 0.375703 3.97104 0.124899 5.23192C-0.125905 6.49279 0.00281635 7.79973 0.494786 8.98744C0.986756 10.1752 1.81988 11.1903 2.8888 11.9046C3.95772 12.6188 5.21442 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="#575757"/>
                            </svg>
                        </span>
                    </div>
                    <button className="add-button" onClick={() => setModalIsOpen(true)}>NOVO +</button>
                </div>

                <div className="table-background">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Gênero</th>
                                <th>Assunto</th>
                                <th>Autores</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
            {titulos.map((titulo, index) => (
                <tr key={index} className="table-row">
                    <td className="table-row-text">{titulo.id}</td>
                    <td className="table-row-text">{titulo.nome}</td>
                    <td className="table-row-text">{titulo.genero.genero}</td>
                    <td className="table-row-text">{titulo.assunto}</td>
                    <td className="table-row-text">
                        {titulo.autores && titulo.autores.length > 0 ? (
                            titulo.autores.map((autor, i) => (
                                <span key={i}>
                                    {autor.nome}
                                    {i < titulo.autores.length - 1 ? ', ' : ''}
                                </span>
                            ))
                        ) : (
                            <span>Sem autor</span>
                        )}
                    </td>
                    <td className="table-row-text">
                        <button className="edit-button" onClick={() => { handleEditTitulo(index); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 5L19 8M20.385 6.585C20.7788 6.19115 21.0001 5.65698 21.0001 5.1C21.0001 4.54302 20.7788 4.00885 20.385 3.615C19.9912 3.22115 19.457 2.99989 18.9 2.99989C18.343 2.99989 17.8088 3.22115 17.415 3.615L9 12V15H12L20.385 6.585Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button className="delete-button" onClick={() => handleDeleteTitulo(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
                    </table>
                </div>
            </div>

            {modalIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{selectedTituloIndex !== null ? 'Editar Livro' : 'Adicionar Novo Livro'}</h2>
                        <div>
                            <input
                                type="text"
                                placeholder="Nome"
                                id="nome"
                                value={novoTitulo.nome}
                                onChange={(e) => handleChange('nome', e.target.value)}
                            />
                            {errors.nome && <div className="error">{errors.nome}</div>}
                        </div>
                        <div className="form-group">
                            <select
                                id="genero"
                                value={novoTitulo.genero.id}
                                onChange={(e) => handleChange('genero', e.target.value)}
                            >
                                <option value="0">Selecione um gênero</option>
                                {generos.map((genero) => (
                                    <option key={genero.id} value={genero.id}>
                                        {genero.genero}
                                    </option>
                                ))}
                            </select>
                            {errors.genero && <span className="error">{errors.genero}</span>}
                        </div>
                        <div>
                            <input
                                type="text"
                                id="assunto"
                                placeholder="Assunto"
                                value={novoTitulo.assunto}
                                onChange={(e) => handleChange('assunto', e.target.value)}
                            />
                            {errors.assunto && <div className="error">{errors.assunto}</div>}
                        </div>
                        <div>
                        {selectedAutores.length > 0 ? (
                            selectedAutores.map((autor, index) => (
                                <div className="autor-field" key={index}>
                                    <select
                                        id="autor"
                                        value={autor.id}
                                        onChange={(e) => handleChange('autor', e.target.value, index)}
                                    >
                                        <option value="0">Selecione um autor</option>
                                        {autores.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.nome}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="autor-actions">
                                        <button type="button" onClick={() => handleRemoveAutorField(index)}>
                                            Remover
                                        </button>
                                        {index === selectedAutores.length - 1 && (
                                            <button type="button" onClick={handleAddAutorField}>
                                                Adicionar Autor
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="autor-actions">
                                <button type="button" onClick={handleAddAutorField}>
                                    Adicionar Autor
                                </button>
                            </div>
                        )}
                        </div>
                        <div>
                            <button type="button" onClick={handleAddTitulo}>
                                {selectedTituloIndex !== null ? 'Atualizar' : 'Cadastrar'}
                            </button>
                            <button type="button" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {confirmationModalIsOpen && (
                <div className="confirmation-modal">
                    <div className="confirmation-modal-content">
                        <span className="close" onClick={() => setConfirmationModalIsOpen(false)}>&times;</span>
                        <h2>{confirmationMessage}</h2>
                        <button onClick={() => setConfirmationModalIsOpen(false)}>Fechar</button>
                    </div>
                </div>
            )}

            {deleteConfirmationModalIsOpen && (
                <div className="confirmation-modal">
                    <div className="confirmation-modal-content">
                        <span className="close" onClick={() => setDeleteConfirmationModalIsOpen(false)}>&times;</span>
                        <h2>Você deseja deletar este titulo?</h2>
                        <button onClick={confirmDeleteTitulo}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

        </div>
    );
};
export default GerenciarTitulos;
