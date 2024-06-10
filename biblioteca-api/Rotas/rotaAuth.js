import { Router } from 'express';
import AuthCtrl from '../Controles/authCtrl.js';

const rotaAuth = new Router();

rotaAuth.post('/login', AuthCtrl.login);

export default rotaAuth;
