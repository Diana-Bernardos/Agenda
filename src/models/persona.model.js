const pool = require('../config/database');

class PersonaModel {
  static async crear(persona) {
    const [result] = await pool.query(
      'INSERT INTO personas (nombre, apellido, telefono, email, direccion_id) VALUES (?, ?, ?, ?, ?)',
      [persona.nombre, persona.apellido, persona.telefono, persona.email, persona.direccionId]
    );
    return result.insertId;
  }

  static async obtenerTodos() {
    const [rows] = await pool.query(`
      SELECT p.*, d.*
      FROM personas p
      LEFT JOIN direcciones d ON p.direccion_id = d.id
    `);
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query(`
      SELECT p.*, d.*
      FROM personas p
      LEFT JOIN direcciones d ON p.direccion_id = d.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }
}

module.exports = PersonaModel;