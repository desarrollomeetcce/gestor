'use server';

import { getUserFromCookie } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma'
import { withActionWrapper } from '@/app/utils/actions';

import { ERROR, SUCCESS } from '@/app/utils/constants';

export async function createLinkAction(_: any, formData: FormData) {
    return withActionWrapper(async () => {
        const user = await getUserFromCookie();
        const title = formData.get('title')?.toString().trim();
        const url = formData.get('url')?.toString().trim();
        const typeId = Number(formData.get('typeId'));
        const userIds = formData.getAll('userIds').map((v) => Number(v));
        const profileIds = formData.getAll('profileIds').map((v) => Number(v));

        if (!title || !url || !typeId) throw new Error('Datos incompletos');

        const newLink = await prisma.link.create({
            data: {
                title,
                url,
                typeId,
                ownerId: user?.userId || 0,
                users: {
                    connect: userIds.map((id) => ({ id })),
                },
                profiles: {
                    connect: profileIds.map((id) => ({ id })),
                },
            },
        });

        return { message: 'Enlace creado correctamente', data: newLink };
    });
}

export async function deleteLinkAction(id: number) {
    try {
        await prisma.link.delete({ where: { id } });
        return {
            status: SUCCESS,
            message: 'Enlace eliminado',
        };
    } catch (error: any) {
        return {
            status: ERROR,
            message: 'Error al eliminar el enlace',
            technicalMessage: error?.message ?? 'Error desconocido',
        };
    }
}

export async function updateLinkAction(prevState: any, formData: FormData) {
    try {
        const id = Number(formData.get('id'));
        const title = formData.get('title') as string;
        const url = formData.get('url') as string;
        const typeId = Number(formData.get('typeId'));

        await prisma.link.update({
            where: { id },
            data: {
                title,
                url,
                typeId,
            },
        });

        return {
            status: SUCCESS,
            message: 'Enlace actualizado correctamente',
        };
    } catch (error: any) {
        return {
            status: ERROR,
            message: 'Error al actualizar el enlace',
            technicalMessage: error?.message ?? 'Error desconocido',
        };
    }
}
