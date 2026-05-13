import { listComercios } from '../services/data.service.js';

export const listarComercios = (req, res) => {
  res.json(listComercios());
};

export const obtenerDashboardComercio = (req, res) => {
  res.json({
    ventasHoy: 12,
    pedidosPendientes: 4,
    tiempoPromedio: '28 min',
    clima: 'Operativo'
  });
};
