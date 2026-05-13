import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes/index.js';
import { initSockets } from './src/sockets/index.js';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/landing', express.static(path.join(__dirname, 'public/landing')));
app.use('/api', router);

app.get('/', (req, res) => {
  res.json({
    name: 'DeliveryPlus API',
    status: 'ok',
    landing: 'http://localhost:4000/landing/#hero'
  });
});

app.get('/landing-redirect', (req, res) => {
  res.redirect('https://landing-deliveryplus-1nvy.vercel.app/');
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'DeliveryPlus backend activo' });
});

app.get('/api/status', (req, res) => {
  res.json({ ok: true, status: 'Backend running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});

initSockets(server);
