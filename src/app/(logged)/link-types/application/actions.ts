'use server';

import { prisma } from '@/lib/prisma';
import { withActionWrapper } from '@/utils/actions';


export async function createLinkTypeAction(_: any, formData: FormData) {
  return withActionWrapper(async () => {
    const name = formData.get('name')?.toString().trim();
    if (!name) throw new Error('El nombre es requerido');

    await prisma.linkType.create({ data: { name } });

    return { message: 'Tipo creado correctamente' };
  });
}

export async function deleteLinkTypeAction(id: number) {
  return withActionWrapper(async () => {
    await prisma.linkType.delete({ where: { id } });
    return { message: 'Tipo eliminado' };
  });
}

export async function updateLinkTypeAction(_: any, formData: FormData) {
  return withActionWrapper(async () => {
    const id = Number(formData.get('id'));
    const name = formData.get('name')?.toString().trim();
    if (!id || !name) throw new Error('Datos inválidos');

    await prisma.linkType.update({
      where: { id },
      data: { name },
    });

    return { message: 'Tipo actualizado' };
  });
}


export async function getAllLinkTypesAction() {
  return await prisma.linkType.findMany({
    orderBy: { name: 'asc' },
  });
}
