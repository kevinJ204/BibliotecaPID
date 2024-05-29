import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componentes/login';
import Home from './componentes/Home';
import GerenciarUsuarios from './componentes/GerenciarUsuarios'
import GerenciarAlunos from './componentes/GerenciarAlunos';
import GerenciarTitulos from './componentes/GerenciarTitulos';
import GerenciarAutores from './componentes/GerenciarAutores';
import GerenciarExemplares from './componentes/GerenciarExemplares'
import GerenciarEmprestimos from './componentes/GerenciarEmpréstimos'
import GerenciarGeneros from './componentes/GerenciarGeneros';


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
