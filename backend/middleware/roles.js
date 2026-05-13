function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const rolUsuario = req.usuario.rol;

    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ error: 'No tienes permisos para esta accion' });
    }

    next();
  };
}

module.exports = permitirRoles;
