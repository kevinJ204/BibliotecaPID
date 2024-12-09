import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './Logo.png';
import './Usuarios.css';
import UsuarioServico from '../servicos/UsuarioServico';

const GerenciarUsuarios = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um usuário...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', nivel: 'Básico' });
    const [selectedUsuarioIndex, setSelectedUsuarioIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [usuarioADeletar, setUsuarioADeletar] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const usuarioServico = new UsuarioServico();

    const hasFetchedUsuarios = useRef(false);

    useEffect(() => {
        if (!hasFetchedUsuarios.current) {
            fetchUsuarios();
            hasFetchedUsuarios.current = true;
        }
    }, []);

    const fetchUsuarios = async () => {
        setIsLoading(true);
        const startTime = Date.now();

        try {
            const dados = await usuarioServico.obterUsuarios();

            const elapsedTime = Date.now() - startTime;
            const minimumDelay = 1000;
            const remainingTime = Math.max(0, minimumDelay - elapsedTime);

            setTimeout(() => {
                if (dados.length > 0 && !dados.message) {
                    setUsuarios(dados);
                } else {
                    setConfirmationMessage(dados.message || 'Nenhum usuário encontrado.');
                    setConfirmationModalIsOpen(true);
                }
                setIsLoading(false);
            }, remainingTime);
        } catch (error) {
            alert('Erro ao buscar usuários: ' + error);
            setIsLoading(false);
        } finally {
            setConfirmationModalIsOpen(false);
        }
    };

    const hasSearchedUsuario = useRef(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchValue && !hasSearchedUsuario.current) {
                usuarioServico.obterUsuarioPorIdOuNome(searchValue)
                    .then((dados) => {
                        if (dados.length > 0 && !dados.message) {
                            setUsuarios(dados);
                        } else {
                            setConfirmationMessage(dados.message || 'Nenhum usuário encontrado.');
                            setConfirmationModalIsOpen(true);
                        }
                    })
                    .catch(error => {
                        alert('Erro ao buscar usuários: ' + error);
                    });
                hasSearchedUsuario.current = true;
            } else if (!searchValue && hasSearchedUsuario.current) {
                fetchUsuarios();
                hasSearchedUsuario.current = false;
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchValue]);

    const validateForm = () => {
        const newErrors = {};
        if (novoUsuario.nome.length < 3) newErrors.nome = 'Usuário deve ter no mínimo 3 caracteres';
        if (!/\S+@\S+\.\S+/.test(novoUsuario.email)) newErrors.email = 'Formato de email inválido';
        if (novoUsuario.senha.length < 6) newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
        return newErrors;
    };

    const validateField = (field, value) => {
        const newErrors = { ...errors };
        if (field === 'nome') {
            if (value.length < 3) {
                newErrors.nome = 'Usuário deve ter no mínimo 3 caracteres';
            } else {
                delete newErrors.nome;
            }
        } else if (field === 'email') {
            if (!/\S+@\S+\.\S+/.test(value)) {
                newErrors.email = 'Formato de email inválido';
            } else {
                delete newErrors.email;
            }
        } else if (field === 'senha') {
            if (value.length < 6) {
                newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
            } else {
                delete newErrors.senha;
            }
        }
        setErrors(newErrors);
    };

    const handleChange = (field, value) => {
        setNovoUsuario({ ...novoUsuario, [field]: value });
        validateField(field, value);
    };

    const handleAddUsuario = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                let resposta;
                if (selectedUsuarioIndex !== null) {
                    resposta = await usuarioServico.atualizarUsuario(usuarios[selectedUsuarioIndex].id, novoUsuario);
                    setSelectedUsuarioIndex(null);
                } else {
                    resposta = await usuarioServico.adicionarUsuario(novoUsuario);
                }
                if (resposta && resposta.status === true) {
                    setConfirmationMessage(selectedUsuarioIndex !== null ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso');
                } else {
                    setConfirmationMessage(resposta.message || 'Erro ao salvar usuário!');
                }
                fetchUsuarios();
                setNovoUsuario({ nome: '', email: '', senha: '', nivel: 'Basico' });
                setModalIsOpen(false);
                setConfirmationModalIsOpen(true);
            } catch (error) {
                alert('Erro ao salvar usuário: ' + error);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleDeleteUsuario = (index) => {
        setUsuarioADeletar(index);
        setDeleteConfirmationModalIsOpen(true);
    };

    const confirmDeleteUsuario = async () => {
        try {
            const resposta = await usuarioServico.deletarUsuario(usuarios[usuarioADeletar].id);
            if (resposta && resposta.status === true) {
                fetchUsuarios();
            } else {
                setConfirmationMessage(resposta.message || 'Erro ao deletar usuário!');
                setConfirmationModalIsOpen(true);
            }
            setDeleteConfirmationModalIsOpen(false);
            setUsuarioADeletar(null);
        } catch (error) {
            alert('Erro ao deletar usuário: ' + error);
        }
    };

    const handleEditUsuario = (index) => {
        setNovoUsuario(usuarios[index]);
        setSelectedUsuarioIndex(index);
        setErrors({});
        setModalIsOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setErrors({});
        setNovoUsuario({ nome: '', email: '', senha: '', nivel: 'Basico' });
        setSelectedUsuarioIndex(null);
    };

    // if (isLoading) {
    //     return (
    //         <div className="loading-container">
    //             <div className="spinner"></div>
    //             <p>Carregando usuários...</p>
    //         </div>
    //     );
    // }
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
                <h1 className="page-title">Gerenciamento de Usuários</h1>
                <div className="search-add">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="search-box"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={() => setSearchPlaceholder('')}
                            onBlur={() => setSearchPlaceholder('Pesquisar um usuário...')}
                        />
                        <span className="search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 11H11.71L11.43 10.73C12.4439 9.55402 13.0011 8.0527 13 6.5C13 5.21442 12.6188 3.95772 11.9046 2.8888C11.1903 1.81988 10.1752 0.986756 8.98744 0.494786C7.79973 0.00281635 6.49279 -0.125905 5.23192 0.124899C3.97104 0.375703 2.81285 0.994767 1.90381 1.90381C0.994767 2.81285 0.375703 3.97104 0.124899 5.23192C-0.125905 6.49279 0.00281635 7.79973 0.494786 8.98744C0.986756 10.1752 1.81988 11.1903 2.8888 11.9046C3.95772 12.6188 5.21442 13 6.5 13C8.0527 13.0011 9.55402 12.4439 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C5.50739 11 4.53324 10.7063 3.6967 10.1583C2.86015 9.61036 2.20435 8.8328 1.80399 7.90599C1.40362 6.97917 1.27675 5.95079 1.43864 4.95341C1.60053 3.95602 2.04313 3.03153 2.70711 2.26757C3.3711 1.5036 4.22734 0.937269 5.17519 0.636428C6.12304 0.335587 7.12926 0.312878 8.08849 0.571325C9.04771 0.829772 9.92095 1.35992 10.6066 2.1005C11.2922 2.84107 11.7566 3.76546 11.9385 4.76537C12.1205 5.76528 12.0124 6.79795 11.6265 7.73363C11.2407 8.6693 10.5946 9.46554 9.76777 10.0156C8.94096 10.5657 7.97368 10.8428 6.985 10.82H6.5V11Z" fill="#787486" />
                            </svg>
                        </span>
                    </div>
                    <button
                        className="add-button"
                        onClick={() => {
                            setNovoUsuario({ nome: '', email: '', senha: '', nivel: 'Básico' });
                            setSelectedUsuarioIndex(null);
                            setModalIsOpen(true);
                        }}
                    >
                        NOVO +
                    </button>
                </div>
                <div className="table-background">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuário</th>
                                <th>Email</th>
                                <th>Nível</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="loading-container">
                                        <div className="spinner"></div>
                                        <p>Carregando Dados de Usuários...</p>
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((usuario, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="table-row-text">{usuario.id}</td>
                                        <td className="table-row-text">{usuario.nome}</td>
                                        <td className="table-row-text">{usuario.email}</td>
                                        <td className="table-row-text">{usuario.nivel}</td>
                                        <td className="table-row-text">
                                            <button className="edit-button" onClick={() => handleEditUsuario(index)}>
                                                <span className="edit-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M9 11L17.385 2.615C17.7788 2.22115 18.313 2 18.87 2C19.427 2 19.9612 2.22115 20.355 2.615C20.7488 3.00885 20.9701 3.54302 20.9701 4.1C20.9701 4.65698 20.7488 5.19115 20.355 5.585L12 14H9V11Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                            </button>
                                            <button className="delete-button" onClick={() => handleDeleteUsuario(index)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                        <h2>{selectedUsuarioIndex !== null ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
                        <div>
                            <input
                                type="text"
                                placeholder="Usuário"
                                value={novoUsuario.nome}
                                onChange={(e) => handleChange('nome', e.target.value)}
                            />
                            {errors.nome && <div className="error">{errors.nome}</div>}
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={novoUsuario.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                            {errors.email && <div className="error">{errors.email}</div>}
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Senha"
                                value={novoUsuario.senha}
                                onChange={(e) => handleChange('senha', e.target.value)}
                            />
                            {errors.senha && <div className="error">{errors.senha}</div>}
                        </div>
                        <div>
                            <select
                                value={novoUsuario.nivel}
                                onChange={(e) => setNovoUsuario({ ...novoUsuario, nivel: e.target.value })}
                            >
                                <option value="Básico">Básico</option>
                                <option value="Intermediário">Intermediário</option>
                                <option value="Avançado">Avançado</option>
                            </select>
                        </div>
                        <div>
                            <button className="cancel" onClick={closeModal}>Cancelar</button>
                            <button className="add" onClick={handleAddUsuario} disabled={Object.keys(errors).length > 0}>
                                {selectedUsuarioIndex !== null ? 'Salvar' : 'Adicionar'}
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
                        <h2>Tem certeza que deseja deletar este usuário?</h2>
                        <button onClick={confirmDeleteUsuario}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarUsuarios;
