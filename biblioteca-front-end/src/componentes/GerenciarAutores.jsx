import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Usuarios.css';

const GerenciarAutores = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchPlaceholder, setSearchPlaceholder] = useState("Pesquisar um Autor...");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [novoUsuario, setNovoUsuario] = useState({ id: '', nome: '' });
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const handleAddUsuario = () => {
        setUsuarios([...usuarios, novoUsuario]);
        setNovoUsuario({ id: '', nome: '' }); // Limpar os campos do novo usuário
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

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nome.toLowerCase().includes(searchValue.toLowerCase())
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
                        <Link to="/GerenciarGeneros" className="menu-option">Gerenciar Gêneros</Link>
                    </div>
                    <div>
                        <Link to="/GerenciarAutores" className="menu-option">Gerenciar Autores</Link>
                    </div>
                </div>
                <Link to="/" className="logout-button">
                    SAIR
                </Link>
            </div>
            <div className="content-background">
                <h1 className="page-title">Gerenciamento de Autores</h1>
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
                                <th>ID</th>
                                <th>Nome</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map((usuario, index) => (
                                <tr key={index} className={`table-row ${selectedRowIndex === index ? 'selected' : ''}`} onClick={() => handleRowClick(index)}>
                                    <td className="table-row-text">{usuario.id}</td>
                                    <td className="table-row-text">{usuario.nome}</td>
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
                        <h2>Adicionar Novo Autor</h2>
                        <div>
                            <input type="text" placeholder="ID" value={novoUsuario.id} onChange={(e) => setNovoUsuario({ ...novoUsuario, id: e.target.value })} />
                        </div>
                        <div>
                            <input type="text" placeholder="Nome" value={novoUsuario.nome} onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })} />
                        </div>
                        <div>
                            <button onClick={() => setModalIsOpen(false)}>Cancelar</button>
                            <button onClick={handleAddUsuario}>Adicionar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciarAutores;
