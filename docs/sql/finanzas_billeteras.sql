CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER,
  usuario_id INTEGER,
  monto NUMERIC,
  metodo VARCHAR(50),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE billetera_repartidor (
  id SERIAL PRIMARY KEY,
  repartidor_id INTEGER,
  monto NUMERIC,
  tipo VARCHAR(50),
  descripcion TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE billetera_negocio (
  id SERIAL PRIMARY KEY,
  negocio_id INTEGER,
  monto NUMERIC,
  tipo VARCHAR(50),
  descripcion TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE billetera_emprendedor (
  id SERIAL PRIMARY KEY,
  emprendedor_id INTEGER,
  monto NUMERIC,
  tipo VARCHAR(50),
  descripcion TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comisiones (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER,
  monto NUMERIC,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
