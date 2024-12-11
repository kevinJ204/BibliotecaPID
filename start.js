const { exec } = require('child_process');

exec('npm start', { cwd: './biblioteca-api' }, (erro) => {
    if (erro) {
        console.error(`Erro ao iniciar a API: ${erro}`);
        return;
    }
    console.log('API iniciada com sucesso!');
});

exec('npm start', { cwd: './biblioteca-front-end' }, (erro) => {
    if (erro) {
        console.error(`Erro ao iniciar o Front-end: ${erro}`);
        return;
    }
    console.log('Front-end iniciado com sucesso!');
});
