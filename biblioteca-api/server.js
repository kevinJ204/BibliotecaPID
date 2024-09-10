import express from 'express';
import process from 'process';
import path from 'path';
import session from 'express-session';
import rotaUsuario from "./Rotas/rotaUsuario.js";
import rotaAluno from "./Rotas/rotaAluno.js";
import rotaTitulo from "./Rotas/rotaTitulo.js";
import rotaGenero from "./Rotas/rotaGenero.js";
import rotaAutor from "./Rotas/rotaAutor.js";
import rotaAuth from "./Rotas/rotaAuth.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { verificarAutenticacao } from './Controles/authCtrl.js';
import flash from 'connect-flash';

dotenv.configDotenv();

const host = 'localhost';
const porta = 3001;

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(session({
    secret: process.env.CHAVE_SECRETA,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
        sameSite: 'none'
    }
}));

app.use(flash());

app.use(express.urlencoded({ extended: true }));

app.use('/usuarios', verificarAutenticacao, rotaUsuario);
app.use('/alunos', verificarAutenticacao, rotaAluno);
app.use('/titulos', verificarAutenticacao, rotaTitulo);
app.use('/generos', verificarAutenticacao, rotaGenero);
app.use('/autores', verificarAutenticacao, rotaAutor);
app.use('/auth', rotaAuth);

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
});

app.use(express.static(path.join(process.cwd(), 'build')));

app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
});
