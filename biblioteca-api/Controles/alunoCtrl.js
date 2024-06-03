import Aluno from "../Modelo/Aluno.js";

export default class AlunoCtrl{

    gravar(requisicao, resposta){

        resposta.type('application/json');

        if(requisicao.method === "POST" && requisicao.is('application/json')){
            const dados = requisicao.body;
            const nome = dados.nome;
            const email = dados.email;
            const ra = dados.ra;
            const telefone = dados.telefone;
        

            if (nome && email && ra && telefone){
                const aluno = new Aluno(0, nome, email, ra, telefone);
                aluno.gravar().then(()=>{
                    resposta.status(201);
                    resposta.json({
                        "status":true,
                        "mensagem": "Aluno gravado com sucesso!",
                        "id_aluno": aluno.id
                    });
                }).catch((erro) =>{
                    resposta.status(500);
                    resposta.json({
                        "status":false,
                        "mensagem": "Não foi possível armazenar o Aluno! " + erro.message
                    })
                });
            }
            else{
                resposta.status(400);
                resposta.json({
                    "status":false,
                    "mensagem": "Por favor, informe todos os dados do Aluno, conforme documentação da API"
                });
            }
        }
        else{
            resposta.status(405);
            resposta.json({
                "status":false,
                "mensagem": "Requisição inválida! Esperando o método POST e dados no formato JSON para gravar um Aluno!"
            })
        }
    }

    atualizar(requisicao, resposta){
        resposta.type('application/json');
        if ((requisicao.method === "PATCH" || requisicao.method === "PUT") && requisicao.is('application/json')
        ){
            const dados = requisicao.body; 
            const id = requisicao.params.id;
            const nome = dados.nome;
            const email = dados.email;
            const ra = dados.ra;
            const telefone = dados.telefone;
            if (id && id > 0 && nome && email && ra && telefone)
            {
                const aluno = new Aluno(id, nome, email, ra, telefone);
                aluno.atualizar()
                .then(()=>{
                    resposta.status(200);
                    resposta.json({
                        "status":true,
                        "mensagem": "Aluno atualizado com sucesso!",
                    })
                })
                .catch((erro) =>{
                    resposta.status(500);
                    resposta.json({
                        "status":false,
                        "mensagem": "Não foi possível atualizar o Aluno! " + erro.message
                    })
                });
            }
            else{
                resposta.status(400);
                resposta.json({
                    "status":false,
                    "mensagem": "Por favor, informe todos os dados do Aluno, conforme documentação da API"
                })
            }
        }
        else{
            resposta.status(405);
            resposta.json({
                "status":false,
                "mensagem": "Requisição inválida! Esperando o método PATCH, PUT e dados no formato JSON para atualizar um Aluno!"
            })
        }
    }

    excluir(requisicao, resposta){
        resposta.type('application/json');
        if (requisicao.method === "DELETE"){
            const id = requisicao.params.id;
            if (id && id > 0){
                const aluno = new Aluno(id);
                aluno.excluir()
                .then(()=>{
                    resposta.status(200);
                    resposta.json({
                        "status":true,
                        "mensagem": "Aluno excluído com sucesso!",
                    })
                })
                .catch((erro) =>{
                    resposta.status(500);
                    resposta.json({
                        "status":false,
                        "mensagem": "Não foi possível excluir o Aluno! " + erro.message
                    })
                })
            }
            else{
                resposta.status(400);
                resposta.json({
                    "status":false,
                    "mensagem": "Por favor, informe o id do Aluno que deseja excluir, conforme documentação da API"
                })
            }
        }
        else{
            resposta.status(405);
            resposta.json({
                "status":false,
                "mensagem": "Requisição inválida! Esperando o método DELETE para excluir um Aluno!"
            })
        }
    }

    consultar(requisicao, resposta){
        resposta.type('application/json');
        if (requisicao.method === "GET"){
            const termoDeQuery = requisicao.params.termo;
            const aluno = new Aluno(0);
            aluno.consultar(termoDeQuery)
            .then((alunos)=>{
                resposta.status(200);
                resposta.json(alunos);
            })
            .catch((erro) =>{
                resposta.status(500);
                resposta.json({
                    "status":false,
                    "mensagem": "Não foi possível consultar os Alunos! " + erro.message
                })
            })
        }
        else{
            resposta.status(405);
            resposta.json({
                "status":false,
                "mensagem": "Requisição inválida! Esperando o método GET para consultar os Alunos!"
            })
        }
    }

}