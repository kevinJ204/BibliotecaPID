import { Router } from 'express';
import GeneroCtrl from '../Controles/generoCtrl.js';
import MiddlewareAutenticacao from '../Seguranca/MiddlewareAutenticacao.js';

const rotaGenero = new Router();
const genCtrl = new GeneroCtrl();

rotaGenero
    .get('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('genero'), 
        genCtrl.consultar)
    .get('/:termo', 
        MiddlewareAutenticacao.verificarNivelAcesso('genero'), 
        genCtrl.consultar)
    .post('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('genero'), 
        genCtrl.gravar)
    .put('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('genero'), 
        genCtrl.atualizar)
    .patch('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('genero'), 
        genCtrl.atualizar)
    .delete('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('genero'), 
        genCtrl.excluir);

export default rotaGenero;
