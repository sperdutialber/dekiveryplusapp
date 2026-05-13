const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { crearUsuario, obtenerUsuarioPorEmail } = require('../models/usuarios');

exports.registro = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!rol) {
    return res.status(400).json({ error: 'El rol es obligatorio' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await crearUsuario(nombre, email, hashedPassword, rol);
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(400).json({ error: 'Contrasena incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({ token, usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesion' });
  }
};
