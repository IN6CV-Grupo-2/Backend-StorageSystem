export const validarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
      if (!rolesPermitidos.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Acceso denegado: rol no autorizado' });
      }
      next();
    };
  };
  