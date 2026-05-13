const { pool } = require('../config/db');

let pedidosMemoria = [];
let nextMemId = 1;

const getPedidos = async (req, res) => {
  try {
    const rol = req.usuario.rol;
    const idUsuario = req.usuario.id;

    let result;

    if (rol === 'negocio') {
      result = await pool.query('SELECT * FROM pedidos WHERE negocio_id = $1', [idUsuario]);
    } else if (rol === 'repartidor') {
      result = await pool.query('SELECT * FROM pedidos WHERE repartidor_id = $1', [idUsuario]);
    } else if (rol === 'admin') {
      result = await pool.query('SELECT * FROM pedidos');
    } else {
      return res.status(403).json({ error: 'Rol no autorizado' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    if (error.code === 'ECONNREFUSED') {
      return res.json(pedidosMemoria);
    }
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

const createPedido = async (req, res) => {
  const { cliente, producto, precio } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO pedidos (cliente, producto, precio) VALUES ($1, $2, $3) RETURNING *',
      [cliente, producto, precio]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === 'ECONNREFUSED') {
      const pedido = {
        id: nextMemId++,
        cliente,
        producto,
        precio,
        fecha: new Date().toISOString(),
      };
      pedidosMemoria.push(pedido);
      return res.status(201).json(pedido);
    }
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

module.exports = {
  getPedidos,
  createPedido,
};
