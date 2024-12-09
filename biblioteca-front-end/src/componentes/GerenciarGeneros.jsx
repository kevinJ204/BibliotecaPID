import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './Logo.png';
import './Usuarios.css';
import GeneroServico from '../servicos/GeneroServico';

const GerenciarGeneros = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um gênero...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [generos, setGeneros] = useState([]);
    const [novoGenero, setNovoGenero] = useState({ id: '', genero: '' });
    const [selectedGeneroIndex, setSelectedGeneroIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [generoADeletar, setGeneroADeletar] = useState(null);
    const generoServico = new GeneroServico();
    const [isLoading, setIsLoading] = useState(true); 

    const hasFetchedGeneros = useRef(false);

    useEffect(() => {
        if (!hasFetchedGeneros.current) {
            fetchGeneros();
            hasFetchedGeneros.current = true;
        }
    }, []);

    const fetchGeneros = async () => {
        setIsLoading(true);
        const startTime = Date.now();

        try {
            const dados = await generoServico.obterGeneros();
            const elapsedTime = Date.now() - startTime;
            const minimumDelay = 1000;
            const remainingTime = Math.max(0, minimumDelay - elapsedTime);

            setTimeout(() => {
                if (dados.length > 0 && !dados.message) {
                    setGeneros(dados);
                } else {
                    setConfirmationMessage(dados.message || 'Nenhum gênero encontrado.');
                    setConfirmationModalIsOpen(true);
                }
                setIsLoading(false);
            }, remainingTime);
        } catch (error) {
            alert('Erro ao buscar gêneros: ' + error);
            setIsLoading(false);
        } finally {
            setConfirmationModalIsOpen(false);
        }
    };   

    const hasSearchedGenero = useRef(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchValue && !hasSearchedGenero.current) {
                generoServico.obterGeneroPorIdOuNome(searchValue)
                    .then((dados) => {
                        if (dados.length > 0 && !dados.message) {
                            setGeneros(dados);
                        } else {
                            setConfirmationMessage(dados.message || 'Nenhum gênero encontrado.');
                            setConfirmationModalIsOpen(true);
                        }
                    })
                    .catch(error => {
                        alert('Erro ao buscar gêneros: ' + error);
                    });
                hasSearchedGenero.current = true;
            } else if (!searchValue && hasSearchedGenero.current) {
                fetchGeneros();
                hasSearchedGenero.current = false;
            }
        }, 500);
    
        return () => clearTimeout(delayDebounceFn);
    }, [searchValue]);
    

    const validateForm = () => {
        const newErrors = {};
        if (!novoGenero.genero || novoGenero.genero.length <3 ) 
            {
                newErrors.genero = 'Gênero é obrigatório';
            } 
        return newErrors;
    };

    const validateField = (field, value) => {
        const newErrors = { ...errors };
        if (field === 'genero') {
            if (value.length < 3) {
                newErrors.genero = 'Gênero deve ter no mínimo 3 caracteres';
            } else {
                delete newErrors.genero;
            }
        }
        setErrors(newErrors);
    };

    const handleAddGenero = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                let resposta;
                if (selectedGeneroIndex !== null) {
                    resposta = await generoServico.atualizarGenero(generos[selectedGeneroIndex].id, novoGenero);
                    setSelectedGeneroIndex(null);
                } else {
                    resposta = await generoServico.adicionarGenero(novoGenero);
                }
                if (resposta && resposta.status === true) {
                    setConfirmationMessage(selectedGeneroIndex !== null ? 'Gênero atualizado com sucesso!' : 'Gênero cadastrado com sucesso');
                } else {
                    setConfirmationMessage(resposta.message || 'Erro ao salvar gênero!');
                }
                fetchGeneros();
                setNovoGenero({ id: '', genero: '' });
                setModalIsOpen(false);
                setConfirmationModalIsOpen(true);
            } catch (error) {
                alert('Erro ao salvar gênero: ' + error);
            }
        } else {
            setErrors(newErrors);
        }
    };
    

    const handleDeleteGenero = (index) => {
        setGeneroADeletar(index);
        setDeleteConfirmationModalIsOpen(true);
    };

    const confirmDeleteGenero = async () => {
        try {
            const resposta = await generoServico.deletarGenero(generos[generoADeletar].id);
            if (resposta && resposta.status === true) {
                fetchGeneros();
            } else {
                setConfirmationMessage(resposta.message || 'Erro ao deletar gênero!');
                setConfirmationModalIsOpen(true);
            }
            setDeleteConfirmationModalIsOpen(false);
            setGeneroADeletar(null);
        } catch (error) {
            alert('Erro ao deletar gênero: ' + error);
        }
    };
    

    const handleEditGenero = (index) => {
        setNovoGenero(generos[index]);
        setSelectedGeneroIndex(index);
        setErrors({});
        setModalIsOpen(true);
    };

    const handleChange = (field, value) => {
        setNovoGenero({ ...novoGenero, [field]: value });
        validateField(field, value);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setErrors({});
        setNovoGenero({ id: '', genero: ''});
        setSelectedGeneroIndex(null);
    };

    return (
        <div className="home-page">
            <div className="menu-background">
            <div className="logo-container">
                    <img src={logoImage} alt="Logo" className="logo" />
                </div>
                <div className="menu-options">
                    <div>
                        <Link to="/GerenciarUsuarios" className="menu-option">Gerenciar Usuários</Link>
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
                <h1 className="page-title">Gerenciamento de Gêneros</h1>
                <div className="search-add">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="search-box"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={() => setSearchPlaceholder('')}
                            onBlur={() => setSearchPlaceholder('Pesquisar um gênero...')}
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
                                <th>Gênero</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="3" className="loading-container">
                                    <div className="spinner"></div>
                                    <p>Carregando Dados de Gêneros...</p>
                                </td>
                            </tr>
                        ) : (
                            generos.map((genero, index) => (
                                <tr key={index} className="table-row">
                                    <td className="table-row-text">{genero.id}</td>
                                    <td className="table-row-text">{genero.genero}</td>
                                    <td className="table-row-text">
                                    <button className="edit-button" onClick={() => handleEditGenero(index)}>
                                            <span className="edit-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M16 5L19 8M20.385 6.585C20.7788 6.19115 21.0001 5.65698 21.0001 5.1C21.0001 4.54302 20.7788 4.00885 20.385 3.615C19.9912 3.22115 19.457 2.99989 18.9 2.99989C18.343 2.99989 17.8088 3.22115 17.415 3.615L9 12V15H12L20.385 6.585Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </span>
                                        </button>
                                        <button className="delete-button" onClick={() => handleDeleteGenero(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
            </div>

            {modalIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{selectedGeneroIndex !== null ? 'Editar Gênero' : 'Adicionar Novo Gênero'}</h2>
                        <div>
                            <input
                                type="text"
                                placeholder="Gênero"
                                value={novoGenero.genero}
                                onChange={(e) => handleChange('genero', e.target.value)}
                            />
                            {errors.genero && <div className="error">{errors.genero}</div>}
                        </div>
                        <div>
                            <button className="cancel" onClick={closeModal}>Cancelar</button>
                            <button className="add" onClick={handleAddGenero} disabled={Object.keys(errors).length > 0}>
                                {selectedGeneroIndex !== null ? 'Salvar' : 'Adicionar'}
                            </button>
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
                        <h2>Tem certeza que deseja deletar este gênero?</h2>
                        <button onClick={confirmDeleteGenero}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GerenciarGeneros;
