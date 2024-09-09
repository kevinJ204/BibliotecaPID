import mysql from 'mysql2/promise';

export default async function conectar() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: process.env.USER_BD, 
        password: process.env.SENHA_BD,
        port: 3306,
        database: 'biblioteca'
    });

    return await pool.getConnection();
}
