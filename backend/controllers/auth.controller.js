import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, getUserById } from '../services/data.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'deliveryplus_local_secret';

const signToken = (usuario) => jwt.sign(
  { id: usuario.id, email: usuario.email, rol: usuario.rol },
  JWT_SECRET,
  { expiresIn: '8h' }
);

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Datos incompletos' });
    }

    const usuarioEncontrado = findUserByEmail(email);
    const usuario = usuarioEncontrado
      ? { ...usuarioEncontrado, rol: usuarioEncontrado.rol === 'cliente' ? 'emprendedor' : usuarioEncontrado.rol }
      : null;
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ msg: 'Credenciales invalidas' });
    }

    return res.json({
      msg: 'Login correcto',
      token: signToken(usuario),
      rol: usuario.rol,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error en login', error: error.message });
  }
};

export const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Datos incompletos' });
    }

    if (findUserByEmail(email)) {
      return res.status(409).json({ msg: 'El email ya esta registrado' });
    }

    const usuario = createUser({ nombre, email, password, rol });

    return res.status(201).json({
      msg: 'Registro correcto',
      token: signToken(usuario),
      rol: usuario.rol,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error en registro', error: error.message });
  }
};

export const me = async (req, res) => {
  const usuario = getUserById(req.usuario.id);
  if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
  res.json({ usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
};
