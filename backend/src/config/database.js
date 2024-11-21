const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'agenda',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function initDatabase() {
  try {
    // Primero conectamos sin seleccionar una base de datos
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    // Crear la base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    
    // Usar la base de datos
    await connection.query(`USE ${dbConfig.database}`);

    // Crear las tablas si no existen
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

    await connection.query(`
      CREATE TABLE IF NOT EXISTS colecciones (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS personas_colecciones (
        persona_id INT,
        coleccion_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (persona_id, coleccion_id),
        FOREIGN KEY (persona_id) REFERENCES personas(id),
        FOREIGN KEY (coleccion_id) REFERENCES colecciones(id)
      )
    `);

    await connection.close();
    console.log('✓ Base de datos y tablas creadas correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Crear el pool después de asegurarnos que la base de datos existe
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Conexión a MySQL exitosa');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error en la conexión a MySQL:', error);
    throw error;
  }
}

module.exports = {
  pool,
  initDatabase,
  testConnection
};