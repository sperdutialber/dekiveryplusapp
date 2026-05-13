function emitir(canal, payload) {
  if (!global.io) return;
  global.io.emit(canal, payload);
}

function notificarNuevoPedidoRepartidor(repartidorId, pedido) {
  emitir(`repartidor_${repartidorId}`, {
    tipo: 'nuevo_pedido',
    pedidoId: pedido.id,
    mensaje: 'Tienes un nuevo pedido asignado'
  });
}

function notificarMensajeIAVendedor(negocioId, respuestaIA) {
  emitir(`ia_vendedor_${negocioId}`, {
    tipo: 'mensaje',
    texto: respuestaIA
  });
}

function notificarAsignacionIARepartidor(id) {
  emitir(`repartidor_${id}`, {
    tipo: 'nuevo_pedido',
    mensaje: 'IA te asigno un pedido'
  });
}

function notificarAlertaClimaGlobal(mensaje) {
  emitir('alerta_clima', {
    tipo: 'tormenta',
    mensaje
  });
}

module.exports = {
  emitir,
  notificarNuevoPedidoRepartidor,
  notificarMensajeIAVendedor,
  notificarAsignacionIARepartidor,
  notificarAlertaClimaGlobal
};
