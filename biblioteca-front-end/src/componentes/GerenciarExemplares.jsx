import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './Logo.png';
import './Usuarios.css';
import ExemplarServico from '../servicos/ExemplarServico.js';
import TituloServico from '../servicos/TituloServico.js';

const GerenciarExemplares = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um Exemplar...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [exemplares, setExemplares] = useState([]);
    const [novoExemplar, setnovoExemplar] = useState({ id: 0, codigo: '', titulo: { id: 0, nome: '' }, status: false });
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [titulos, setTitulos] = useState([]); 
    const [loadingTitulos, setLoadingTitulos] = useState(true); 
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const carregarExemplares = async () => {
            const exemplaresData = await ExemplarServico.obterExemplares();
            setExemplares(exemplaresData);
        };

        carregarExemplares();
    }, []);

    useEffect(() => {
        if (searchValue) {
            ExemplarServico.obterExemplarPorIdOuNome(searchValue)
                .then(setExemplares)
                .catch(error => console.error('Erro ao buscar exemplares:', error));
        } else {
            ExemplarServico.obterExemplares()
            .then(setExemplares)
            .catch(error => console.error('Erro ao buscar exemplares:', error));
        }
    }, [searchValue]);

    useEffect(() => {
        const carregarTitulos = async () => {
            try {
                const servico = new TituloServico();
                const titulosObtidos = await servico.obterTitulos();
                setTitulos(titulosObtidos);
                setLoadingTitulos(false);
            } catch (error) {
                console.error("Erro ao carregar títulos:", error);
                setLoadingTitulos(false);
            }
        };

        carregarTitulos();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!novoExemplar.codigo) newErrors.codigo = 'Código é obrigatório';
        if (!novoExemplar.titulo.id) newErrors.titulo = 'Título é obrigatório';
        return newErrors;
    };

    const handleAddExemplar = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const novoExemplarAdicionado = await ExemplarServico.adicionarExemplar(novoExemplar);
            if (novoExemplarAdicionado) {
                setExemplares([...exemplares, novoExemplarAdicionado]);
                setnovoExemplar({ id: 0, codigo: '', titulo: { id: 0, nome: '' }, status: false });
                setModalIsOpen(false);
                setErrors({});
            }
        } catch (error) {
            console.error("Erro ao adicionar exemplar:", error);
        }
    };

    const handleRowClick = (index) => {
        setSelectedRowIndex(index);
    };

    const handleDeleteSelectedExemplar = async () => {
        if (selectedRowIndex !== null) {
            const exemplarSelecionado = exemplares[selectedRowIndex];
            try {
                await ExemplarServico.deletarExemplar(exemplarSelecionado.id);
                const updatedExemplares = [...exemplares];
                updatedExemplares.splice(selectedRowIndex, 1);
                setExemplares(updatedExemplares);
                setSelectedRowIndex(null);
            } catch (error) {
                console.error("Erro ao deletar exemplar", error);
            }
        }
    };

    const handleSearchChange = async (e) => {
        const termo = e.target.value;
        setSearchValue(termo);
        if (termo) {
            const resultadoBusca = await ExemplarServico.obterExemplarPorIdOuNome(termo);
            setExemplares(Array.isArray(resultadoBusca) ? resultadoBusca : [resultadoBusca]);
        } else {
            const exemplaresData = await ExemplarServico.obterExemplares();
            setExemplares(exemplaresData);
        }
    };

    const toggleDevolvido = async (index) => {
        const exemplarSelecionado = exemplares[index];
        const exemplarAtualizado = { ...exemplarSelecionado, status: !exemplarSelecionado.status };
        try {
            await ExemplarServico.atualizarExemplar(exemplarSelecionado.id, exemplarAtualizado);
            const updatedExemplares = exemplares.map((exemplar, i) =>
                i === index ? exemplarAtualizado : exemplar
            );
            setExemplares(updatedExemplares);
        } catch (error) {
            console.error("Erro ao atualizar status do exemplar", error);
        }
    };

    const filteredExemplares = exemplares.filter(exemplar =>
        exemplar.codigo.toLowerCase().includes(searchValue.toLowerCase()) ||
        exemplar.titulo.nome.toLowerCase().includes(searchValue.toLowerCase())
    );

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
                </div>
                <Link to="/" className="logout-button">SAIR</Link>
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
                            onBlur={() => setSearchPlaceholder('Pesquisar um exemplar...')}
                        />
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExemplares.map((exemplar, index) => (
                                <tr key={index} className={`table-row ${selectedRowIndex === index ? 'selected' : ''}`} onClick={() => handleRowClick(index)}>
                                    <td className="table-row-text">{exemplar.id}</td>
                                    <td className="table-row-text">{exemplar.codigo}</td>
                                    <td className="table-row-text">{exemplar.titulo.nome}</td>
                                    <td className="table-row-text" onClick={() => toggleDevolvido(index)}>
                                        {exemplar.status ? 'Devolvido' : 'Emprestado'}
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
                        <span className="close" onClick={() => setModalIsOpen(false)}>&times;</span>
                        <h2>Registrar Novo Exemplar</h2>
                        <div>
                            <input
                                type="text"
                                placeholder="Insira o Código ISBN"
                                value={novoExemplar.codigo}
                                onChange={(e) => setnovoExemplar({ ...novoExemplar, codigo: e.target.value })}
                            />
                            {errors.codigo && <div className="error">{errors.codigo}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="titulo">Título:</label>
                            {loadingTitulos ? (
                                <div>Carregando títulos...</div>
                            ) : (
                                <select
                                    id="titulo"
                                    value={novoExemplar.titulo.id}
                                    onChange={(e) => setnovoExemplar({ ...novoExemplar, titulo: { id: e.target.value, nome: titulos.find(titulo => titulo.id === parseInt(e.target.value)).nome } })}
                                >
                                    <option value="">Selecione um título</option>
                                    {titulos.map(titulo => (
                                        <option key={titulo.id} value={titulo.id}>{titulo.nome}</option>
                                    ))}
                                </select>
                            )}
                            {errors.titulo && <div className="error">{errors.titulo}</div>}
                        </div>
                        <button onClick={handleAddExemplar}>Adicionar Exemplar</button>
                    </div>
                </div>
            )}

            <button className="delete-button" onClick={handleDeleteSelectedExemplar}>Excluir Exemplar Selecionado</button>
        </div>
    );
};

export default GerenciarExemplares;
