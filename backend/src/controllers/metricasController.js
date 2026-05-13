const { pool } = require('../config/db');

exports.metricasNegocio = async (req, res) => {
  try {
    const id = req.usuario.id;

    const ventas = await pool.query(
      'SELECT SUM(precio) AS total FROM pedidos WHERE negocio_id = $1',
      [id]
    );

    const pedidosHoy = await pool.query(
      'SELECT COUNT(*) AS cantidad FROM pedidos WHERE negocio_id = $1 AND fecha::date = CURRENT_DATE',
      [id]
    );

    res.json({
      totalVentas: ventas.rows[0].total || 0,
      pedidosHoy: pedidosHoy.rows[0].cantidad || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener metricas de negocio' });
  }
};

exports.metricasRepartidor = async (req, res) => {
  try {
    const id = req.usuario.id;

    const entregas = await pool.query(
      "SELECT COUNT(*) AS total FROM pedidos WHERE repartidor_id = $1 AND estado = 'entregado'",
      [id]
    );

    const ganancias = await pool.query(
      "SELECT SUM(comision) AS total FROM pedidos WHERE repartidor_id = $1 AND estado = 'entregado'",
      [id]
    );

    res.json({
      entregas: entregas.rows[0].total || 0,
      ganancias: ganancias.rows[0].total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener metricas de repartidor' });
  }
};

exports.metricasEmprendedor = async (req, res) => {
  try {
    const id = req.usuario.id;

    const ventas = await pool.query(
      'SELECT SUM(precio) AS total FROM pedidos WHERE emprendedor_id = $1',
      [id]
    );

    res.json({
      ventas: ventas.rows[0].total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener metricas de emprendedor' });
  }
};

exports.metricasAdmin = async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
    const pedidos = await pool.query('SELECT COUNT(*) AS total FROM pedidos');

    res.json({
      usuarios: usuarios.rows[0].total,
      pedidos: pedidos.rows[0].total
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener metricas admin' });
  }
};
