
import { Router } from 'express';
import GeneroCtrl from '../Controles/generoCtrl.js';

const rotaGenero = new Router();
const genCtrl = new GeneroCtrl();

rotaGenero
.get('/', genCtrl.consultar)
.get('/:termo', genCtrl.consultar)
.post('/', genCtrl.gravar)
.put('/:id', genCtrl.atualizar)
.patch('/:id', genCtrl.atualizar)
.delete('/:id', genCtrl.excluir);


export default rotaGenero;