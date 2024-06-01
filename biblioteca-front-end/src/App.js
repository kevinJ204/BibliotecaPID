import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componentes/login.jsx';
import Home from './componentes/Home.jsx';
import GerenciarUsuarios from './componentes/GerenciarUsuarios.jsx'
import GerenciarAlunos from './componentes/GerenciarAlunos.jsx';
import GerenciarTitulos from './componentes/GerenciarTitulos.jsx';
import GerenciarAutores from './componentes/GerenciarAutores.jsx';
import GerenciarExemplares from './componentes/GerenciarExemplares.jsx'
import GerenciarEmprestimos from './componentes/GerenciarEmpréstimos.jsx'
import GerenciarGeneros from './componentes/GerenciarGeneros.jsx';


import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/GerenciarUsuarios" element={<GerenciarUsuarios />} />
          <Route path="/GerenciarAlunos" element={<GerenciarAlunos />} />
          <Route path="/GerenciarTitulos" element={<GerenciarTitulos />} />
          <Route path="/GerenciarAutores" element={<GerenciarAutores />} />
          <Route path="/GerenciarExemplares" element={<GerenciarExemplares />} />
          <Route path="/GerenciarEmprestimos" element={<GerenciarEmprestimos />} />
          <Route path="/GerenciarGeneros" element={<GerenciarGeneros />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
