import express from 'express';
import process from 'process';
import path from 'path';
import session from 'express-session';
import rotaUsuario from './Rotas/rotaUsuario.js';
import rotaAluno from './Rotas/rotaAluno.js';
import rotaTitulo from './Rotas/rotaTitulo.js';
import rotaGenero from './Rotas/rotaGenero.js';
import rotaAutor from './Rotas/rotaAutor.js';
import rotaExemplar from './Rotas/rotaExemplar.js';
import rotaEmprestimo from './Rotas/rotaEmprestimo.js';
import rotaAuth from './Rotas/rotaAuth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import { verificarAutenticacao } from './Controles/authCtrl.js';

dotenv.configDotenv();

const host = 'localhost';
const porta = 3001;

const __dirname = path.resolve();
const key = fs.readFileSync(path.join(__dirname, 'certs', 'chave.key'));
const cert = fs.readFileSync(path.join(__dirname, 'certs', 'certificado.crt'));

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'https://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(session({
    secret: process.env.CHAVE_SECRETA,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
        sameSite: 'none'
    }
}));

app.use(express.urlencoded({ extended: true }));

app.use('/usuarios', verificarAutenticacao, rotaUsuario);
app.use('/alunos', verificarAutenticacao, rotaAluno);
app.use('/titulos', verificarAutenticacao, rotaTitulo);
app.use('/generos', verificarAutenticacao, rotaGenero);
app.use('/autores', verificarAutenticacao, rotaAutor);
app.use('/exemplares', verificarAutenticacao, rotaExemplar);
app.use('/emprestimos', verificarAutenticacao, rotaEmprestimo);
app.use('/auth', rotaAuth);

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
});

app.use(express.static(path.join(process.cwd(), 'build')));

const httpsOptions = {
    key: key,
    cert: cert
};

https.createServer(httpsOptions, app).listen(porta, host, () => {
    console.log(`Servidor escutando em https://${host}:${porta}`);
});
