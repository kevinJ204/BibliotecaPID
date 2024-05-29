import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Usuarios.css';

const GerenciarEmprestimos = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um Empréstimo...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [novoUsuario, setNovoUsuario] = useState({ codigo: '', dataEmprestimo: '', dataDevolucao: '', titulo: '' });
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const handleAddUsuario = () => {
        const hoje = new Date();
        const dataEmprestimo = new Date(novoUsuario.dataEmprestimo);
        const dataDevolucao = new Date(novoUsuario.dataDevolucao);

        // Verifica se a data de empréstimo é igual ao dia atual
        if (dataEmprestimo.toDateString() !== hoje.toDateString()) {
            alert("A data de empréstimo deve ser hoje.");
            return;
        }

        // Verifica se a data de devolução é no mínimo um dia após a data de empréstimo
        if (dataDevolucao <= dataEmprestimo) {
            alert("A data de devolução deve ser posterior à data de empréstimo.");
            return;
        }

        setUsuarios([...usuarios, novoUsuario]);
        setNovoUsuario({ codigo: '', dataEmprestimo: '', dataDevolucao: '', titulo: '' }); // Limpar os campos do novo usuário
        setModalIsOpen(false); // Fechar o modal após adicionar usuário
    };

    const handleRowClick = (index) => {
        setSelectedRowIndex(index);
    };

    const handleDeleteSelectedUsuario = () => {
        if (selectedRowIndex !== null) {
            const updatedUsuarios = [...usuarios];
            updatedUsuarios.splice(selectedRowIndex, 1);
            setUsuarios(updatedUsuarios);
            setSelectedRowIndex(null);
        }
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleDateChange = (e) => {
        setNovoUsuario({ ...novoUsuario, [e.target.name]: e.target.value });
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.titulo.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div className="home-page">
            <div className="menu-background">
                <div className="logo"></div>
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
                <Link to="/" className="logout-button">
                    SAIR
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
                            onBlur={() => setSearchPlaceholder('Pesquisar um aluno...')}
                        />
                        <span className="search-icon">
                            {/* Coloque o SVG do ícone de pesquisa aqui */}
                        </span>
                    </div>
                    <button className="add-button" onClick={() => setModalIsOpen(true)}>NOVO +</button>
                    <button className="delete-button" onClick={handleDeleteSelectedUsuario}>EXCLUIR</button>
                </div>

                <div className="table-background">
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Data de Empréstimo</th>
                                <th>Data de Devolução</th>
                                <th>Título</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map((usuario, index) => (
                                <tr key={index} className={`table-row ${selectedRowIndex === index ? 'selected' : ''}`} onClick={() => handleRowClick(index)}>
                                    <td className="table-row-text">{usuario.codigo}</td>
                                    <td className="table-row-text">{usuario.dataEmprestimo}</td>
                                    <td className="table-row-text">{usuario.dataDevolucao}</td>
                                    <td className="table-row-text">{usuario.titulo}</td>
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
                        <h2>Registrar Novo Emprestimo</h2>
                        <div>
                            <input type="text" placeholder="Código" value={novoUsuario.codigo} onChange={(e) => setNovoUsuario({ ...novoUsuario, codigo: e.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="dataEmprestimo">Data de Empréstimo:</label>
                            <input type="date" name="dataEmprestimo" value={novoUsuario.dataEmprestimo} onChange={handleDateChange} />
                        </div>
                        <div>
                            <label htmlFor="dataDevolucao">Data de Devolução:</label>
                            <input type="date" name="dataDevolucao" value={novoUsuario.dataDevolucao} onChange={handleDateChange} />
                        </div>
                        <div>
                            <input type="text" placeholder="Título" value={novoUsuario.titulo} onChange={(e) => setNovoUsuario({ ...novoUsuario, titulo: e.target.value })} />
                        </div>
                        <div>
                            <button onClick={() => setModalIsOpen(false)}>Cancelar</button>
                            <button onClick={handleAddUsuario}>Registrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarEmprestimos;
