const users = [
  { id: 1, nombre: 'Admin Demo', email: 'admin@deliveryplus.local', password: 'admin123', rol: 'admin' },
  { id: 2, nombre: 'Comercio Demo', email: 'comercio@deliveryplus.local', password: 'comercio123', rol: 'comercio' },
  { id: 3, nombre: 'Repartidor Demo', email: 'repartidor@deliveryplus.local', password: 'repartidor123', rol: 'repartidor' },
  { id: 4, nombre: 'Emprendedor Demo', email: 'emprendedor@deliveryplus.local', password: 'emprendedor123', rol: 'emprendedor' }
];

const orders = [
  {
    id: 1,
    comercio: 'Comercio Demo',
    cliente: 'Cliente Demo',
    direccion: 'Av. Costanera 123',
    estado: 'pendiente',
    creadoPor: 2,
    repartidorId: 3
  }
];

const tracking = [];

export const listUsers = () => users;

export const getUserById = (id) => users.find((user) => user.id === Number(id));

export const findUserByEmail = (email) => users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());

export const createUser = ({ nombre, email, password, rol = 'cliente' }) => {
  const nextUser = {
    id: users.length + 1,
    nombre: nombre || 'Usuario DeliveryPlus',
    email,
    password,
    rol
  };

  users.push(nextUser);
  return nextUser;
};

export const listOrders = (usuario) => {
  if (usuario.rol === 'admin') return orders;
  if (usuario.rol === 'repartidor') return orders.filter((order) => order.repartidorId === usuario.id);
  return orders.filter((order) => order.creadoPor === usuario.id || usuario.rol === 'cliente');
};

export const getOrderById = (id) => orders.find((order) => order.id === Number(id));

export const createOrder = (payload) => {
  const order = {
    id: orders.length + 1,
    comercio: payload.comercio || 'Comercio Demo',
    cliente: payload.cliente || 'Cliente DeliveryPlus',
    direccion: payload.direccion || 'Direccion pendiente',
    estado: 'pendiente',
    creadoPor: payload.creadoPor,
    repartidorId: payload.repartidorId || 3
  };

  orders.push(order);
  return order;
};

export const updateOrderStatus = (id, estado, actualizadoPor) => {
  const order = getOrderById(id);
  if (!order) return null;
  order.estado = estado || order.estado;
  order.actualizadoPor = actualizadoPor;
  order.actualizadoEn = new Date().toISOString();
  return order;
};

export const listComercios = () => users.filter((user) => user.rol === 'comercio').map(({ password, ...user }) => user);

export const listRepartidores = () => users.filter((user) => user.rol === 'repartidor').map(({ password, ...user }) => user);

export const updateTracking = ({ repartidorId, lat, lng, estado }) => {
  const item = {
    repartidorId,
    lat: Number(lat),
    lng: Number(lng),
    estado,
    actualizadoEn: new Date().toISOString()
  };

  tracking.push(item);
  return item;
};
