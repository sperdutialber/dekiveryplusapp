export const checkRole = (...rolesPermitidos) => (req, res, next) => {
  const rol = req.usuario?.rol;

  if (!rol || !rolesPermitidos.includes(rol)) {
    return res.status(403).json({
      msg: 'Permisos insuficientes',
      requerido: rolesPermitidos,
      rol
    });
  }

  next();
};
