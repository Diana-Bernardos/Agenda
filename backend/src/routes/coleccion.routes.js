

// routes/coleccion.routes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Obtener todas las colecciones
router.get('/', async (req, res) => {
 try {
   const [rows] = await pool.query('SELECT * FROM colecciones');
   res.json(rows);
 } catch (error) {
   console.error('Error al obtener colecciones:', error);
   res.status(500).json({ error: error.message });
 }
});

// Obtener una colección por ID
router.get('/:id', async (req, res) => {
 try {
   const [rows] = await pool.query('SELECT * FROM colecciones WHERE id = ?', [req.params.id]);
   if (rows.length === 0) {
     return res.status(404).json({ mensaje: 'Colección no encontrada' });
   }
   res.json(rows[0]);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
});

// Crear nueva colección
router.post('/', async (req, res) => {
 try {
   const { nombre, descripcion } = req.body;
   const [result] = await pool.query(
     'INSERT INTO colecciones (nombre, descripcion) VALUES (?, ?)',
     [nombre, descripcion]
   );
   res.status(201).json({ 
     id: result.insertId,
     mensaje: 'Colección creada exitosamente'
   });
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
});

// Actualizar colección
router.put('/:id', async (req, res) => {
 try {
   const { nombre, descripcion } = req.body;
   const [result] = await pool.query(
     'UPDATE colecciones SET nombre = ?, descripcion = ? WHERE id = ?',
     [nombre, descripcion, req.params.id]
   );
   if (result.affectedRows === 0) {
     return res.status(404).json({ mensaje: 'Colección no encontrada' });
   }
   res.json({ mensaje: 'Colección actualizada exitosamente' });
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
});

// Eliminar colección
router.delete('/:id', async (req, res) => {
 try {
   const [result] = await pool.query('DELETE FROM colecciones WHERE id = ?', [req.params.id]);
   if (result.affectedRows === 0) {
     return res.status(404).json({ mensaje: 'Colección no encontrada' });
   }
   res.json({ mensaje: 'Colección eliminada exitosamente' });
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
});

// Agregar persona a colección
router.post('/:coleccionId/personas/:personaId', async (req, res) => {
    try {
      const { coleccionId, personaId } = req.params;
      await pool.query(
        'INSERT INTO personas_colecciones (persona_id, coleccion_id) VALUES (?, ?)',
        [personaId, coleccionId]
      );
      res.json({ mensaje: 'Persona agregada a la colección' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Eliminar persona de colección
  router.delete('/:coleccionId/personas/:personaId', async (req, res) => {
    try {
      const { coleccionId, personaId } = req.params;
      await pool.query(
        'DELETE FROM personas_colecciones WHERE persona_id = ? AND coleccion_id = ?',
        [personaId, coleccionId]
      );
      res.json({ mensaje: 'Persona eliminada de la colección' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ver personas de una coleccion 

  router.get('/:id/personas', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT p.* 
        FROM personas p
        JOIN personas_colecciones pc ON p.id = pc.persona_id
        WHERE pc.coleccion_id = ?
      `, [req.params.id]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });



module.exports = router;