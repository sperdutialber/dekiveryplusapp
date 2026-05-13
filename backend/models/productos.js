const { pool } = require('../config/db');

async function crearProducto(emprendedorId, nombre, descripcion, precio, stock) {
  const result = await pool.query(
    `INSERT INTO productos (emprendedor_id, nombre, descripcion, precio, stock)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [emprendedorId, nombre, descripcion, precio, stock]
  );
  return result.rows[0];
}

async function obtenerProductosPorEmprendedor(id) {
  const result = await pool.query(
    'SELECT * FROM productos WHERE emprendedor_id = $1 ORDER BY fecha DESC',
    [id]
  );
  return result.rows;
}

async function actualizarProducto(id, emprendedorId, campos) {
  const { nombre, descripcion, precio, stock } = campos;

  const result = await pool.query(
    `UPDATE productos
     SET nombre = $1, descripcion = $2, precio = $3, stock = $4
     WHERE id = $5 AND emprendedor_id = $6
     RETURNING *`,
    [nombre, descripcion, precio, stock, id, emprendedorId]
  );

  return result.rows[0];
}

async function eliminarProducto(id, emprendedorId) {
  const result = await pool.query(
    'DELETE FROM productos WHERE id = $1 AND emprendedor_id = $2 RETURNING *',
    [id, emprendedorId]
  );
  return result.rows[0];
}

module.exports = {
  crearProducto,
  obtenerProductosPorEmprendedor,
  actualizarProducto,
  eliminarProducto,
};
