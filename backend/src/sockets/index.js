import { Server } from 'socket.io';

let ioInstance;

const joinRoleRoom = (socket, role, id) => {
  if (!id) return;
  socket.join(`${role}:${id}`);
};

export const initSockets = (server) => {
  ioInstance = new Server(server, {
    cors: { origin: '*' }
  });

  ioInstance.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('join-admin', (adminId) => {
      joinRoleRoom(socket, 'admin', adminId || 'global');
    });

    socket.on('join-comercio', (comercioId) => {
      joinRoleRoom(socket, 'comercio', comercioId);
    });

    socket.on('join-repartidor', (repartidorId) => {
      joinRoleRoom(socket, 'repartidor', repartidorId);
    });

    socket.on('join-emprendedor', (emprendedorId) => {
      joinRoleRoom(socket, 'emprendedor', emprendedorId);
    });

    socket.on('tracking', (data) => {
      ioInstance.emit('tracking-update', data);

      if (data?.comercioId) {
        ioInstance.to(`comercio:${data.comercioId}`).emit('tracking-update', data);
      }

      if (data?.repartidorId) {
        ioInstance.to(`repartidor:${data.repartidorId}`).emit('tracking-update', data);
      }

      if (data?.emprendedorId) {
        ioInstance.to(`emprendedor:${data.emprendedorId}`).emit('tracking-update', data);
      }
    });

    socket.on('pedido-evento', (data) => {
      ioInstance.emit('pedido-update', data);

      if (data?.comercioId) {
        ioInstance.to(`comercio:${data.comercioId}`).emit('pedido-update', data);
      }

      if (data?.repartidorId) {
        ioInstance.to(`repartidor:${data.repartidorId}`).emit('pedido-update', data);
      }

      if (data?.emprendedorId) {
        ioInstance.to(`emprendedor:${data.emprendedorId}`).emit('pedido-update', data);
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
};

export const emitToSockets = (event, payload) => {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
};
