
import { Router } from 'express';
import ExemplarCtrl from '../Controles/exemplarCtrl.js';

const rotaExemplar = new Router();
const exeCtrl = new ExemplarCtrl();

rotaExemplar
.get('/', exeCtrl.consultar)
.get('/:termo', exeCtrl.consultar)
.post('/', exeCtrl.gravar)
.put('/:id', exeCtrl.atualizar)
.patch('/:id', exeCtrl.atualizar)
.delete('/:id', exeCtrl.excluir);


export default rotaExemplar;