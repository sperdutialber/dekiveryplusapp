const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'deliveryplus_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'deliveryplus_db',
  password: process.env.DB_PASS || 'password',
  port: process.env.DB_PORT || 5432,
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      cliente VARCHAR(100),
      producto VARCHAR(100),
      precio NUMERIC,
      negocio_id INTEGER,
      repartidor_id INTEGER,
      estado VARCHAR(30) DEFAULT 'pendiente',
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    ALTER TABLE pedidos
    ADD COLUMN IF NOT EXISTS negocio_id INTEGER
  `);

  await pool.query(`
    ALTER TABLE pedidos
    ADD COLUMN IF NOT EXISTS repartidor_id INTEGER
  `);

  await pool.query(`
    ALTER TABLE pedidos
    ADD COLUMN IF NOT EXISTS estado VARCHAR(30) DEFAULT 'pendiente'
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol VARCHAR(50),
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      emprendedor_id INTEGER NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      precio NUMERIC NOT NULL,
      stock INTEGER DEFAULT 0,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pagos (
      id SERIAL PRIMARY KEY,
      pedido_id INTEGER,
      usuario_id INTEGER,
      monto NUMERIC,
      metodo VARCHAR(50),
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS billetera_repartidor (
      id SERIAL PRIMARY KEY,
      repartidor_id INTEGER,
      monto NUMERIC,
      tipo VARCHAR(50),
      descripcion TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS billetera_negocio (
      id SERIAL PRIMARY KEY,
      negocio_id INTEGER,
      monto NUMERIC,
      tipo VARCHAR(50),
      descripcion TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS billetera_emprendedor (
      id SERIAL PRIMARY KEY,
      emprendedor_id INTEGER,
      monto NUMERIC,
      tipo VARCHAR(50),
      descripcion TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS comisiones (
      id SERIAL PRIMARY KEY,
      pedido_id INTEGER,
      monto NUMERIC,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = { pool, initDb };
