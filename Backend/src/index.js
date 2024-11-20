// src/index.js
const express = require('express');
require('dotenv').config();

// Envolvemos todo en un try-catch para ver errores de importación
try {
  const pool = require('./config/database');
  const personaRoutes = require('./routes/persona.routes');

  const app = express();

  // Middleware para logging básico
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // Ruta básica de prueba
  app.get('/', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
  });

  app.use('/personas', personaRoutes);

  const PORT = process.env.PORT || 3000;

  // Verificar la conexión a la base de datos
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

  // Iniciar servidor
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

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Promesa rechazada no manejada:', error);
  process.exit(1);
});