// src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

try {
  const pool = require('./config/database');
  const personaRoutes = require('./routes/persona.routes');

  // Middleware para logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Ruta de prueba DB
  app.get('/test-db', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM personas');
      console.log('Datos de personas:', rows);
      res.json(rows);
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.use('/personas', personaRoutes);

  const PORT = process.env.PORT || 3000;

  async function verificarConexion() {
    try {
      const connection = await pool.getConnection();
      console.log('✓ Conexión a MySQL exitosa');
      connection.release();
      return true;
    } catch (error) {
      console.error('Error al conectar con MySQL:', error.message);
      return false;
    }
  }

  async function iniciarServidor() {
    try {
      const dbConectada = await verificarConexion();
      
      if (!dbConectada) {
        throw new Error('No se pudo conectar a la base de datos');
      }

      app.listen(PORT, () => {
        console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:', error.message);
      process.exit(1);
    }
  }

  iniciarServidor();

} catch (error) {
  console.error('Error crítico al iniciar la aplicación:', error);
  process.exit(1);
}

process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Promesa rechazada no manejada:', error);
  process.exit(1);
});