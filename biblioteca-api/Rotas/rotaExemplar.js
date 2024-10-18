import { Router } from 'express';
import ExemplarCtrl from '../Controles/exemplarCtrl.js';
import MiddlewareAutenticacao from '../Seguranca/MiddlewareAutenticacao.js';

const rotaExemplar = new Router();
const exeCtrl = new ExemplarCtrl();

rotaExemplar
    .get('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('exemplar'), 
        exeCtrl.consultar)
    .get('/:termo', 
        MiddlewareAutenticacao.verificarNivelAcesso('exemplar'), 
        exeCtrl.consultar)
    .post('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('exemplar'), 
        exeCtrl.gravar)
    .put('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('exemplar'), 
        exeCtrl.atualizar)
    .patch('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('exemplar'), 
        exeCtrl.atualizar)
    .delete('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('exemplar'), 
        exeCtrl.excluir);

export default rotaExemplar;
