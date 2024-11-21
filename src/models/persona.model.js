const pool = require('../config/database');

class PersonaModel {
  static async crear(persona, direccion) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Insertar dirección
      const [resultDireccion] = await conn.query(
        'INSERT INTO direcciones (calle, numero, ciudad, codigo_postal, pais) VALUES (?, ?, ?, ?, ?)',
        [direccion.calle, direccion.numero, direccion.ciudad, direccion.codigoPostal, direccion.pais]
      );

      // Insertar persona con el ID de la dirección
      const [resultPersona] = await conn.query(
        'INSERT INTO personas (nombre, apellido, telefono, email, direccion_id) VALUES (?, ?, ?, ?, ?)',
        [persona.nombre, persona.apellido, persona.telefono, persona.email, resultDireccion.insertId]
      );

      await conn.commit();
      return resultPersona.insertId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async obtenerTodos() {
    const [rows] = await pool.query(`
      SELECT p.*, d.calle, d.numero, d.ciudad, d.codigo_postal, d.pais
      FROM personas p
      LEFT JOIN direcciones d ON p.direccion_id = d.id
    `);
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query(`
      SELECT p.*, d.calle, d.numero, d.ciudad, d.codigo_postal, d.pais
      FROM personas p
      LEFT JOIN direcciones d ON p.direccion_id = d.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async actualizar(id, persona, direccion) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [personaActual] = await conn.query('SELECT direccion_id FROM personas WHERE id = ?', [id]);
      if (!personaActual.length) throw new Error('Persona no encontrada');

      // Actualizar dirección
      await conn.query(
        'UPDATE direcciones SET calle = ?, numero = ?, ciudad = ?, codigo_postal = ?, pais = ? WHERE id = ?',
        [direccion.calle, direccion.numero, direccion.ciudad, direccion.codigoPostal, direccion.pais, personaActual[0].direccion_id]
      );

      // Actualizar persona
      await conn.query(
        'UPDATE personas SET nombre = ?, apellido = ?, telefono = ?, email = ? WHERE id = ?',
        [persona.nombre, persona.apellido, persona.telefono, persona.email, id]
      );

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async eliminar(id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [persona] = await conn.query('SELECT direccion_id FROM personas WHERE id = ?', [id]);
      if (!persona.length) throw new Error('Persona no encontrada');

      await conn.query('DELETE FROM personas WHERE id = ?', [id]);
      await conn.query('DELETE FROM direcciones WHERE id = ?', [persona[0].direccion_id]);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}

module.exports = PersonaModel;
