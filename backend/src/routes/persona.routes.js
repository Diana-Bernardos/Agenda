const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Obtener todas las personas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, d.calle, d.numero, d.ciudad, d.codigo_postal as codigoPostal, d.pais
      FROM personas p
      LEFT JOIN direcciones d ON p.direccion_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener personas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener personas de una colección
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
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Crear una nueva persona
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { nombre, apellido, telefono, email, direccion } = req.body;

    // Insertar dirección
    const [resultDireccion] = await connection.query(
      'INSERT INTO direcciones (calle, numero, ciudad, codigo_postal, pais) VALUES (?, ?, ?, ?, ?)',
      [direccion.calle, direccion.numero, direccion.ciudad, direccion.codigoPostal, direccion.pais]
    );

    // Insertar persona
    const [resultPersona] = await connection.query(
      'INSERT INTO personas (nombre, apellido, telefono, email, direccion_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, telefono, email, resultDireccion.insertId]
    );

    await connection.commit();
    res.status(201).json({ 
      id: resultPersona.insertId,
      mensaje: 'Persona creada exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear persona:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// Obtener una persona por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, d.calle, d.numero, d.ciudad, d.codigo_postal as codigoPostal, d.pais
      FROM personas p
      LEFT JOIN direcciones d ON p.direccion_id = d.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Persona no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener persona:', error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una persona
router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { nombre, apellido, telefono, email, direccion } = req.body;

    // Obtener el ID de la dirección actual
    const [personaActual] = await connection.query(
      'SELECT direccion_id FROM personas WHERE id = ?',
      [req.params.id]
    );

    if (personaActual.length === 0) {
      throw new Error('Persona no encontrada');
    }

    // Actualizar dirección
    await connection.query(
      'UPDATE direcciones SET calle = ?, numero = ?, ciudad = ?, codigo_postal = ?, pais = ? WHERE id = ?',
      [direccion.calle, direccion.numero, direccion.ciudad, direccion.codigoPostal, direccion.pais, personaActual[0].direccion_id]
    );

    // Actualizar persona
    await connection.query(
      'UPDATE personas SET nombre = ?, apellido = ?, telefono = ?, email = ? WHERE id = ?',
      [nombre, apellido, telefono, email, req.params.id]
    );

    await connection.commit();
    res.json({ mensaje: 'Persona actualizada exitosamente' });
  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar persona:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// Eliminar una persona
router.delete('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener el ID de la dirección
    const [persona] = await connection.query(
      'SELECT direccion_id FROM personas WHERE id = ?',
      [req.params.id]
    );

    if (persona.length === 0) {
      throw new Error('Persona no encontrada');
    }

    // Eliminar persona y su dirección
    await connection.query('DELETE FROM personas WHERE id = ?', [req.params.id]);
    await connection.query('DELETE FROM direcciones WHERE id = ?', [persona[0].direccion_id]);

    await connection.commit();
    res.json({ mensaje: 'Persona eliminada exitosamente' });
  } catch (error) {
    await connection.rollback();
    console.error('Error al eliminar persona:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;