import { Router } from 'express';
import AutorCtrl from '../Controles/autorCtrl.js';
import MiddlewareAutenticacao from '../Seguranca/MiddlewareAutenticacao.js';

const rotaAutor = new Router();
const autCtrl = new AutorCtrl();

rotaAutor
    .get('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('autor'), 
        autCtrl.consultar)
    .get('/:termo', 
        MiddlewareAutenticacao.verificarNivelAcesso('autor'), 
        autCtrl.consultar)
    .post('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('autor'), 
        autCtrl.gravar)
    .put('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('autor'), 
        autCtrl.atualizar)
    .patch('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('autor'), 
        autCtrl.atualizar)
    .delete('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('autor'), 
        autCtrl.excluir);

export default rotaAutor;
