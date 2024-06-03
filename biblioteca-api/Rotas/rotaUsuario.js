
import { Router } from 'express';
import UsuarioCtrl from '../Controles/usuarioCtrl.js';

const rotaUsuario = new Router();
const usuCtrl = new UsuarioCtrl();

rotaUsuario
.get('/', usuCtrl.consultar)
.get('/:termo', usuCtrl.consultar)
.post('/', usuCtrl.gravar)
.put('/:id', usuCtrl.atualizar)
.patch('/:id', usuCtrl.atualizar)
.delete('/:id', usuCtrl.excluir);


export default rotaUsuario;