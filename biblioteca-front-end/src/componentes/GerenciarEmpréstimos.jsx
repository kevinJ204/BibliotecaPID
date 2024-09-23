import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './Logo.png';
import './Usuarios.css';
import EmprestimoServico from '../servicos/EmprestimoServico';
import GeneroServico from '../servicos/GeneroServico';
import AlunoServico from '../servicos/AlunoServico';
import ExemplarServico from '../servicos/ExemplarServico';

const GerenciarEmprestimos = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um Empréstimo...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [emprestimos, setEmprestimos] = useState([]);
    const [novoEmprestimo, setNovoEmprestimo] = useState({ id: '', nomeexemplar: '', nomealuno: '', dataemprestimo: '', dataentrega: '' });
    const [selectedEmprestimoIndex, setSelectedEmprestimoIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [emprestimoADeletar, setEmprestimoADeletar] = useState(null);
    const [loading, setLoading] = useState(false); // Spinner loading
    const [generos, setGeneros] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [exemplares, setExemplares] = useState([]);
    const generoServico = new GeneroServico();
    const alunoServico = new AlunoServico();
    const exemplarServico = new ExemplarServico();
    const emprestimoServico = new EmprestimoServico();

    useEffect(() => {
        fetchEmprestimos();
    }, []);

    const fetchEmprestimos = async () => {
        try {
            setLoading(true);  // Show spinner
            const dados = await emprestimoServico.obterEmprestimos();
            setEmprestimos(dados);
            setLoading(false);  // Hide spinner
        } catch (error) {
            alert('Erro ao buscar empréstimos: ' + error);
            setLoading(false);  // Hide spinner on error
        }
    };

    useEffect(() => {
        if (searchValue) {
            emprestimoServico.obterEmprestimoPorIdOuNome(searchValue)
                .then(setEmprestimos)
                .catch(error => alert('Erro ao buscar empréstimos: ' + error));
        } else {
            fetchEmprestimos();
        }
    }, [searchValue]);

    useEffect(() => {
        fetchGeneros();
        fetchAlunos();
        fetchExemplares();
    }, []);

    const fetchGeneros = async () => {
        try {
            const dados = await generoServico.obterGeneros();
            setGeneros(dados);
        } catch (error) {
            alert('Erro ao buscar gêneros: ' + error);
        }
    };

    const fetchAlunos = async () => {
        try {
            setLoading(true);  // Show spinner
            const dados = await alunoServico.obterAlunos();
            setAlunos(dados);
            setLoading(false);  // Hide spinner
        } catch (error) {
            alert('Erro ao buscar alunos: ' + error);
            setLoading(false);  // Hide spinner on error
        }
    };

    const fetchExemplares = async () => {
        try {
            setLoading(true);  // Show spinner
            const dados = await exemplarServico.obterExemplares();
            setExemplares(dados);
            setLoading(false);  // Hide spinner
        } catch (error) {
            alert('Erro ao buscar exemplares: ' + error);
            setLoading(false);  // Hide spinner on error
        }
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
                setNovoEmprestimo({ id: '', nomeexemplar: '', nomealuno: '', dataemprestimo: '', dataentrega: '' });
                setModalIsOpen(false);
                setConfirmationModalIsOpen(true);
            } catch (error) {
                alert(error);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleChange = (field, value) => {
        setNovoEmprestimo({ ...novoEmprestimo, [field]: value });
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
        setErrors({});
        setModalIsOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {};
        if (novoEmprestimo.nomeexemplar.length < 3) {
            newErrors.nomeexemplar = 'Nome do exemplar deve ter mais que 3 letras.';
        }
        if (novoEmprestimo.nomealuno.length < 3) {
            newErrors.nomealuno = 'Nome do aluno deve ter mais que 3 letras.';
        }
        let date1 = novoEmprestimo.dataemprestimo;
        let date2 = novoEmprestimo.dataentrega;
        if (date1 > date2) {
            newErrors.dataemprestimo = 'A data de empréstimo não pode ser depois da data de entrega.';
        }
        return newErrors;
    };

    const validateField = (field, value) => {
        const newErrors = { ...errors };
        if (field === 'nomeexemplar') {
            if (value.length < 3) {
                newErrors.nomeexemplar = 'Nome do exemplar deve ter no mínimo 3 caracteres';
            } else {
                delete newErrors.nomeexemplar;
            }
        }
        if (field === 'nomealuno') {
            if (value.length < 3) {
                newErrors.nomealuno = 'Nome do aluno deve ter no mínimo 3 caracteres';
            } else {
                delete newErrors.nomealuno;
            }
        }
        if (field === 'dataemprestimo' || field === 'dataentrega') {
            let date1 = novoEmprestimo.dataemprestimo;
            let date2 = novoEmprestimo.dataentrega;
            if (date1 > date2) {
                newErrors.dataemprestimo = 'A data de empréstimo não pode ser depois da data de entrega.';
            } else {
                delete newErrors.dataemprestimo;
            }
        }
        setErrors(newErrors);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setErrors({});
        setNovoEmprestimo({ id: '', nomeexemplar: '', nomealuno: '', dataemprestimo: '', dataentrega: '' });
        setSelectedEmprestimoIndex(null);
    };

    return (
        <div className="home-page">
            <div className="menu-background">
                <div className="logo-container">
                    <img src={logoImage} alt="Logo" className="logo" />
                </div>
                <div className="menu-options">
                    <Link to="/GerenciarUsuarios" className="menu-option">Gerenciar Usuários</Link>
                    <Link to="/GerenciarAlunos" className="menu-option">Gerenciar Alunos</Link>
                    <Link to="/GerenciarTitulos" className="menu-option">Gerenciar Títulos</Link>
                    <Link to="/GerenciarAutores" className="menu-option">Gerenciar Autores</Link>
                    <Link to="/GerenciarExemplares" className="menu-option">Gerenciar Exemplares</Link>
                    <Link to="/GerenciarEmprestimos" className="menu-option">Gerenciar Empréstimos</Link>
                    <Link to="/GerenciarGeneros" className="menu-option">Gerenciar Gêneros</Link>
                </div>
            </div>

            <div className="content-background">
                <h1 className="page-title">Gerenciamento de Empréstimos</h1>

                {loading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="table-background">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome dos exemplares</th>
                                    <th>Nome do aluno</th>
                                    <th>Data do empréstimo</th>
                                    <th>Data da entrega</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emprestimos.map((emprestimo, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="table-row-text">{emprestimo.id}</td>
                                        <td className="table-row-text">{emprestimo.nomeexemplar}</td>
                                        <td className="table-row-text">{emprestimo.nomealuno}</td>
                                        <td className="table-row-text">{emprestimo.dataemprestimo}</td>
                                        <td className="table-row-text">{emprestimo.dataentrega}</td>
                                        <td className="table-row-text">
                                            <button className="edit-button" onClick={() => handleEditEmprestimo(index)}>
                                                Editar
                                            </button>
                                            <button className="delete-button" onClick={() => handleDeleteEmprestimo(index)}>
                                                Deletar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{selectedEmprestimoIndex !== null ? 'Editar Emprestimo' : 'Adicionar Novo Emprestimo'}</h2>
                        <div>
                            <input
                                type="text"
                                placeholder="Nomes dos exemplares"
                                id="nomeexemplar"
                                value={novoEmprestimo.nomeexemplar}
                                onChange={(e) => handleChange('nomeexemplar', e.target.value)}
                            />
                            {errors.nomeexemplar && <div className="error">{errors.nomeexemplar}</div>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Nome do aluno"
                                id="nomealuno"
                                value={novoEmprestimo.nomealuno}
                                onChange={(e) => handleChange('nomealuno', e.target.value)}
                            />
                            {errors.nomealuno && <div className="error">{errors.nomealuno}</div>}
                        </div>
                        <div>
                            <small>Data do empréstimo</small>
                            <input
                                type="date"
                                placeholder="Data do empréstimo"
                                id="dataemprestimo"
                                value={novoEmprestimo.dataemprestimo}
                                onChange={(e) => handleChange('dataemprestimo', e.target.value)}
                            />
                            {errors.dataemprestimo && <div className="error">{errors.dataemprestimo}</div>}
                        </div>
                        <div>
                            <small>Data da entrega</small>
                            <input
                                type="date"
                                placeholder="Data do empréstimo"
                                id="dataentrega"
                                value={novoEmprestimo.dataentrega}
                                onChange={(e) => handleChange('dataentrega', e.target.value)}
                            />
                            {errors.dataentrega && <div className="error">{errors.dataentrega}</div>}
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
