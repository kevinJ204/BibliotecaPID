
import { Router } from 'express';
import TituloCtrl from '../Controles/tituloCtrl.js';

const rotaTitulo = new Router();
const titCtrl = new TituloCtrl();

rotaTitulo
.get('/', titCtrl.consultar)
.get('/:termo', titCtrl.consultar)
.post('/', titCtrl.gravar)
.put('/:id', titCtrl.atualizar)
.patch('/:id', titCtrl.atualizar)
.delete('/:id', titCtrl.excluir);


export default rotaTitulo;