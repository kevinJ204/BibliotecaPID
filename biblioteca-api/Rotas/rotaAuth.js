import { Router } from 'express';
import AuthCtrl from '../Controles/authCtrl.js';

const rotaAuth = new Router();

rotaAuth.get('/usuario-logado', AuthCtrl.obterUsuarioLogado);
rotaAuth.post('/login', AuthCtrl.login);
rotaAuth.get('/logout', AuthCtrl.logout);


export default rotaAuth;
