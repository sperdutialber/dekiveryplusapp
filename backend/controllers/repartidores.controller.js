import { listRepartidores, updateTracking } from '../services/data.service.js';
import { emitToSockets } from '../src/sockets/index.js';

export const listarRepartidores = (req, res) => {
  res.json(listRepartidores());
};

export const actualizarTracking = (req, res) => {
  const tracking = updateTracking({
    repartidorId: req.usuario.id,
    lat: req.body.lat,
    lng: req.body.lng,
    estado: req.body.estado || 'disponible'
  });

  emitToSockets('tracking-update', tracking);
  res.json(tracking);
};
