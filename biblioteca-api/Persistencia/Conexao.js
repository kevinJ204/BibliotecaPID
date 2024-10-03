import mysql from 'mysql2/promise';

export default async function conectar() {
    if (global.poolConexoes){
        return await global.poolConexoes.getConnection();
    }
    else{
        const pool = mysql.createPool({
            host: 'localhost',
            user: process.env.USER_BD, 
            password: process.env.SENHA_BD,
            port: 3306,
            database: 'biblioteca',
            waitForConnections: true,
            connectionLimit: 25,
            maxIdle: 20,
            idleTimeout: 30000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });

        global.poolConexoes = pool;
        return await global.poolConexoes.getConnection();
    }
}
