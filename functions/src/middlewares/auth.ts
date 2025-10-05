import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id_usuario: number;
    auth_uid: string;
    email: string;
    nombre: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify Supabase token
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !supabaseUser) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    // Find user in database by Supabase UID
    const user = await prisma.usuarios.findFirst({
      where: {
        auth_uid: supabaseUser.id,
      },
      select: {
        id_usuario: true,
        auth_uid: true,
        email: true,
        nombre: true,
        activo: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    if (!user.activo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo',
      });
    }

    // Add user to request object
    req.user = {
      id_usuario: user.id_usuario,
      auth_uid: user.auth_uid!,
      email: user.email,
      nombre: user.nombre,
    };

    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Error de autenticación',
    });
  }
};

// Optional auth middleware - doesn't fail if no token provided
export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user
      return next();
    }

    const token = authHeader.substring(7);
    
    // Verify Supabase token
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (!error && supabaseUser) {
      // Find user in database
      const user = await prisma.usuarios.findFirst({
        where: {
          auth_uid: supabaseUser.id,
        },
        select: {
          id_usuario: true,
          auth_uid: true,
          email: true,
          nombre: true,
          activo: true,
        },
      });

      if (user && user.activo) {
        req.user = {
          id_usuario: user.id_usuario,
          auth_uid: user.auth_uid!,
          email: user.email,
          nombre: user.nombre,
        };
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors in optional middleware
    console.warn('Optional auth middleware error:', error);
    next();
  }
};