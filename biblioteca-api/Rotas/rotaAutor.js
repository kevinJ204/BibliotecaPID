
import { Router } from 'express';
import AutorCtrl from '../Controles/autorCtrl.js';

const rotaAutor = new Router();
const autCtrl = new AutorCtrl();

rotaAutor
.get('/', autCtrl.consultar)
.get('/:termo', autCtrl.consultar)
.post('/', autCtrl.gravar)
.put('/:id', autCtrl.atualizar)
.patch('/:id', autCtrl.atualizar)
.delete('/:id', autCtrl.excluir);


export default rotaAutor;