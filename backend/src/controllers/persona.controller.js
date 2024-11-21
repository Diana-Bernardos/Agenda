const pool = require('../config/database');

class PersonaController {
  static async obtenerTodos(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT p.*, d.calle, d.numero, d.ciudad, d.codigo_postal as codigoPostal, d.pais
        FROM personas p
        LEFT JOIN direcciones d ON p.direccion_id = d.id
      `);
      
      // Formatea los resultados
      const personas = rows.map(row => ({
        id: row.id,
        nombre: row.nombre,
        apellido: row.apellido,
        telefono: row.telefono,
        email: row.email,
        direccion: {
          calle: row.calle,
          numero: row.numero,
          ciudad: row.ciudad,
          codigoPostal: row.codigoPostal,
          pais: row.pais
        }
      }));

      res.json(personas);
    } catch (error) {
      console.error('Error al obtener personas:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const { nombre, apellido, telefono, email, direccion } = req.body;

      // Insertar dirección
      const [resultDireccion] = await conn.query(
        'INSERT INTO direcciones (calle, numero, ciudad, codigo_postal, pais) VALUES (?, ?, ?, ?, ?)',
        [direccion.calle, direccion.numero, direccion.ciudad, direccion.codigoPostal, direccion.pais]
      );

      // Insertar persona
      const [resultPersona] = await conn.query(
        'INSERT INTO personas (nombre, apellido, telefono, email, direccion_id) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, telefono, email, resultDireccion.insertId]
      );

      await conn.commit();
      
      res.status(201).json({
        id: resultPersona.insertId,
        mensaje: 'Persona creada exitosamente'
      });
    } catch (error) {
      await conn.rollback();
      console.error('Error al crear persona:', error);
      res.status(500).json({ error: error.message });
    } finally {
      conn.release();
    }
  }

  // ... otros métodos del controlador
}

module.exports = PersonaController;