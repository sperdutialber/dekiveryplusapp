import { getUserById, listUsers } from '../services/data.service.js';

export const listarUsuarios = (req, res) => {
  res.json(listUsers().map(({ password, ...usuario }) => usuario));
};

export const obtenerUsuario = (req, res) => {
  const usuario = getUserById(Number(req.params.id));
  if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
  const { password, ...safeUser } = usuario;
  res.json(safeUser);
};
