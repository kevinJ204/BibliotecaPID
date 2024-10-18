import { Router } from 'express';
import UsuarioCtrl from '../Controles/usuarioCtrl.js';
import MiddlewareAutenticacao from '../Seguranca/MiddlewareAutenticacao.js';

const rotaUsuario = new Router();
const usuCtrl = new UsuarioCtrl();

rotaUsuario
    .get('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('usuario'), 
        usuCtrl.consultar)
    .get('/:termo', 
        MiddlewareAutenticacao.verificarNivelAcesso('usuario'), 
        usuCtrl.consultar)
    .post('/', 
        MiddlewareAutenticacao.verificarNivelAcesso('usuario'), 
        usuCtrl.gravar)
    .put('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('usuario'), 
        usuCtrl.atualizar)
    .patch('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('usuario'), 
        usuCtrl.atualizar)
    .delete('/:id', 
        MiddlewareAutenticacao.verificarNivelAcesso('usuario'), 
        usuCtrl.excluir);

export default rotaUsuario;