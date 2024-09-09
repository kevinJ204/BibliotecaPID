import { Router } from 'express';
import AuthCtrl from '../Controles/authCtrl.js';

const rotaAuth = new Router();

rotaAuth.post('/login', AuthCtrl.login);
rotaAuth.get('/login', AuthCtrl.logout);


export default rotaAuth;
