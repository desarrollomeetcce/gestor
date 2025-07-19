'use server'

import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { ERROR, SUCCESS } from '@/utils/constants';

const JWT_SECRET = process.env.JWT_SECRET || 'soutbug-secret-key';

export async function performLogin(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, reason: 'Usuario no encontrado' };
    console.log(password, user.password)
    const match = await bcrypt.compare(password, user.password);
    console.log(match)
    if (!match) return { success: false, reason: 'Contraseña incorrecta' };

    const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    const cookiesSession = await cookies()
    cookiesSession.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    });

    return { success: true };
}


export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<{
  status: 'success' | 'error';
  message: string;
  technicalMessage?: string;
}> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await performLogin(email, password);

    if (!result.success) {
      return {
        status: ERROR,
        message: 'No se pudo iniciar sesión',
        technicalMessage: result.reason,
      };
    }

    return {
      status: SUCCESS,
      message: 'Inicio de sesión exitoso',
    };
  } catch (error: any) {
    return {
      status: ERROR,
      message: 'Ocurrió un error inesperado',
      technicalMessage: error?.message ?? 'Desconocido',
    };
  }
}