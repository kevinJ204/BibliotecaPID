import mysql from 'mysql2/promise';

export default async function conectar() {
    if (global.pool !== undefined) {
        return await global.pool.getConnection();
    }
    else {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root', 
            password: 'O123456K',
            port: 3306,
            database: 'backend',
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, 
            idleTimeout: 360000, 
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        global.pool = pool;
        return await pool.getConnection();
    }
}