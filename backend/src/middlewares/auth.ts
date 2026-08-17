import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
      if (err) {
        res.status(403).json({ error: 'Token inválido o expirado' });
        return;
      }

      req.user = user as AuthRequest['user'];
      next();
    });
  } else {
    res.status(401).json({ error: 'No se proporcionó token de autenticación' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.role.toUpperCase())) {
      res.status(403).json({ error: 'Permisos insuficientes para realizar esta acción' });
      return;
    }

    next();
  };
};
