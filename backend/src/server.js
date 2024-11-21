// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const personaRoutes = require('./routes/persona.routes');
const coleccionRoutes = require('./routes/coleccion.routes');
const { pool, initDatabase, testConnection } = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/personas', personaRoutes);
app.use('/colecciones', coleccionRoutes);
// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/personas', personaRoutes);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
async function iniciarServidor() {
  try {
    // Inicializar la base de datos
    await initDatabase();
    
    // Probar la conexión
    await testConnection();

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Promesa rechazada no manejada:', error);
  process.exit(1);
});