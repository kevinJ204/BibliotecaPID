import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './Logo.png';
import './Usuarios.css';
import TituloServico from '../servicos/TituloServico';
import ExemplarServico from '../servicos/ExemplarServico';
import InputMask from 'react-input-mask';

const GerenciarExemplares = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um Livro...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [exemplares, setExemplares] = useState([]);
    const [novoExemplar, setNovoExemplar] = useState({ id: 0, codigo: '', titulo: { id: 0, nome: '', genero: { id: 0, genero: ''}, autores: [] }, status: ''});
    const [selectedExemplarIndex, setSelectedExemplarIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [exemplarADeletar, setExemplarADeletar] = useState(null);
    const exemplarServico = new ExemplarServico();
    const [titulos, setTitulos] = useState([]);
    const tituloServico = new TituloServico();
    const [baixaConfirmationModalIsOpen, setBaixaConfirmationModalIsOpen] = useState(false);

    useEffect(() => {
        fetchExemplares();
    }, []);

    useEffect(() => {
        tituloServico.obterTitulos()
            .then(setTitulos)
            .catch(error => alert('Erro ao buscar titulos:', error));
    }, []);

    const fetchExemplares = async () => {
        try {
            const dados = await exemplarServico.obterExemplares();
            setExemplares(dados);
        } catch (error) {
            alert('Erro ao buscar exemplares: ' + error);
        }
    };

    const handleAddExemplar = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                let resposta;
                if (selectedExemplarIndex !== null) {
                    resposta = await exemplarServico.atualizarExemplar(exemplares[selectedExemplarIndex].id, novoExemplar);
                    setSelectedExemplarIndex(null);
                } else {
                    resposta = await exemplarServico.adicionarExemplar(novoExemplar);
                }
    
                if (resposta && resposta.status === true) {
                    setConfirmationMessage(selectedExemplarIndex !== null ? 'Exemplar atualizado com sucesso!' : 'Exemplar cadastrado com sucesso!');
                } else {
                    setConfirmationMessage('Erro ao salvar Exemplar!');
                }
    
                fetchExemplares();
                setNovoExemplar({ codigo: '', titulo: { id: 0, nome: '', genero: { id: 0, genero: ''}, autores: [] }, status: ''});
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
        if (field === 'titulo') {
            if (parseInt(value) === 0) {
                setNovoExemplar({ ...novoExemplar, titulo: { id: 0, nome: '', genero: { id: 0, genero: ''}, autores: [] } });
            } else {
                const tituloSelecionado = titulos.find(titulo => titulo.id === parseInt(value));
                setNovoExemplar({ ...novoExemplar, titulo: tituloSelecionado });
            }
        } else {
            setNovoExemplar({ ...novoExemplar, [field]: value });
        }
        validateField(field, value);
    };
    
    const validateForm = () => {
        const newErrors = {};    
        const codigoSemMascara = novoExemplar.codigo.replace(/_/g, '');
    
        if (codigoSemMascara.length !== 13) {
            newErrors.codigo = 'Código deve ter 13 caracteres.';
        }
    
        if (!novoExemplar.titulo || novoExemplar.titulo.id === 0) {
            newErrors.titulo = 'Selecione um título.';
        }
    
        if (novoExemplar.status === 'Selecione um status') {
            newErrors.assunto = 'Selecione um status.';
        }
    
        return newErrors;
    };
    
    const validateField = (field, value) => {
        const newErrors = { ...errors };
    
        if (field === 'codigo') {
            const codigoSemMascara = value.replace(/_/g, '');
    
            if (codigoSemMascara.length !== 13) {
                newErrors.codigo = 'Código deve ter 13 caracteres.';
            } else {
                delete newErrors.codigo;
            }
        } else if (field === 'titulo') {
            if (!value || value === '0') {
                newErrors.titulo = 'Título inválido';
            } else {
                delete newErrors.titulo;
            }
        } else if (field === 'status') {
            if (value === 'Selecione um status') {
                newErrors.status = 'Status deve ser diferente de: Selecione um status';
            } else {
                delete newErrors.status;
            }
        }
    
        setErrors(newErrors);
    };
    
    const closeModal = () => {
        setModalIsOpen(false);
        setErrors({});
        setNovoExemplar({ codigo: '', titulo: { id: 0, nome: '', genero: { id: 0, genero: ''}, autores: [] }, status: ''});
        setSelectedExemplarIndex(null);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleEditExemplar = (index) => {
        const exemplar = exemplares[index];
        setNovoExemplar({ ...exemplar });
        setSelectedExemplarIndex(index);
        setErrors({});
        setModalIsOpen(true);
    };

    const handleDeleteExemplar = (index) => {
        setExemplarADeletar(index);
        setDeleteConfirmationModalIsOpen(true);
    };

    const confirmDeleteExemplar = async () => {
        try {
            await exemplarServico.deletarExemplar(exemplares[exemplarADeletar].id);
            fetchExemplares();
            setDeleteConfirmationModalIsOpen(false);
            setExemplarADeletar(null);
        } catch (error) {
            alert(error);
        }
    };

    const handleBaixaExemplar = (index) => {
        setSelectedExemplarIndex(index);
        setConfirmationMessage(`Deseja realmente realizar a baixa do exemplar ${exemplares[index].codigo}?`);
        setBaixaConfirmationModalIsOpen(true);
    };

    const confirmBaixaExemplar = async () => {
        if (selectedExemplarIndex !== null) {
            const exemplarAtualizado = { ...exemplares[selectedExemplarIndex], status: 'Baixa' };
            try {
                await exemplarServico.atualizarExemplar(exemplarAtualizado.id, exemplarAtualizado);
                const novosExemplares = [...exemplares];
                novosExemplares[selectedExemplarIndex] = exemplarAtualizado;
                setExemplares(novosExemplares); 
                setBaixaConfirmationModalIsOpen(false); 
                setSelectedExemplarIndex(null);
            } catch (error) {
                console.error('Erro ao realizar baixa no exemplar:', error);
            }
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
                <h1 className="page-title">Gerenciamento de Exemplares</h1>
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
                                <th>Código</th>
                                <th>Título</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exemplares.map((exemplar, index) => (
                                <tr key={index} className="table-row">
                                    <td className="table-row-text">{exemplar.id}</td>
                                    <td className="table-row-text">{exemplar.codigo}</td>
                                    <td className="table-row-text">{exemplar.titulo.nome}</td>
                                    <td className="table-row-text">{exemplar.status}</td>
                                    <td className="table-row-text">
                                        <button className="edit-button" onClick={() => { handleEditExemplar(index); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M16 5L19 8M20.385 6.585C20.7788 6.19115 21.0001 5.65698 21.0001 5.1C21.0001 4.54302 20.7788 4.00885 20.385 3.615C19.9912 3.22115 19.457 2.99989 18.9 2.99989C18.343 2.99989 17.8088 3.22115 17.415 3.615L9 12V15H12L20.385 6.585Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                        <button className="delete-button" onClick={() => handleDeleteExemplar(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                        <button className="baixa-button" onClick={() => handleBaixaExemplar(index)}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.97503 19.95C7.70836 19.8167 6.52936 19.4627 5.43802 18.888C4.34669 18.3133 3.40069 17.58 2.60002 16.688C1.79936 15.796 1.17036 14.775 0.713024 13.625C0.255691 12.475 0.0263577 11.2583 0.0250244 9.975C0.0250244 7.39167 0.879357 5.15433 2.58802 3.263C4.29669 1.37167 6.43402 0.284 9.00002 0V2C6.98336 2.28333 5.31669 3.17933 4.00002 4.688C2.68336 6.19667 2.02502 7.959 2.02502 9.975C2.02502 11.991 2.68336 13.7537 4.00002 15.263C5.31669 16.7723 6.97503 17.668 8.97503 17.95V19.95ZM9.97503 15L4.95002 9.95L6.37502 8.525L8.97503 11.125V5H10.975V11.125L13.55 8.55L14.975 10L9.97503 15ZM10.975 19.95V17.95C11.6917 17.85 12.3794 17.6583 13.038 17.375C13.6967 17.0917 14.309 16.7333 14.875 16.3L16.325 17.75C15.5417 18.3667 14.7 18.8627 13.8 19.238C12.9 19.6133 11.9584 19.8507 10.975 19.95ZM14.925 3.65C14.3417 3.21667 13.721 2.85833 13.063 2.575C12.405 2.29167 11.7174 2.1 11 2V0C11.9834 0.1 12.925 0.337667 13.825 0.713C14.725 1.08833 15.5584 1.584 16.325 2.2L14.925 3.65ZM17.725 16.3L16.325 14.875C16.7584 14.3083 17.1084 13.696 17.375 13.038C17.6417 12.38 17.825 11.6923 17.925 10.975H19.975C19.8417 11.9583 19.5917 12.9043 19.225 13.813C18.8584 14.7217 18.3584 15.5507 17.725 16.3ZM17.925 8.975C17.825 8.25833 17.6417 7.571 17.375 6.913C17.1084 6.255 16.7584 5.64233 16.325 5.075L17.725 3.65C18.3584 4.4 18.8667 5.22933 19.25 6.138C19.6334 7.04667 19.875 7.99233 19.975 8.975H17.925Z" fill="black"/>
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
                        <h2>{selectedExemplarIndex !== null ? 'Editar Exemplar' : 'Adicionar Novo Exemplar'}</h2>
                        <div>
                            <InputMask
                                mask="9999999999999"
                                placeholder="Codigo de Barras"
                                id="codigo"
                                value={novoExemplar.codigo}
                                onChange={(e) => handleChange('codigo', e.target.value)}
                            />
                            {errors.codigo && <div className="error">{errors.codigo}</div>}
                        </div>
                        <div className="form-group">
                            <select
                                id="titulo"
                                value={novoExemplar.titulo.id}
                                onChange={(e) => handleChange('titulo', e.target.value)}
                            >
                                <option value="0">Selecione um título</option>
                                {titulos.map((titulo) => (
                                    <option key={titulo.id} value={titulo.id}>
                                        {titulo.nome}
                                    </option>
                                ))}
                            </select>
                            {errors.titulo && <span className="error">{errors.titulo}</span>}
                        </div>
                        <div>
                            <select
                                id="status"
                                value={novoExemplar.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                disabled={novoExemplar.status === 'Emprestado'}
                            >
                                <option value="Selecione um status">Selecione um status</option>
                                <option value="Disponível">Disponível</option>
                                <option value="Emprestado">Emprestado</option>
                                <option value="Baixa">Baixa</option>
                            </select>
                            {errors.status && <div className="error">{errors.status}</div>}
                        </div>

                        <div>
                            <button type="button" onClick={handleAddExemplar}>
                                {selectedExemplarIndex !== null ? 'Atualizar' : 'Cadastrar'}
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
                        <h2>Você deseja deletar este Exemplar?</h2>
                        <button onClick={confirmDeleteExemplar}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {baixaConfirmationModalIsOpen && (
                <div className="confirmation-modal">
                    <div className="confirmation-modal-content">
                        <span className="close" onClick={() => setBaixaConfirmationModalIsOpen(false)}>&times;</span>
                        <h2>{confirmationMessage}</h2>
                        <button onClick={confirmBaixaExemplar}>Confirmar</button>
                        <button onClick={() => setBaixaConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

        </div>
    );
};
export default GerenciarExemplares;