import React, { useState, useEffect, useRef } from 'react';
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
    const [novoEmprestimo, setNovoEmprestimo] = useState({ id: '', exemplares: [], aluno: { id: 0, nome: '', email: '', ra: 0, telefone: 0 }, dataEmprestimo: '', dataPrazo: '' });
    const [selectedEmprestimoIndex, setSelectedEmprestimoIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [emprestimoADeletar, setEmprestimoADeletar] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [exemplares, setExemplares] = useState([]); 
    const [selectedExemplares, setSelectedExemplares] = useState([{ id: '' }]);
    const alunoServico = new AlunoServico();
    const exemplarServico = new ExemplarServico();
    const emprestimoServico = new EmprestimoServico();

    const hasFetchedEmprestimos = useRef(false);
    const hasFetchedAlunos = useRef(false);
    const hasFetchedExemplares = useRef(false);

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

    useEffect(() => {
        if (searchValue) {
            emprestimoServico.obterEmprestimoPorIdOuNome(searchValue)
                .then(setEmprestimos)
                .catch(error => alert('Erro ao buscar empréstimos: ' + error));
        } else if (!hasFetchedEmprestimos.current) {
            fetchEmprestimos();
        }
    }, [searchValue]);

    const fetchEmprestimos = async () => {
        try {
            const dados = await emprestimoServico.obterEmprestimos();
            setEmprestimos(dados);
        } catch (error) {
            alert('Erro ao buscar empréstimos: ' + error);
        }
    };

    const fetchAlunos = async () => {
        try {
            const dados = await alunoServico.obterAlunos();
            setAlunos(dados);
        } catch (error) {
            alert('Erro ao buscar alunos: ' + error);
        }
    };

    const fetchExemplares = async () => {
        try {
            const dados = await exemplarServico.obterExemplares();
            const exemplaresDisponiveis = dados.filter(exemplar => exemplar.status === "Disponível");
            setExemplares(exemplaresDisponiveis);
        } catch (error) {
            alert('Erro ao buscar exemplares: ' + error);
        }
    };
    
    const handleAddExemplarField = () => {
        setSelectedExemplares([...selectedExemplares, { id: 0 }]);
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
                    setConfirmationMessage(selectedEmprestimoIndex !== null ? 'Empréstimo atualizado com sucesso!' : 'Empréstimo cadastrado com sucesso!');
                } else {
                    setConfirmationMessage('Erro ao salvar empréstimo!');
                }

                fetchEmprestimos();
                setNovoEmprestimo({ id: '', exemplares: [], aluno: { id: 0, nome: '', email: '', ra: 0, telefone: 0 }, dataEmprestimo: '', dataPrazo: '' });
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
        if (field === 'aluno') {
            if (parseInt(value) === 0) {
                setNovoEmprestimo({ ...novoEmprestimo, aluno: { id: 0, nome: '', email: '', ra: 0, telefone: 0 } });
            } else {
                const alunoSelecionado = alunos.find(aluno => aluno.id === parseInt(value));
                setNovoEmprestimo({ ...novoEmprestimo, aluno: alunoSelecionado });
            }
        } else if (field === 'exemplar') {
            const updatedExemplares = [...selectedExemplares];
            updatedExemplares[index] = { id: parseInt(value) };
            setSelectedExemplares(updatedExemplares);
            setNovoEmprestimo({ ...novoEmprestimo, exemplares: updatedExemplares });
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
            await emprestimoServico.deletarEmprestimo(emprestimos[emprestimoADeletar].id);
            fetchEmprestimos();
            setDeleteConfirmationModalIsOpen(false);
            setEmprestimoADeletar(null);
        } catch (error) {
            alert(error);
        }
    };

    const handleEditEmprestimo = (index) => {
        const emprestimo = emprestimos[index];
        setNovoEmprestimo({ ...emprestimo });
        setSelectedEmprestimoIndex(index);
        setSelectedExemplares(emprestimo.exemplares || []);
        setErrors({});
        setModalIsOpen(true);
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
        setNovoEmprestimo({ id: '', exemplares: [], aluno: { id: 0, nome: '', email: '', ra: 0, telefone: 0 }, dataEmprestimo: '', dataPrazo: '' });
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
                                <th>Nome dos exemplares</th>
                                <th>Nome do aluno</th>
                                <th>Data do empréstimo</th>
                                <th>Data Prazo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emprestimos.map((emprestimo, index) => (
                                <tr key={index} className="table-row">
                                    <td className="table-row-text">{emprestimo.id}</td>
                                    <td className="table-row-text">{emprestimo.exemplares}</td>
                                    <td className="table-row-text">{emprestimo.aluno}</td>
                                    <td className="table-row-text">{emprestimo.dataEmprestimo}</td>
                                    <td className="table-row-text">{emprestimo.dataPrazo}</td>
                                    <td className="table-row-text">
                                        <button className="edit-button" onClick={() => { handleEditEmprestimo(index); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M16 5L19 8M20.385 6.585C20.7788 6.19115 21.0001 5.65698 21.0001 5.1C21.0001 4.54302 20.7788 4.00885 20.385 3.615C19.9912 3.22115 19.457 2.99989 18.9 2.99989C18.343 2.99989 17.8088 3.22115 17.415 3.615L9 12V15H12L20.385 6.585Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                        <button className="delete-button" onClick={() => handleDeleteEmprestimo(index)}>
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
                                        {exemplares.map((exemplar) => (
                                            <option key={exemplar.id} value={exemplar.id}>
                                                {exemplar.titulo.nome}
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
                                value={novoEmprestimo.dataEmprestimo}
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
                                value={novoEmprestimo.dataPrazo}
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
                        <h2>Tem certeza que deseja deletar este aluno?</h2>
                        <button onClick={confirmDeleteEmprestimo}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GerenciarEmprestimos;
