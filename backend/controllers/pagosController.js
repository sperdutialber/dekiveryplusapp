const { pool } = require('../config/db');
const { tarifaClimatica } = require('../services/iaClima');
const { predecirDemanda } = require('../services/iaDemanda');

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function calcularFactorIA(montoBase) {
  let factor = 1;

  try {
    const ajusteClima = await tarifaClimatica(montoBase, 'normal');
    const ajusteNum = toNumber(ajusteClima, montoBase);
    if (ajusteNum > 0 && montoBase > 0) {
      factor *= ajusteNum / montoBase;
    }
  } catch (_) {
    // fallback sin ajuste de clima
  }

  try {
    const prediccion = await predecirDemanda({
      fecha: new Date().toISOString(),
      tipo: 'finanzas'
    });
    const recs = Array.isArray(prediccion?.recomendaciones) ? prediccion.recomendaciones.join(' ').toLowerCase() : '';
    if (recs.includes('alta demanda') || recs.includes('pico')) factor *= 1.05;
  } catch (_) {
    // fallback sin ajuste de demanda
  }

  return Math.max(0.8, Math.min(factor, 1.3));
}

exports.acreditarPago = async (req, res) => {
  const { pedidoId, monto, rol, usuarioId } = req.body;
  const montoBase = toNumber(monto);

  if (!pedidoId || !usuarioId || !rol || montoBase <= 0) {
    return res.status(400).json({ error: 'Datos incompletos para acreditar pago' });
  }

  try {
    const pagoExistente = await pool.query('SELECT id FROM pagos WHERE pedido_id = $1 LIMIT 1', [pedidoId]);
    if (pagoExistente.rows.length > 0) {
      return res.json({ ok: true, duplicado: true });
    }

    await pool.query(
      "INSERT INTO pagos (pedido_id, usuario_id, monto, metodo) VALUES ($1, $2, $3, 'online')",
      [pedidoId, usuarioId, montoBase]
    );

    const factorIA = await calcularFactorIA(montoBase);
    const comisionRepartidor = montoBase * 0.6 * factorIA;
    const comisionDeliveryPlus = montoBase * 0.2;
    const comisionTercero = montoBase * 0.2 * factorIA;

    if (rol === 'repartidor') {
      await pool.query(
        "INSERT INTO billetera_repartidor (repartidor_id, monto, tipo, descripcion) VALUES ($1, $2, 'ingreso', 'Entrega completada')",
        [usuarioId, comisionRepartidor]
      );
    }

    if (rol === 'negocio') {
      await pool.query(
        "INSERT INTO billetera_negocio (negocio_id, monto, tipo, descripcion) VALUES ($1, $2, 'ingreso', 'Venta completada')",
        [usuarioId, comisionTercero]
      );
    }

    if (rol === 'emprendedor') {
      await pool.query(
        "INSERT INTO billetera_emprendedor (emprendedor_id, monto, tipo, descripcion) VALUES ($1, $2, 'ingreso', 'Venta completada')",
        [usuarioId, comisionTercero]
      );
    }

    await pool.query(
      'INSERT INTO comisiones (pedido_id, monto) VALUES ($1, $2)',
      [pedidoId, comisionDeliveryPlus]
    );

    res.json({ ok: true, factorIA });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al acreditar pago' });
  }
};

exports.resumenPagos = async (req, res) => {
  const { desde, hasta } = req.query;
  const params = [];
  const where = [];

  if (desde) {
    params.push(`${desde} 00:00:00`);
    where.push(`fecha >= $${params.length}`);
  }
  if (hasta) {
    params.push(`${hasta} 23:59:59`);
    where.push(`fecha <= $${params.length}`);
  }

  const filtro = where.length ? `WHERE ${where.join(' AND ')}` : '';

  try {
    const [pagos, comisiones, walletRep, walletNeg, walletEmp, pagosPorMetodo] = await Promise.all([
      pool.query(`SELECT COALESCE(SUM(monto), 0) AS total, COUNT(*) AS cantidad FROM pagos ${filtro}`, params),
      pool.query(`SELECT COALESCE(SUM(monto), 0) AS total FROM comisiones ${filtro}`, params),
      pool.query(`SELECT COALESCE(SUM(monto), 0) AS total FROM billetera_repartidor ${filtro}`, params),
      pool.query(`SELECT COALESCE(SUM(monto), 0) AS total FROM billetera_negocio ${filtro}`, params),
      pool.query(`SELECT COALESCE(SUM(monto), 0) AS total FROM billetera_emprendedor ${filtro}`, params),
      pool.query(
        `SELECT metodo, COUNT(*) AS cantidad, COALESCE(SUM(monto), 0) AS total
         FROM pagos ${filtro}
         GROUP BY metodo
         ORDER BY total DESC`,
        params
      )
    ]);

    res.json({
      rango: { desde: desde || null, hasta: hasta || null },
      pagos: {
        cantidad: Number(pagos.rows[0].cantidad || 0),
        total: Number(pagos.rows[0].total || 0)
      },
      comisionesDeliveryPlus: Number(comisiones.rows[0].total || 0),
      billeteras: {
        repartidores: Number(walletRep.rows[0].total || 0),
        negocios: Number(walletNeg.rows[0].total || 0),
        emprendedores: Number(walletEmp.rows[0].total || 0)
      },
      metodos: pagosPorMetodo.rows.map((r) => ({
        metodo: r.metodo,
        cantidad: Number(r.cantidad || 0),
        total: Number(r.total || 0)
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener resumen de pagos' });
  }
};
