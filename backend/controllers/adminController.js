const { pool } = require('../config/db');

exports.resumen = async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
    const pedidos = await pool.query('SELECT COUNT(*) AS total FROM pedidos');
    const entregados = await pool.query("SELECT COUNT(*) AS total FROM pedidos WHERE estado = 'entregado'");
    const activos = await pool.query("SELECT COUNT(*) AS total FROM pedidos WHERE estado != 'entregado'");
    const totalPagos = await pool.query('SELECT COALESCE(SUM(monto), 0) AS total FROM pagos');
    const totalComisiones = await pool.query('SELECT COALESCE(SUM(monto), 0) AS total FROM comisiones');
    const billeteraRepartidor = await pool.query("SELECT COALESCE(SUM(monto), 0) AS total FROM billetera_repartidor WHERE tipo = 'ingreso'");
    const billeteraNegocio = await pool.query("SELECT COALESCE(SUM(monto), 0) AS total FROM billetera_negocio WHERE tipo = 'ingreso'");
    const billeteraEmprendedor = await pool.query("SELECT COALESCE(SUM(monto), 0) AS total FROM billetera_emprendedor WHERE tipo = 'ingreso'");

    res.json({
      usuarios: usuarios.rows[0].total,
      pedidosTotales: pedidos.rows[0].total,
      pedidosEntregados: entregados.rows[0].total,
      pedidosActivos: activos.rows[0].total,
      totalPagos: totalPagos.rows[0].total,
      totalComisiones: totalComisiones.rows[0].total,
      billeteraRepartidor: billeteraRepartidor.rows[0].total,
      billeteraNegocio: billeteraNegocio.rows[0].total,
      billeteraEmprendedor: billeteraEmprendedor.rows[0].total
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen admin' });
  }
};

exports.actividad = async (req, res) => {
  try {
    const logs = await pool.query('SELECT * FROM logs ORDER BY fecha DESC LIMIT 50');
    res.json(logs.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividad admin' });
  }
};

exports.usuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, email, rol FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios admin' });
  }
};

exports.pedidos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY fecha DESC LIMIT 100');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos admin' });
  }
};

exports.mapa = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, repartidor_id, lat, lng, fecha FROM repartidores_posicion ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mapa admin' });
  }
};
