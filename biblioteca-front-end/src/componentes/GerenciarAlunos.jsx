import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './Logo.png';
import './Alunos.css';
import InputMask from 'react-input-mask';
import AlunoServico from '../servicos/AlunoServico';

const GerenciarAlunos = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um aluno...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [alunos, setAlunos] = useState([]);
    const [novoAluno, setNovoAluno] = useState({ nome: '', email: '', ra: 0, telefone: 0 });
    const [selectedAlunoIndex, setSelectedAlunoIndex] = useState(null);
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [alunoADeletar, setAlunoADeletar] = useState(null);
    const alunoServico = new AlunoServico();
    const [isLoading, setIsLoading] = useState(true); 

    const hasFetchedAlunos = useRef(false);

    useEffect(() => {
        if (!hasFetchedAlunos.current) {
            fetchAlunos();
            hasFetchedAlunos.current = true;
        }
    }, []);

    const fetchAlunos = async () => {
        setIsLoading(true); 
        const startTime = Date.now();

        try {
            const dados = await alunoServico.obterAlunos();
            const elapsedTime = Date.now() - startTime;
            const minimumDelay = 1000;
            const remainingTime = Math.max(0, minimumDelay - elapsedTime);

            setTimeout(() => {
                if (dados.length > 0 && !dados.message) {
                    setAlunos(dados);
                } else {
                    setAlunos(dados);

                    setConfirmationMessage(dados.message || 'Nenhum aluno encontrado.');
                    setConfirmationModalIsOpen(true);
                }
                setIsLoading(false);
            }, remainingTime);
        } catch (error) {
            alert('Erro ao buscar alunos: ' + error);
            setIsLoading(false);
        }
    };
    

    const hasSearchedAluno = useRef(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchValue && !hasSearchedAluno.current) {
                alunoServico.obterAlunoPorIdOuNome(searchValue)
                    .then((dados) => {
                        if (dados.length > 0 && !dados.message) {
                            setAlunos(dados);
                        } else {
                            setConfirmationMessage(dados.message || 'Nenhum aluno encontrado.');
                            setConfirmationModalIsOpen(true);
                        }
                    })
                    .catch(error => {
                        alert('Erro ao buscar alunos: ' + error);
                    });
                hasSearchedAluno.current = true;
            } else if (!searchValue && hasSearchedAluno.current) {
                fetchAlunos();
                hasSearchedAluno.current = false;
            }
        }, 500);
    
        return () => clearTimeout(delayDebounceFn);
    }, [searchValue]);
    
    const validateForm = () => {
        const newErrors = {};
        const telefoneNumerico = novoAluno.telefone.toString().replace(/\D/g, '');    
        if (novoAluno.nome.length < 3) newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
        if (!/\S+@\S+\.\S+/.test(novoAluno.email)) newErrors.email = 'Formato de email inválido';
        if (!/^\d+$/.test(novoAluno.ra)) newErrors.ra = 'RA deve conter apenas números';
        if (telefoneNumerico.length !== 11) newErrors.telefone = 'Telefone deve ter 11 dígitos';
        return newErrors;
    };
    
    const validateField = (field, value) => {
        const newErrors = { ...errors };
        const telefoneNumerico = value.replace(/\D/g, ''); 
        if (field === 'nome') {
            if (value.length < 3) {
                newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
            } else {
                delete newErrors.nome;
            }
        } else if (field === 'email') {
            if (!/\S+@\S+\.\S+/.test(value)) {
                newErrors.email = 'Formato de email inválido';
            } else {
                delete newErrors.email;
            }
        } else if (field === 'ra') {
            if (!/^\d+$/.test(value)) {
                newErrors.ra = 'RA deve conter apenas números';
            } else {
                delete newErrors.ra;
            }
        } else if (field === 'telefone') {
            if (telefoneNumerico.length !== 11) {
                newErrors.telefone = 'Telefone deve ter 11 dígitos';
            } else {
                delete newErrors.telefone;
            }
        }
        setErrors(newErrors);
    };
    
    const handleChange = (field, value) => {
        if (field === 'telefone') {
            value = value.replace(/\D/g, '');
        }
        setNovoAluno({ ...novoAluno, [field]: value });
        validateField(field, value);
    };

    const handleAddAluno = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                let resposta;
                if (selectedAlunoIndex !== null) {
                    resposta = await alunoServico.atualizarAluno(alunos[selectedAlunoIndex].id, novoAluno);
                    setSelectedAlunoIndex(null);
                } else {
                    resposta = await alunoServico.adicionarAluno(novoAluno);
                }
                if (resposta && resposta.status === true) {
                    setConfirmationMessage(selectedAlunoIndex !== null ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso');
                } else {
                    setConfirmationMessage(resposta.message || 'Erro ao salvar aluno!');
                }
                fetchAlunos();
                setNovoAluno({ nome: '', email: '', ra: 0, telefone: 0 });
                setModalIsOpen(false);
                setConfirmationModalIsOpen(true);
            } catch (error) {
                alert('Erro ao salvar aluno: ' + error);
            }
        } else {
            setErrors(newErrors);
        }
    };
    
    const handleDeleteAluno = (index) => {
        setAlunoADeletar(index);
        setDeleteConfirmationModalIsOpen(true);
    };

    const confirmDeleteAluno = async () => {
        try {
            const resposta = await alunoServico.deletarAluno(alunos[alunoADeletar].id);
            if (resposta && resposta.status === true) {
                fetchAlunos();
            } else {
                setConfirmationMessage(resposta.message || 'Erro ao deletar aluno!');
                setConfirmationModalIsOpen(true);
            }
            setDeleteConfirmationModalIsOpen(false);
            setAlunoADeletar(null);
        } catch (error) {
            alert('Erro ao deletar aluno: ' + error);
        }
    };

    const handleEditAluno = (index) => {
        setNovoAluno(alunos[index]);
        setSelectedAlunoIndex(index);
        setErrors({});
        setModalIsOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setErrors({});
        setNovoAluno({ nome: '', email: '', ra: '', telefone: '' });
        setSelectedAlunoIndex(null);
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
                <h1 className="page-title">Gerenciamento de Alunos</h1>
                <div className="search-add">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="search-box"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={() => setSearchPlaceholder('')}
                            onBlur={() => setSearchPlaceholder('Pesquisar um aluno...')}
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
                                <th>Email</th>
                                <th>RA</th>
                                <th>Telefone</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="loading-container">
                                    <div className="spinner"></div>
                                    <p>Carregando Dados de Alunos...</p>
                                </td>
                            </tr>
                        ) : (
                            alunos.map((aluno, index) => (
                                <tr key={index} className="table-row">
                                    <td className="table-row-text">{aluno.id}</td>
                                    <td className="table-row-text">{aluno.nome}</td>
                                    <td className="table-row-text">{aluno.email}</td>
                                    <td className="table-row-text">{aluno.ra}</td>
                                    <td className="table-row-text">{aluno.telefone}</td>
                                    <td className="table-row-text">
                                    <button className="edit-button" onClick={() => handleEditAluno(index)}>
                                            <span className="edit-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M16 5L19 8M20.385 6.585C20.7788 6.19115 21.0001 5.65698 21.0001 5.1C21.0001 4.54302 20.7788 4.00885 20.385 3.615C19.9912 3.22115 19.457 2.99989 18.9 2.99989C18.343 2.99989 17.8088 3.22115 17.415 3.615L9 12V15H12L20.385 6.585Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </span>
                                        </button>
                                        <button className="delete-button" onClick={() => handleDeleteAluno(index)}>
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
                        <h2>{selectedAlunoIndex !== null ? 'Editar Aluno' : 'Adicionar Novo Aluno'}</h2>
                        <div>
                            <input 
                            type="text" 
                            placeholder="Nome" 
                            value={novoAluno.nome} 
                            onChange={(e) => handleChange('nome', e.target.value)} 
                            />
                            {errors.nome && <div className="error">{errors.nome}</div>}
                        </div>
                        <div>
                            <input type="email" placeholder="Email" value={novoAluno.email} onChange={(e) => handleChange('email', e.target.value )} />
                            {errors.email && <div className="error">{errors.email}</div>}
                        </div>
                        <div>
                            <input type="number" placeholder="RA" value={novoAluno.ra} onChange={(e) => handleChange('ra', e.target.value )} />
                            {errors.ra && <div className="error">{errors.ra}</div>}
                        </div>
                        <div>
                            <InputMask
                                mask="(99) 99999-9999"
                                value={novoAluno.telefone}
                                onChange={(e) => handleChange('telefone', e.target.value)}
                            >
                                {(inputProps) => <input {...inputProps} type="text" />}
                            </InputMask>
                            {errors.telefone && <div className="error">{errors.telefone}</div>}
                        </div>
                        <div>
                            <button className="cancel" onClick={closeModal}>Cancelar</button>
                            <button className="add" onClick={handleAddAluno} disabled={Object.keys(errors).length > 0}>
                                {selectedAlunoIndex !== null ? 'Salvar' : 'Adicionar'}
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
                        <button onClick={confirmDeleteAluno}>Confirmar</button>
                        <button onClick={() => setDeleteConfirmationModalIsOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarAlunos;
