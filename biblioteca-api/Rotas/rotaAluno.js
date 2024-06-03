
import { Router } from 'express';
import AlunoCtrl from '../Controles/alunoCtrl.js';

const rotaAluno = new Router();
const aluCtrl = new AlunoCtrl();

rotaAluno
.get('/', aluCtrl.consultar)
.get('/:termo', aluCtrl.consultar)
.post('/', aluCtrl.gravar)
.put('/:id', aluCtrl.atualizar)
.patch('/:id', aluCtrl.atualizar)
.delete('/:id', aluCtrl.excluir);


export default rotaAluno;