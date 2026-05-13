import { createOrder, getOrderById, listOrders, updateOrderStatus } from '../services/data.service.js';
import { emitToSockets } from '../src/sockets/index.js';

export const listarPedidos = (req, res) => {
  res.json(listOrders(req.usuario));
};

export const obtenerPedido = (req, res) => {
  const pedido = getOrderById(Number(req.params.id));
  if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' });
  res.json(pedido);
};

export const crearPedido = (req, res) => {
  const pedido = createOrder({ ...req.body, creadoPor: req.usuario.id });
  emitToSockets('pedido-creado', pedido);
  res.status(201).json(pedido);
};

export const actualizarEstadoPedido = (req, res) => {
  const pedido = updateOrderStatus(Number(req.params.id), req.body.estado, req.usuario.id);
  if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' });
  emitToSockets('pedido-actualizado', pedido);
  res.json(pedido);
};
