
import { Router } from 'express';
import EmprestimoCtrl from '../Controles/emprestimoCtrl.js';

const rotaEmprestimo = new Router();
const empCtrl = new EmprestimoCtrl();

rotaEmprestimo
.get('/', empCtrl.consultar)
.get('/:termo', empCtrl.consultar)
.post('/', empCtrl.gravar)
.put('/:id', empCtrl.atualizar)
.patch('/:id', empCtrl.atualizar)
.delete('/:id', empCtrl.excluir);


export default rotaEmprestimo;