import express from 'express';
import process from 'process';
import path from 'path';
import session from 'express-session';
import rotaUsuario from "./Rotas/rotaUsuario.js";
import rotaAluno from "./Rotas/rotaAluno.js";
import rotaTitulo from "./Rotas/rotaTitulo.js";
import rotaGenero from "./Rotas/rotaGenero.js";
import rotaAutor from "./Rotas/rotaAutor.js";
import cookieParser from 'cookie-parser';


const host='localhost';
const porta = 3001;

const app = express();
app.use(express.json()); 
app.use(cookieParser());

app.use((req, res, next) => {
    res.cookie('SameSite', 'None', {
        secure: true,
        sameSite: 'None'
    });
    next();
});

app.use(express.urlencoded({extended: true}));

app.use('/usuarios',rotaUsuario);
app.use('/alunos',rotaAluno);
app.use('/titulos',rotaTitulo);
app.use('/generos',rotaGenero);
app.use('/autores',rotaAutor);

app.use(session({
    secret: 'chaveSecreta',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60 * 1000 * 30
    }
}))

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
});

app.use(express.static(path.join(process.cwd(), 'build')));
//app.use(autenticar, express.static(path.join(process.cwd(), 'privado')));

app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
})