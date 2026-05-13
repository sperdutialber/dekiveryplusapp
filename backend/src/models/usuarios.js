const { pool } = require('../config/db');

async function crearUsuario(nombre, email, password, rol) {
  const result = await pool.query(
    'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, email, password, rol]
  );
  return result.rows[0];
}

async function obtenerUsuarioPorEmail(email) {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

module.exports = { crearUsuario, obtenerUsuarioPorEmail };
