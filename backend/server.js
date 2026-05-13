const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const { initDb } = require('./config/db');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/landing', express.static(path.join(__dirname, 'public/landing')));

// Importar rutas
const pedidosRoutes = require('./routes/pedidos');
const usuariosRoutes = require('./routes/usuarios');
const repartidorRoutes = require('./routes/repartidor');
const emprendedorRoutes = require('./routes/emprendedor');
const metricasRoutes = require('./routes/metricas');
const adminRoutes = require('./routes/admin');
const tarifasRoutes = require('./routes/tarifas');
const posicionRoutes = require('./routes/posicion');
const pagosRoutes = require('./routes/pagos');
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/repartidor', repartidorRoutes);
app.use('/api/emprendedor', emprendedorRoutes);
app.use('/api/metricas', metricasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tarifas', tarifasRoutes);
app.use('/api/posicion', posicionRoutes);
app.use('/api/pagos', pagosRoutes);

// Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ message: 'DeliveryPlus backend activo' });
});

global.io = io;

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  try {
    await initDb();
    console.log('Base de datos conectada y tablas listas.');
  } catch (error) {
    console.error('No se pudo inicializar la base de datos:', error.code || error.message);
  }
});
