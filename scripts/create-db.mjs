import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_DATABASE;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USERNAME || 'root';
const dbPass = process.env.DB_PASSWORD;

const connection = mysql.createConnection({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPass,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  }

  connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (error) => {
    if (error) {
      console.error('❌ Erro ao criar banco de dados:', error.message);
      connection.end();
      process.exit(1);
    }

    console.log(`✅ Banco de dados '${dbName}' pronto!`);
    connection.end();
  });
});
