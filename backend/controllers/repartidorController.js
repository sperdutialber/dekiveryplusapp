const { pool } = require('../config/db');
const { acreditarPago } = require('./pagosController');

// Obtener pedidos asignados al repartidor
exports.getPedidosAsignados = async (req, res) => {
  try {
    const repartidorId = req.usuario.id;

    const result = await pool.query(
      'SELECT * FROM pedidos WHERE repartidor_id = $1 ORDER BY fecha DESC',
      [repartidorId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos del repartidor' });
  }
};

// Cambiar estado del pedido
exports.cambiarEstado = async (req, res) => {
  try {
    const repartidorId = req.usuario.id;
    const pedidoId = req.params.id;
    const { estado } = req.body;

    const result = await pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2 AND repartidor_id = $3 RETURNING *',
      [estado, pedidoId, repartidorId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'No puedes modificar este pedido' });
    }

    const pedidoActualizado = result.rows[0];

    if (estado === 'entregado') {
      req.body = {
        pedidoId: pedidoActualizado.id,
        monto: pedidoActualizado.precio,
        rol: 'repartidor',
        usuarioId: repartidorId
      };
      await acreditarPago(req, { json: () => {}, status: () => ({ json: () => {} }) });
    }

    res.json(pedidoActualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cambiar estado del pedido' });
  }
};
