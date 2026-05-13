const { pool } = require('../config/db');

exports.actualizarPosicion = async (req, res) => {
  try {
    const repartidorId = req.usuario.id;
    const { lat, lng } = req.body;

    await pool.query(
      `INSERT INTO repartidores_posicion (repartidor_id, lat, lng)
       VALUES ($1, $2, $3)`,
      [repartidorId, lat, lng]
    );

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar la posicion' });
  }
};

exports.obtenerPosiciones = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT repartidor_id, lat, lng, fecha
      FROM repartidores_posicion
      ORDER BY fecha DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener posiciones' });
  }
};
