import mysql from 'mysql2/promise';

export default async function conectar() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root', 
        password: 'O123456K',
        port: 3306,
        database: 'biblioteca'
    });

    return await pool.getConnection();
}
