import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './Logo.png';
import './Usuarios.css';
import EmprestimoServico from '../servicos/EmprestimoServico';
import AlunoServico from '../servicos/AlunoServico';
import ExemplarServico from '../servicos/ExemplarServico';

const GerenciarEmprestimos = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um Empréstimo...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [emprestimos, setEmprestimos] = useState([]);
    const [novoEmprestimo, setNovoEmprestimo] = useState({ id: '', exemplares: [], aluno: { id: 0, nome: '', email: '', ra: 0, telefone: 0 }, dataEmprestimo: '', dataPrazo: '', status: 'Ativo' });
    const [selectedEmprestimoIndex, setSelectedEmprestimoIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [emprestimoADeletar, setEmprestimoADeletar] = useState(null);
    const [devolverConfirmationModalIsOpen, setDevolverConfirmationModalIsOpen] = useState(false);
    const [emprestimoADevolver, setEmprestimoADevolver] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [exemplares, setExemplares] = useState([]);
    const [selectedExemplares, setSelectedExemplares] = useState([{
        id: 0,
        codigo: '',
        titulo: { id: 0, nome: '', genero: { id: 0, genero: '' }, autores: [] },
        status: ''
    }]);
    const alunoServico = new AlunoServico();
    const exemplarServico = new ExemplarServico();
    const emprestimoServico = new EmprestimoServico();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const hasFetchedEmprestimos = useRef(false);
    const hasFetchedAlunos = useRef(false);
    const hasFetchedExemplares = useRef(false);

    const [isLoading, setIsLoading] = useState(false);

    const sortedEmprestimos = useMemo(() => {
        if (!sortConfig.key) return emprestimos;
    
        return [...emprestimos].sort((a, b) => {
            const dateA = new Date(a[sortConfig.key]);
            const dateB = new Date(b[sortConfig.key]);
    
            if (sortConfig.direction === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
    }, [emprestimos, sortConfig]);    

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                return {
                    key,
                    direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return { key, direction: 'asc' }; 
        });
    };
    

    useEffect(() => {
        if (!hasFetchedEmprestimos.current) {
            fetchEmprestimos();
            hasFetchedEmprestimos.current = true;
        }

        if (!hasFetchedAlunos.current) {
            fetchAlunos();
            hasFetchedAlunos.current = true;
        }

        if (!hasFetchedExemplares.current) {
            fetchExemplares();
            hasFetchedExemplares.current = true;
        }
    }, []);

    const hasSearchedEmprestimo = useRef(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchValue && !hasSearchedEmprestimo.current) {
                emprestimoServico.obterEmprestimoPorIdOuNome(searchValue)
                    .then((dados) => {
                        if (dados.length > 0 && !dados.message) {
                            setEmprestimos(dados);
                        } else {
                            setConfirmationMessage(dados.message || 'Nenhum empréstimo encontrado.');
                            setConfirmationModalIsOpen(true);
                        }
                    })
                    .catch(error => {
                        alert('Erro ao buscar empréstimos: ' + error);
                    });
                hasSearchedEmprestimo.current = true;
            } else if (!searchValue && hasSearchedEmprestimo.current) {
                fetchEmprestimos();
                hasSearchedEmprestimo.current = false;
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchValue]);


    const fetchEmprestimos = async () => {
        setIsLoading(true);
        const startTime = Date.now();

        try {
            const dados = await emprestimoServico.obterEmprestimos();
            const elapsedTime = Date.now() - startTime;
            const minimumDelay = 1000;
            const remainingTime = Math.max(0, minimumDelay - elapsedTime);

            setTimeout(() => {
                if (dados.length > 0 && !dados.message) {
                    setEmprestimos(dados);
                } else {
                    setEmprestimos(dados);
                    setConfirmationMessage(dados.message || 'Nenhum empréstimo encontrado.');
                    setConfirmationModalIsOpen(true);
                }
                setIsLoading(false);
                setConfirmationModalIsOpen(false);
            }, remainingTime);
        } catch (error) {
            alert('Erro ao buscar empréstimos: ' + error);
            setIsLoading(false);
        }
    };


    const fetchAlunos = async () => {
        try {
            const dados = await alunoServico.obterAlunos();
            if (dados.length > 0 && !dados.message) {
                setAlunos(dados);
            } else {
                setConfirmationMessage(dados.message || 'Nenhum aluno encontrado.');
                setConfirmationModalIsOpen(true);
            }
        } catch (error) {
            alert('Erro ao buscar alunos: ' + error);
        }
    };

    const fetchExemplares = async () => {
        try {
            const dados = await exemplarServico.obterExemplares();
            if (dados.length > 0 && !dados.message) {
                const exemplaresDisponiveis = dados.filter(exemplar => exemplar.status === "Disponível");
                setExemplares(exemplaresDisponiveis);
            } else {
                setConfirmationMessage(dados.message || 'Nenhum exemplar encontrado.');
                setConfirmationModalIsOpen(true);
            }
        } catch (error) {
            alert('Erro ao buscar exemplares: ' + error);
        }
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const formatarDataParaInputDate = (dataString) => {
        return dataString.split('T')[0];
    };

    const handleAddExemplarField = () => {
        setSelectedExemplares([...selectedExemplares, {
            id: 0,
            codigo: '',
            titulo: { id: 0, nome: '', genero: { id: 0, genero: '' }, autores: [] },
            status: ''
        }]);
    };

    const handleRemoveExemplarField = (index) => {
        const updatedExemplares = [...selectedExemplares];
        updatedExemplares.splice(index, 1);
        setSelectedExemplares(updatedExemplares);
        setNovoEmprestimo({ ...novoEmprestimo, exemplares: updatedExemplares });
    };

    const handleAddEmprestimo = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                let resposta;
                if (selectedEmprestimoIndex !== null) {
                    resposta = await emprestimoServico.atualizarEmprestimo(emprestimos[selectedEmprestimoIndex].id, novoEmprestimo);
                    setSelectedEmprestimoIndex(null);
                } else {
                    resposta = await emprestimoServico.adicionarEmprestimo(novoEmprestimo);
                }
                if (resposta && resposta.status === true) {
                    setConfirmationMessage(selectedEmprestimoIndex !== null ? 'Empréstimo atualizado com sucesso!' : 'Empréstimo cadastrado com sucesso');
                } else {
                    setConfirmationMessage(resposta.message || 'Erro ao salvar empréstimo!');
                }
                fetchEmprestimos();
                setNovoEmprestimo({ id: '', exemplares: [], aluno: { id: 0, nome: '', email: '', ra: 0, telefone: 0 }, dataEmprestimo: '', dataPrazo: '', status: 'Ativo' });
                setSelectedExemplares([{ id: '' }])
                setModalIsOpen(false);
                setConfirmationModalIsOpen(true);
            } catch (error) {
                alert('Erro ao salvar empréstimo: ' + error);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleChange = (field, value, index = null) => {
        if (field === 'aluno') {
            if (parseInt(value) === 0) {
                setNovoEmprestimo({ ...novoEmprestimo, aluno: { id: 0, nome: '', email: '', ra: 0, telefone: 0 } });
            } else {
                const alunoSelecionado = alunos.find(aluno => aluno.id === parseInt(value));
                setNovoEmprestimo({ ...novoEmprestimo, aluno: alunoSelecionado });
            }
        } else if (field === 'exemplar') {
            const exemplarSelecionado = exemplares.find(exemplar => exemplar.id === parseInt(value));

            if (exemplarSelecionado && !selectedExemplares.some(selected => selected.id === exemplarSelecionado.id)) {
                const updatedExemplares = [...selectedExemplares];

                if (index !== null) {
                    updatedExemplares[index] = exemplarSelecionado;
                } else {
                    updatedExemplares.push(exemplarSelecionado);
                }

                setSelectedExemplares(updatedExemplares);
                const updatedDisponiveis = exemplares.filter(exemplar => exemplar.id !== exemplarSelecionado.id);

                setNovoEmprestimo({ ...novoEmprestimo, exemplares: updatedExemplares });
                setExemplares(updatedDisponiveis);
            }
        } else if (field === 'dataEmprestimo') {
            if (value.length === 10) {
                setNovoEmprestimo({ ...novoEmprestimo, dataEmprestimo: value });
            }
        } else if (field === 'dataPrazo') {
            if (value.length === 10) {
                setNovoEmprestimo({ ...novoEmprestimo, dataPrazo: value });
            }
        } else {
            setNovoEmprestimo({ ...novoEmprestimo, [field]: value });
        }

        validateField(field, value);
    };

    const handleDeleteEmprestimo = (index) => {
        setEmprestimoADeletar(index);
        setDeleteConfirmationModalIsOpen(true);
    };

    const confirmDeleteEmprestimo = async () => {
        try {
            const resposta = await emprestimoServico.deletarEmprestimo(emprestimos[emprestimoADeletar].id);
            if (resposta && resposta.status === true) {
                fetchEmprestimos();
            } else {
                setConfirmationMessage(resposta.message || 'Erro ao deletar empréstimo!');
                setConfirmationModalIsOpen(true);
            }
            setDeleteConfirmationModalIsOpen(false);
            setEmprestimoADeletar(null);
        } catch (error) {
            alert('Erro ao deletar empréstimo: ' + error);
        }
    };


    const handleEditEmprestimo = async(index) => {
        const emprestimo = emprestimos[index];
        setNovoEmprestimo({
            ...emprestimo,
            dataEmprestimo: formatarDataParaInputDate(emprestimo.dataEmprestimo),
            dataPrazo: formatarDataParaInputDate(emprestimo.dataPrazo)
        });
        setSelectedEmprestimoIndex(index);
        setSelectedExemplares(emprestimo.exemplares || []);
        setErrors({});
        setModalIsOpen(true);
    };

    const handleEmprestimosDevolver = (index) => {
        setEmprestimoADevolver(index);
        setDevolverConfirmationModalIsOpen(true);
    };

    const confirmDevolverEmprestimo = async () => {
        try {
            const resposta = await emprestimoServico.devolverEmprestimo(emprestimos[emprestimoADevolver].id);

            if (resposta && resposta.status === true) {
                fetchEmprestimos();  
                setConfirmationMessage('Empréstimo devolvido com sucesso!');
            } else {
                setConfirmationMessage(resposta.message || 'Erro ao devolver empréstimo!');
                setConfirmationModalIsOpen(true);
            }
        } catch (error) {
            setConfirmationMessage('Erro ao devolver empréstimo: ' + error.message);
        } finally {
            setDevolverConfirmationModalIsOpen(false);  
            setEmprestimoADevolver(null);
        }
    };


    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {};

        if (novoEmprestimo.exemplares.length === 0 || novoEmprestimo.exemplares.some(exemplar => exemplar.id === 0)) {
            newErrors.exemplares = 'Selecione ao menos um exemplar';
        }

        if (!novoEmprestimo.aluno || novoEmprestimo.aluno.id === 0) {
            newErrors.aluno = 'Selecione um aluno.';
        }

        const parseDate = (dateString) => {
            return new Date(dateString);
        };

        if (!novoEmprestimo.dataEmprestimo) {
            newErrors.dataEmprestimo = 'Insira uma data de empréstimo válida.';
        }

        if (!novoEmprestimo.dataPrazo) {
            newErrors.dataPrazo = 'Insira uma data de prazo válida.';
        }

        if (novoEmprestimo.dataEmprestimo && novoEmprestimo.dataPrazo) {
            const dateEmprestimo = parseDate(novoEmprestimo.dataEmprestimo);
            const datePrazo = parseDate(novoEmprestimo.dataPrazo);

            if (isNaN(dateEmprestimo.getTime())) {
                newErrors.dataEmprestimo = 'Insira uma data de empréstimo válida.';
            }

            if (isNaN(datePrazo.getTime())) {
                newErrors.dataPrazo = 'Insira uma data de prazo válida.';
            }

            if (dateEmprestimo > datePrazo) {
                newErrors.dataEmprestimo = 'A data de empréstimo não pode ser depois da data de entrega.';
            }
        }

        return newErrors;
    };

    const validateField = (field, value) => {
        const newErrors = { ...errors };

        if (field === 'exemplares') {
            if (value.length === 0 || value.some(exemplar => exemplar.id === 0)) {
                newErrors.exemplares = 'Selecione ao menos um exemplar válido.';
            } else {
                delete newErrors.exemplares;
            }
        } else if (field === 'aluno') {
            if (!value || value.id === 0) {
                newErrors.aluno = 'Selecione um aluno válido.';
            } else {
                delete newErrors.aluno;
            }
        } else if (field === 'dataEmprestimo') {
            if (value.length === 0) {
                newErrors.dataEmprestimo = 'Insira uma data de empréstimo válida no formato dd/mm/aaaa.';
            } else {
                delete newErrors.dataEmprestimo;
            }
        } else if (field === 'dataPrazo') {
            if (value.length === 0) {
                newErrors.dataPrazo = 'Insira uma data de prazo válida no formato dd/mm/aaaa.';
            } else {
                delete newErrors.dataPrazo;
            }
        }
        setErrors(newErrors);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setErrors({});
        setNovoEmprestimo({ id: '', exemplares: [], aluno: { id: 0, nome: '', email: '', ra: 0, telefone: 0 }, dataEmprestimo: '', dataPrazo: '', status: 'Ativo' });
        setSelectedExemplares([{ id: '' }])
        setSelectedEmprestimoIndex(null);
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
                <h1 className="page-title">Gerenciamento de Empréstimos</h1>
                <div className="search-add">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="search-box"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={() => setSearchPlaceholder('')}
                            onBlur={() => setSearchPlaceholder('Pesquisar um empréstimo...')}
                        />
                        <span className="search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 11H11.71L11.43 10.73C12.4439 9.55402 13.0011 8.0527 13 6.5C13 5.21442 12.6188 3.95772 11.9046 2.8888C11.1903 1.81988 10.1752 0.986756 8.98744 0.494786C7.79973 0.00281635 6.49279 -0.125905 5.23192 0.124899C3.97104 0.375703 2.81285 0.994767 1.90381 1.90381C0.994767 2.81285 0.375703 3.97104 0.124899 5.23192C-0.125905 6.49279 0.00281635 7.79973 0.494786 8.98744C0.986756 10.1752 1.81988 11.1903 2.8888 11.9046C3.95772 12.6188 5.21442 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="#575757" />
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
                                <th>Nome dos exemplares</th>
                                <th>Nome do aluno</th>
                                <th>
                                    Data do empréstimo
                                    <button className="sort-button" onClick={() => handleSort('dataEmprestimo')}>
                                        Ordenar{sortConfig.key === 'dataEmprestimo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </button>
                                </th>
                                <th>
                                    Data Prazo
                                    <button className="sort-button" onClick={() => handleSort('dataPrazo')}>
                                        Ordenar{sortConfig.key === 'dataPrazo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </button>
                                </th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="loading-container">
                                        <div className="spinner"></div>
                                        <p>Carregando Dados de Empréstimos...</p>
                                    </td>
                                </tr>
                            ) : (
                                sortedEmprestimos.map((emprestimo, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="table-row-text">{emprestimo.id}</td>
                                        <td className="table-row-text">
                                            {emprestimo.exemplares.map((exemplar) => exemplar.titulo.nome).join(', ')}
                                        </td>
                                        <td className="table-row-text">{emprestimo.aluno.nome}</td>
                                        <td className="table-row-text">{formatDate(emprestimo.dataEmprestimo)}</td>
                                        <td className="table-row-text">{formatDate(emprestimo.dataPrazo)}</td>
                                        <td className="table-row-text">{emprestimo.status}</td>
                                        <td className="table-row-text">
                                            <button className="edit-button" onClick={() => { handleEmprestimosDevolver(index); }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 20.4C12 21.72 12.4 22.944 13.08 24H2.66667C1.18667 24 0 22.932 0 21.6V2.4C0 1.76348 0.280951 1.15303 0.781048 0.702944C1.28115 0.252856 1.95942 0 2.66667 0H4V8.4L7.33333 6.6L10.6667 8.4V0H18.6667C19.3739 0 20.0522 0.252856 20.5523 0.702944C21.0524 1.15303 21.3333 1.76348 21.3333 2.4V13.308C20.8933 13.248 20.4533 13.2 20 13.2C15.5867 13.2 12 16.428 12 20.4ZM18.6667 19.2V16.8L14.6667 20.4L18.6667 24V21.6H24V19.2H18.6667Z" fill="black" />
                                                </svg>
                                            </button>
                                            <button className="edit-button" onClick={() => { handleEditEmprestimo(index); }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M16 5L19 8M20.385 6.585C20.7788 6.19115 21.0001 5.65698 21.0001 5.1C21.0001 4.54302 20.7788 4.00885 20.385 3.615C19.9912 3.22115 19.457 2.99989 18.9 2.99989C18.343 2.99989 17.8088 3.22115 17.415 3.615L9 12V15H12L20.385 6.585Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <button className="delete-button" onClick={() => handleDeleteEmprestimo(index)}>
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
                        <h2>{selectedEmprestimoIndex !== null ? 'Editar Emprestimo' : 'Adicionar Novo Emprestimo'}</h2>
                        <div>
                            {selectedExemplares.length > 0 ? (
                                selectedExemplares.map((exemplar, index) => (
                                    <div className="autor-field" key={index}>
                                        <select
                                            id="exemplar"
                                            value={exemplar.id}
                                            onChange={(e) => handleChange('exemplar', e.target.value, index)}
                                        >
                                            <option value="0">Selecione um Exemplar</option>
                                            {[...exemplares, ...novoEmprestimo.exemplares]
                                                .map((exemplarOption) => (
                                                    <option key={exemplarOption.id} value={exemplarOption.id}>
                                                        {exemplarOption.titulo.nome}
                                                    </option>
                                                ))}
                                        </select>
                                        <div className="autor-actions">
                                            <button type="button" onClick={() => handleRemoveExemplarField(index)}>
                                                Remover
                                            </button>
                                            {index === selectedExemplares.length - 1 && (
                                                <button type="button" onClick={handleAddExemplarField}>
                                                    Adicionar Exemplar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="exemplar-actions">
                                    <button type="button" onClick={handleAddExemplarField}>
                                        Adicionar Exemplar
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <select
                                id="aluno"
                                value={novoEmprestimo.aluno.id}
                                onChange={(e) => handleChange('aluno', e.target.value)}
                            >
                                <option value="0">Selecione um aluno</option>
                                {alunos.map((aluno) => (
                                    <option key={aluno.id} value={aluno.id}>
                                        {aluno.nome}
                                    </option>
                                ))}
                            </select>
                            {errors.aluno && <span className="error">{errors.aluno}</span>}
                        </div>
                        <div>
                            <small>Data do empréstimo</small>
                            <input
                                type="date"
                                placeholder="Data do empréstimo"
                                id="dataEmprestimo"
                                value={formatarDataParaInputDate(novoEmprestimo.dataEmprestimo)}
                                onChange={(e) => handleChange('dataEmprestimo', e.target.value)}
                            />
                            {errors.dataEmprestimo && <div className="error">{errors.dataEmprestimo}</div>}
                        </div>
                        <div>
                            <small>Data da entrega</small>
                            <input
                                type="date"
                                placeholder="Data do empréstimo"
                                id="dataPrazo"
                                value={formatarDataParaInputDate(novoEmprestimo.dataPrazo)}
                                onChange={(e) => handleChange('dataPrazo', e.target.value)}
                            />
                            {errors.dataPrazo && <div className="error">{errors.dataPrazo}</div>}
                        </div>
                        <div>
                            <button className="cancel" onClick={closeModal}>Cancelar</button>
                            <button className="add" onClick={handleAddEmprestimo} disabled={Object.keys(errors).length > 0}>
                                {selectedEmprestimoIndex !== null ? 'Salvar' : 'Adicionar'}
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
                        <h2>Tem certeza que deseja deletar este empréstimo?</h2>
                        <button onClick={confirmDeleteEmprestimo}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {devolverConfirmationModalIsOpen && (
                <div className="confirmation-modal">
                    <div className="confirmation-modal-content">
                        <span className="close" onClick={() => setDevolverConfirmationModalIsOpen(false)}>&times;</span>
                        <h2>Tem certeza que deseja devolver este empréstimo?</h2>
                        <button onClick={confirmDevolverEmprestimo}>Confirmar</button>
                        <button onClick={() => setDevolverConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {confirmationMessage && (
                <div className="confirmation-modal">
                    <div className="confirmation-modal-content">
                        <span className="close" onClick={() => setConfirmationMessage('')}>×</span>
                        <h2>{confirmationMessage}</h2>
                        <button onClick={() => setConfirmationMessage('')}>Fechar</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GerenciarEmprestimos;
