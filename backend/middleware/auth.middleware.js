import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'deliveryplus_local_secret';

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  if (!token) {
    return res.status(401).json({ msg: 'Token requerido' });
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token invalido o expirado' });
  }
};
