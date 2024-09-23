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
    const [novoExemplar, setnovoExemplar] = useState({ id: 0, codigo: '', titulo: '', status: false });
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [titulos, setTitulos] = useState([]); // Estado para armazenar os títulos
    const [loadingTitulos, setLoadingTitulos] = useState(true); // Estado de carregamento dos títulos
    const [errors, setErrors] = useState({}); // Estado para gerenciar erros

    useEffect(() => {
        const carregarExemplares = async () => {
            const exemplaresData = await ExemplarServico.obterExemplares();
            setExemplares(exemplaresData);
        };

        carregarExemplares();
    }, []);

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

    const handleAddExemplar = async () => {
        // Validar os dados do novo exemplar antes de adicionar
        const validationErrors = {};
        if (!novoExemplar.codigo) {
            validationErrors.codigo = "O código é obrigatório.";
        }
        if (!novoExemplar.titulo) {
            validationErrors.titulo = "O título é obrigatório.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Não prossegue se houver erros
        }

        setExemplares([...exemplares, novoExemplar]);
        setnovoExemplar({ id: 0, codigo: '', titulo: '', status: false });
        setModalIsOpen(false);
        setErrors({}); // Limpar erros ao adicionar    
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

    const toggleDevolvido = (index) => {
        const exemplarSelecionado = exemplares[index];
        const exemplarAtualizado = { ...exemplarSelecionado, status: !exemplarSelecionado.status };
        ExemplarServico.atualizarExemplar(exemplarSelecionado.id, exemplarAtualizado).then(() => {
            const updatedExemplares = exemplares.map((exemplar, i) =>
                i === index ? exemplarAtualizado : exemplar
            );
            setExemplares(updatedExemplares);
        }).catch(error => console.error("Erro ao atualizar status do exemplar", error));
    };

    const filteredExemplares = exemplares.filter(exemplar =>
        exemplar.codigo.toLowerCase().includes(searchValue.toLowerCase()) ||
        exemplar.titulo.toLowerCase().includes(searchValue.toLowerCase())
    );

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
                        <Link to="/GerenciarAutores" className="menu-option">Gerenciar Autores</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarExemplares" className="menu-option">Gerenciar Exemplares</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarEmprestimos" className="menu-option">Gerenciar empréstimos</Link>
                    </div>
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExemplares.map((exemplar, index) => (
                                <tr key={index} className={`table-row ${selectedRowIndex === index ? 'selected' : ''}`} onClick={() => handleRowClick(index)}>
                                    <td className="table-row-text">{exemplar.id}</td>
                                    <td className="table-row-text">{exemplar.codigo}</td>
                                    <td className="table-row-text">{exemplar.titulo}</td>
                                    <td className="table-row-text" onClick={() => toggleDevolvido(index)}>
                                        {exemplar.status ? 'Devolvido' : 'Emprestado'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalIsOpen(false)}>&times;</span>
                        <h2>Registrar Novo Exemplar</h2>
                        <div>
                            <input type="text" placeholder="Insira o Código ISBN" value={novoExemplar.codigo} onChange={(e) => setnovoExemplar({ ...novoExemplar, codigo: e.target.value })} />
                            {errors.codigo && <div className="error">{errors.codigo}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="titulo">Título:</label>
                            {loadingTitulos ? (
                                <div>Carregando títulos...</div> // Exibir mensagem de carregamento
                            ) : (
                                <select
                                    id="titulo"
                                    value={novoExemplar.titulo}
                                    onChange={(e) => setnovoExemplar({ ...novoExemplar, titulo: e.target.value })}
                                >
                                    <option value="">Selecione um título</option>
                                    {titulos.map((titulo) => (
                                        <option key={titulo.id} value={titulo.nome}>
                                            {titulo.nome}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.titulo && <div className="error">{errors.titulo}</div>}
                        </div>
                        <div>
                            <button type="button" onClick={handleAddExemplar}>Adicionar Exemplar</button>
                            <button type="button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}        
        </div>
    );
};

export default GerenciarExemplares;
