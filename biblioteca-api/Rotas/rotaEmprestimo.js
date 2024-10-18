import { Router } from 'express';
import EmprestimoCtrl from '../Controles/emprestimoCtrl.js';
import MiddlewareAutenticacao from '../Seguranca/MiddlewareAutenticacao.js';

const rotaEmprestimo = new Router();
const empCtrl = new EmprestimoCtrl();

rotaEmprestimo
    .get('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('emprestimo'), 
        empCtrl.consultar)
    .get('/:termo', 
        MiddlewareAutenticacao.verificarNivelAcesso('emprestimo'), 
        empCtrl.consultar)
    .post('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('emprestimo'), 
        empCtrl.gravar)
    .put('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('emprestimo'), 
        empCtrl.atualizar)
    .patch('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('emprestimo'), 
        empCtrl.atualizar)
    .delete('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('emprestimo'), 
        empCtrl.excluir);

export default rotaEmprestimo;
