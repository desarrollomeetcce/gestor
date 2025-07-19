'use server'

import { prisma } from '@/lib/prisma'
import { withActionWrapper } from '@/utils/actions'
import bcrypt from 'bcryptjs';


export async function createUserAction(_: any, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const profileId = Number(formData.get('profileId'));

    if (!name || !email || !password || !profileId) {
      return { status: 'error', message: 'Faltan campos requeridos.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profileId,
      },
    });

    return { status: 'success', message: 'Usuario creado correctamente.' };
  } catch (error: any) {
    return {
      status: 'error',
      message: 'Error al crear usuario.',
      technicalMessage: error?.message,
    };
  }
}

export async function updateUserAction(_: any, formData: FormData) {
  try {
    const id = Number(formData.get('id'));
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const profileId = Number(formData.get('profileId'));
    const rawPassword = formData.get('password') as string | null;

    if (!id || !name || !email || !profileId) {
      return { status: 'error', message: 'Faltan campos requeridos.' };
    }

    const updateData: any = {
      name,
      email,
      profileId,
    };
    console.log(rawPassword)
    if (rawPassword && rawPassword.trim()) {
      updateData.password = await bcrypt.hash(rawPassword, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return { status: 'success', message: 'Usuario actualizado correctamente.' };
  } catch (error: any) {
    return {
      status: 'error',
      message: 'Error al actualizar usuario.',
      technicalMessage: error?.message,
    };
  }
}

export const deleteUserAction = async (id: number) => {
  return withActionWrapper(async () => {
    await prisma.user.delete({ where: { id } })
    return { status: 'success', message: 'Usuario eliminado' }
  })
}