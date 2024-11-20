// src/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Conexión a MySQL exitosa');
    
    // Intentar crear la base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✓ Base de datos ${process.env.DB_NAME} verificada`);
    
    // Usar la base de datos
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // Crear tablas si no existen
    await connection.query(`
      CREATE TABLE IF NOT EXISTS direcciones (
        id INT PRIMARY KEY AUTO_INCREMENT,
        calle VARCHAR(100) NOT NULL,
        numero VARCHAR(20),
        ciudad VARCHAR(100),
        codigo_postal VARCHAR(10),
        pais VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS personas (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        telefono VARCHAR(20),
        email VARCHAR(100),
        direccion_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (direccion_id) REFERENCES direcciones(id)
      )
    `);
    
    console.log('✓ Tablas verificadas correctamente');
    connection.release();
  } catch (error) {
    console.error('Error en la conexión a MySQL:', error.message);
    throw error;
  }
};

// Ejecutar la prueba de conexión al iniciar
testConnection().catch(console.error);

module.exports = pool;