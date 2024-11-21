// src/index.js
require('dotenv').config();
import express, { json } from 'express';
const express = require('express');
const cors = require('cors');
const app = express();

const personaRoutes = require('./routes/persona.routes');

app.use(cors());
app.use(express.json());

// Middleware para logging
use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/personas', personaRoutes);

export default app;

// server.js
const app = require('./app');
const pool = require('./config/database');

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


process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Promesa rechazada no manejada:', error);
  process.exit(1);
});