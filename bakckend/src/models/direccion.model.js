const pool = require('../config/agenda');

class DireccionModel {
  static async crear(direccion) {
    const [result] = await pool.query(
      'INSERT INTO direcciones (calle, numero, ciudad, codigo_postal, pais) VALUES (?, ?, ?, ?, ?)',
      [direccion.calle, direccion.numero, direccion.ciudad, direccion.codigoPostal, direccion.pais]
    );
    return result.insertId;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM direcciones WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = DireccionModel;