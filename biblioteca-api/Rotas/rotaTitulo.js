import { Router } from 'express';
import TituloCtrl from '../Controles/tituloCtrl.js';
import MiddlewareAutenticacao from '../Seguranca/MiddlewareAutenticacao.js';

const rotaTitulo = new Router();
const titCtrl = new TituloCtrl();

rotaTitulo
    .get('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('titulo'), 
        titCtrl.consultar)
    .get('/:termo', 
        MiddlewareAutenticacao.verificarNivelAcesso('titulo'), 
        titCtrl.consultar)
    .post('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('titulo'), 
        titCtrl.gravar)
    .put('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('titulo'), 
        titCtrl.atualizar)
    .patch('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('titulo'), 
        titCtrl.atualizar)
    .delete('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('titulo'), 
        titCtrl.excluir);

export default rotaTitulo;
