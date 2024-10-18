import { Router } from 'express';
import AlunoCtrl from '../Controles/alunoCtrl.js';
import MiddlewareAutenticacao from '../Seguranca/MiddlewareAutenticacao.js';

const rotaAluno = new Router();
const aluCtrl = new AlunoCtrl();

rotaAluno
    .get('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('aluno'), 
        aluCtrl.consultar)
    .get('/:termo', 
        MiddlewareAutenticacao.verificarNivelAcesso('aluno'), 
        aluCtrl.consultar)
    .post('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('aluno'), 
        aluCtrl.gravar)
    .put('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('aluno'), 
        aluCtrl.atualizar)
    .patch('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('aluno'), 
        aluCtrl.atualizar)
    .delete('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('aluno'), 
        aluCtrl.excluir);

export default rotaAluno;
